import { Request, Response, NextFunction } from 'express'
import { userServices } from '@/services/user.services'

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdUser = await userServices.register(req.body)

    res.status(201).json(createdUser)
  } catch (error) {
    next(error)
  }
}

export const userControllers = {
  register
}
