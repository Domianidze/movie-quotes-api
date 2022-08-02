import express from 'express'

import {
  getQuotes,
  getQuote,
  addQuote,
  editQuote,
  deleteQuote,
  likeQuote,
  commentQuote,
} from 'controllers'

const Router = express.Router()

Router.get('/quotes/:page', getQuotes)

Router.get('/quote/:id', getQuote)

Router.post('/quote', addQuote)

Router.put('/quote', editQuote)

Router.delete('/quote', deleteQuote)

Router.post('/like-quote', likeQuote)

Router.post('/comment-quote', commentQuote)

export default Router
