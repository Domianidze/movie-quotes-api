import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import 'dotenv/config'

import { getMongoUrl } from 'helpers'

const server: Express = express()

server.use(bodyParser.json())

server.use((_: Request, res: Response) => {
  res.json({
    message: 'Hello World!',
  })
})

const startServer = async () => {
  try {
    await mongoose.connect(getMongoUrl())
    server.listen(process.env.SEVER_PORT)
  } catch (err) {
    console.error(err)
  }
}

startServer()
