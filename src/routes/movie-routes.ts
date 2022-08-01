import express from 'express'

import { getMovies, getMovie, addMovie } from 'controllers'

const Router = express.Router()

Router.get('/movies', getMovies)

Router.get('/movie/:id', getMovie)

Router.post('/movie', addMovie)

export default Router
