import express, { Express } from 'express'
import ENV from './configs/env'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
// import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './configs/swagger'
// import checkUploadsFolderExist from '@/utils/checkFolderExist'
// import CONSTANT from '@/utils/constants'

const app: Express = express()

// Use it if u want to use server side upload file
// checkUploadsFolderExist([CONSTANT.FOLDER.UPLOAD_DIR])

if (ENV.NODE_ENV === 'dev') {
  app.use(morgan('dev'))
  app.use(express.urlencoded({ extended: true }))
}
app.use(cookieParser())
app.use(express.json())
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'same-origin' },
    referrerPolicy: { policy: 'no-referrer' }
  })
)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     limit: 100,
//     standardHeaders: 'draft-8',
//     legacyHeaders: false
//   })
// )
export default app
