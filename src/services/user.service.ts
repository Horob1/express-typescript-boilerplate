import { IUserCreate, IUserUpdate, IVerifyEmail, ILogin, IToken, ICredentialId, IEmail, IUsername, IResetPassword, IChangePassword, ICredentials } from '@/types/user.interface'
import User from '@/models/user.model'
import RFTokens from '@/models/rftoken.model'
import HttpError from '@/utils/httpError'
import { StatusCodes } from 'http-status-codes'
import MESSAGES from '@/utils/messages'
import { hashPassword } from '@/utils/password'
import { genOTP, hashOTP } from '@/utils/otp'
import ms, { StringValue } from 'ms'
import ENV from '@/configs/env'
import { successResponse } from '@/utils/response'
import { sendOtpEmail } from '@/providers/nodemailer.provider'
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { UAParser } from 'ua-parser-js'
import { signAccessToken, signRefreshToken, verifyRefreshToken, hashToken } from '@/utils/jwt'
import { ObjectId } from 'mongoose'
import { EPlatform } from '@/utils/enums'
import CONSTANT from '@/utils/constants'
import redisClient from '@/providers/redis.provider'
import { saveCache } from '@/utils/cache'
import { getSocketIO } from '@/configs/socket'

export const register = async (data: IUserCreate) => {
  const isExist = await User.findOne({ $or: [{ email: data.email }, { username: data.username }] })
  if (isExist) throw new HttpError(StatusCodes.CONFLICT, MESSAGES.USER.EMAIL_OR_USERNAME_IS_ALREADY_TAKEN)

  const otp = genOTP()
  const [hashedPassword, hashedOTP] = await Promise.all([hashPassword(data.password), hashOTP(otp)])

  const user = new User({
    ...data,
    password: hashedPassword,
    emailVerificationOtp: hashedOTP,
    emailVerificationOtpExpires: new Date(Date.now() + ms(ENV.OTP.OTP_VERIFICATION_EMAIL_EXPIRATION as StringValue)),
  })

  await Promise.all([user.save(), sendOtpEmail(data.email, otp, MESSAGES.USER.VERIFICATION_EMAIL_TITLE)])
  return successResponse(user, MESSAGES.USER.USER_REGISTER_SUCCESSFULLY)
}

export const verifyEmail = async (data: IVerifyEmail) => {
  const user = await User.findOne({ email: data.email })
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, MESSAGES.USER.USER_NOT_FOUND)

  if (user.emailVerified) throw new HttpError(StatusCodes.BAD_REQUEST, MESSAGES.USER.EMAIL_IS_ALREADY_VERIFIED)
  const isExpired = user.emailVerificationOtpExpires && user.emailVerificationOtpExpires?.getTime() < Date.now()

  if (isExpired) throw new HttpError(StatusCodes.BAD_REQUEST, MESSAGES.OTP.OTP_EXPIRED_OR_INVALID)

  const isMatch = await bcrypt.compare(data.otp, user.emailVerificationOtp as string)
  if (!isMatch) throw new HttpError(StatusCodes.BAD_REQUEST, MESSAGES.OTP.OTP_EXPIRED_OR_INVALID)

  user.emailVerified = true
  user.emailVerificationOtp = null
  user.emailVerificationOtpExpires = null
  await user.save()

  return successResponse(null, MESSAGES.USER.EMAIL_IS_ALREADY_VERIFIED)
}

export const resendVerificationEmail = async (data: IEmail) => {
  const user = await User.findOne({ email: data.email })
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, MESSAGES.USER.USER_NOT_FOUND)

  if (user.emailVerified) throw new HttpError(StatusCodes.BAD_REQUEST, MESSAGES.USER.EMAIL_IS_ALREADY_VERIFIED)

  const cacheLimit = await redisClient.get(`resendVerificationEmailLimit:${data.email}`)
  if (cacheLimit) throw new HttpError(StatusCodes.TOO_MANY_REQUESTS, MESSAGES.OTP.RESEND_LIMIT_TIME)

  await redisClient.set(`resendVerificationEmailLimit:${data.email}`, '1', { EX: ms(ENV.OTP.OTP_RESEND_LIMIT_TIME as StringValue) })

  const otp = genOTP()
  const hashedOTP = await hashOTP(otp)

  user.emailVerificationOtp = hashedOTP
  user.emailVerificationOtpExpires = new Date(Date.now() + ms(ENV.OTP.OTP_VERIFICATION_EMAIL_EXPIRATION as StringValue))
  await Promise.all([user.save(), sendOtpEmail(data.email, otp, MESSAGES.USER.VERIFICATION_EMAIL_TITLE)])

  return successResponse(null, MESSAGES.USER.SEND_VERIFICATION_EMAIL)
}

