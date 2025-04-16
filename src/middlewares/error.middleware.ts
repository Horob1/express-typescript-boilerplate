import ENV from '@/configs/env'
import HttpError from '@/utils/httpError'
import { errorResponse } from '@/utils/response'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { errorLogMiddleware } from './logger.middleware'

/**
 * A middleware function for handling errors.
 * @param err
 * @param req
 * @param res
 * @param next
 */
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
export default function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  // eslint-disable-next-line no-console
  if (ENV.NODE_ENV === 'dev') console.log(err)

  errorLogMiddleware(err, req)

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json(errorResponse(err.message, ENV.NODE_ENV === 'dev' ? err.stack : undefined))
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(err.message, ENV.NODE_ENV === 'dev' ? err.stack : undefined))
}
