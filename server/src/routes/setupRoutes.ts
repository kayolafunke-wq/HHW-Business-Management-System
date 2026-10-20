import { Router, Request, Response } from 'express'
import prisma from '../config/database.js'

const router = Router()

// Create first admin user (only works if no users exist)
router.post('/init-admin', async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if any users already exist
    const userCount = await prisma.user.count()
    
    if (userCount > 0) {
      res.status(400).json({ 
        success: false,
        message: 'Admin user already exists. Please use login.' 
      })
      return
    }

    const { email, name } = req.body

    if (!email || !name) {
      res.status(400).json({ 
        success: false,
        message: 'Email and name are required' 
      })
      return
    }

    // Create the first admin user
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

    res.status(201).json({
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
    res.status(500).json({ 
      success: false,
      message: 'Failed to create admin user' 
    })
  }
})

export default router
