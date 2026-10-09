import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.js'
import prisma from '../config/database.js'
import { auth as firebaseAuth } from '../config/firebase.js'
import { logAudit } from '../utils/logger.js'

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, username, password, role } = req.body

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' })
      return
    }

    // Create Firebase user
    const firebaseUser = await firebaseAuth.createUser({
      email,
      password,
      displayName: name,
    })

    // Create user in database
    const user = await prisma.user.create({
      data: {
        firebaseUid: firebaseUser.uid,
        name,
        email,
        username,
        role: role || 'SALES_USER',
        status: 'ACTIVE',
      },
    })

    // Log audit
    if (req.user) {
      await logAudit(
        req.user.id,
        'User Registration',
        `Registered new user: ${name} (${role})`,
        req.ip,
        req.get('user-agent')
      )
    }

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      message: 'User registered successfully',
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Failed to register user' })
  }
}

export const verifyToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body

    if (!idToken) {
      res.status(400).json({ message: 'Token is required' })
      return
    }

    // Verify Firebase token
    const decodedToken = await firebaseAuth.verifyIdToken(idToken)

    // Get or create user in database
    let user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    })

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    // Update last login
    user = await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    // Log audit
    await logAudit(
      user.id,
      'Sign In',
      'Logged into HHW Business Manager',
      req.ip,
      req.get('user-agent')
    )

    res.json({
      success: true,
      data: {
        id: user.id,
        firebaseUid: user.firebaseUid,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
        lastLogin: user.lastLogin,
      },
    })
  } catch (error: any) {
    console.error('Token verification error:', error)
    res.status(401).json({ message: 'Invalid token' })
  }
}

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' })
      return
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    })

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        firebaseUid: user.firebaseUid,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
        lastLogin: user.lastLogin,
      },
    })
  } catch (error: any) {
    console.error('Get current user error:', error)
    res.status(500).json({ message: 'Failed to get user' })
  }
}

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user) {
      await logAudit(
        req.user.id,
        'Sign Out',
        'Ended session',
        req.ip,
        req.get('user-agent')
      )
    }

    res.json({ success: true, message: 'Logged out successfully' })
  } catch (error: any) {
    console.error('Logout error:', error)
    res.status(500).json({ message: 'Failed to logout' })
  }
}
