import { IUserCreate, IVerifyEmail, IResendEmail, ILogin, IToken } from '@/types/user.interface'
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
import { UAParser } from 'ua-parser-js'
import { signAccessToken, signRefreshToken, verifyRefreshToken, hashToken } from '@/utils/jwt'
import { ObjectId } from 'mongoose'
import { EPlatform } from '@/utils/enums'
import CONSTANT from '@/utils/constants'

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

  await Promise.all([user.save(), sendOtpEmail(data.email, otp, MESSAGES.USER.SEND_VERIFICATION_EMAIL)])
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

export const resendVerificationEmail = async (data: IResendEmail) => {
  const user = await User.findOne({ email: data.email })
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, MESSAGES.USER.USER_NOT_FOUND)

  if (user.emailVerified) throw new HttpError(StatusCodes.BAD_REQUEST, MESSAGES.USER.EMAIL_IS_ALREADY_VERIFIED)

  if (user.updatedAt.getTime() + ms(ENV.OTP.OTP_RESEND_LIMIT_TIME as StringValue) > Date.now()) throw new HttpError(StatusCodes.TOO_MANY_REQUESTS, MESSAGES.OTP.RESEND_LIMIT_TIME)

  const otp = genOTP()
  const hashedOTP = await hashOTP(otp)

  user.emailVerificationOtp = hashedOTP
  user.emailVerificationOtpExpires = new Date(Date.now() + ms(ENV.OTP.OTP_VERIFICATION_EMAIL_EXPIRATION as StringValue))
  await Promise.all([user.save(), sendOtpEmail(data.email, otp, MESSAGES.USER.SEND_VERIFICATION_EMAIL)])

  return successResponse(null, MESSAGES.USER.SEND_VERIFICATION_EMAIL)
}

export const login = async (data: ILogin, req: Request, res: Response) => {
  const user = await User.findOne({ $or: [{ email: data.usernameOrEmail }, { username: data.usernameOrEmail }] })
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, MESSAGES.USER.USERNAME_OR_PASSWORD_IS_NOT_CORRECT)
  if (!user.emailVerified) throw new HttpError(StatusCodes.FORBIDDEN, MESSAGES.USER.EMAIL_IS_ALREADY_VERIFIED)

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
