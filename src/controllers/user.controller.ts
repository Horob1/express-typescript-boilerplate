import { IUserCreate, IVerifyEmail, ILogin, IToken, ICredentialId, IEmail, IUsername, IResetPassword, IChangePassword, IUserUpdate, IAvatar, ICredentials } from '@/types/user.interface'
import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { StatusCodes } from 'http-status-codes'
import * as userService from '@/services/user.service'
import { deleteCache, genCacheKey } from '@/utils/cache'

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

export const resendVerificationEmail = async (req: Request<ParamsDictionary, any, IEmail>, res: Response, next: NextFunction) => {
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

export const logout = async (req: Request<ParamsDictionary, any, ICredentialId>, res: Response, next: NextFunction) => {
  try {
    const data = await userService.logout(req, res)
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}

export const logoutAll = async (req: Request<ParamsDictionary, any, ICredentialId>, res: Response, next: NextFunction) => {
  try {
    const data = await userService.logoutAll(req.user?._id as string, res)
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}

export const checkEmail = async (req: Request<ParamsDictionary, any, IEmail>, res: Response, next: NextFunction) => {
  try {
    const data = await userService.checkEmail(req.body)
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}

export const checkUsername = async (req: Request<ParamsDictionary, any, IUsername>, res: Response, next: NextFunction) => {
  try {
    const data = await userService.checkUsername(req.body)
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}

export const forgotPassword = async (req: Request<ParamsDictionary, any, IEmail>, res: Response, next: NextFunction) => {
  try {
    const data = await userService.forgotPassword(req.body)
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (req: Request<ParamsDictionary, any, IResetPassword>, res: Response, next: NextFunction) => {
  try {
    const data = await userService.resetPassword(req.body)
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}

export const changePassword = async (req: Request<ParamsDictionary, any, IChangePassword>, res: Response, next: NextFunction) => {
  try {
    const data = await userService.changePassword(req.body, req.user?._id as string)
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (req: Request<ParamsDictionary, any, IUserUpdate>, res: Response, next: NextFunction) => {
  try {
    const cacheKey = genCacheKey(req.originalUrl, req.user?._id)
    const [data] = await Promise.all([userService.updateProfile(req.body, req.user?._id as string), deleteCache(cacheKey)])
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}

export const updateAvatar = async (req: Request<ParamsDictionary, any, IAvatar>, res: Response, next: NextFunction) => {
  try {
    // const data = await userService.updateAvatar(req.body, req.user?._id as string)
    //
    // res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = req.cacheKey as string
    const data = await userService.getProfile(req.user?._id as string, cacheKey)
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}

export const getDeviceList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await userService.getDeviceList(req.user?._id as string)
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}

export const logoutDevice = async (req: Request<ParamsDictionary, any, ICredentials>, res: Response, next: NextFunction) => {
  try {
    const data = await userService.logoutDevice(req.user?._id as string, req.body)
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}
