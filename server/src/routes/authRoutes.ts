import { Router } from 'express'
import { register, verifyToken, getCurrentUser, logout, login, resetPassword, getUserById, getAllUsers } from '../controllers/authController.js'
import { authenticate, authorize } from '../middleware/auth.js'
import prisma from '../config/database.js'

const router = Router()

// Setup route - create first admin user (only works if no users exist)
router.post('/setup/init-admin', async (req, res) => {
  try {
    const userCount = await prisma.user.count()
    
    if (userCount > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Admin user already exists. Please use login.' 
      })
    }

    const { email, name } = req.body

    if (!email || !name) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and name are required' 
      })
    }

    const admin = await prisma.user.create({
      data: {
        firebaseUid: `system-${Date.now()}`,
        name,
        email,
        username: email.split('@')[0],
        role: 'ADMINISTRATOR',
        status: 'ACTIVE',
      },
    })

    return res.status(201).json({
      success: true,
      message: 'Admin user created successfully! You can now login.',
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    })
  } catch (error) {
    console.error('Setup error:', error)
    return res.status(500).json({ 
      success: false,
      message: 'Failed to create admin user' 
    })
  }
})

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
