import { Router } from 'express'
import { register, verifyToken, getCurrentUser, logout } from '../controllers/authController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

// Public routes
router.post('/verify-token', verifyToken)
router.post('/logout', logout)

// Protected routes
router.post('/register', authenticate, authorize('ADMINISTRATOR'), register)
router.get('/me', authenticate, getCurrentUser)

export default router
