import jwt from 'jsonwebtoken'
import ENV from '@/configs/env'
import { IRTPayload, IToken } from '@/types/jwt.interface'
import { StringValue } from 'ms'
import HttpError from '@/utils/httpError'
import { StatusCodes } from 'http-status-codes'

/**
 * Sign access token
 * @param payload implements interface IToken
 * @returns Promise<string>
 */
const signAccessToken = (payload: IToken) =>
  new Promise<string>((resolve, reject) => {
    jwt.sign(
      payload,
      ENV.JWT.JWT_SECRETS_AT as string,
      {
        expiresIn: ENV.JWT.ACCESS_TOKEN_EXPIRATION as StringValue
      },
      (err, token) => {
        if (err) reject(err)
        else resolve(token as string)
      }
    )
  })

/**
 * Sign refresh token
 * @param exp number is optional, used when you want to sign a refresh token with a specific expiration time
 * @param payload implements interface IToken
 * @returns Promise<string>
 */
const signRefreshToken = (payload: IToken, exp?: number) => {
  if (exp) {
    return new Promise<string>((resolve, reject) => {
      jwt.sign({ ...payload, exp }, ENV.JWT.JWT_SECRETS_RT as string, (err: Error | null, token: string | undefined) => {
        if (err) reject(err)
        else resolve(token as string)
      })
    })
  } else
    return new Promise<string>((resolve, reject) => {
      jwt.sign(
        payload,
        ENV.JWT.JWT_SECRETS_RT as string,
        {
          expiresIn: ENV.JWT.REFRESH_TOKEN_EXPIRATION as StringValue
        },
        (err, token) => {
          if (err) reject(err)
          else resolve(token as string)
        }
      )
    })
}

/**
 * Verify refresh token
 * @param token string
 * @returns Promise<IRTPayload>
 */
const verifyRefreshToken = async (token: string) => {
  return new Promise<IRTPayload>((resolve, reject) => {
    jwt.verify(token, ENV.JWT.JWT_SECRETS_RT as string, (err, payload) => {
      if (err) reject(new HttpError(StatusCodes.UNAUTHORIZED, err.message))
      else resolve(payload as IRTPayload)
    })
  })
}

/**
 * Verify access token
 * @param token string
 * @returns Promise<IRTPayload>
 */
const verifyAccessToken = async (token: string) => {
  return new Promise<IRTPayload>((resolve, reject) => {
    jwt.verify(token, ENV.JWT.JWT_SECRETS_AT as string, (err, payload) => {
      if (err) reject(new HttpError(StatusCodes.UNAUTHORIZED, err.message === 'jwt expired' ? 'Access token expired' : err.message))
      else resolve(payload as IRTPayload)
    })
  })
}

export { signAccessToken, signRefreshToken, verifyRefreshToken, verifyAccessToken }
