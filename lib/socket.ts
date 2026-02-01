import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { redis } from './redis'

let io: SocketIOServer | null = null

export function initSocketServer(httpServer: HTTPServer) {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  })

  io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`)

    // Autenticação (opcional)
    socket.on('authenticate', async (token: string) => {
      // Verificar token JWT aqui
      console.log('Socket authenticated')
    })

    // Entrar em sala de arena
    socket.on('join:arena', (arenaId: string) => {
      socket.join(`arena:${arenaId}`)
      console.log(`Socket ${socket.id} joined arena:${arenaId}`)
    })

    // Sair de sala
    socket.on('leave:arena', (arenaId: string) => {
      socket.leave(`arena:${arenaId}`)
    })

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`)
    })
  })

  // Setup Redis Pub/Sub para escalar WebSocket
  setupRedisPubSub()

  return io
}

async function setupRedisPubSub() {
  const subscriber = redis.duplicate()
  await subscriber.connect()

  // Inscrever em canal de métricas
  await subscriber.subscribe('metrics:update', (message) => {
    if (io) {
      io.emit('metrics:update', JSON.parse(message))
    }
  })

  // Inscrever em canal de alertas
  await subscriber.subscribe('alert:new', (message) => {
    if (io) {
      io.emit('alert:new', JSON.parse(message))
    }
  })

  console.log('✅ Redis Pub/Sub configured for WebSocket')
}

export function getSocketServer(): SocketIOServer | null {
  return io
}

export async function emitMetricsUpdate(data: any) {
  // Publicar no Redis para que todos os workers recebam
  await redis.publish('metrics:update', JSON.stringify(data))
}

export async function emitAlert(alert: any) {
  await redis.publish('alert:new', JSON.stringify(alert))
}
