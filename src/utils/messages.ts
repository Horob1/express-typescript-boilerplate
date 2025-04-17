export default {
  MULTER: {
    INVALID_FILE_TYPE: 'Invalid file type',
  },
  MIDDLEWARE: {
    MISSING_AUTHORIZATION_HEADER: 'Missing authorization header',
    TOKEN_EXPIRED: 'Access token expired',
    JSON_WEB_TOKEN_ERROR: 'Json web token error',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    INVALID_PLATFORM: 'Invalid platform',
  },
  USER: {
    EMAIL_OR_USERNAME_IS_ALREADY_TAKEN: 'Email or username is already taken',
    USER_REGISTER_SUCCESSFULLY: 'Register successfully',
    SEND_VERIFICATION_EMAIL: 'Mail verification OTP sent successfully',
    USER_NOT_FOUND: 'User not found',
    EMAIL_IS_ALREADY_VERIFIED: 'Email is already verified',
    USERNAME_OR_PASSWORD_IS_NOT_CORRECT: 'Username or password is not correct',
    LOGIN_SUCCESSFULLY: 'Login successfully',
    TOKEN_EXPIRED_OR_INVALID: 'Token expired or invalid',
    REFRESH_TOKEN_SUCCESSFULLY: 'Refresh token successfully',
  },
  OTP: {
    OTP_EXPIRED_OR_INVALID: 'OTP expired or invalid',
    RESEND_LIMIT_TIME: `Resend email limit time. Please try again later after ${process.env.OTP_RESEND_LIMIT_TIME}`,
  },
} as const
