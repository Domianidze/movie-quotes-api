import express from 'express'

import { getUser } from 'controllers'

const Router = express.Router()

Router.get('/user', getUser)

export default Router
