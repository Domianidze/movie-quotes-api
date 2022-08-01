import { Request, Response, NextFunction } from 'express'

import { User, Movie } from 'models'
import { getApiUrl } from 'helpers'
import { ErrorType } from 'types'

export const addMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      const error: ErrorType = new Error('Proper image not found.')
      error.statusCode = 422
      throw error
    }

    const image = `${getApiUrl()}/${req.file.path}`

    const user = await User.findOne({ _id: req.body.createdBy })

    if (!user) {
      const error: ErrorType = new Error('User not found.')
      error.statusCode = 404
      throw error
    }

    const movie = { ...req.body, image }

    const response = await Movie.create(movie)

    res.status(201).json({
      message: 'Movie added successfully!',
      id: response._id,
    })
  } catch (err) {
    next(err)
  }
}
