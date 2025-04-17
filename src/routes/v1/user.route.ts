import { Router } from 'express'
import * as userController from '@/controllers/user.controller'

const router = Router()

/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - User
 *     parameters:
 *       - in: header
 *         name: X-Platform
 *         description: Platform of the request
 *         schema:
 *           type: string
 *           enum: [WEB, MOBILE]
 *           default: WEB
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

/**
 * @swagger
 * /api/v1/user/verify-email:
 *   post:
 *     summary: Verify email
 *     tags:
 *       - User
 *     parameters:
 *       - in: header
 *         name: X-Platform
 *         description: Platform of the request
 *         schema:
 *           type: string
 *           enum: [WEB, MOBILE]
 *           default: WEB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 *       400:
 *         description: Token expired or OTP is invalid
 */
router.post('/verify-email', userController.verifyEmail)
/**
 * @swagger
 * /api/v1/user/resend-verification-email:
 *   post:
 *     summary: Resend verification email
 *     tags:
 *       - User
 *     parameters:
 *       - in: header
 *         name: X-Platform
 *         description: Platform of the request
 *         schema:
 *           type: string
 *           enum: [WEB, MOBILE]
 *           default: WEB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 *       400:
 *         description: Email is already verified
 *       404:
 *         description: User not found
 *       429:
 *         description: Resend email limit time
 */
router.post('/resend-verification-email', userController.resendVerificationEmail)
/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Login
 *     tags:
 *       - User
 *     parameters:
 *       - in: header
 *         name: X-Platform
 *         description: Platform of the request
 *         schema:
 *           type: string
 *           enum: [WEB, MOBILE]
 *           default: WEB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usernameOrEmail:
 *                 type: string
 *               password:
 *                 type: string
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       description: Only for mobile
 *                       type: string
 *                       optional: true
 *                     credentialId:
 *                       type: string
 *       401:
 *         description: Username or password is not correct
 *       403:
 *         description: Email is not verified
 */
router.post('/login', userController.login)
/**
 * @swagger
 * /api/v1/user/refresh-token:
 *   post:
 *     summary: Refresh token
 *     tags:
 *       - User
 *     parameters:
 *       - in: header
 *         name: X-Platform
 *         description: Platform of the request
 *         schema:
 *           type: string
 *           enum: [WEB, MOBILE]
 *           default: WEB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Token'
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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       description: Only for mobile
 *                       type: string
 *                       optional: true
 *       401:
 *         description: Refresh token is invalid or expired
 */
router.post('/refresh-token', userController.refreshToken)
//TODO: logout
//TODO: forgot password (email)
//TODO: reset password
//TODO: resend reset password email
//TODO: change password
//TODO: update profile
//TODO: update avatar
//TODO: get profile
//TODO: get device logged in list
//TODO: logout device
//TODO: check email exist
//TODO: check username exist

export default router
