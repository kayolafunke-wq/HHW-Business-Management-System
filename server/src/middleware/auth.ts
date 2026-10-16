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

import { Request, Response, NextFunction } from 'express'
import { auth } from '../config/firebase.js'
import prisma from '../config/database.js'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

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
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // DEVELOPMENT MODE: Try to use mock user
      if (process.env.NODE_ENV === 'development' || !auth) {
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
      
      res.status(401).json({ message: 'No token provided' })
      return
    }

    const token = authHeader.split('Bearer ')[1]

    // Try JWT token first (our simple auth)
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string }
      
      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
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
      return
    } catch (jwtError) {
      // JWT failed, try Firebase token
      if (auth) {
        try {
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
          return
        } catch (firebaseError) {
          res.status(401).json({ message: 'Invalid or expired token' })
          return
        }
      }
      
      res.status(401).json({ message: 'Invalid or expired token' })
    }
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
