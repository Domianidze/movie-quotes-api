import express from 'express'

import { getUser, editUser, addEmail, activateEmail } from 'controllers'

const Router = express.Router()

Router.get('/user', getUser)

Router.put('/user', editUser)

Router.post('/add-email', addEmail)

Router.post('/activate-email', activateEmail)

export default Router
