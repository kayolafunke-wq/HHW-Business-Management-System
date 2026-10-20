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

    // Save each attendance record
    const attendancePromises = records.map((record: any) =>
      prisma.attendance.upsert({
        where: {
          employeeId_date: {
            employeeId: record.employeeId,
            date: new Date(date)
          }
        },
        update: {
          status: record.status.toUpperCase(), // Convert to uppercase for enum
          updatedAt: new Date()
        },
        create: {
          employeeId: record.employeeId,
          date: new Date(date),
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

// Get attendance for a specific date
router.get('/daily/:date', authenticate, async (req, res) => {
  try {
    const { date } = req.params
    
    const attendance = await prisma.attendance.findMany({
      where: {
        date: new Date(date)
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
