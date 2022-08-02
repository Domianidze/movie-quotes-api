import express from 'express'

import { getQuotes, getQuote, addQuote } from 'controllers'

const Router = express.Router()

Router.get('/quotes/:page', getQuotes)

Router.get('/quote/:id', getQuote)

Router.post('/quote', addQuote)

export default Router
