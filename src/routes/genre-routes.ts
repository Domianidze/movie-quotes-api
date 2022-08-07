import express from 'express'

import { getGenres, addGenre, deleteGenre } from 'controllers'

const Router = express.Router()

Router.get('/genres', getGenres)

Router.post('/genre', addGenre)

Router.delete('/genre', deleteGenre)

export default Router
