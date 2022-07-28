import express, { Express } from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import SwaggerUI from 'swagger-ui-express'
import 'dotenv/config'

import { corsMiddleware, swaggerMiddleware, errorMiddleware } from 'middleware'
import { authRoutes, passwordRecoveryRoutes } from 'routes'
import { getMongoUrl } from 'helpers'

const server: Express = express()

server.use(bodyParser.json())

server.use(corsMiddleware)

server.use('/api-docs', SwaggerUI.serve, swaggerMiddleware())

server.use(authRoutes)

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
