import { Redis } from "@upstash/redis"

// Load credentials from environment variables
// Do NOT hardcode secrets. Configure these in .env.local:
// UPSTASH_REDIS_REST_URL=...
// UPSTASH_REDIS_REST_TOKEN=...
const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN

// Minimal Redis-like interface we rely on in this project
type RedisLike = {
  incr: (key: string) => Promise<number>
  hgetall: (key: string) => Promise<Record<string, string> | null>
  hget: (key: string, field: string) => Promise<string | null>
  hset: (key: string, value: Record<string, string>) => Promise<void>
  hdel: (key: string, field: string) => Promise<void>
}

let redis: RedisLike

if (url && token) {
  // Use real Upstash Redis when credentials are provided
  const real = new Redis({ url, token }) as unknown as RedisLike
  redis = real
} else {
  // Fallback in-memory implementation for local development or missing creds
  console.warn(
    "[redis] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set. Using in-memory fallback. Data will not persist.",
  )

  const counters = new Map<string, number>()
  const hashes = new Map<string, Map<string, string>>()

  const mem: RedisLike = {
    async incr(key: string) {
      const next = (counters.get(key) ?? 0) + 1
      counters.set(key, next)
      return next
    },
    async hgetall(key: string) {
      const map = hashes.get(key)
      if (!map) return {}
      const obj: Record<string, string> = {}
      for (const [k, v] of map.entries()) obj[k] = v
      return obj
    },
    async hget(key: string, field: string) {
      return hashes.get(key)?.get(field) ?? null
    },
    async hset(key: string, value: Record<string, string>) {
      let map = hashes.get(key)
      if (!map) {
        map = new Map<string, string>()
        hashes.set(key, map)
      }
      for (const [k, v] of Object.entries(value)) map.set(k, v)
    },
    async hdel(key: string, field: string) {
      hashes.get(key)?.delete(field)
    },
  }

  redis = mem
}

export { redis }

export const REDIS_KEYS = {
  PRODUCTS: "products",
  CROPS: "crops",
  KRUSHI_ARTICLES: "krushi_articles",
  STORE_INFO: "store_info",
  PRODUCT_COUNTER: "product_counter",
  CROP_COUNTER: "crop_counter",
  ARTICLE_COUNTER: "article_counter",
} as const

// Local fallbacks to ensure app keeps working if Redis errors at runtime (e.g., WRONGPASS)
const localCounters = new Map<string, number>()
const localHashes = new Map<string, Map<string, string>>()

export const redisHelpers = {
  // Generate unique ID for new items
  async generateId(type: "product" | "crop" | "article"): Promise<string> {
    const counterKey =
      type === "product"
        ? REDIS_KEYS.PRODUCT_COUNTER
        : type === "crop"
          ? REDIS_KEYS.CROP_COUNTER
          : REDIS_KEYS.ARTICLE_COUNTER

    try {
      const counter = await redis.incr(counterKey)
      return `${type}_${counter}`
    } catch (err: any) {
      console.warn(`[redis] incr failed for ${counterKey}. Falling back locally.`, err?.message || err)
      const next = (localCounters.get(counterKey) ?? 0) + 1
      localCounters.set(counterKey, next)
      return `${type}_${next}`
    }
  },

  // Get all items of a type
  async getAllItems(key: string) {
    try {
      const items = (await redis.hgetall(key)) || {}
      return Object.values(items).map((item) => JSON.parse(item as string))
    } catch (err: any) {
      console.warn(`[redis] hgetall failed for ${key}. Returning empty array.`, err?.message || err)
      return []
    }
  },

  // Get single item
  async getItem(key: string, id: string) {
    try {
      const item = await redis.hget(key, id)
      return item ? JSON.parse(item as string) : null
    } catch (err: any) {
      console.warn(`[redis] hget failed for ${key}:${id}. Returning null.`, err?.message || err)
      const map = localHashes.get(key)
      const fallback = map?.get(id) ?? null
      return fallback ? JSON.parse(fallback) : null
    }
  },

  // Set item
  async setItem(key: string, id: string, data: any) {
    try {
      await redis.hset(key, { [id]: JSON.stringify(data) })
    } catch (err: any) {
      console.warn(`[redis] hset failed for ${key}:${id}. Writing to local fallback.`, err?.message || err)
      let map = localHashes.get(key)
      if (!map) {
        map = new Map<string, string>()
        localHashes.set(key, map)
      }
      map.set(id, JSON.stringify(data))
    }
  },

  // Delete item
  async deleteItem(key: string, id: string) {
    try {
      await redis.hdel(key, id)
    } catch (err: any) {
      console.warn(`[redis] hdel failed for ${key}:${id}. Deleting from local fallback.`, err?.message || err)
      localHashes.get(key)?.delete(id)
    }
  },
}
