import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { User } from 'models'
import { sendEmailSchema, recoverPasswordSchema } from 'schemas'
import { sendPasswordRecoveryEmail } from 'mail'
import { ErrorType, JwtPayloadType } from 'types'

export const sendPasswordRecoveryLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await sendEmailSchema.validateAsync(req.body)

    const loadedUser = await User.findOne({ email: req.body.email })

    if (!loadedUser) {
      const error: ErrorType = new Error('Account not found.')
      error.statusCode = 404
      throw error
    }

    if (!process.env.PASSWORD_SECRET) {
      throw new Error('JWT secret missing.')
    }

    const recoverToken = jwt.sign(
      {
        id: loadedUser._id,
      },
      process.env.PASSWORD_SECRET,
      {
        expiresIn: process.env.PASSWORD_EXPIRES_IN,
      }
    )

    await sendPasswordRecoveryEmail(
      loadedUser.email,
      recoverToken,
      loadedUser.username,
      req.body.redirectOnConfirm,
      req.body.language
    )

    res.status(200).json({
      message: 'Password recovery email sent!',
    })
  } catch (err: any) {
    next(err)
  }
}

export const recoverPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await recoverPasswordSchema.validateAsync(req.body)

    if (!process.env.PASSWORD_SECRET) {
      throw new Error('JWT secret missing.')
    }

    const { id } = jwt.verify(
      req.body.token,
      process.env.PASSWORD_SECRET
    ) as JwtPayloadType

    if (!id) {
      const error: ErrorType = new Error('Invalid token.')
      error.statusCode = 422
      throw error
    }

    const loadedUser = await User.findOne({ _id: id })

    if (!loadedUser || !loadedUser.password) {
      const error: ErrorType = new Error('Account not found.')
      error.statusCode = 404
      throw error
    }

    const samePassword = await bcrypt.compare(
      req.body.newPassword,
      loadedUser.password
    )

    if (samePassword) {
      const error: ErrorType = new Error('Same password.')
      error.statusCode = 409
      throw error
    }

    const newHashedPassword = await bcrypt.hash(req.body.newPassword, 12)

    await loadedUser.updateOne({ password: newHashedPassword })

    res.status(200).json({
      message: 'Password recovered successfully!',
    })
  } catch (err: any) {
    next(err)
  }
}
