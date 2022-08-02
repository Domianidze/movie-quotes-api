import express from 'express'

import { getQuotes, addQuote } from 'controllers'

const Router = express.Router()

Router.get('/quotes/:page', getQuotes)

Router.post('/quote', addQuote)

export default Router
