import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

// TODO: Implement routes for saleRoutes

export default router