export const login = async (data: ILogin, req: Request, res: Response) => {
  const user = await User.findOne({
    $or: [{ email: data.usernameOrEmail }, { username: data.usernameOrEmail }],
  })
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, MESSAGES.USER.USERNAME_OR_PASSWORD_IS_NOT_CORRECT)
  if (!user.emailVerified) throw new HttpError(StatusCodes.FORBIDDEN, MESSAGES.USER.EMAIL_IS_NOT_VERIFIED)

  const isMatch = await bcrypt.compare(data.password, user.password)
  if (!isMatch) throw new HttpError(StatusCodes.UNAUTHORIZED, MESSAGES.USER.USERNAME_OR_PASSWORD_IS_NOT_CORRECT)

  const client = new UAParser(req.headers['user-agent'])
  const userId = (user._id as ObjectId).toString()

  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken({
      _id: userId,
      email: user.email,
    }),
    signRefreshToken({ _id: userId, email: user.email }),
  ])

  const refreshTokenDecoded = await verifyRefreshToken(refreshToken)

  const savedRefreshToken = new RFTokens({
    token: hashToken(refreshToken),
    userId: user._id,
    ip: req.ip,
    os: client.getOS().name,
    browser: client.getBrowser().name,
    device: client.getDevice().type,
    userAgent: req.headers['user-agent'] as string,
    iat: new Date((refreshTokenDecoded.iat as number) * 1000),
    exp: new Date((refreshTokenDecoded.exp as number) * 1000),
  })

  await savedRefreshToken.save()

  if (req.platform === EPlatform.WEB)
    res.cookie(CONSTANT.COOKIES.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'prod',
      sameSite: 'none',
      maxAge: ((refreshTokenDecoded.exp as number) - Math.floor(Date.now() / 1000)) * 1000,
    })

  return successResponse(
    {
      accessToken,
      refreshToken: req.platform === EPlatform.WEB ? null : refreshToken,
      credentialId: savedRefreshToken._id,
    },
    MESSAGES.USER.LOGIN_SUCCESSFULLY
  )
}

export const refreshToken = async (data: IToken, req: Request, res: Response) => {
  const client = new UAParser(req.headers['user-agent'])
  const clientRT = req.platform === EPlatform.WEB ? req.cookies[CONSTANT.COOKIES.REFRESH_TOKEN_NAME] : data.token
  const refreshTokenDecoded = await verifyRefreshToken(clientRT)
  const userId = refreshTokenDecoded._id

  const savedRefreshTokens = await RFTokens.find({ userId })
  if (savedRefreshTokens.length === 0) throw new HttpError(StatusCodes.UNAUTHORIZED, MESSAGES.USER.TOKEN_EXPIRED_OR_INVALID)

  const inputHashed = hashToken(clientRT)

  const matchedToken = savedRefreshTokens.find(token => token.token === inputHashed && token.device === client.getDevice().type && token.os === client.getOS().name && token.browser === client.getBrowser().name)

  if (!matchedToken) {
    throw new HttpError(StatusCodes.UNAUTHORIZED, MESSAGES.USER.TOKEN_EXPIRED_OR_INVALID)
  }

  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken({
      _id: userId,
      email: refreshTokenDecoded.email,
    }),
    signRefreshToken(
      {
        _id: userId,
        email: refreshTokenDecoded.email,
      },
      matchedToken?.exp.getTime() / 1000
    ),
  ])

  await RFTokens.findByIdAndUpdate(matchedToken._id, { token: hashToken(refreshToken) })

  if (req.platform === EPlatform.WEB)
    res.cookie(CONSTANT.COOKIES.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'prod',
      sameSite: 'none',
      maxAge: ((refreshTokenDecoded.exp as number) - Math.floor(Date.now() / 1000)) * 1000,
    })
  return successResponse({ accessToken, refreshToken: req.platform === EPlatform.WEB ? null : refreshToken }, MESSAGES.USER.REFRESH_TOKEN_SUCCESSFULLY)
}

