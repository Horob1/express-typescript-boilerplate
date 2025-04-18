export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_RULE_MESSAGE = 'Your string fails to match the Object Id pattern!'

export const FIELD_REQUIRED_MESSAGE = 'This field is required.'
export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE = 'Email is invalid. (example@trinhminhnhat.com)'
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/
export const PASSWORD_RULE_MESSAGE = 'Password must include at least 1 letter, a number, and at least 8 characters.'
export const PASSWORD_CONFIRMATION_MESSAGE = 'Password Confirmation does not match!'

// Liên quan đến Validate File
export const LIMIT_COMMON_IMAGE_SIZE = 10485760 // byte = 10 MB
export const ALLOW_COMMON_IMAGE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']

// Liên quan đến Validate File attachments
export const maxFileSize = 20 * 1024 * 1024 // byte = 20 MB
export const allowedFileTypes = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/msword', // for .doc files
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // for .docx files
  'application/zip', // for .zip files
  'application/x-zip-compressed', // for .zip files
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain'
]
