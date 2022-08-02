import express from 'express'

import {
  getQuotes,
  getQuote,
  addQuote,
  editQuote,
  deleteQuote,
  likeQuote,
  postQuoteComment,
  deleteQuoteComment,
} from 'controllers'

const Router = express.Router()

Router.get('/quotes/:page', getQuotes)

Router.get('/quote/:id', getQuote)

Router.post('/quote', addQuote)

Router.put('/quote', editQuote)

Router.delete('/quote', deleteQuote)

Router.post('/like-quote', likeQuote)

Router.post('/quote-comment', postQuoteComment)

Router.delete('/quote-comment', deleteQuoteComment)

export default Router
