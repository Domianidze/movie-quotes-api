import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { User } from 'models'
import { putUserSchema, postEmailSchema, putPasswordSchema } from 'schemas'
import { sendActivateEmail } from 'mail'
import { validateId, getApiUrl, getDefaultPhoto, removeImage } from 'helpers'
import { ErrorType, JwtPayloadType } from 'types'

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateId(req.user.id)

    const user = await User.findById(req.user.id).select('-__v -activated')

    if (!user) {
      const error: ErrorType = new Error('User not found.')
      error.statusCode = 404
      throw error
    }

    res.json(user)
  } catch (err: any) {
    next(err)
  }
}

export const editUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await putUserSchema.validateAsync(req.body)

    validateId(req.user.id)

    const user = await User.findById(req.user.id)

    if (!user) {
      const error: ErrorType = new Error('User not found.')
      error.statusCode = 404
      throw error
    }

    if (req.body.username) {
      const existingUsername = await User.findOne({
        username: req.body.username,
      })

      if (existingUsername) {
        const error: ErrorType = new Error('Username is already taken.')
        error.statusCode = 409
        throw error
      }
    }

    const photo = req.file

    const data = {
      ...req.body,
      ...(photo && { photo: `${getApiUrl()}/${photo.path}` }),
    }

    await user.updateOne(data)

    if (photo && user.photo !== getDefaultPhoto()) {
      removeImage(user.photo)
    }

    res.status(200).json({
      message: 'User edited successfully!',
    })
  } catch (err) {
    if (req.file) {
      removeImage(req.file.path)
    }

    next(err)
  }
}

export const addEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await postEmailSchema.validateAsync(req.body)

    validateId(req.user.id)

    const existingUser =
      (await User.findOne({ email: req.body.email })) ||
      (await User.findOne({ emails: { email: req.body.email } }))

    if (existingUser) {
      const error: ErrorType = new Error('Email is already taken.')
      error.statusCode = 422
      throw error
    }

    const user = await User.findById(req.user.id)

    if (!user || user.googleUser) {
      const error: ErrorType = new Error('User not found.')
      error.statusCode = 404
      throw error
    }

    await user.updateOne({
      $push: { emails: { email: req.body.email, activated: false } },
    })

    if (!process.env.EMAIL_SECRET) {
      throw new Error('JWT secret missing.')
    }

    const confirmToken = jwt.sign(
      {
        id: user._id,
        email: req.body.email,
      },
      process.env.EMAIL_SECRET,
      {
        expiresIn: process.env.EMAIL_EXPIRES_IN,
      }
    )

    await sendActivateEmail(
      req.body.email,
      confirmToken,
      user.username,
      req.body.redirectOnConfirm,
      req.body.language
    )

    res.status(201).json({
      message: 'Email added successfully!',
    })
  } catch (err) {
    next(err)
  }
}

export const activateEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!process.env.EMAIL_SECRET) {
      throw new Error('JWT secret missing.')
    }

    const { id, email } = jwt.verify(
      req.body.token,
      process.env.EMAIL_SECRET
    ) as JwtPayloadType

    const user = await User.findById(id)

    if (!user || user.googleUser) {
      const error: ErrorType = new Error('User not found.')
      error.statusCode = 404
      throw error
    }

    const { emails } = user
    const foundEmail = emails.find((data) => data.email === email)

    if (!foundEmail) {
      const error: ErrorType = new Error('Email not found.')
      error.statusCode = 404
      throw error
    }

    foundEmail.activated = true

    await user.updateOne({
      $set: { emails },
    })

    res.status(200).json({
      message: 'Email activated successfully!',
    })
  } catch (err) {
    next(err)
  }
}

export const setPrimaryEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateId(req.user.id)

    const user = await User.findById(req.user.id)

    if (!user || user.googleUser) {
      const error: ErrorType = new Error('User not found.')
      error.statusCode = 404
      throw error
    }

    const foundEmail = user.emails.find((data) => data.email === req.body.email)

    if (!foundEmail || !foundEmail.activated) {
      const error: ErrorType = new Error('Email not found.')
      error.statusCode = 404
      throw error
    }

    const emails = user.emails.filter((data) => data.email !== foundEmail.email)

    await user.updateOne({
      $set: {
        email: foundEmail.email,
        emails: [{ email: user.email, activated: true }, ...emails],
      },
    })

    res.status(200).json({
      message: 'Primary email set successfully!',
    })
  } catch (err) {
    next(err)
  }
}

export const deleteEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateId(req.user.id)

    const user = await User.findById(req.user.id)

    if (!user || user.googleUser) {
      const error: ErrorType = new Error('User not found.')
      error.statusCode = 404
      throw error
    }

    const emails = user.emails.filter((data) => data.email !== req.body.email)

    await user.updateOne({
      $set: {
        emails,
      },
    })

    res.status(200).json({
      message: 'Email deleted successfully!',
    })
  } catch (err) {
    next(err)
  }
}

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await putPasswordSchema.validateAsync(req.body)

    validateId(req.user.id)

    const user = await User.findById(req.user.id)

    if (!user || user.googleUser) {
      const error: ErrorType = new Error('User not found.')
      error.statusCode = 404
      throw error
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12)

    await user.updateOne({
      $set: {
        password: hashedPassword,
      },
    })

    res.status(200).json({
      message: 'Password changed successfully!',
    })
  } catch (err) {
    next(err)
  }
}
