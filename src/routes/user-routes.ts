import express from 'express'

import { getUser, editUser } from 'controllers'

const Router = express.Router()

Router.get('/user', getUser)

Router.put('/user', editUser)

export default Router
