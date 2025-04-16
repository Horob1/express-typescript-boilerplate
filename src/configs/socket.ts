import { Server, Socket } from 'socket.io'
import { Server as HttpServer } from 'http'
import getCorsOptions from './cors'

let io: Server

const OnlineUsers = new Map<string, string>()

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: getCorsOptions()
  })

  io.on('connection', (socket: Socket) => {
    const userId = socket.handshake.query.userId as string
    if (!userId) return
    OnlineUsers.set(userId, socket.id)
    socket.on('disconnect', () => {
      OnlineUsers.delete(userId)
    })
  })
}

export const getSocketIO = () => io
