import { Router } from 'express'
import * as userController from '@/controllers/user.controller'
import authMiddleware from '@/middlewares/auth.middleware'
import { cachePersonal } from '@/middlewares/cache.middleware'

const router = Router()

/**
 * @swagger
 * /api/v1/user/check-email:
 *   post:
 *     summary: Check email is already taken
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
 *             $ref: '#/components/schemas/Email'
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
 *         description: Email is already taken
 */
router.post('/check-email', userController.checkEmail)

/**
 * @swagger
 * /api/v1/user/check-username:
 *   post:
 *     summary: Check username is already taken
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
 *             $ref: '#/components/schemas/Username'
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
 *         description: Username is already taken
 */
router.post('/check-username', userController.checkUsername)

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
 *         description: OTP is invalid or expired
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
 *             $ref: '#/components/schemas/Email'
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

/**
 * @swagger
 * /api/v1/user/forgot-password:
 *   post:
 *     summary: Forgot password
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
 *             $ref: '#/components/schemas/Email'
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
 *       404:
 *         description: User not found
 *       429:
 *         description: Resend email limit time
 */
router.post('/forgot-password', userController.forgotPassword)

/**
 * @swagger
 * /api/v1/user/reset-password:
 *   post:
 *     summary: Reset password
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
 *             $ref: '#/components/schemas/ResetPassword'
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
 *         description: OTP is invalid or expired
 */
router.post('/reset-password', userController.resetPassword)

//protected routes
router.use(authMiddleware)

/**
 * @swagger
 * /api/v1/user/logout:
 *   post:
 *     summary: Logout
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
 *             $ref: '#/components/schemas/CredentialId'
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
 *       401:
 *         description: Refresh token is invalid or expired
 */
router.post('/logout', userController.logout)

/**
 * @swagger
 * /api/v1/user/logout-all:
 *   post:
 *     summary: Logout all
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
 */
router.post('/logout-all', userController.logoutAll)

/**
 * @swagger
 * /api/v1/user/change-password:
 *   post:
 *     summary: Change password
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
 *             $ref: '#/components/schemas/ChangePassword'
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
 *       403:
 *         description: Old password is not correct
 *       400:
 *         description: New password is not compare with comfirm password
 */
router.post('/change-password', userController.changePassword)

/**
 * @swagger
 * /api/v1/user/me:
 *   patch:
 *     summary: Update profile
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
 *             $ref: '#/components/schemas/UpdateUser'
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
 *                   schema:
 *                     $ref: '#/components/schemas/User'
 */
router.patch('/me', userController.updateProfile)

//TODO: update avatar
/**
 * @swagger
 * /api/v1/user/me:
 *   put:
 *     summary: Update avatar
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
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
 *                   schema:
 *                     $ref: '#/components/schemas/User'
 */
router.put('/me', userController.updateAvatar)

/**
 * @swagger
 * /api/v1/user/me:
 *   get:
 *     summary: Get user profile
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
 *                   schema:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/me', cachePersonal, userController.getProfile)

/**
 * @swagger
 * /api/v1/user/me/devices:
 *   get:
 *     summary: Get device list
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
 *                   type: array
 *                   items:
 *                     schema:
 *                       $ref: '#/components/schemas/RFTokens'
 */
router.get('/me/devices', userController.getDeviceList)

/**
 * @swagger
 * /api/v1/user/me/devices:
 *   delete:
 *     summary: Logout on mobile
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
 *             $ref: '#/components/schemas/Credentials'
 */
router.delete('/me/devices', userController.logoutDevice)

export default router
