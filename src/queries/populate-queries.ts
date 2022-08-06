export const quotePopulateQuery = [
  {
    path: 'movie',
    select: ['-__v', '-createdBy'],
  },
  {
    path: 'createdBy',
    select: ['username'],
  },
  {
    path: 'likes.likedBy',
    select: ['username'],
  },
  {
    path: 'comments.commentedBy',
    select: ['username'],
  },
]

export const moviePopulateQuery = [
  {
    path: 'createdBy',
    select: ['username'],
  },
  {
    path: 'quotes.data',
    select: ['-__v', '-movie', '-createdBy'],
  },
]
