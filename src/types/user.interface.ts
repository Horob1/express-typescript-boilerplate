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
 *     ResendEmail:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 */
export interface IResendEmail {
  email: string
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
 */
export interface IToken {
  token: string
}
