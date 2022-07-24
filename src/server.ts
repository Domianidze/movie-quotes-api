import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import SwaggerUI from 'swagger-ui-express'
import 'dotenv/config'

import { swaggerMiddleware } from 'middleware'
import { getMongoUrl } from 'helpers'

const server: Express = express()

server.use(bodyParser.json())

server.use('/api-docs', SwaggerUI.serve, swaggerMiddleware())

server.use((_: Request, res: Response) => {
  res.json({
    message: 'Hello World!',
  })
})

const startServer = async () => {
  try {
    await mongoose.connect(getMongoUrl())
    server.listen(process.env.SERVER_PORT)
  } catch (err) {
    console.error(err)
  }
}

startServer()
