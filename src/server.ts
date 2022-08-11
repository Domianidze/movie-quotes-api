import express, { Express } from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import SwaggerUI from 'swagger-ui-express'
import 'dotenv/config'

import {
  multerMiddleware,
  swaggerMiddleware,
  errorMiddleware,
  authMiddleware,
} from 'middleware'
import {
  authRoutes,
  googleRoutes,
  passwordRecoveryRoutes,
  movieRoutes,
  quoteRoutes,
  genreRoutes,
  notificationRoutes,
} from 'routes'
import { getMongoUrl } from 'helpers'

const server: Express = express()

server.use(cors())
server.use(bodyParser.json())

server.use(multerMiddleware)
server.use('/storage', express.static(path.join('storage')))

server.use('/api-docs', SwaggerUI.serve, swaggerMiddleware())

server.use(authRoutes)

server.use('/google', googleRoutes)

server.use('/password', passwordRecoveryRoutes)

server.use(authMiddleware, movieRoutes)

server.use(authMiddleware, quoteRoutes)

server.use(authMiddleware, genreRoutes)

server.use(authMiddleware, notificationRoutes)

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
