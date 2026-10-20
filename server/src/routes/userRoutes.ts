import { Router, Response } from 'express'
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js'
import prisma from '../config/database.js'
import { logAudit } from '../utils/logger.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

// GET /api/users - List all users
router.get('/', authorize('ADMINISTRATOR', 'HR_USER'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role, status, search } = req.query

    const where: any = {}
    if (role && typeof role === 'string' && role !== 'All') {
      where.role = role.replace(/ /g, '_').toUpperCase()
    }
    if (status && typeof status === 'string' && status !== 'All') {
      where.status = status.toUpperCase()
    }
    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      ]
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        status: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json({
      success: true,
      data: users,
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch users' })
  }
})

// GET /api/users/:id - Get single user
router.get('/:id', authorize('ADMINISTRATOR', 'HR_USER'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        status: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' })
      return
    }

    res.json({ success: true, data: user })
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch user' })
  }
})

// PUT /api/users/:id - Update user details, role, or status
router.put('/:id', authorize('ADMINISTRATOR'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { name, role, status } = req.body

    const updateData: any = {}
    if (name) updateData.name = name
    if (role) updateData.role = role.replace(/ /g, '_').toUpperCase()
    if (status) updateData.status = status.toUpperCase()

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        status: true,
        lastLogin: true,
        updatedAt: true,
      },
    })

    if (req.user) {
      await logAudit(
        req.user.id,
        'Update User',
        `Updated user ${updatedUser.name} (${updatedUser.email})`,
        req.ip,
        req.get('user-agent')
      )
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    })
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ success: false, message: 'Failed to update user' })
  }
})

// DELETE /api/users/:id - Deactivate user
router.delete('/:id', authorize('ADMINISTRATOR'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const user = await prisma.user.update({
      where: { id },
      data: { status: 'INACTIVE' },
    })

    if (req.user) {
      await logAudit(
        req.user.id,
        'Deactivate User',
        `Deactivated user ${user.name} (${user.email})`,
        req.ip,
        req.get('user-agent')
      )
    }

    res.json({
      success: true,
      message: 'User deactivated successfully',
    })
  } catch (error) {
    console.error('Error deactivating user:', error)
    res.status(500).json({ success: false, message: 'Failed to deactivate user' })
  }
})

export default router
