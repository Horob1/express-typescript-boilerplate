import dotenv from 'dotenv'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  BASE_URL: process.env.BASE_URL
} as const

export default ENV
