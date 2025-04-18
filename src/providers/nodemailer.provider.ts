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
    pass: ENV.SMTP.SMTP_APPPASSWORD,
  },
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
              path: filePath,
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
          path: latestApiLog.path,
        })
      }
      if (latestErrorLog) {
        attachments.push({
          filename: latestErrorLog.name,
          path: latestErrorLog.path,
        })
      }

      const templatePath = path.join(CONSTANT.FOLDER.TEMPLATE_DIR, 'mails/log-email.pug')
      const htmlContent = pug.renderFile(templatePath, {
        recipient: 'Boss',
        sender: ENV.SMTP.SMTP_LOGSENDER,
      })

      const mailOptions = {
        from: ENV.SMTP.SMTP_SENDER,
        to: ENV.SMTP.SMTP_ADMINEMAIL,
        subject: 'The latest API and Error log files',
        html: htmlContent,
        attachments,
      }

      await transporter.sendMail(mailOptions)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('⚡ [Email Service] Error sending email logs:', error)
  }
}

export const sendOtpEmail = async (email: string, otp: string, subject: string) => {
  try {
    const templatePath = path.join(CONSTANT.FOLDER.TEMPLATE_DIR, 'mails/otp-email.pug')
    const htmlContent = pug.renderFile(templatePath, {
      appName: ENV.PROJECT_NAME,
      otp: otp,
    })

    const mailOptions = {
      from: ENV.SMTP.SMTP_SENDER,
      to: email,
      subject: subject,
      html: htmlContent,
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('⚡ [Email Service] Error sending OTP email:', error)
  }
}

export const crashReportEmail = async (error: Error) => {
  try {
    const templatePath = path.join(CONSTANT.FOLDER.TEMPLATE_DIR, 'mails/crash-report-email.pug')
    const htmlContent = pug.renderFile(templatePath, {
      appName: ENV.PROJECT_NAME,
      errorMessage: error.message,
      errorStack: error.stack,
    })

    const mailOptions = {
      from: ENV.SMTP.SMTP_SENDER,
      to: ENV.SMTP.SMTP_ADMINEMAIL,
      subject: 'Crash Report',
      html: htmlContent,
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('⚡ [Email Service] Error sending crash report email:', error)
  }
}
