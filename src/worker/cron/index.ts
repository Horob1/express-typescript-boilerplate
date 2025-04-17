/* eslint-disable no-console */
import cron from 'node-cron'
import { sendMailLogs } from '@/providers/nodemailer.provider'

console.log('⚡ [Worker]: Cron job worker started!')

cron.schedule(
  '0 22 * * *',
  async () => {
    await sendMailLogs()
  },
  {
    timezone: 'Asia/Ho_Chi_Minh',
  }
)
