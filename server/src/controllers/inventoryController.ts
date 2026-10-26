import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.js'
import prisma from '../config/database.js'
import { logAudit } from '../utils/logger.js'

// Get all stock movements with filters
export const getAllStockMovements = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, type, startDate, endDate, reference } = req.query

    const where: any = {}

    if (productId) where.productId = productId as string
    if (type) where.type = type
    if (reference) where.reference = { contains: reference as string, mode: 'insensitive' }
    
    if (startDate || endDate) {
      where.movementDate = {}
      if (startDate) where.movementDate.gte = new Date(startDate as string)
      if (endDate) where.movementDate.lte = new Date(endDate as string)
    }

    const movements = await prisma.stockMovement.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            sku: true,
            name: true,
            category: true,
            stock: true,
          },
        },
      },
      orderBy: [
        { movementDate: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    res.json({ success: true, data: movements })
  } catch (error: any) {
    console.error('Get stock movements error:', error)
    res.status(500).json({ message: 'Failed to fetch stock movements', error: error.message })
  }
}

// Get stock movement by ID
export const getStockMovementById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const movement = await prisma.stockMovement.findUnique({
      where: { id },
      include: {
        product: true,
      },
    })

    if (!movement) {
      res.status(404).json({ message: 'Stock movement not found' })
      return
    }

    res.json({ success: true, data: movement })
  } catch (error: any) {
    console.error('Get stock movement error:', error)
    res.status(500).json({ message: 'Failed to fetch stock movement', error: error.message })
  }
}

// Create stock movement (Stock In/Out - manual adjustment)
export const createStockMovement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, type, quantity, reference, supplier, reason, notes } = req.body

    // Validate required fields
    if (!productId || !type || !quantity || !reason) {
      res.status(400).json({ message: 'Missing required fields: productId, type, quantity, reason' })
      return
    }

    // Validate quantity
    if (quantity <= 0) {
      res.status(400).json({ message: 'Quantity must be positive' })
      return
    }

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      res.status(404).json({ message: 'Product not found' })
      return
    }

    // Check if stock out is valid
    if (type === 'OUT' && product.stock < quantity) {
      res.status(400).json({
        message: `Insufficient stock. Available: ${product.stock}, Requested: ${quantity}`,
      })
      return
    }

    // Calculate new stock
    const stockChange = type === 'IN' ? quantity : -quantity
    const newStock = product.stock + stockChange

    // Validate new stock
    if (newStock < 0) {
      res.status(400).json({ message: 'Resulting stock cannot be negative' })
      return
    }

    // Transaction: Create movement and update product
    const result = await prisma.$transaction(async (tx) => {
      const actorName = req.user?.name || req.user?.email || 'System'
      const roleSuffix = req.user?.role === 'ADMINISTRATOR' ? ' (Admin)' : (req.user?.role ? ` (${req.user.role})` : '')

      // Create stock movement
      const movement = await tx.stockMovement.create({
        data: {
          type,
          quantity,
          reference: reference || `ADJ-${Date.now()}`,
          supplier: type === 'IN' ? supplier : null,
          reason,
          notes,
          performedBy: `${actorName}${roleSuffix}`,
          productId,
        },
        include: {
          product: true,
        },
      })

      // Determine new status
      let newStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'IN_STOCK'
      if (newStock === 0) newStatus = 'OUT_OF_STOCK'
      else if (newStock <= product.minStock) newStatus = 'LOW_STOCK'

      // Update product stock
      await tx.product.update({
        where: { id: productId },
        data: {
          stock: newStock,
          status: newStatus,
        },
      })

      return movement
    })

    // Log audit
    if (req.user) {
      await logAudit(
        req.user.id,
        `Stock ${type === 'IN' ? 'In' : 'Out'}`,
        `${type === 'IN' ? 'Added' : 'Removed'} ${quantity} units of ${product.name}. Reason: ${reason}`,
        req.ip,
        req.get('user-agent')
      )
    }

    res.status(201).json({
      success: true,
      data: result,
      message: 'Stock movement created successfully',
    })
  } catch (error: any) {
    console.error('Create stock movement error:', error)
    res.status(500).json({ message: 'Failed to create stock movement', error: error.message })
  }
}

