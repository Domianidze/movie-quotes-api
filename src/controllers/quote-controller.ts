import { Request, Response, NextFunction } from 'express'

import { User, Movie, Quote } from 'models'
import { getApiUrl, removeImage, validateId } from 'helpers'
import { ErrorType } from 'types'

export const getQuotes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = +req.params.page || 0
    const skip = page * 10
    const limit = skip + 10

    const quotes = await Quote.find()
      .select('-__v')
      .populate({
        path: 'movie',
        select: ['-__v', '-createdBy'],
      })
      .populate({
        path: 'createdBy',
        select: ['username'],
      })
      .populate({
        path: 'likes.likedBy',
        select: ['username'],
      })
      .populate({
        path: 'comments.commentedBy',
        select: ['username'],
      })
      .skip(skip)
      .limit(limit)

    res.status(200).json(quotes)
  } catch (err) {
    next(err)
  }
}

export const getQuote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateId(req.params.id)

    const quote = await Quote.findById(req.params.id)
      .select('-__v')
      .populate({
        path: 'movie',
        select: ['-__v', '-createdBy'],
      })
      .populate({
        path: 'createdBy',
        select: ['username'],
      })
      .populate({
        path: 'likes.likedBy',
        select: ['username'],
      })

    if (!quote) {
      const error: ErrorType = new Error('Quote not found.')
      error.statusCode = 404
      throw error
    }

    res.status(200).json(quote)
  } catch (err) {
    next(err)
  }
}

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
      likes: [],
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

export const editQuote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateId(req.body.id)

    const quote = await Quote.findById(req.body.id)

    if (!quote || !quote.createdBy) {
      const error: ErrorType = new Error('Quote not found.')
      error.statusCode = 404
      throw error
    }

    if (req.user.id.toString() !== quote.createdBy.toString()) {
      const error: ErrorType = new Error('Not authorized.')
      error.statusCode = 401
      throw error
    }

    const image = req.file

    const data = {
      ...req.body,
      ...(image && { image: `${getApiUrl()}/${image.path}` }),
    }

    await quote.update(data)

    if (image) {
      removeImage(quote.image)
    }

    res.status(200).json({
      message: 'Quote edited successfully!',
    })
  } catch (err) {
    if (req.file) {
      removeImage(req.file.path)
    }

    next(err)
  }
}

export const deleteQuote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateId(req.body.id)

    const quote = await Quote.findById(req.body.id)

    if (!quote || !quote.createdBy) {
      const error: ErrorType = new Error('Quote not found.')
      error.statusCode = 404
      throw error
    }

    if (req.user.id.toString() !== quote.createdBy.toString()) {
      const error: ErrorType = new Error('Not authorized.')
      error.statusCode = 401
      throw error
    }

    await quote.remove()

    removeImage(quote.image)

    res.status(200).json({
      message: 'Quote deleted successfully!',
    })
  } catch (err) {
    next(err)
  }
}

export const likeQuote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateId(req.body.id)

    const quote = await Quote.findById(req.body.id)

    if (!quote) {
      const error: ErrorType = new Error('Quote not found.')
      error.statusCode = 404
      throw error
    }

    const alreadyLiked = quote.likes.find(
      (like) => like.likedBy?.toString() === req.user.id.toString()
    )

    if (alreadyLiked) {
      const filteredLikes = quote.likes.filter(
        (like) => like.likedBy?.toString() !== req.user.id.toString()
      )

      console.log('hello', filteredLikes)

      await quote.update({
        $set: { likes: filteredLikes },
      })

      res.status(200).json({
        message: 'Quote un-liked successfully!',
      })
      return
    }

    await quote.update({
      $push: { likes: { likedBy: req.user.id } },
    })

    res.status(200).json({
      message: 'Quote liked successfully!',
    })
  } catch (err) {
    next(err)
  }
}

export const commentQuote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateId(req.body.id)

    const quote = await Quote.findById(req.body.id)

    if (!quote) {
      const error: ErrorType = new Error('Quote not found.')
      error.statusCode = 404
      throw error
    }

    await quote.update({
      $push: {
        comments: { comment: req.body.comment, commentedBy: req.user.id },
      },
    })

    res.status(200).json({
      message: 'Commented on quote successfully!',
    })
  } catch (err) {
    next(err)
  }
}
