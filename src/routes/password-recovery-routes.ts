import express from 'express'

import { sendPasswordRecoveryLink, recoverPassword } from 'controllers'

const Router = express.Router()

Router.post('/send-recovery-link', sendPasswordRecoveryLink)

Router.post('/recover', recoverPassword)

export default Router
