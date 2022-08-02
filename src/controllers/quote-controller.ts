import { Request, Response, NextFunction } from 'express'

import { User, Movie, Quote } from 'models'
import { getApiUrl, removeImage, validateId } from 'helpers'
import { ErrorType } from 'types'

export const addQuote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const movieId = req.body.movie
    const createdBy = req.user.id

    validateId(movieId)
    validateId(createdBy)

    if (!req.file) {
      const error: ErrorType = new Error('Proper image not found.')
      error.statusCode = 422
      throw error
    }

    const movie = await Movie.findById(movieId)

    if (!movie || movie.createdBy?.toString() !== createdBy.toString()) {
      const error: ErrorType = new Error('Movie not found.')
      error.statusCode = 404
      throw error
    }

    const user = await User.findById(createdBy)

    if (!user) {
      const error: ErrorType = new Error('User not found.')
      error.statusCode = 404
      throw error
    }

    const quote = {
      ...req.body,
      image: `${getApiUrl()}/${req.file.path}`,
      createdBy,
    }

    const response = await Quote.create(quote)

    res.status(201).json({
      message: 'Quote added successfully!',
      id: response._id,
    })
  } catch (err) {
    if (req.file) {
      removeImage(req.file.path)
    }

    next(err)
  }
}
