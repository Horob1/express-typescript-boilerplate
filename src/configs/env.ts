import dotenv from 'dotenv'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  BASE_URL: process.env.BASE_URL,
  JWT: {
    JWT_SECRETS_AT: process.env.JWT_SECRETS_AT,
    JWT_SECRETS_RT: process.env.JWT_SECRETS_RT,
    ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION,
    REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION
  },
  SMTP: {
    SMTP_SENDER: process.env.SMTP_SENDER,
    SMTP_APPPASSWORD: process.env.SMTP_APPPASSWORD,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_ADMINEMAIL: process.env.ADMIN_EMAIL
  },
  BREVO: {
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    ADMIN_EMAIL_ADDRESS: process.env.ADMIN_EMAIL_ADDRESS,
    ADMIN_EMAIL_NAME: process.env.ADMIN_EMAIL_NAME
  },
  CLOUDINARY: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
  }
} as const

export default ENV
