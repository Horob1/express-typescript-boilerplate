import ENV from './env'
import mongoose from 'mongoose'

export default async () => {
  try {
    await mongoose.set('strictQuery', true).connect(ENV.DATABASE_URL as string, { retryWrites: true, w: 'majority' })
    // initial data if not exist
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('⚡ [MONGOOSE]: Error connecting to the database', error)
  }
}
