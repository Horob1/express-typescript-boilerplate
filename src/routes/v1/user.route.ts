import { Router } from 'express'
import * as userController from '@/controllers/user.controller'

const router = Router()

//TODO: register
/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 */
router.post('/register', userController.register)
//TODO: verify email
//TODO: resend verification email
//TODO: login
//TODO: refresh token
//TODO: logout
//TODO: forgot password
//TODO: reset password
//TODO: change password
//TODO: update profile
//TODO: update avatar
//TODO: get profile
//TODO: get device logged in list
//TODO: logout device // không cần thiết
//TODO: check email exist // không cần thiết vì đã check trong register
//TODO: check username exist // không cần thiết vì đã check trong register

export default router
