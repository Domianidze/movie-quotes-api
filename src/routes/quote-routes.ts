import express from 'express'

import { getQuotes, getQuote, addQuote, editQuote } from 'controllers'

const Router = express.Router()

Router.get('/quotes/:page', getQuotes)

Router.get('/quote/:id', getQuote)

Router.post('/quote', addQuote)

Router.put('/quote', editQuote)

export default Router
