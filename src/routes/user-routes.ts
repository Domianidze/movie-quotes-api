import express from 'express'

import { getUser, editUser, addEmail } from 'controllers'

const Router = express.Router()

Router.get('/user', getUser)

Router.put('/user', editUser)

Router.post('/add-email', addEmail)

export default Router
