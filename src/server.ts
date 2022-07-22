import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'

const server: Express = express()

server.use(bodyParser.json())

server.use((_: Request, res: Response) => {
  res.json('Hello World!')
})

server.listen(3000)
