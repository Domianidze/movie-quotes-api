import express from 'express'

import { signUp, logIn, verifyAccount, resendVerify } from 'controllers'

const Router = express.Router()

Router.post('/signup', signUp)

Router.post('/login', logIn)

Router.post('/verify-account', verifyAccount)

Router.post('/resend-verify', resendVerify)

export default Router
