import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { safeRedis } from './redis'

let io: SocketIOServer | null = null
let redisPubSubEnabled = false

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

// ✅ FIX: Setup Redis Pub/Sub com fallback
async function setupRedisPubSub() {
  // Não tentar conectar durante build do Vercel
  if (!safeRedis.isAvailable()) {
    console.log('[Socket] Redis not available, skipping Pub/Sub setup')
    redisPubSubEnabled = false
    return
  }

  try {
    const { redis } = await import('./redis')
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

    redisPubSubEnabled = true
    console.log('[Socket] ✅ Redis Pub/Sub configured for WebSocket')
  } catch (err) {
    console.error('[Socket] Failed to setup Redis Pub/Sub:', err)
    redisPubSubEnabled = false
  }
}

export function getSocketServer(): SocketIOServer | null {
  return io
}

// ✅ FIX: Emit com fallback
export async function emitMetricsUpdate(data: any) {
  if (!redisPubSubEnabled) {
    console.log('[Socket] Redis Pub/Sub not enabled, emitting directly')
    if (io) {
      io.emit('metrics:update', data)
    }
    return
  }

  try {
    const { redis } = await import('./redis')
    await redis.publish('metrics:update', JSON.stringify(data))
  } catch (err) {
    console.error('[Socket] Failed to publish metrics update:', err)
    // Fallback: emit diretamente
    if (io) {
      io.emit('metrics:update', data)
    }
  }
}

export async function emitAlert(alert: any) {
  if (!redisPubSubEnabled) {
    console.log('[Socket] Redis Pub/Sub not enabled, emitting directly')
    if (io) {
      io.emit('alert:new', alert)
    }
    return
  }

  try {
    const { redis } = await import('./redis')
    await redis.publish('alert:new', JSON.stringify(alert))
  } catch (err) {
    console.error('[Socket] Failed to publish alert:', err)
    // Fallback: emit diretamente
    if (io) {
      io.emit('alert:new', alert)
    }
  }
}
