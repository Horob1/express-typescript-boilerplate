import HttpError from '@/utils/httpError'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { verifyAccessToken } from '@/utils/jwt'
import MESSAGE from '@/utils/messages'

export default async function (req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers.authorization
    if (!authorization) return next(new HttpError(StatusCodes.UNAUTHORIZED, MESSAGE.MIDDLEWARE.MISSING_AUTHORIZATION_HEADER))

    const token = authorization.split(' ')[1]

    const payload = await verifyAccessToken(token)
    req.user = payload
    next()
  } catch (e: any) {
    if (e.message === 'jwt expired') {
      return next(new HttpError(StatusCodes.UNAUTHORIZED, MESSAGE.MIDDLEWARE.TOKEN_EXPIRED))
    }
    return next(new HttpError(StatusCodes.UNAUTHORIZED, MESSAGE.MIDDLEWARE.JSON_WEB_TOKEN_ERROR))
  }
}
