import { Router } from 'express'
import {
  getAllStockMovements,
  getStockMovementById,
  createStockMovement,
  updateStockMovement,
  deleteStockMovement,
  getInventorySummary,
  getLowStockProducts,
  getProductStockHistory,
} from '../controllers/inventoryController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Inventory summary and reports
router.get('/summary', getInventorySummary)
router.get('/low-stock', getLowStockProducts)
router.get('/product/:productId/history', getProductStockHistory)

// Stock movements
router.get('/movements', getAllStockMovements)
router.get('/movements/:id', getStockMovementById)

// Create, update, delete stock movements (Admin and Inventory User only)
router.post('/movements', authorize('ADMINISTRATOR', 'INVENTORY_USER'), createStockMovement)
router.put('/movements/:id', authorize('ADMINISTRATOR', 'INVENTORY_USER'), updateStockMovement)
router.delete('/movements/:id', authorize('ADMINISTRATOR'), deleteStockMovement)

export default router