export const logout = async (req: Request<ParamsDictionary, any, ICredentialId>, res: Response) => {
  const platfrom = req.platform
  if (platfrom === EPlatform.WEB) {
    const token = req.cookies[CONSTANT.COOKIES.REFRESH_TOKEN_NAME]
    const userId = req.user?._id
    if (!token || !userId) throw new HttpError(StatusCodes.UNAUTHORIZED, MESSAGES.USER.TOKEN_EXPIRED_OR_INVALID)

    await logoutOnWeb(userId, token, res)
  } else {
    const userId = req.user?._id
    const credentialId = req.body.credentialId
    if (!userId || !credentialId) throw new HttpError(StatusCodes.UNAUTHORIZED, MESSAGES.USER.TOKEN_EXPIRED_OR_INVALID)
    await logoutOnMobile(userId, credentialId)
  }
  return successResponse(null, MESSAGES.USER.LOGOUT_SUCCESSFULLY)
}

export const logoutOnWeb = async (userId: string, token: string, res: Response) => {
  await Promise.all([RFTokens.deleteOne({ token: hashToken(token), userId: userId }), verifyRefreshToken(token)])
  res.clearCookie(CONSTANT.COOKIES.REFRESH_TOKEN_NAME)
}

export const logoutOnMobile = async (userId: string, credentialId: string) => {
  const deletedToken = await RFTokens.findOneAndDelete({ _id: credentialId, userId: userId })
  if (!deletedToken) throw new HttpError(StatusCodes.UNAUTHORIZED, MESSAGES.USER.TOKEN_EXPIRED_OR_INVALID)
}

export const logoutAll = async (userId: string, res: Response) => {
  await RFTokens.deleteMany({ userId: userId })
  res.clearCookie(CONSTANT.COOKIES.REFRESH_TOKEN_NAME)
  return successResponse(null, MESSAGES.USER.LOGOUT_ALL_SUCCESSFULLY)
}

export const checkEmail = async (data: IEmail) => {
  const isExist = await User.findOne({ email: data.email })
  if (isExist) throw new HttpError(StatusCodes.CONFLICT, MESSAGES.USER.EMAIL_IS_ALREADY_TAKEN)
  return successResponse(null, MESSAGES.USER.EMAIL_IS_NOT_TAKEN)
}

export const checkUsername = async (data: IUsername) => {
  const isExist = await User.findOne({ username: data.username })
  if (isExist) throw new HttpError(StatusCodes.CONFLICT, MESSAGES.USER.EMAIL_IS_ALREADY_TAKEN)
  return successResponse(null, MESSAGES.USER.USERNAME_IS_NOT_TAKEN)
}

export const forgotPassword = async (data: IEmail) => {
  const user = await User.findOne({ email: data.email })
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, MESSAGES.USER.USER_NOT_FOUND)
  if (!user.emailVerified) throw new HttpError(StatusCodes.FORBIDDEN, MESSAGES.USER.EMAIL_IS_NOT_VERIFIED)

  const cacheLimit = await redisClient.get(`resendForgotPasswordLimit:${data.email}`)
  if (cacheLimit) throw new HttpError(StatusCodes.TOO_MANY_REQUESTS, MESSAGES.OTP.RESEND_LIMIT_TIME)

  await redisClient.set(`resendForgotPasswordLimit:${data.email}`, '1', { EX: ms(ENV.OTP.OTP_RESEND_LIMIT_TIME as StringValue) })
  const otp = genOTP()
  const hashedOTP = await hashOTP(otp)

  user.passwordResetOtp = hashedOTP
  user.passwordResetOtpExpires = new Date(Date.now() + ms(ENV.OTP.OTP_PASSWORD_RESET_EXPIRATION as StringValue))

  await Promise.all([user.save(), sendOtpEmail(data.email, otp, MESSAGES.USER.FORGOT_PASSWORD_EMAIL_TITLE)])
  await user.save()
  return successResponse(null, MESSAGES.USER.SEND_RESET_PASSWORD_EMAIL)
}

