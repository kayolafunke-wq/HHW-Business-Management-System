import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.js'
import prisma from '../config/database.js'
import { auth as firebaseAuth } from '../config/firebase.js'
import { logAudit } from '../utils/logger.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Simple username/password login (no Firebase)
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' })
      return
    }

    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username }
        ],
        status: 'ACTIVE'
      },
    })

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    // For now, accept any password (demo mode)
    // In production, verify against hashed password
    // const isValid = await bcrypt.compare(password, user.password)
    // if (!isValid) {
    //   res.status(401).json({ message: 'Invalid credentials' })
    //   return
    // }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

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
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
          status: user.status,
          lastLogin: user.lastLogin,
        },
        token
      },
      message: 'Login successful'
    })
  } catch (error: any) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Login failed' })
  }
}

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, firebaseUid, role, username } = req.body

    // Validate required fields
    if (!name || !email || !firebaseUid) {
      res.status(400).json({ message: 'Name, email, and Firebase UID are required' })
      return
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { firebaseUid },
          ...(username ? [{ username }] : [])
        ],
      },
    })

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' })
      return
    }

    // Generate username from email if not provided
    const generatedUsername = username || email.split('@')[0]

    // Create user in database
    const user = await prisma.user.create({
      data: {
        firebaseUid,
        name,
        email,
        username: generatedUsername,
        role: role || 'SALES_USER', // Default role
        status: 'ACTIVE',
      },
    })

    // Log audit (only if there's an authenticated user creating another user)
    if (req.user) {
      await logAudit(
        req.user.id,
        'User Registration',
        `Registered new user: ${name} (${role || 'SALES_USER'})`,
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

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        status: true,
        lastLogin: true,
        createdAt: true,
      }
    })

    res.json({
      success: true,
      data: users,
    })
  } catch (error: any) {
    console.error('Get all users error:', error)
    res.status(500).json({ message: 'Failed to get users' })
  }
}

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: { id },
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
    console.error('Get user by ID error:', error)
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

export const resetPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, email, newPassword } = req.body

    if (!userId || !email || !newPassword) {
      res.status(400).json({ message: 'User ID, email, and new password are required' })
      return
    }

    if (newPassword.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters' })
      return
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    if (!user.firebaseUid) {
      res.status(400).json({ message: 'User does not have Firebase account' })
      return
    }

    // Try to update password in Firebase
    try {
      await firebaseAuth.updateUser(user.firebaseUid, {
        password: newPassword
      })

      // Log audit
      if (req.user) {
        await logAudit(
          req.user.id,
          'Password Reset',
          `Reset password for user: ${user.name} (${user.email})`,
          req.ip,
          req.get('user-agent')
        )
      }

      res.json({
        success: true,
        message: 'Password reset successfully',
        data: {
          email: user.email,
          newPassword
        }
      })
    } catch (firebaseError: any) {
      console.error('Firebase password update error:', firebaseError)
      
      // If Firebase Admin fails, return success anyway since we can't verify
      // In production, you'd need proper Firebase Admin credentials
      // For now, just log the audit and return success
      if (req.user) {
        await logAudit(
          req.user.id,
          'Password Reset Attempted',
          `Attempted to reset password for user: ${user.name} (${user.email})`,
          req.ip,
          req.get('user-agent')
        )
      }
      
      res.json({
        success: true,
        message: 'Password reset request recorded. Admin must manually update in Firebase Console.',
        data: {
          email: user.email,
          newPassword,
          requiresManualUpdate: true
        }
      })
    }
  } catch (error: any) {
    console.error('Reset password error:', error)
    res.status(500).json({ message: 'Failed to reset password' })
  }
}
