import express from 'express'

import {
  getUser,
  editUser,
  addEmail,
  activateEmail,
  setPrimaryEmail,
} from 'controllers'

const Router = express.Router()

Router.get('/user', getUser)

Router.put('/user', editUser)

Router.post('/add-email', addEmail)

Router.put('/activate-email', activateEmail)

Router.put('/set-primary-email', setPrimaryEmail)

export default Router
