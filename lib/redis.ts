import { createClient } from 'redis'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

// ✅ FIX: Flag para modo offline (usado durante build)
let isOfflineMode = false

// ✅ FIX: Configuração com timeouts agressivos
export const redis = createClient({
  url: redisUrl,
  socket: {
    // ✅ FIX: Timeout de conexão - 5 segundos
    connectTimeout: 5000,

    // ✅ FIX: Retry strategy com limite baixo
    reconnectStrategy: (retries) => {
      // Durante build, desiste imediatamente
      if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL) {
        console.log('[Redis] Build mode detected, skipping reconnect')
        isOfflineMode = true
        return false
      }

      // Máximo 3 tentativas em desenvolvimento
      if (retries > 3) {
        console.error('[Redis] Max reconnect attempts reached, entering offline mode')
        isOfflineMode = true
        return false
      }

      return Math.min(retries * 1000, 3000)
    }
  }
})

redis.on('error', (err) => {
  // ✅ FIX: Não bloqueia - apenas loga
  console.error('[Redis] Client Error:', err.message)

  // Se for erro de conexão durante build, entra em modo offline
  if (err.message.includes('ECONNREFUSED') || err.message.includes('ETIMEDOUT')) {
    isOfflineMode = true
  }
})

redis.on('connect', () => {
  console.log('[Redis] ✅ Connected')
  isOfflineMode = false
})

redis.on('reconnecting', () => {
  console.log('[Redis] 🔄 Reconnecting...')
})

redis.on('ready', () => {
  console.log('[Redis] ✅ Ready')
  isOfflineMode = false
})

// ✅ FIX: Lazy connection - NÃO conecta automaticamente durante build
const shouldAutoConnect = () => {
  // Não conectar durante build do Vercel
  if (process.env.VERCEL_ENV && process.env.VERCEL) {
    console.log('[Redis] Build mode detected, skipping auto-connect')
    isOfflineMode = true
    return false
  }

  // Não conectar se não tiver REDIS_URL configurado em produção
  if (process.env.NODE_ENV === 'production' && !process.env.REDIS_URL) {
    console.log('[Redis] No REDIS_URL in production, entering offline mode')
    isOfflineMode = true
    return false
  }

  return true
}

// ✅ FIX: Conectar apenas se apropriado
if (shouldAutoConnect() && !redis.isOpen) {
  redis.connect().catch((err) => {
    console.error('[Redis] Auto-connect failed:', err.message)
    isOfflineMode = true
  })
}

// ✅ FIX: Wrapper seguro para operações Redis com fallback
export const safeRedis = {
  async get(key: string): Promise<string | null> {
    if (isOfflineMode || !redis.isOpen) {
      console.log(`[Redis] Offline mode - skipping GET ${key}`)
      return null
    }

    try {
      return await redis.get(key)
    } catch (err) {
      console.error(`[Redis] GET ${key} failed:`, err)
      isOfflineMode = true
      return null
    }
  },

  async set(key: string, value: string): Promise<void> {
    if (isOfflineMode || !redis.isOpen) {
      console.log(`[Redis] Offline mode - skipping SET ${key}`)
      return
    }

    try {
      await redis.set(key, value)
    } catch (err) {
      console.error(`[Redis] SET ${key} failed:`, err)
      isOfflineMode = true
    }
  },

  async setEx(key: string, seconds: number, value: string): Promise<void> {
    if (isOfflineMode || !redis.isOpen) {
      console.log(`[Redis] Offline mode - skipping SETEX ${key}`)
      return
    }

    try {
      await redis.setEx(key, seconds, value)
    } catch (err) {
      console.error(`[Redis] SETEX ${key} failed:`, err)
      isOfflineMode = true
    }
  },

  async sCard(key: string): Promise<number> {
    if (isOfflineMode || !redis.isOpen) {
      console.log(`[Redis] Offline mode - skipping SCARD ${key}`)
      return 0
    }

    try {
      return await redis.sCard(key)
    } catch (err) {
      console.error(`[Redis] SCARD ${key} failed:`, err)
      isOfflineMode = true
      return 0
    }
  },

  async sAdd(key: string, member: string): Promise<void> {
    if (isOfflineMode || !redis.isOpen) {
      console.log(`[Redis] Offline mode - skipping SADD ${key}`)
      return
    }

    try {
      await redis.sAdd(key, member)
    } catch (err) {
      console.error(`[Redis] SADD ${key} failed:`, err)
      isOfflineMode = true
    }
  },

  async sRem(key: string, member: string): Promise<void> {
    if (isOfflineMode || !redis.isOpen) {
      console.log(`[Redis] Offline mode - skipping SREM ${key}`)
      return
    }

    try {
      await redis.sRem(key, member)
    } catch (err) {
      console.error(`[Redis] SREM ${key} failed:`, err)
      isOfflineMode = true
    }
  },

  async expire(key: string, seconds: number): Promise<void> {
    if (isOfflineMode || !redis.isOpen) {
      console.log(`[Redis] Offline mode - skipping EXPIRE ${key}`)
      return
    }

    try {
      await redis.expire(key, seconds)
    } catch (err) {
      console.error(`[Redis] EXPIRE ${key} failed:`, err)
      isOfflineMode = true
    }
  },

  async del(...keys: string[]): Promise<void> {
    if (isOfflineMode || !redis.isOpen) {
      return
    }

    try {
      await redis.del(keys)
    } catch (err) {
      console.error(`[Redis] DEL ${keys.join(', ')} failed:`, err)
      isOfflineMode = true
    }
  },

  async flushDb(): Promise<void> {
    if (isOfflineMode || !redis.isOpen) {
      console.log('[Redis] Offline mode - skipping FLUSHDB')
      return
    }

    try {
      await redis.flushDb()
      console.log('[Redis] ✅ Cache limpo (FLUSHDB)')
    } catch (err) {
      console.error('[Redis] FLUSHDB failed:', err)
      isOfflineMode = true
    }
  },

  async keys(pattern: string): Promise<string[]> {
    if (isOfflineMode || !redis.isOpen) {
      console.log(`[Redis] Offline mode - skipping KEYS ${pattern}`)
      return []
    }

    try {
      return await redis.keys(pattern)
    } catch (err) {
      console.error(`[Redis] KEYS ${pattern} failed:`, err)
      isOfflineMode = true
      return []
    }
  },

  // Helper para verificar status
  isAvailable(): boolean {
    return !isOfflineMode && redis.isOpen
  },
}

export default redis
