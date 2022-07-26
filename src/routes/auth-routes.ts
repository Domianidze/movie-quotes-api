import express from 'express'

import { signUp, verifyAccount } from 'controllers/auth-controller'

const Router = express.Router()

Router.post('/signup', signUp)

Router.post('/verify-account', verifyAccount)

export default Router
