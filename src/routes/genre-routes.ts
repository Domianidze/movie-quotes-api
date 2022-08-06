import express from 'express'

import { getGenres, addGenre } from 'controllers'

const Router = express.Router()

Router.get('/genres', getGenres)

Router.post('/genre', addGenre)

export default Router
