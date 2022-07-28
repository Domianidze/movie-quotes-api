import express from 'express'

import { googelAuth } from 'controllers'

const Router = express.Router()

Router.post('/auth', googelAuth)

export default Router
