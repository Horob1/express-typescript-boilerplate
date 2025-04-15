import express from 'express'
import { userValidators } from '@/validators/user.validators'
import { userControllers } from '@/controllers/user.controllers'
import { userServices } from '@/services/user.services'
import { userModels } from '@/models/user.models'

const Router = express.Router()

Router.post('/register', userValidators.register, userControllers.register)

export const userRoute = Router
