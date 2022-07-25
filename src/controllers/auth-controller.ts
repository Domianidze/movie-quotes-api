import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { User } from 'models'
import { ErrorType } from 'types'
import { sendConfirmAccountMail } from 'mail'

export const signUp = async (req: Request, res: Response) => {
  try {
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
      confirmed: false,
    })

    const response = await user.save()

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT secret missing.')
    }

    const confirmToken = jwt.sign(
      {
        email: response.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    )

    await sendConfirmAccountMail(
      response.email,
      confirmToken,
      response.username,
      req.body.redirectOnConfirm,
      req.body.language
    )

    res.status(201).json({
      message: 'Signed up successfully!',
      userId: response._id,
    })
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500
    }

    res.status(err.statusCode).json({
      message: err.message,
    })
  }
}
