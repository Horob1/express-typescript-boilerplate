/* eslint-disable no-console */
import app from './app'
import ENV from '@/configs/env'
import connectDB from '@/configs/mongoose'
import exitHook from 'exit-hook'

connectDB()
  .then(() => {
    console.log('⚡ [Server]: Connected to database')
    app.listen(ENV.PORT, () => {
      console.log(`⚡ [Server]: Environment: ${ENV.NODE_ENV}`)
      console.log(`⚡ [Server]: Running at http://localhost:${ENV.PORT}`)
      console.log(`⚡ [Server]: Swagger URL: ${ENV.BASE_URL}/api-docs`)
    })

    exitHook(() => {
      app.close(() => {
        console.log('⚡ [Server]: Server closed')
        process.exit(0)
      })
    })
  })
  .catch(error => {
    console.log('⚡ [Server]: Error starting server', error)
    process.exit(1)
  })
