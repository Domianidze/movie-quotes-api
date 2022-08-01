import express, { Express } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import SwaggerUI from 'swagger-ui-express'
import 'dotenv/config'

import {
  multerMiddleware,
  swaggerMiddleware,
  errorMiddleware,
} from 'middleware'
import { authRoutes, googleRoutes, passwordRecoveryRoutes } from 'routes'
import { getMongoUrl } from 'helpers'

const server: Express = express()

server.use(cors())
server.use(bodyParser.json())

server.use(multerMiddleware)

server.use('/api-docs', SwaggerUI.serve, swaggerMiddleware())

server.use(authRoutes)

server.use('/google', googleRoutes)

server.use('/password', passwordRecoveryRoutes)

server.use(errorMiddleware)

const startServer = async () => {
  try {
    await mongoose.connect(getMongoUrl())
    server.listen(process.env.SERVER_PORT)
  } catch (err) {
    console.error(err)
  }
}

startServer()
