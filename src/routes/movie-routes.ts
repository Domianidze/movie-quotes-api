import express from 'express'

import { addMovie } from 'controllers'

const Router = express.Router()

Router.post('', addMovie)

export default Router
