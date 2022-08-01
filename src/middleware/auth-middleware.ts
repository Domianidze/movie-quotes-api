import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { ErrorType } from 'types'

export default (req: Request, _: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers

    if (!authorization) {
      const error: ErrorType = new Error('Please provide a Bearer token.')
      error.statusCode = 401
      throw error
    }

    const [, token] = authorization.split(' ')

    if (!token) {
      const error: ErrorType = new Error('Please provide a valid Bearer token.')
      error.statusCode = 401
      throw error
    }

    if (!process.env.SESSION_SECRET) {
      const error: ErrorType = new Error('JWT secret not found.')
      error.statusCode = 404
      throw error
    }

    const decodedToken = jwt.verify(token, process.env.SESSION_SECRET)

    if (!decodedToken) {
      const error: ErrorType = new Error('Not authorized.')
      error.statusCode = 403
      throw error
    }

    req.user = decodedToken

    next()
  } catch (err) {
    next(err)
  }
}
