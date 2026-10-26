import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, AuthRequest } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

// Save daily attendance
router.post('/daily', authenticate, async (req: AuthRequest, res) => {
  try {
    const { date, records } = req.body
    const userId = req.user?.id

    if (!date || !records || !Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        message: 'Date and records array are required'
      })
    }

    const dateStr = String(date).split('T')[0]
    const recordDate = new Date(`${dateStr}T00:00:00.000Z`)

    // Save each attendance record
    const attendancePromises = records.map((record: any) =>
      prisma.attendance.upsert({
        where: {
          employeeId_date: {
            employeeId: record.employeeId,
            date: recordDate
          }
        },
        update: {
          status: record.status.toUpperCase(), // Convert to uppercase for enum
          updatedAt: new Date()
        },
        create: {
          employeeId: record.employeeId,
          date: recordDate,
          status: record.status.toUpperCase(), // Convert to uppercase for enum
          markedBy: userId || 'system'
        }
      })
    )

    await Promise.all(attendancePromises)

    res.json({
      success: true,
      message: 'Attendance saved successfully',
      data: { recordCount: records.length }
    })
  } catch (error) {
    console.error('Save attendance error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to save attendance'
    })
  }
})

// Get today's attendance summary for dashboard (MUST be before /daily/:date)
router.get('/today-summary', authenticate, async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0]
    const startOfDay = new Date(`${todayStr}T00:00:00.000Z`)
    const endOfDay = new Date(`${todayStr}T23:59:59.999Z`)

    const [totalEmployees, records] = await Promise.all([
      prisma.employee.count({ where: { status: 'ACTIVE' } }),
      prisma.attendance.findMany({
        where: {
          date: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      })
    ])

    const presentCount = records.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length
    const exactlyPresent = records.filter(r => r.status === 'PRESENT').length
    const lateCount = records.filter(r => r.status === 'LATE').length
    const absentCount = records.filter(r => r.status === 'ABSENT').length
    const leaveCount = records.filter(r => r.status === 'LEAVE').length

    res.json({
      success: true,
      data: {
        date: todayStr,
        totalEmployees,
        presentCount,
        exactlyPresent,
        lateCount,
        absentCount,
        leaveCount,
        totalMarked: records.length,
        isMarked: records.length > 0
      }
    })
  } catch (error: any) {
    console.error('Get today attendance error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch today attendance summary' })
  }
})

// Get attendance for a specific date
router.get('/daily/:date', authenticate, async (req, res) => {
  try {
    const { date } = req.params
    const dateStr = String(date).split('T')[0]
    const startOfDay = new Date(`${dateStr}T00:00:00.000Z`)
    const endOfDay = new Date(`${dateStr}T23:59:59.999Z`)
    
    const attendance = await prisma.attendance.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        employee: true
      }
    })

    res.json({
      success: true,
      data: attendance
    })
  } catch (error) {
    console.error('Get attendance error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance'
    })
  }
})

// Get monthly attendance report
router.get('/monthly/:year/:month', authenticate, async (req, res) => {
  try {
    const { year, month } = req.params
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
    const endDate = new Date(parseInt(year), parseInt(month), 0)

    const attendance = await prisma.attendance.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        employee: true
      }
    })

    res.json({
      success: true,
      data: attendance
    })
  } catch (error) {
    console.error('Get monthly attendance error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly attendance'
    })
  }
})

export default router
