import { APIlog, ErrorLog } from '@/configs/logger'
import { Request, Response, NextFunction } from 'express'

/**
 * A middleware function for logging API requests.
 * @param req
 * @param res
 * @param next
 */
export const apiLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { method, url, ip, headers } = req

  const logData = {
    method,
    url,
    ip,
    userAgent: headers['user-agent'],
    timestamp: new Date().toISOString()
  }

  APIlog.info(logData) // Ghi log API

  next()
}

/**
 * A middleware function for logging errors. This function is used in the error middleware.
 * @param err
 * @param req
 */
export const errorLogMiddleware = (err: Error, req: Request) => {
  const { method, url, ip, headers } = req
  const errorLogData = {
    method,
    url,
    ip,
    userAgent: headers['user-agent'],
    timestamp: new Date().toISOString(),
    message: err.message,
    stack: err.stack
  }
  try {
    ErrorLog.error(errorLogData)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('⚡ [LOGGING ERROR]: ' + error)
  }
}
