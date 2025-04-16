import { promises as fs } from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'
import ENV from '@/configs/env'
// Cấu hình Nodemailer
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user: ENV.SMTP.SMTP_SENDER, // Địa chỉ email người gửi
    pass: ENV.SMTP.SMTP_APPPASSWORD // App password của Gmail, với mỗi sender email bạn cần tạo một app password riêng
  }
})

// Hàm gửi email log API và error log
export const sendMailLogs = async () => {
  const baseDir = path.resolve(__dirname, '../../')
  const logsDir = path.join(baseDir, 'logs')
  const apiLogDir = path.join(logsDir, 'apis')
  const errorLogDir = path.join(logsDir, 'errors')

  try {
    // Hàm phụ: Lấy file mới nhất trong thư mục
    const getLatestLogFile = async (dir: string) => {
      const files = await fs.readdir(dir)

      const logFiles = await Promise.all(
        files
          .filter(file => file.endsWith('.log')) // Chỉ lấy file .log
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

      // Sắp xếp giảm dần theo thời gian và lấy file mới nhất
      if (logFiles.length === 0) return null
      return logFiles.sort((a, b) => b.time - a.time)[0]
    }

    // Lấy file API log và error log mới nhất
    const latestApiLog = await getLatestLogFile(apiLogDir)
    const latestErrorLog = await getLatestLogFile(errorLogDir)

    if (latestApiLog || latestErrorLog) {
      // Tạo danh sách file đính kèm
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
      const htmlContent = `
                <div style="font-family: Arial, sans-serif; line-height: 1.8; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
    <div style="background-color: #0056b3; color: #fff; padding: 20px; text-align: center;">
        <h2 style="margin: 0; font-size: 24px;">📄 Eng-Toe Daily Logs</h2>
    </div>
    <div style="padding: 20px;">
        <p style="font-size: 16px; margin: 0 0 20px;">Hello <b>Boss</b>,</p>
        <p style="font-size: 16px; margin: 0 0 20px;">
            The latest log files (API and Error) have been attached to this email. 
            Please check the information in the files.
        </p>
        <p style="font-size: 16px; margin: 0 0 20px;">
            Best regards,<br />
            <b>The Eng-Toe Server Team</b>
        </p>
    </div>
    <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666; margin: 0;">
            This email was sent automatically by the system. Please do not reply.
        </p>
    </div>
</div>
            `

      // Tạo nội dung email
      const mailOptions = {
        from: ENV.SMTP.SMTP_SENDER, // hoặc có thể là string tên sản phẩm
        to: ENV.SMTP.SMTP_ADMINEMAIL, // Địa chỉ email người nhận
        subject: 'The latest API and Error log files',
        html: htmlContent,
        attachments // Đính kèm danh sách file log
      }

      // Gửi email
      await transporter.sendMail(mailOptions)
    } else {
      console.log('File Log Not Found')
    }
  } catch (error) {
    console.error('Error sending email logs:', error)
  }
}
