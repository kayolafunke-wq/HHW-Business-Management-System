import { Router, Response } from 'express'
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js'
import prisma from '../config/database.js'
import { logAudit } from '../utils/logger.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

function getInitials(name: string): string {
  if (!name) return 'SY'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function inferCategory(action: string): 'Sales' | 'Inventory' | 'Users' | 'Settings' | 'Products' | 'HR' {
  const act = action.toLowerCase()
  if (act.includes('sale') || act.includes('invoice') || act.includes('pos')) return 'Sales'
  if (act.includes('product')) return 'Products'
  if (act.includes('stock') || act.includes('inventory')) return 'Inventory'
  if (act.includes('user') || act.includes('password') || act.includes('login') || act.includes('auth')) return 'Users'
  if (act.includes('employee') || act.includes('attendance') || act.includes('leave') || act.includes('payroll')) return 'HR'
  return 'Settings'
}

// GET /api/audit - Get all audit logs with optional filters
router.get('/', authorize('ADMINISTRATOR'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { action, userId, search, limit = '100', offset = '0' } = req.query

    const where: any = {}
    if (userId && typeof userId === 'string') {
      where.userId = userId
    }
    if (action && typeof action === 'string' && action !== 'All') {
      where.action = { contains: action, mode: 'insensitive' }
    }
    if (search && typeof search === 'string') {
      where.OR = [
        { action: { contains: search, mode: 'insensitive' } },
        { details: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              username: true,
            },
          },
        },
        orderBy: { timestamp: 'desc' },
        take: parseInt(limit as string, 10),
        skip: parseInt(offset as string, 10),
      }),
      prisma.auditLog.count({ where }),
    ])

    const formattedLogs = logs.map(log => {
      const userName = log.user?.name || 'System'
      const status: 'Success' | 'Failed' | 'Warning' =
        log.action.toLowerCase().includes('failed') || (log.details && log.details.toLowerCase().includes('fail'))
          ? 'Failed'
          : log.action.toLowerCase().includes('warn')
          ? 'Warning'
          : 'Success'

      return {
        id: log.id,
        timestamp: log.timestamp.toISOString(),
        user: getInitials(userName),
        userName,
        action: log.action,
        category: inferCategory(log.action),
        details: log.details || '',
        ipAddress: log.ipAddress || '127.0.0.1',
        status,
      }
    })

    res.json({
      success: true,
      data: formattedLogs,
      total,
    })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch audit logs' })
  }
})

// POST /api/audit - Create an audit entry manually
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { action, details } = req.body
    if (!action) {
      res.status(400).json({ success: false, message: 'Action is required' })
      return
    }

    const userId = req.user?.id
    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' })
      return
    }

    await logAudit(userId, action, details, req.ip, req.get('user-agent'))

    res.status(201).json({ success: true, message: 'Audit log recorded' })
  } catch (error) {
    console.error('Error creating audit log:', error)
    res.status(500).json({ success: false, message: 'Failed to record audit log' })
  }
})

export default router
