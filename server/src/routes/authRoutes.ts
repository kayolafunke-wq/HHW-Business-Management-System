import { Router } from 'express'
import { register, verifyToken, getCurrentUser, logout, login, resetPassword, getUserById, getAllUsers } from '../controllers/authController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

// Public routes
router.post('/login', login)
router.post('/verify-token', verifyToken)
router.post('/logout', logout)

// Protected routes - only HR and Admin can create users
router.post('/register', authenticate, authorize('ADMINISTRATOR', 'HR_USER'), register)
router.post('/reset-password', authenticate, authorize('ADMINISTRATOR', 'HR_USER'), resetPassword)
router.get('/me', authenticate, getCurrentUser)
router.get('/users', authenticate, authorize('ADMINISTRATOR', 'HR_USER'), getAllUsers)
router.get('/users/:id', authenticate, authorize('ADMINISTRATOR', 'HR_USER'), getUserById)

export default router
