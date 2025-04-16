/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable prefer-const */
const brevo = require('@getbrevo/brevo')
// import brevo from '@getbrevo/brevo' // không dùng được import nha, dùng vậy nó sẽ báo apiInstance.authentications là protected, mình gọi từ ngoài vào nên không được phép
import ENV from '@/configs/env'

let apiInstance = new brevo.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = ENV.BREVO.BREVO_API_KEY

const sendEmail = async (recipientEmail: string, customSubject: string, customHtmlContent: string) => {
  // Khởi tạo một cái sendSmtpEmail để tí config với những thông tin cần thiết
  let sendSmtpEmail = new brevo.SendSmtpEmail()

  // Tài khoản gửi mail: lưu ý địa chỉ admin email phải là cái email mà các bạn tạo tài khoản trên Brevo
  sendSmtpEmail.sender = { email: ENV.BREVO.ADMIN_EMAIL_ADDRESS, name: ENV.BREVO.ADMIN_EMAIL_NAME }

  // Những tài khoản nhận email
  // 'to' phải là một Array để sau chúng ta có thể tùy biến gửi 1 email tới nhiều user tùy tính năng dự án nhé
  sendSmtpEmail.to = [{ email: recipientEmail }]

  // Title của email:
  sendSmtpEmail.subject = customSubject

  // Nội dung email dạng HTML
  sendSmtpEmail.htmlContent = customHtmlContent

  // Cấu hình người nhận nếu user phản hồi lại
  sendSmtpEmail.replyTo = { email: 'bietdoidanhthue@gmail.com', name: 'Biệt đội đánh thuê' }

  // Ngoài ra còn send sendSmtpEmail.headers và sendSmtpEmail.params nữa nhưng hồi trc test thử ko thấy có tác dụng gì
  // nên bỏ qua, chỉ cần cấu hình như này đã ok và chạy ngon lành rồi

  // Gọi hành động gửi mail
  // More info: thằng sendTransacEmail của thư viện nó sẽ return một Promise
  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

export const BrevoProvider = {
  sendEmail
}

// Cụ thể sử dụng như nào anh em xem trong hàm createNew trong file userService của code hoàn thiện Trello Advanced nhé
