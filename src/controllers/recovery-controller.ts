import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { User } from 'models'
import { sendPasswordRecoveryEmail } from 'mail'
import { ErrorType } from 'types'

export const sendPasswordRecoveryLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loadedUser =
      (await User.findOne({ username: req.body.user })) ||
      (await User.findOne({ email: req.body.user }))

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
