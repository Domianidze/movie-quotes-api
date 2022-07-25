import express from 'express'

import { signUp } from 'controllers/auth-controller'

const Router = express.Router()

Router.post('/signup', signUp)

export default Router
