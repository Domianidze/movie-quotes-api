import express from 'express'

import { signUp, confirmAccount } from 'controllers/auth-controller'

const Router = express.Router()

Router.post('/signup', signUp)

Router.post('/confirm-account', confirmAccount)

export default Router
