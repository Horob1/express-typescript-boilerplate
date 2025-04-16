import { IAuditTrailDocument } from '@/utils/withAuditTrailPlugin'

interface IUser extends IAuditTrailDocument {
  username: string
  email: string
  password: string

  firstName: string
  lastName: string
  phoneNumber: string
  address: string
  dob: Date
  gender: string

  emailVerificationOtp: string
  emailVerificationOtpExpires: Date
  emailVerified: boolean

  passwordResetOtp: string
  passwordResetOtpExpires: Date

  // role: string

  avatar: string
}

export { IUser }
