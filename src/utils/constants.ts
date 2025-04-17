import path from 'path'

export default {
  FOLDER: {
    UPLOAD_DIR: path.resolve('uploads'),
    TEMPLATE_DIR: path.resolve('src/templates'),
    LOGS_DIR: path.resolve('logs'),
    API_LOGS_DIR: path.resolve('logs/apis'),
    ERROR_LOGS_DIR: path.resolve('logs/errors'),
    UPLOAD_IMAGES_DIR: path.resolve('uploads/images'),
  },
  MULTER: {
    IMAGE_SIZE_LIMIT: 1024 * 1024 * 5,
  },
  REDIS: {
    DEFAULT_TTL: 10,
  },
  COOKIES: {
    REFRESH_TOKEN_NAME: 'refreshToken',
  },
} as const
