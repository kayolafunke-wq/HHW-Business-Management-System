import { Request, Response, NextFunction } from 'express'
import { auth } from '../config/firebase.js'
import prisma from '../config/database.js'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: {
    id: string
    firebaseUid: string
    email: string
    role: string
  }
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // DEVELOPMENT MODE: Skip Firebase auth and use mock user
    if (process.env.NODE_ENV === 'development' || !auth) {
      // Get first admin user from database for testing
      const adminUser = await prisma.user.findFirst({
        where: { role: 'ADMINISTRATOR' },
      })

      if (adminUser) {
        req.user = {
          id: adminUser.id,
          firebaseUid: adminUser.firebaseUid,
          email: adminUser.email,
          role: adminUser.role,
        }
        next()
        return
      }
    }

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided' })
      return
    }

    const token = authHeader.split('Bearer ')[1]

    // Verify Firebase token
    if (!auth) {
      res.status(500).json({ message: 'Authentication service not available' })
      return
    }

    const decodedToken = await auth.verifyIdToken(token)
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    })

    if (!user || user.status !== 'ACTIVE') {
      res.status(401).json({ message: 'User not found or inactive' })
      return
    }

    // Attach user to request
    req.user = {
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      role: user.role,
    }

    next()
  } catch (error) {
    console.error('Authentication error:', error)
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' })
      return
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: 'Insufficient permissions' })
      return
    }

    next()
  }
}
