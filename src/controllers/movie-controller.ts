import { Request, Response, NextFunction } from 'express'
import fs from 'fs'

import { User, Movie } from 'models'
import { getApiUrl, getImagePath } from 'helpers'
import { ErrorType } from 'types'

export const getMovies = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const movies = await Movie.find()
      .select('-__v')
      .populate({
        path: 'createdBy',
        select: ['username'],
      })

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
    const movie = await Movie.findById(req.params.id)
      .select('-__v')
      .populate({
        path: 'createdBy',
        select: ['username'],
      })

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
    if (!req.file) {
      const error: ErrorType = new Error('Proper image not found.')
      error.statusCode = 422
      throw error
    }

    const user = await User.findById(req.body.createdBy)

    if (!user) {
      const error: ErrorType = new Error('User not found.')
      error.statusCode = 404
      throw error
    }

    const movie = { ...req.body, image: `${getApiUrl()}/${req.file.path}` }

    const response = await Movie.create(movie)

    res.status(201).json({
      message: 'Movie added successfully!',
      id: response._id,
    })
  } catch (err) {
    next(err)
  }
}

export const editMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const image = req.file

    const data = {
      ...req.body,
      ...(image && { image: `${getApiUrl()}/${image.path}` }),
    }

    console.log(data)

    const movie = await Movie.findOneAndUpdate(
      {
        _id: req.body.id,
      },
      data
    )

    if (!movie) {
      const error: ErrorType = new Error('No movie found.')
      error.statusCode = 404
      throw error
    }

    if (image) {
      const path = getImagePath(movie.image)

      if (fs.existsSync(path)) {
        await fs.promises.unlink(path)
      }
    }

    res.status(200).json({
      message: 'Movie edited successfully!',
    })
  } catch (err) {
    next(err)
  }
}
