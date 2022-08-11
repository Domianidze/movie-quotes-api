import express from 'express'

import { getNotifications, readNotification } from 'controllers'

const Router = express.Router()

Router.get('/notifications', getNotifications)

Router.put('/read-notification', readNotification)

export default Router
