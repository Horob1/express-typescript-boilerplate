import { Router } from 'express'
import v1 from './v1'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Version 1
 *   description: API version 1 management
 */
router.use('/v1', v1)

export default router
