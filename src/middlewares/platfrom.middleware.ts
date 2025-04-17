import { Request, Response, NextFunction } from 'express'
import { EPlatform } from '@/utils/enums'
import { StatusCodes } from 'http-status-codes'
import { errorResponse } from '@/utils/response'
import MESSAGES from '@/utils/messages'

export default function (req: Request, res: Response, next: NextFunction) {
  const platform = req.headers['x-platform'] as string
  if (!platform || !Object.values(EPlatform).includes(platform as EPlatform)) {
    res.status(StatusCodes.FORBIDDEN).json(errorResponse(MESSAGES.MIDDLEWARE.INVALID_PLATFORM))
    return
  }
  req.platform = platform
  next()
}
