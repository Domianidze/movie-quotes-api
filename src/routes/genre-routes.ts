import express from 'express'

import { addGenre } from 'controllers'

const Router = express.Router()

Router.post('/genre', addGenre)

export default Router
