import express from 'express'

import {
  getNotifications,
  readNotification,
  readAllNotifications,
} from 'controllers'

const Router = express.Router()

Router.get('/notifications', getNotifications)

Router.put('/read-notification', readNotification)

Router.put('/read-all-notifications', readAllNotifications)

export default Router
