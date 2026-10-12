import { Router } from 'express'
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  markAttendance,
  getAttendance,
} from '../controllers/employeeController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Attendance routes
router.get('/attendance', getAttendance)
router.post('/attendance', authorize('ADMINISTRATOR', 'HR_USER'), markAttendance)

// Employee routes
router.get('/', getAllEmployees)
router.get('/:id', getEmployeeById)

// Create, update, delete (Admin and HR User only)
router.post('/', authorize('ADMINISTRATOR', 'HR_USER'), createEmployee)
router.put('/:id', authorize('ADMINISTRATOR', 'HR_USER'), updateEmployee)
router.delete('/:id', authorize('ADMINISTRATOR'), deleteEmployee)

export default router
