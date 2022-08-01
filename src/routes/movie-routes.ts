import express from 'express'

import { getMovies, getMovie, addMovie, editMovie } from 'controllers'

const Router = express.Router()

Router.get('/movies', getMovies)

Router.get('/movie/:id', getMovie)

Router.post('/movie', addMovie)

Router.put('/movie', editMovie)

export default Router
