import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.js'
import prisma from '../config/database.js'
import { generateEmployeeId } from '../utils/helpers.js'
import { logAudit } from '../utils/logger.js'

// Get all employees
export const getAllEmployees = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { department, status, search } = req.query

    const where: any = {}

    if (department) where.department = department
    if (status) where.status = status
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { employeeId: { contains: search as string, mode: 'insensitive' } },
      ]
    }

    const employees = await prisma.employee.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    res.json({ success: true, data: employees })
  } catch (error: any) {
    console.error('Get employees error:', error)
    res.status(500).json({ message: 'Failed to fetch employees', error: error.message })
  }
}

// Get employee by ID
export const getEmployeeById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        attendance: {
          take: 30,
          orderBy: { date: 'desc' },
        },
      },
    })

    if (!employee) {
      res.status(404).json({ message: 'Employee not found' })
      return
    }

    res.json({ success: true, data: employee })
  } catch (error: any) {
    console.error('Get employee error:', error)
    res.status(500).json({ message: 'Failed to fetch employee', error: error.message })
  }
}

// Create employee
export const createEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      position,
      department,
      salary,
      dateEmployed,
      address,
      emergencyContact,
    } = req.body

    // Validate required fields
    if (!name || !email || !phone || !position || !department || !salary || !dateEmployed) {
      res.status(400).json({ message: 'Missing required fields' })
      return
    }

    // Check if email already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { email },
    })

    if (existingEmployee) {
      res.status(400).json({ message: 'Email already exists' })
      return
    }

    // Generate employee ID
    const employeeCount = await prisma.employee.count()
    const employeeId = generateEmployeeId(employeeCount)

    const employee = await prisma.employee.create({
      data: {
        employeeId,
        name,
        email,
        phone,
        position,
        department,
        salary: parseFloat(salary),
        dateEmployed: new Date(dateEmployed),
        address,
        emergencyContact,
        status: 'ACTIVE',
      },
    })

    // Log audit
    if (req.user) {
      await logAudit(
        req.user.id,
        'Employee Created',
        `Added employee: ${name} (${employeeId})`,
        req.ip,
        req.get('user-agent')
      )
    }

    res.status(201).json({
      success: true,
      data: employee,
      message: 'Employee created successfully',
    })
  } catch (error: any) {
    console.error('Create employee error:', error)
    res.status(500).json({ message: 'Failed to create employee', error: error.message })
  }
}

// Update employee
export const updateEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const {
      name,
      email,
      phone,
      position,
      department,
      salary,
      status,
      address,
      emergencyContact,
    } = req.body

    const employee = await prisma.employee.findUnique({ where: { id } })

    if (!employee) {
      res.status(404).json({ message: 'Employee not found' })
      return
    }

    // Check email uniqueness if email is being changed
    if (email && email !== employee.email) {
      const existingEmployee = await prisma.employee.findUnique({
        where: { email },
      })

      if (existingEmployee) {
        res.status(400).json({ message: 'Email already exists' })
        return
      }
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (position !== undefined) updateData.position = position
    if (department !== undefined) updateData.department = department
    if (salary !== undefined) updateData.salary = parseFloat(salary)
    if (status !== undefined) updateData.status = status
    if (address !== undefined) updateData.address = address
    if (emergencyContact !== undefined) updateData.emergencyContact = emergencyContact

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: updateData,
    })

    // Log audit
    if (req.user) {
      await logAudit(
        req.user.id,
        'Employee Updated',
        `Updated employee: ${updatedEmployee.name}`,
        req.ip,
        req.get('user-agent')
      )
    }

    res.json({
      success: true,
      data: updatedEmployee,
      message: 'Employee updated successfully',
    })
  } catch (error: any) {
    console.error('Update employee error:', error)
    res.status(500).json({ message: 'Failed to update employee', error: error.message })
  }
}

// Delete employee
export const deleteEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const employee = await prisma.employee.findUnique({ where: { id } })

    if (!employee) {
      res.status(404).json({ message: 'Employee not found' })
      return
    }

    await prisma.employee.delete({ where: { id } })

    // Log audit
    if (req.user) {
      await logAudit(
        req.user.id,
        'Employee Deleted',
        `Deleted employee: ${employee.name} (${employee.employeeId})`,
        req.ip,
        req.get('user-agent')
      )
    }

    res.json({ success: true, message: 'Employee deleted successfully' })
  } catch (error: any) {
    console.error('Delete employee error:', error)
    res.status(500).json({ message: 'Failed to delete employee', error: error.message })
  }
}

// Mark attendance
export const markAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { employeeId, date, status, checkIn, checkOut, notes } = req.body

    if (!employeeId || !date || !status) {
      res.status(400).json({ message: 'Missing required fields: employeeId, date, status' })
      return
    }

    const employee = await prisma.employee.findUnique({ where: { id: employeeId } })

    if (!employee) {
      res.status(404).json({ message: 'Employee not found' })
      return
    }

    // Check if attendance already exists for this date
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: new Date(date),
        },
      },
    })

    let attendance

    if (existingAttendance) {
      // Update existing attendance
      attendance = await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: {
          status,
          ...(checkIn && { checkIn: new Date(checkIn) }),
          ...(checkOut && { checkOut: new Date(checkOut) }),
          ...(notes !== undefined && { notes }),
        },
      })
    } else {
      // Create new attendance
      attendance = await prisma.attendance.create({
        data: {
          employeeId,
          date: new Date(date),
          status,
          ...(checkIn && { checkIn: new Date(checkIn) }),
          ...(checkOut && { checkOut: new Date(checkOut) }),
          notes,
        },
      })
    }

    res.json({
      success: true,
      data: attendance,
      message: 'Attendance marked successfully',
    })
  } catch (error: any) {
    console.error('Mark attendance error:', error)
    res.status(500).json({ message: 'Failed to mark attendance', error: error.message })
  }
}

// Get attendance records
export const getAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { employeeId, startDate, endDate, status } = req.query

    const where: any = {}

    if (employeeId) where.employeeId = employeeId as string
    if (status) where.status = status

    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate as string)
      if (endDate) where.date.lte = new Date(endDate as string)
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        employee: {
          select: {
            employeeId: true,
            name: true,
            department: true,
            position: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    })

    res.json({ success: true, data: attendance })
  } catch (error: any) {
    console.error('Get attendance error:', error)
    res.status(500).json({ message: 'Failed to fetch attendance', error: error.message })
  }
}
