import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { User } from 'models'
import { googleAuthSchema } from 'schemas'
import { ErrorType } from 'types'

export const googelAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await googleAuthSchema.validateAsync(req.body)

    let user = await User.findOne({ email: req.body.email })
    let statusCode = 200

    if (!user) {
      user = await User.create({
        photo: req.body.photo,
        username: req.body.name,
        email: req.body.email,
        googleAccount: true,
      })
      statusCode = 201
    }

    if (!process.env.SESSION_SECRET) {
      const error: ErrorType = new Error('JWT secret missing.')
      error.statusCode = 404
      throw error
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.SESSION_SECRET
    )

    res.status(statusCode).json({
      id: user.id.toString(),
      photo: user.photo,
      username: user.username,
      token,
    })
  } catch (err) {
    next(err)
  }
}
