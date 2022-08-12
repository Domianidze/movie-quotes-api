import { Request, Response, NextFunction } from 'express'

import { User } from 'models'
import { validateId } from 'helpers'
import { ErrorType } from 'types'

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
