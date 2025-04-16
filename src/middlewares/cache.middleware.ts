import { NextFunction, Request, Response } from 'express'
import { genCacheKey } from '@/utils/cache'
import redisClient from '@/providers/redis.provider'
/**
 * A middleware function for caching API responses.
 * @param req
 * @param res
 * @param next
 */
export const cachePublic = async (req: Request, res: Response, next: NextFunction) => {
  const cacheKey = genCacheKey(req.originalUrl)
  req.cacheKey = cacheKey
  try {
    const cachedData = await redisClient.get(cacheKey)
    if (cachedData) {
      return res.json(JSON.parse(cachedData))
    }
    next()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  } catch (error) {
    next()
  }
}

export const cachePersonal = async (req: Request, res: Response, next: NextFunction) => {
  const cacheKey = genCacheKey(req.originalUrl, req.user?._id)
  req.cacheKey = cacheKey
  try {
    const cachedData = await redisClient.get(cacheKey)
    if (cachedData) {
      return res.json(JSON.parse(cachedData))
    }
    next()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  } catch (error) {
    next()
  }
}
