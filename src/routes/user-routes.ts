import express from 'express'

import {
  getUser,
  editUser,
  addEmail,
  activateEmail,
  setPrimaryEmail,
  deleteEmail,
} from 'controllers'

const Router = express.Router()

Router.get('/user', getUser)

Router.put('/user', editUser)

Router.post('/email', addEmail)

Router.put('/activate-email', activateEmail)

Router.put('/set-primary-email', setPrimaryEmail)

Router.delete('/email', deleteEmail)

export default Router
