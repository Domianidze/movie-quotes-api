import express, { Express } from 'express'
import { initIo } from 'socket'
import http from 'http'
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

const app: Express = express()

app.use(cors())
app.use(bodyParser.json())

app.use(multerMiddleware)
app.use('/storage', express.static(path.join('storage')))

app.use('/api-docs', SwaggerUI.serve, swaggerMiddleware())

app.use(authRoutes)

app.use('/google', googleRoutes)

app.use('/password', passwordRecoveryRoutes)

app.use(authMiddleware, movieRoutes)

app.use(authMiddleware, quoteRoutes)

app.use(authMiddleware, genreRoutes)

app.use(authMiddleware, notificationRoutes)

app.use(errorMiddleware)

const startServer = async () => {
  try {
    await mongoose.connect(getMongoUrl())

    const server = http.createServer(app)

    initIo(server)

    server.listen(process.env.SERVER_PORT)
  } catch (err) {
    console.error(err)
  }
}

startServer()
