/* eslint-disable prettier/prettier */
import express from 'express'
import { userRoute } from './user.routes'


const Router = express.Router()

// User API
Router.use('/users', userRoute)

export const APIs_V1 = Router