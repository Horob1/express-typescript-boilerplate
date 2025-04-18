/* eslint-disable no-console */
import { createClient } from 'redis'
import ENV from '@/configs/env'

const client = createClient({
  socket: {
    host: ENV.REDIS.REDIS_HOST,
    port: ENV.REDIS.REDIS_PORT,
  },
})

client.on('error', err => {
  console.log('⚡ [REDIS]: Redis Client Error', err)
})

client.connect()

export default client
