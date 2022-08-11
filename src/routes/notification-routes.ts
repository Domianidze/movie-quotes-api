import express from 'express'

import { getNotifications } from 'controllers'

const Router = express.Router()

Router.get('/notifications', getNotifications)

export default Router
