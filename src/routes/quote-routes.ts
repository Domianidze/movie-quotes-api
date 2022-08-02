import express from 'express'

import { addQuote } from 'controllers'

const Router = express.Router()

Router.post('/quote', addQuote)

export default Router
