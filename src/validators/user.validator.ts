import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { Request, Response, NextFunction } from 'express'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '@/utils/validators'
import HttpError from '@/utils/httpError'
import { EGender } from '@/utils/enums'

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    username: Joi.string().required().min(3).max(30).trim().strict(),
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE),
    firstName: Joi.string().required().min(1).max(30),
    lastName: Joi.string().required().min(1).max(30),
    phoneNumber: Joi.string().required().min(10).max(15),
    address: Joi.string().required().min(3).max(100),
    dob: Joi.date().required(),
    gender: Joi.string()
      .valid(...Object.values(EGender))
      .required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: true })
    next()
  } catch (error: any) {
    next(new HttpError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    opt: Joi.string().required().length(6).trim().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: true })
    next()
  } catch (error: any) {
    next(new HttpError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const email = async (req: Request, res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE)
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: true })
    next()
  } catch (error: any) {
    next(new HttpError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    usernameOrEmail: Joi.string().trim().strict().required(),
    password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE)
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: true })
    next()
  } catch (error: any) {
    next(new HttpError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE)
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: true })
    next()
  } catch (error: any) {
    next(new HttpError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    otp: Joi.string().required().length(6).trim().strict(),
    newPassword: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE)
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: true })
    next()
  } catch (error: any) {
    next(new HttpError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE),
    newPassword: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE)
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: true })
    next()
  } catch (error: any) {
    next(new HttpError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  const correctCondition = Joi.object({
    firstName: Joi.string().optional().min(1).max(30),
    lastName: Joi.string().optional().min(1).max(30),
    phoneNumber: Joi.string().optional().min(10).max(15),
    address: Joi.string().optional().min(3).max(100),
    dob: Joi.date().optional(),
    gender: Joi.string()
      .valid(...Object.values(EGender))
      .optional()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: true })
    next()
  } catch (error: any) {
    next(new HttpError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}
