import Bull from 'bull'
import ENV from '@/configs/env'

const exampleQueue = new Bull('example-queue', {
  redis: {
    host: ENV.REDIS.REDIS_HOST,
    port: ENV.REDIS.REDIS_PORT,
  },
})

export default exampleQueue
