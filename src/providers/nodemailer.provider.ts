import { promises as fs } from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'
import pug from 'pug'
import ENV from '@/configs/env'
import CONSTANT from '@/utils/constants'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user: ENV.SMTP.SMTP_SENDER,
    pass: ENV.SMTP.SMTP_APPPASSWORD
  }
})

export const sendMailLogs = async () => {
  const apiLogDir = CONSTANT.FOLDER.API_LOGS_DIR
  const errorLogDir = CONSTANT.FOLDER.ERROR_LOGS_DIR

  try {
    const getLatestLogFile = async (dir: string) => {
      const files = await fs.readdir(dir)
      const logFiles = await Promise.all(
        files
          .filter(file => file.endsWith('.log'))
          .map(async file => {
            const filePath = path.join(dir, file)
            const stat = await fs.stat(filePath)
            return {
              name: file,
              time: stat.mtime.getTime(),
              path: filePath
            }
          })
      )

      if (logFiles.length === 0) return null
      return logFiles.sort((a, b) => b.time - a.time)[0]
    }

    const latestApiLog = await getLatestLogFile(apiLogDir)
    const latestErrorLog = await getLatestLogFile(errorLogDir)

    if (latestApiLog || latestErrorLog) {
      const attachments = []
      if (latestApiLog) {
        attachments.push({
          filename: latestApiLog.name,
          path: latestApiLog.path
        })
      }
      if (latestErrorLog) {
        attachments.push({
          filename: latestErrorLog.name,
          path: latestErrorLog.path
        })
      }

      const templatePath = path.join(CONSTANT.FOLDER.TEMPLATE_DIR, 'mails/log-email.pug')
      const htmlContent = pug.renderFile(templatePath, {
        recipient: 'Boss'
      })

      const mailOptions = {
        from: ENV.SMTP.SMTP_SENDER,
        to: ENV.SMTP.SMTP_ADMINEMAIL,
        subject: 'The latest API and Error log files',
        html: htmlContent,
        attachments
      }

      await transporter.sendMail(mailOptions)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('⚡ [Email Service] Error sending email logs:', error)
  }
}
