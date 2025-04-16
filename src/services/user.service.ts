import { IUserCreate } from '@/types/user.interface'
import User from '@/models/user.model'
import HttpError from '@/utils/httpError'
import { StatusCodes } from 'http-status-codes'
import MESSAGES from '@/utils/messages'
import { hashPassword } from '@/utils/password'
import { genOTP, hashOTP } from '@/utils/otp'
import ms, { StringValue } from 'ms'
import ENV from '@/configs/env'
import { successResponse } from '@/utils/response'

export const register = async (data: IUserCreate) => {
  const isExist = await User.findOne({ $or: [{ email: data.email }, { username: data.username }] })
  if (isExist) throw new HttpError(StatusCodes.CONFLICT, MESSAGES.USER.EMAIL_OR_USERNAME_IS_ALREADY_TAKEN)
  const otp = genOTP()
  const [hashedPassword, hashedOTP] = await Promise.all([hashPassword(data.password), hashOTP(otp)])
  const user = await User.create({ ...data, password: hashedPassword, emailVerificationOtp: hashedOTP, emailVerificationOtpExpires: new Date(Date.now() + ms(ENV.OTP.OTP_VERIFICATION_EMAIL_EXPIRATION as StringValue)) })
  //send email to user
  return successResponse(user, MESSAGES.USER.USER_REGISTER_SUCCESSFULLY)
}