export const resetPassword = async (data: IResetPassword) => {
  const user = await User.findOne({ email: data.email })
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, MESSAGES.USER.USER_NOT_FOUND)

  if (!user.emailVerified) throw new HttpError(StatusCodes.BAD_REQUEST, MESSAGES.USER.EMAIL_IS_NOT_VERIFIED)

  const isExpired = user.passwordResetOtpExpires && user.passwordResetOtpExpires?.getTime() < Date.now()

  if (isExpired) throw new HttpError(StatusCodes.BAD_REQUEST, MESSAGES.OTP.OTP_EXPIRED_OR_INVALID)

  const isMatch = await bcrypt.compare(data.otp, user.passwordResetOtp as string)
  if (!isMatch) throw new HttpError(StatusCodes.BAD_REQUEST, MESSAGES.OTP.OTP_EXPIRED_OR_INVALID)

  const hashedPassword = await hashPassword(data.password)
  user.password = hashedPassword
  user.passwordResetOtp = null
  user.passwordResetOtpExpires = null
  await user.save()

  return successResponse(null, MESSAGES.USER.RESET_PASSWORD_SUCCESSFULLY)
}

export const changePassword = async (data: IChangePassword, userId: string) => {
  const user = await User.findOne({ _id: userId })
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, MESSAGES.USER.USER_NOT_FOUND)
  if (data.newPassword !== data.confirmPassword) throw new HttpError(StatusCodes.BAD_REQUEST, MESSAGES.USER.PASSWORD_NOT_MATCH)

  const isMatch = await bcrypt.compare(data.oldPassword, user.password)
  if (!isMatch) throw new HttpError(StatusCodes.FORBIDDEN, MESSAGES.USER.USERNAME_OR_PASSWORD_IS_NOT_CORRECT)

  const hashedPassword = await hashPassword(data.newPassword)
  user.password = hashedPassword
  await user.save()

  return successResponse(null, MESSAGES.USER.CHANGE_PASSWORD_SUCCESSFULLY)
}

export const updateProfile = async (data: IUserUpdate, userId: string) => {
  const user = await User.findOne({ _id: userId })
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, MESSAGES.USER.USER_NOT_FOUND)
  const { firstName, lastName, phoneNumber, address, dob, gender } = data
  user.firstName = firstName || user.firstName
  user.lastName = lastName || user.lastName
  user.phoneNumber = phoneNumber || user.phoneNumber
  user.address = address || user.address
  user.dob = dob || user.dob
  user.gender = gender || user.gender
  await user.save()
  return successResponse(user, MESSAGES.USER.UPDATE_PROFILE_SUCCESSFULLY)
}

export const getProfile = async (userId: string, cacheKey: string) => {
  const user = await User.findOne(
    { _id: userId },
    {
      password: 0,
      emailVerificationOtp: 0,
      emailVerificationOtpExpires: 0,
      passwordResetOtp: 0,
      passwordResetOtpExpires: 0,
      deleted: 0,
      deletedAt: 0,
      deletedBy: 0,
      createdBy: 0,
      updatedBy: 0,
    }
  )
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, MESSAGES.USER.USER_NOT_FOUND)
  const data = successResponse(user, MESSAGES.USER.GET_PROFILE_SUCCESSFULLY)
  await saveCache(cacheKey, data)
  return data
}

export const getDeviceList = async (userId: string) => {
  const deviceList = await RFTokens.find({ userId: userId }, { token: 0 })
  return successResponse(deviceList, MESSAGES.USER.GET_DEVICE_LIST_SUCCESSFULLY)
}

export const logoutDevice = async (userId: string, data: ICredentials) => {
  await RFTokens.deleteMany({ _id: { $in: data.credentials }, userId: userId })
  const io = getSocketIO()
  data.credentials.forEach(credentialId => io.to(credentialId).emit('logout'))
  return successResponse(null, MESSAGES.USER.LOGOUT_SUCCESSFULLY)
}
