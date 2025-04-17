import { CorsOptions } from 'cors'
import ENV from './env'
const getCorsOptions = (): CorsOptions => {
  const allowedOrigins = ENV.CORS_ORIGIN

  return {
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Platform'],
  }
}

export default getCorsOptions
