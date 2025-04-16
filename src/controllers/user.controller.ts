import { IUserCreate } from '@/types/user.interface'
import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { StatusCodes } from 'http-status-codes'
import * as userService from '@/services/user.service'

export const register = async (req: Request<ParamsDictionary, any, IUserCreate>, res: Response, next: NextFunction) => {
  try {
    const data = userService.register(req.body)
    res.status(StatusCodes.CREATED).json(data)
  } catch (error) {
    next(error)
  }
}
