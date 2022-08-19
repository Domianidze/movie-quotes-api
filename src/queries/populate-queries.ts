export const quotePopulateQuery = [
  {
    path: 'movie',
    select: ['-__v', '-createdBy'],
  },
  {
    path: 'createdBy',
    select: ['photo', 'username'],
  },
  {
    path: 'likes.likedBy',
    select: ['photo', 'username'],
  },
  {
    path: 'comments.commentedBy',
    select: ['photo', 'username'],
  },
]

export const moviePopulateQuery = [
  {
    path: 'createdBy',
    select: ['photo', 'username'],
  },
  {
    path: 'quotes.data',
    select: ['-__v', '-movie', '-createdBy'],
  },
]
