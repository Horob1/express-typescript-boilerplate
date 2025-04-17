export default {
  MULTER: {
    INVALID_FILE_TYPE: 'Invalid file type'
  },
  MIDDLEWARE: {
    MISSING_AUTHORIZATION_HEADER: 'Missing authorization header',
    TOKEN_EXPIRED: 'Access token expired',
    JSON_WEB_TOKEN_ERROR: 'Json web token error',
    INTERNAL_SERVER_ERROR: 'Internal server error'
  },
  USER: {
    EMAIL_OR_USERNAME_IS_ALREADY_TAKEN: 'Email or username is already taken',
    USER_REGISTER_SUCCESSFULLY: 'Register successfully',
    SEND_VERIFICATION_EMAIL: 'Mail verification OTP'
  }
} as const
