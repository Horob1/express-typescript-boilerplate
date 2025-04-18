import { IAuditTrailDocument } from '@/utils/withAuditTrailPlugin'

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         address:
 *           type: string
 *         dob:
 *           type: string
 *         gender:
 *           type: string
 *         avatar:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */
export interface IUser extends IAuditTrailDocument {
  username: string
  email: string
  password: string

  firstName: string
  lastName: string
  phoneNumber: string
  address: string
  dob: Date
  gender: string

  emailVerificationOtp: string | null
  emailVerificationOtpExpires: Date | null
  emailVerified: boolean

  passwordResetOtp: string | null
  passwordResetOtpExpires: Date | null

  // role: string

  avatar: string
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUser:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         address:
 *           type: string
 *         dob:
 *           type: string
 *         gender:
 *           type: string
 */
export interface IUserCreate {
  username: string
  email: string
  password: string

  firstName: string
  lastName: string
  phoneNumber: string
  address: string
  dob: Date
  gender: string
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUser:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           optional: true
 *         lastName:
 *           type: string
 *           optional: true
 *         phoneNumber:
 *           type: string
 *           optional: true
 *         address:
 *           type: string
 *           optional: true
 *         dob:
 *           type: string
 *           optional: true
 *         gender:
 *           type: string
 *           optional: true
 */
export interface IUserUpdate {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  address?: string
  dob?: Date
  gender?: string
}

/**
 * @swagger
 * components:
 *   schemas:
 *     VerifyEmail:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         otp:
 *           type: string
 */
export interface IVerifyEmail {
  email: string
  otp: string
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       properties:
 *         usernameOrEmail:
 *           type: string
 *         password:
 *           type: string
 */
export interface ILogin {
  usernameOrEmail: string
  password: string
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Token:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           optional: true
 *           description: Only for mobile
 */
export interface IToken {
  token?: string
}
/**
 * @swagger
 * components:
 *   schemas:
 *     CredentialId:
 *       type: object
 *       properties:
 *         credentialId:
 *           type: string
 *           optional: true
 *           description: Only for mobile
 */
export interface ICredentialId {
  credentialId?: string
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Email:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 */
export interface IEmail {
  email: string
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Username:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 */
export interface IUsername {
  username: string
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ResetPassword:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         otp:
 *           type: string
 *         password:
 *           type: string
 */
export interface IResetPassword {
  email: string
  otp: string
  password: string
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ChangePassword:
 *       type: object
 *       properties:
 *         oldPassword:
 *           type: string
 *         newPassword:
 *           type: string
 *         confirmPassword:
 *           type: string
 */
export interface IChangePassword {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Avatar:
 *       type: object
 *       properties:
 *         avatar:
 *           type: string
 *           format: binary
 */
export interface IAvatar {
  avatar: string
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Credentials:
 *       type: object
 *       properties:
 *         credentials:
 *           type: array
 *           items:
 *             type: string
 */
export interface ICredentials {
  credentials: string[]
}
