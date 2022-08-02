import { Request, Response, NextFunction } from 'express'

import { postMovieSchema, putMovieSchema } from 'schemas'
import { User, Movie } from 'models'
import { moviePopulateQuery } from 'querys'
import { getApiUrl, removeImage, validateId } from 'helpers'
import { ErrorType } from 'types'

export const getMovies = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const movies = await Movie.find()
      .select('-__v')
      .populate(moviePopulateQuery)

    res.status(200).json(movies)
  } catch (err) {
    next(err)
  }
}

export const getMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateId(req.params.id)

    const movie = await Movie.findById(req.params.id)
      .select('-__v')
      .populate(moviePopulateQuery)

    if (!movie) {
      const error: ErrorType = new Error('Movie not found.')
      error.statusCode = 404
      throw error
    }

    res.status(200).json(movie)
  } catch (err) {
    next(err)
  }
}

export const addMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await postMovieSchema.validateAsync(req.body)

    const createdBy = req.user.id

    validateId(createdBy)

    if (!req.file) {
      const error: ErrorType = new Error('Proper image not found.')
      error.statusCode = 422
      throw error
    }

    const user = await User.findById(createdBy)

    if (!user) {
      const error: ErrorType = new Error('User not found.')
      error.statusCode = 404
      throw error
    }

    const movie = {
      ...req.body,
      image: `${getApiUrl()}/${req.file.path}`,
      createdBy,
    }

    const response = await Movie.create(movie)

    res.status(201).json({
      message: 'Movie added successfully!',
      id: response._id,
    })
  } catch (err) {
    if (req.file) {
      removeImage(req.file.path)
    }

    next(err)
  }
}

export const editMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await putMovieSchema.validateAsync(req.body)

    validateId(req.body.id)

    const movie = await Movie.findById(req.body.id)

    if (!movie || !movie.createdBy) {
      const error: ErrorType = new Error('Movie not found.')
      error.statusCode = 404
      throw error
    }

    if (req.user.id.toString() !== movie.createdBy.toString()) {
      const error: ErrorType = new Error('Not authorized.')
      error.statusCode = 401
      throw error
    }

    const image = req.file

    const data = {
      ...req.body,
      ...(image && { image: `${getApiUrl()}/${image.path}` }),
    }

    await movie.update(data)

    if (image) {
      removeImage(movie.image)
    }

    res.status(200).json({
      message: 'Movie edited successfully!',
    })
  } catch (err) {
    if (req.file) {
      removeImage(req.file.path)
    }

    next(err)
  }
}

export const deleteMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateId(req.body.id)

    const movie = await Movie.findById(req.body.id)

    if (!movie || !movie.createdBy) {
      const error: ErrorType = new Error('Movie not found.')
      error.statusCode = 404
      throw error
    }

    if (req.user.id.toString() !== movie.createdBy.toString()) {
      const error: ErrorType = new Error('Not authorized.')
      error.statusCode = 401
      throw error
    }

    await movie.remove()

    removeImage(movie.image)

    res.status(200).json({
      message: 'Movie deleted successfully!',
    })
  } catch (err) {
    next(err)
  }
}
