import express from 'express'

import {
  getUser,
  editUser,
  addEmail,
  activateEmail,
  setPrimaryEmail,
  deleteEmail,
  changePassword,
} from 'controllers'

const Router = express.Router()

Router.get('/user', getUser)

Router.put('/user', editUser)

Router.post('/email', addEmail)

Router.put('/activate-email', activateEmail)

Router.put('/set-primary-email', setPrimaryEmail)

Router.delete('/email', deleteEmail)

Router.put('/password', changePassword)

export default Router
