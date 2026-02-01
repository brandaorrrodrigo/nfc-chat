import { createClient } from 'redis'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

export const redis = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error('Too many Redis reconnect attempts')
        return new Error('Too many Redis reconnect attempts')
      }
      return Math.min(retries * 100, 3000)
    }
  }
})

redis.on('error', (err) => {
  console.error('Redis Client Error:', err)
})

redis.on('connect', () => {
  console.log('✅ Redis connected')
})

redis.on('reconnecting', () => {
  console.log('🔄 Redis reconnecting...')
})

redis.on('ready', () => {
  console.log('✅ Redis ready')
})

// Auto-connect
if (!redis.isOpen) {
  redis.connect().catch(console.error)
}

export default redis
