import express from 'express'

import { signUp, logIn, verifyAccount } from 'controllers/auth-controller'

const Router = express.Router()

Router.post('/signup', signUp)

Router.post('/login', logIn)

Router.post('/verify-account', verifyAccount)

export default Router
