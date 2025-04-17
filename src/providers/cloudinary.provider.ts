import cloudinary from 'cloudinary'
import streamifier from 'streamifier'
import ENV from '@/configs/env'

// Bước cấu hình cloudinary, sử dụng v2 - version 2
const cloudinaryV2 = cloudinary.v2 // giống import { v2 as cloudinary } from 'cloudinary' thôi
cloudinaryV2.config({
  cloud_name: ENV.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY.CLOUDINARY_API_SECRET,
})

// Khởi tạo một function để thực hiện upload file lên Cloudinary - upload thông qua streamifier
const streamUpload = (fileBuffer: any, folderName: string) => {
  return new Promise((resolve, reject) => {
    // Tạo một cái luồng stream upload lên cloudinary, folder: folderName chỉ định ta sẽ đẩy lên thư mục nào trên Cloudinary
    const stream = cloudinaryV2.uploader.upload_stream({ folder: folderName }, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
    // Thực hiện upload cái luồng mình tạo phía trên bằng lib streamifier
    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}

// Này là đẩy dạng raw file lên Cloudinary, có những tác vụ cần đẩy dạng raw, kiểu mấy file attachment như docx, pdf, zip, rar, exe, v.v...
const streamUploadAttachments = (fileBuffer: any, folderName: string) => {
  return new Promise((resolve, reject) => {
    // Tạo một cái luồng stream upload lên cloudinary, folder: folderName chỉ định ta sẽ đẩy lên thư mục nào trên Cloudinary
    const stream = cloudinaryV2.uploader.upload_stream({ folder: folderName, resource_type: 'raw' }, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
    // Thực hiện upload cái luồng mình tạo phía trên bằng lib streamifier
    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}

export const CloudinaryProvider = { streamUpload, streamUploadAttachments }
