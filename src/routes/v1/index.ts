import { Router } from 'express'
import userRouter from './user.route'

const router = Router()
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and authentication
 */
router.use('/user', userRouter)

export default router
