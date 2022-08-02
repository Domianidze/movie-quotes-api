export const quotePopulateQuery = [
  {
    path: 'movie',
    select: ['-__v', '-createdBy'],
  },
  {
    path: 'likes.likedBy',
    select: ['username'],
  },
  {
    path: 'createdBy',
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
]
