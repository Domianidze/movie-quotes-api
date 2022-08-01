import express from 'express'

import { getMovies, addMovie } from 'controllers'

const Router = express.Router()

Router.get('/movies', getMovies)

Router.post('/movie', addMovie)

export default Router
