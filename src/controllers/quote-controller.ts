import { Request, Response, NextFunction } from 'express'

import {
  postQuoteSchema,
  putQuoteSchema,
  postQuoteCommentSchema,
} from 'schemas'
import { User, Movie, Quote } from 'models'
import { quotePopulateQuery } from 'queries'
import { getApiUrl, removeImage, validateId } from 'helpers'
import { ErrorType } from 'types'

export const searchQuotes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query } = req.params

    const findByQuotes = async () => {
      const data = await Quote.find({ $text: { $search: query } })
        .select('-__v')
        .populate(quotePopulateQuery)
        .sort({ _id: -1 })

      return data
    }

    const findByMovies = async () => {
      const movies = await Movie.find({ $text: { $search: query } })

      const movieIds: string[] = movies.map((movie) => movie._id.toString())

      const data = await Quote.find({ movie: { $in: movieIds } })
        .select('-__v')
        .populate(quotePopulateQuery)
        .sort({ _id: -1 })

      return data
    }

    let quotes

    if (query.startsWith('@')) {
      quotes = await findByQuotes()
    }

    if (query.startsWith('&')) {
      quotes = await findByMovies()
    }

    if (!quotes) {
      const byQuotes = await findByQuotes()
      const byMovies = await findByMovies()

      quotes = [...byQuotes, ...byMovies]
    }

    res.status(200).json(quotes)
  } catch (err) {
    next(err)
  }
}

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
      .populate(quotePopulateQuery)
      .sort({ _id: -1 })
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
      .populate(quotePopulateQuery)

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
    await postQuoteSchema.validateAsync(req.body)

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

    await movie.updateOne({
      $push: {
        quotes: { data: response._id },
      },
    })

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
    await putQuoteSchema.validateAsync(req.body)

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

    await quote.updateOne(data)

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

    const movie = await Movie.findOne({ _id: quote.movie })

    if (movie) {
      const filteredMovieQuotes = movie.quotes.filter(
        (movieQuote) => movieQuote.data?.toString() !== quote._id.toString()
      )

      await movie.updateOne({
        $set: { quotes: filteredMovieQuotes },
      })
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

      await quote.updateOne({
        $set: { likes: filteredLikes },
      })

      res.status(200).json({
        message: 'Quote un-liked successfully!',
      })
      return
    }

    await quote.updateOne({
      $push: { likes: { likedBy: req.user.id } },
    })

    res.status(200).json({
      message: 'Quote liked successfully!',
    })
  } catch (err) {
    next(err)
  }
}

export const postQuoteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await postQuoteCommentSchema.validateAsync(req.body)

    validateId(req.body.id)

    const quote = await Quote.findById(req.body.id)

    if (!quote) {
      const error: ErrorType = new Error('Quote not found.')
      error.statusCode = 404
      throw error
    }

    await quote.updateOne({
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

export const deleteQuoteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateId(req.body.id)
    validateId(req.body.quoteId)

    const quote = await Quote.findById(req.body.quoteId)

    if (!quote) {
      const error: ErrorType = new Error('Quote not found.')
      error.statusCode = 404
      throw error
    }

    const foundComment = quote.comments.find(
      (comment: any) => comment._id.toString() === req.body.id.toString()
    )

    if (!foundComment) {
      const error: ErrorType = new Error('Comment not found.')
      error.statusCode = 404
      throw error
    }

    if (foundComment.commentedBy?.toString() !== req.user.id.toString()) {
      const error: ErrorType = new Error('Not authorized.')
      error.statusCode = 401
      throw error
    }

    const filteredComments = quote.comments.filter(
      (comment: any) => comment._id.toString() !== req.body.id.toString()
    )

    await quote.updateOne({
      $set: { comments: filteredComments },
    })

    res.status(200).json({
      message: 'Commented deleted successfully!',
    })
  } catch (err) {
    next(err)
  }
}
