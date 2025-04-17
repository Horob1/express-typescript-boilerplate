/* eslint-disable no-console */
import redis from 'redis'
import ENV from '@/configs/env'

const client = redis.createClient({
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
