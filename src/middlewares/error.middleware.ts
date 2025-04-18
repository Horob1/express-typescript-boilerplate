import ENV from '@/configs/env'
import HttpError from '@/utils/httpError'
import { errorResponse } from '@/utils/response'
import { StatusCodes } from 'http-status-codes'
import { errorLogMiddleware } from './logger.middleware'
import MESSAGE from '@/utils/messages'
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const errorMiddleware: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line no-console
  if (ENV.NODE_ENV === 'dev') console.log('⚡ [ERROR]: ', err)

  errorLogMiddleware(err, req)

  if (err instanceof HttpError) {
    res.status(err.statusCode).json(errorResponse(err.message, ENV.NODE_ENV === 'dev' ? err.stack : undefined))
    return
  }

  // Handle other errors
  let code = StatusCodes.INTERNAL_SERVER_ERROR
  if (typeof err?.message === 'string') {
    const lowerMessage = err.message.toLowerCase()

    if (err.message.includes('E11000')) {
      code = StatusCodes.CONFLICT // Trùng key (MongoDB duplicate key error)
    } else if (lowerMessage.includes('validation')) {
      code = StatusCodes.UNPROCESSABLE_ENTITY // Lỗi validate
    }
  }
  res.status(code).json(errorResponse(err.message || MESSAGE.MIDDLEWARE.INTERNAL_SERVER_ERROR, ENV.NODE_ENV === 'dev' ? err.stack : undefined))
}

export default errorMiddleware