// Update stock movement
export const updateStockMovement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { reference, supplier, reason, notes } = req.body

    const movement = await prisma.stockMovement.findUnique({ where: { id } })

    if (!movement) {
      res.status(404).json({ message: 'Stock movement not found' })
      return
    }

    const updatedMovement = await prisma.stockMovement.update({
      where: { id },
      data: {
        ...(reference && { reference }),
        ...(supplier !== undefined && { supplier }),
        ...(reason && { reason }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        product: true,
      },
    })

    // Log audit
    if (req.user) {
      await logAudit(
        req.user.id,
        'Stock Movement Updated',
        `Updated stock movement ${id}`,
        req.ip,
        req.get('user-agent')
      )
    }

    res.json({
      success: true,
      data: updatedMovement,
      message: 'Stock movement updated successfully',
    })
  } catch (error: any) {
    console.error('Update stock movement error:', error)
    res.status(500).json({ message: 'Failed to update stock movement', error: error.message })
  }
}

// Delete stock movement (and reverse stock change)
export const deleteStockMovement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const movement = await prisma.stockMovement.findUnique({
      where: { id },
      include: { product: true },
    })

    if (!movement) {
      res.status(404).json({ message: 'Stock movement not found' })
      return
    }

    // Reverse the stock change
    const stockChange = movement.type === 'IN' ? -movement.quantity : movement.quantity
    const newStock = movement.product.stock + stockChange

    if (newStock < 0) {
      res.status(400).json({
        message: 'Cannot delete movement: would result in negative stock',
      })
      return
    }

    // Transaction: Delete movement and update stock
    await prisma.$transaction(async (tx) => {
      // Update product stock
      let newStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'IN_STOCK'
      if (newStock === 0) newStatus = 'OUT_OF_STOCK'
      else if (newStock <= movement.product.minStock) newStatus = 'LOW_STOCK'

      await tx.product.update({
        where: { id: movement.productId },
        data: {
          stock: newStock,
          status: newStatus,
        },
      })

      // Delete movement
      await tx.stockMovement.delete({ where: { id } })
    })

    // Log audit
    if (req.user) {
      await logAudit(
        req.user.id,
        'Stock Movement Deleted',
        `Deleted stock movement ${id} for ${movement.product.name}. Stock adjusted.`,
        req.ip,
        req.get('user-agent')
      )
    }

    res.json({ success: true, message: 'Stock movement deleted and stock adjusted' })
  } catch (error: any) {
    console.error('Delete stock movement error:', error)
    res.status(500).json({ message: 'Failed to delete stock movement', error: error.message })
  }
}

// Get inventory summary/statistics
export const getInventorySummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalProducts,
      inStockCount,
      lowStockCount,
      outOfStockCount,
      totalStockValue,
      recentMovements,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: 'IN_STOCK' } }),
      prisma.product.count({ where: { status: 'LOW_STOCK' } }),
      prisma.product.count({ where: { status: 'OUT_OF_STOCK' } }),
      prisma.product.aggregate({
        _sum: {
          stock: true,
        },
      }),
      prisma.stockMovement.findMany({
        take: 10,
        orderBy: { movementDate: 'desc' },
        include: {
          product: {
            select: {
              sku: true,
              name: true,
            },
          },
        },
      }),
    ])

    // Calculate total stock value (cost * stock)
    const products = await prisma.product.findMany({
      select: {
        cost: true,
        stock: true,
      },
    })

    const stockValue = products.reduce((sum, p) => sum + p.cost * p.stock, 0)

    res.json({
      success: true,
      data: {
        totalProducts,
        inStockCount,
        lowStockCount,
        outOfStockCount,
        totalStockUnits: totalStockValue._sum.stock || 0,
        totalStockValue: stockValue,
        recentMovements,
      },
    })
  } catch (error: any) {
    console.error('Get inventory summary error:', error)
    res.status(500).json({ message: 'Failed to fetch inventory summary', error: error.message })
  }
}

// Get low stock products
export const getLowStockProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [{ status: 'LOW_STOCK' }, { status: 'OUT_OF_STOCK' }],
      },
      orderBy: [{ status: 'desc' }, { stock: 'asc' }],
    })

    res.json({ success: true, data: products })
  } catch (error: any) {
    console.error('Get low stock products error:', error)
    res.status(500).json({ message: 'Failed to fetch low stock products', error: error.message })
  }
}

// Get stock movements by product
export const getProductStockHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params

    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      res.status(404).json({ message: 'Product not found' })
      return
    }

    const movements = await prisma.stockMovement.findMany({
      where: { productId },
      orderBy: [{ movementDate: 'desc' }, { createdAt: 'desc' }],
    })

    res.json({
      success: true,
      data: {
        product,
        movements,
      },
    })
  } catch (error: any) {
    console.error('Get product stock history error:', error)
    res.status(500).json({
      message: 'Failed to fetch product stock history',
      error: error.message,
    })
  }
}
