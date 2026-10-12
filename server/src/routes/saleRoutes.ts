import { Router } from 'express'
import {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
  getSalesStats,
} from '../controllers/saleController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Get all sales and statistics
router.get('/', getAllSales)
router.get('/stats', getSalesStats)
router.get('/:id', getSaleById)

// Create, update, delete (Admin and Sales User only)
router.post('/', authorize('ADMINISTRATOR', 'SALES_USER'), createSale)
router.put('/:id', authorize('ADMINISTRATOR', 'SALES_USER'), updateSale)
router.delete('/:id', authorize('ADMINISTRATOR'), deleteSale)

export default router
