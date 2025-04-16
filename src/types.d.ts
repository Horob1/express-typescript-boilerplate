import 'express'
import { IATPayload } from '@/types/jwt.interface'
declare module 'express' {
  export interface Request {
    user?: IATPayload
    cacheKey?: string
  }
}
