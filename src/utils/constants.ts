import path from 'path'

export default {
  FOLDER: {
    UPLOAD_DIR: path.resolve('uploads'),
    TEMPLATE_DIR: path.resolve('templates'),
    UPLOAD_IMAGES_DIR: path.resolve('uploads/images')
  },
  MULTER: {
    IMAGE_SIZE_LIMIT: 1024 * 1024 * 5
  }
} as const
