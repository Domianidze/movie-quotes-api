import express from 'express'

import { sendPasswordRecoveryLink } from 'controllers'

const Router = express.Router()

Router.post('/send-recovery-link', sendPasswordRecoveryLink)

export default Router
