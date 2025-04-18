import { sha256 } from '@noble/hashes/sha256'
import { utf8ToBytes } from '@noble/hashes/utils'
import mongoose from 'mongoose'
import redisClient from '@/providers/redis.provider'
import CONSTANT from './constants'

/**
 * Func gen cache key
 * @param url
 * @param userId (optional)
 * @returns cache key
 */
export const genCacheKey = (url: string, userId?: string) => {
  const [path, query] = url.split('?')

  // Xử lý phần đường dẫn
  const originalUrl = path
    .split('/')
    .map(pathSegment => {
      if (pathSegment && mongoose.isValidObjectId(pathSegment)) {
        return ':id'
      }
      return pathSegment
    })
    .join('/')

  const finalUrl = `${userId ? `user:${userId}` : ''}${query ? `${originalUrl}?${query}` : originalUrl}`
  const bytes = utf8ToBytes(finalUrl)
  const hash = sha256(bytes)
  return Buffer.from(hash).toString('hex')
}

/**
 * Func save cache
 * @param key
 * @param data
 * @param ttl (minutes)
 * @returns
 */
export const saveCache = async (key: string, data: unknown, ttl: number = CONSTANT.REDIS.DEFAULT_TTL) => {
  await redisClient.set(key, JSON.stringify(data), { EX: 60 * ttl + Math.random() * 180 })
}

/**
 * Func delete cache
 * @param key
 * @returns
 */
export const deleteCache = async (key: string) => {
  await redisClient.del(key)
}
