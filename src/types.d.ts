import 'express'
import { IATPayload } from '@/types/jwt.interface'
declare global {
  namespace Express {
    interface Request {
      user?: IATPayload
      cacheKey?: string
      platform: string
    }
  }
}
