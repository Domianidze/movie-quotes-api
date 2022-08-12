import { Server } from 'socket.io'
import http from 'http'

let io: Server

export const initIo = (server: http.Server) => {
  io = new Server(server, { cors: { origin: '*' } })

  return io
}

export const getIo = () => io
