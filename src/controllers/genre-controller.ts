import { Request, Response, NextFunction } from 'express'

import { Genre } from 'models'
import { ErrorType } from 'types'

export const addGenre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { genre }: { genre: string } = req.body
    const formattedGenre = `${genre.charAt(0).toUpperCase()}${genre.slice(1)}`

    const existingGenre = await Genre.findOne({ genre: formattedGenre })

    if (existingGenre) {
      const error: ErrorType = new Error('Genre with this name already exists.')
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
