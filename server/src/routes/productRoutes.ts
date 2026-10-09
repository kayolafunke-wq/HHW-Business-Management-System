import { Router } from 'express'
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Get all products (all authenticated users)
router.get('/', getAllProducts)
router.get('/:id', getProductById)

// Create, update, delete (Admin and Inventory User only)
router.post('/', authorize('ADMINISTRATOR', 'INVENTORY_USER'), createProduct)
router.put('/:id', authorize('ADMINISTRATOR', 'INVENTORY_USER'), updateProduct)
router.delete('/:id', authorize('ADMINISTRATOR'), deleteProduct)

export default router
