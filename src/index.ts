import app from './app'
import ENV from './configs/env'
import mongoose from 'mongoose'
import exitHook from 'async-exit-hook'

mongoose
  .connect('mongodb://127.0.0.1:27017/kimochi', { retryWrites: true, w: 'majority' })
  .then(async () => {
    console.log(`Running on ENV = ${process.env.BUILD_MODE}`)
    console.log('Connected to mongoDB.')

    StartServer()

    // await bootstrapApp()
    exitHook(() => {})
  })
  .catch(error => {
    console.error('Unable to connect.')
    console.error(error)
  })

const StartServer = () => {
  app.listen({ port: ENV.PORT }, () => {
    console.log(`Server running at http://localhost:${ENV.PORT}`)
  })
}

// app.listen(8888, () => {
//   console.log('Server is running at http://localhost:3000')
//   console.log('Press Ctrl+C to quit.')
//   console.log('NODE_ENV:', ENV)
// })
