import { APIlog, ErrorLog } from '@/configs/logger'
import { Request, Response, NextFunction } from 'express'

const apiLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorLogMiddleware = (err: any, req: Request) => {
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
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('⚡ [LOGGING ERROR]: ' + error)
  }
}

export { apiLoggerMiddleware, errorLogMiddleware }
