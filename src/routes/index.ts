import { Router } from 'express'
import v1 from './v1'
import platformMiddleware from '@/middlewares/platform.middleware'

const router = Router()
router.use(platformMiddleware)
router.use('/v1', v1)

export default router
