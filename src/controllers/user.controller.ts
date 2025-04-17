import { IUserCreate, IVerifyEmail, IResendEmail, ILogin, IToken } from '@/types/user.interface'
import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { StatusCodes } from 'http-status-codes'
import * as userService from '@/services/user.service'

export const register = async (req: Request<ParamsDictionary, any, IUserCreate>, res: Response, next: NextFunction) => {
  try {
    const data = await userService.register(req.body)
    res.status(StatusCodes.CREATED).json(data)
  } catch (error) {
    next(error)
  }
}

export const verifyEmail = async (req: Request<ParamsDictionary, any, IVerifyEmail>, res: Response, next: NextFunction) => {
  try {
    const data = await userService.verifyEmail(req.body)
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}

export const resendVerificationEmail = async (req: Request<ParamsDictionary, any, IResendEmail>, res: Response, next: NextFunction) => {
  try {
    const data = await userService.resendVerificationEmail(req.body)
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}

export const login = async (req: Request<ParamsDictionary, any, ILogin>, res: Response, next: NextFunction) => {
  try {
    const data = await userService.login(req.body, req, res)
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}

export const refreshToken = async (req: Request<ParamsDictionary, any, IToken>, res: Response, next: NextFunction) => {
  try {
    const data = await userService.refreshToken(req.body, req, res)
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}
