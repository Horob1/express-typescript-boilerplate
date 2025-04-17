/* eslint-disable no-console */
import cron from 'node-cron'
import { sendMailLogs } from '@/providers/nodemailer.provider'

console.log('⚡ [Worker]: Cron job worker started!')

cron.schedule(
  '* * * * *',
  async () => {
    console.log('Running a task every minute')
    await sendMailLogs()
  },
  {
    timezone: 'Asia/Ho_Chi_Minh'
  }
)
