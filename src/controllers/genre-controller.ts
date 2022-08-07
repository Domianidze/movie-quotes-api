import { Request, Response, NextFunction } from 'express'

import { postGenreSchema } from 'schemas'
import { Genre } from 'models'
import { validateId } from 'helpers'
import { ErrorType } from 'types'

export const getGenres = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const genres = await Genre.find({ createdBy: req.user.id }).select('-__v')

    res.status(200).json(genres)
  } catch (err) {
    next(err)
  }
}

export const addGenre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await postGenreSchema.validateAsync(req.body)

    const { genre }: { genre: string } = req.body
    const formattedGenre = `${genre.charAt(0).toUpperCase()}${genre.slice(1)}`

    const existingGenre = await Genre.findOne({ genre: formattedGenre })

    if (existingGenre) {
      const error: ErrorType = new Error('Genre already exists.')
      error.statusCode = 409
      throw error
    }

    const response = await Genre.create({ genre: formattedGenre })

    res.status(201).json({
      message: 'Genre added successfully!',
      id: response._id,
    })
  } catch (err) {
    next(err)
  }
}

export const deleteGenre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateId(req.body.id)

    const genre = await Genre.findByIdAndRemove(req.body.id)

    if (!genre) {
      const error: ErrorType = new Error('Genre not found.')
      error.statusCode = 404
      throw error
    }

    res.status(200).json({
      message: 'Genre deleted successfully!',
    })
  } catch (err) {
    next(err)
  }
}
