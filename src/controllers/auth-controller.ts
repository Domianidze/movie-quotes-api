import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { User } from 'models'
import { signUpSchema, logInSchema, resendVerifySchema } from 'schemas'
import { sendVerifyAccountEmail } from 'mail'
import { ErrorType, JwtPayloadType } from 'types'

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await signUpSchema.validateAsync(req.body)

    const existingUsername = await User.findOne({
      username: req.body.username,
    })

    if (existingUsername) {
      const error: ErrorType = new Error('Username is already taken.')
      error.statusCode = 422
      throw error
    }

    const existingEmail = await User.findOne({
      username: req.body.username,
    })

    if (existingEmail) {
      const error: ErrorType = new Error('Email is already taken.')
      error.statusCode = 422
      throw error
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12)

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      activated: false,
    })

    const response = await user.save()

    if (!process.env.EMAIL_SECRET) {
      throw new Error('JWT secret missing.')
    }

    const confirmToken = jwt.sign(
      {
        id: response._id,
      },
      process.env.EMAIL_SECRET,
      {
        expiresIn: process.env.EMAIL_EXPIRES_IN,
      }
    )

    await sendVerifyAccountEmail(
      response.email,
      confirmToken,
      response.username,
      req.body.redirectOnConfirm,
      req.body.language
    )

    res.status(201).json({
      message: 'Signed up successfully!',
    })
  } catch (err: any) {
    next(err)
  }
}

export const logIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await logInSchema.validateAsync(req.body)

    const loadedUser =
      (await User.findOne({ username: req.body.user })) ||
      (await User.findOne({ email: req.body.user }))

    if (!loadedUser) {
      const error: ErrorType = new Error('Invalid credentials.')
      error.statusCode = 422
      throw error
    }

    const correctPassword = await bcrypt.compare(
      req.body.password,
      loadedUser.password
    )

    if (!correctPassword) {
      const error: ErrorType = new Error('Invalid credentials.')
      error.statusCode = 422
      throw error
    }

    if (!loadedUser.activated) {
      const error: ErrorType = new Error('Account is not activated.')
      error.statusCode = 403
      throw error
    }

    if (!process.env.SESSION_SECRET) {
      const error: ErrorType = new Error('JWT secret missing.')
      error.statusCode = 404
      throw error
    }

    const expiresIn = req.body.rememberMe
      ? '365d'
      : process.env.SESSION_EXPIRES_IN

    const token = jwt.sign(
      {
        id: loadedUser._id,
      },
      process.env.SESSION_SECRET,
      {
        expiresIn,
      }
    )

    res.status(200).json({
      token,
      id: loadedUser.id.toString(),
      expiresIn,
    })
  } catch (err) {
    next(err)
  }
}

export const verifyAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!process.env.EMAIL_SECRET) {
      throw new Error('JWT secret missing.')
    }

    const { id } = jwt.verify(
      req.body.token,
      process.env.EMAIL_SECRET
    ) as JwtPayloadType

    if (!id) {
      const error: ErrorType = new Error('Invalid token.')
      error.statusCode = 422
      throw error
    }

    const user = await User.findOneAndUpdate({ activated: true }, { _id: id })

    if (!user) {
      const error: ErrorType = new Error('Account not found.')
      error.statusCode = 404
      throw error
    }

    if (user.activated) {
      const error: ErrorType = new Error('Account is already activated.')
      error.statusCode = 409
      throw error
    }

    res.status(200).json({
      message: 'Account activated successfully!',
    })
  } catch (err: any) {
    next(err)
  }
}

export const resendVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await resendVerifySchema.validateAsync(req.body)

    const loadedUser =
      (await User.findOne({ username: req.body.user })) ||
      (await User.findOne({ email: req.body.user }))

    if (!loadedUser) {
      const error: ErrorType = new Error('Account not found.')
      error.statusCode = 404
      throw error
    }

    if (loadedUser.activated) {
      const error: ErrorType = new Error('Account is already verified.')
      error.statusCode = 409
      throw error
    }

    if (!process.env.EMAIL_SECRET) {
      throw new Error('JWT secret missing.')
    }

    const confirmToken = jwt.sign(
      {
        id: loadedUser._id,
      },
      process.env.EMAIL_SECRET,
      {
        expiresIn: process.env.EMAIL_EXPIRES_IN,
      }
    )

    await sendVerifyAccountEmail(
      loadedUser.email,
      confirmToken,
      loadedUser.username,
      req.body.redirectOnConfirm,
      req.body.language
    )

    res.status(200).json({
      message: 'Account verify email sent!',
    })
  } catch (err: any) {
    next(err)
  }
}
