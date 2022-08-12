import { Request, Response, NextFunction } from 'express'

import { User } from 'models'
import { validateId, getApiUrl, getDefaultPhoto, removeImage } from 'helpers'
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

export const editUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateId(req.user.id)

    const user = await User.findById(req.user.id)

    if (!user) {
      const error: ErrorType = new Error('User not found.')
      error.statusCode = 404
      throw error
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
