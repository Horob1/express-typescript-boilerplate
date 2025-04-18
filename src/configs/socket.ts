import { Server, Socket } from 'socket.io'
import { Server as HttpServer } from 'http'
import getCorsOptions from './cors'

let io: Server
interface OnlineUser {
  userId: string
  socketId: string[]
  socket: Socket[]
  credentialId: string[]
}
const OnlineUsers = new Map<string, OnlineUser>()

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: getCorsOptions(),
  })

  io.on('connection', (socket: Socket) => {
    const userId = socket.handshake.query.userId as string
    const credentialId = socket.handshake.query.credentialId as string

    if (userId && credentialId) {
      const isExist = OnlineUsers.get(userId)
      if (isExist) {
        OnlineUsers.set(userId, {
          userId,
          socketId: [...isExist.socketId, socket.id],
          socket: [...isExist.socket, socket],
          credentialId: [...isExist.credentialId, credentialId],
        })
      } else {
        OnlineUsers.set(userId, {
          userId,
          socketId: [socket.id],
          socket: [socket],
          credentialId: [credentialId],
        })
      }
      socket.join([userId, credentialId])
    } else {
      socket.join('guests')
    }

    socket.on('disconnect', () => {
      if (userId && credentialId) {
        const isExist = OnlineUsers.get(userId)
        if (isExist) {
          OnlineUsers.set(userId, {
            userId,
            socketId: isExist.socketId.filter(id => id !== socket.id),
            socket: isExist.socket.filter(s => s.id !== socket.id),
            credentialId: isExist.credentialId.filter(id => id !== credentialId),
          })
          if (isExist.socketId.length === 0) {
            OnlineUsers.delete(userId)
          }
        }
        socket.leave(userId)
        socket.leave(credentialId)
      } else {
        socket.leave('guests')
      }
    })
  })
}

export const getSocketIO = () => io
