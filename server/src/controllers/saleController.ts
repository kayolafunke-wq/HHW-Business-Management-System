import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.js'
import prisma from '../config/database.js'
import { generateInvoiceNumber, calculateVAT } from '../utils/helpers.js'
import { logAudit } from '../utils/logger.js'

export const getAllSales = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, paymentMethod, paymentStatus } = req.query

    const where: any = {}

    if (startDate || endDate) {
      where.saleDate = {}
      if (startDate) where.saleDate.gte = new Date(startDate as string)
      if (endDate) where.saleDate.lte = new Date(endDate as string)
    }

    if (paymentMethod) where.paymentMethod = paymentMethod
    if (paymentStatus) where.paymentStatus = paymentStatus

    const sales = await prisma.sale.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { saleDate: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    res.json({ success: true, data: sales })
  } catch (error: any) {
    console.error('Get sales error:', error)
    res.status(500).json({ message: 'Failed to fetch sales', error: error.message })
  }
}

export const getSaleById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!sale) {
      res.status(404).json({ message: 'Sale not found' })
      return
    }

    res.json({ success: true, data: sale })
  } catch (error: any) {
    console.error('Get sale error:', error)
    res.status(500).json({ message: 'Failed to fetch sale', error: error.message })
  }
}

export const createSale = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      customer,
      customerPhone,
      items, // [{ productId, quantity, price }]
      discount = 0,
      paymentMethod,
      paymentStatus = 'PAID',
      cashier,
      notes,
    } = req.body

    // Validate required fields
    if (!customer || !items || items.length === 0 || !paymentMethod) {
      res.status(400).json({ message: 'Missing required fields' })
      return
    }

    // Validate stock availability for all items first
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        res.status(404).json({ message: `Product not found: ${item.productId}` })
        return
      }

      if (product.stock < item.quantity) {
        res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        })
        return
      }
    }

    // Calculate totals
    let subtotal = 0
    const saleItems = []

    for (const item of items) {
      const total = item.price * item.quantity
      subtotal += total

      saleItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total,
      })
    }

    const discountAmount = parseFloat(discount.toString())
    const taxable = subtotal - discountAmount
    const vat = calculateVAT(taxable)
    const total = taxable + vat

    // Generate invoice number
    const salesCount = await prisma.sale.count()
    const year = new Date().getFullYear()
    const invoiceNo = `INV-${year}-${String(salesCount + 1).padStart(6, '0')}`

    // Validate stock availability for all items before creating the sale
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product) {
        res.status(404).json({ success: false, message: `Product not found (ID: ${item.productId})` })
        return
      }
      if (product.stock === 0) {
        res.status(400).json({
          success: false,
          message: `Cannot sell '${product.name}' — it is out of stock (0 available).`
        })
        return
      }
      if (product.stock < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Cannot sell ${item.quantity} units of '${product.name}'. Only ${product.stock} units available in stock.`
        })
        return
      }
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create sale with items
      const sale = await tx.sale.create({
        data: {
          invoiceNo,
          customer,
          customerPhone,
          subtotal,
          discount: discountAmount,
          taxable,
          vat,
          total,
          paymentMethod,
          paymentStatus,
          cashier: cashier || req.user?.email || 'Unknown',
          notes,
          userId: req.user!.id,
          items: {
            create: saleItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      // Update stock and create stock movements for each item
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        })

        if (product) {
          const newStock = product.stock - item.quantity

          // Determine new status
          let newStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'IN_STOCK'
          if (newStock === 0) newStatus = 'OUT_OF_STOCK'
          else if (newStock <= product.minStock) newStatus = 'LOW_STOCK'

          // Update product stock and status
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: newStock,
              status: newStatus,
            },
          })

          // Create stock movement record
          await tx.stockMovement.create({
            data: {
              type: 'OUT',
              quantity: item.quantity,
              reference: invoiceNo,
              reason: 'Sale',
              notes: `Sold to ${customer}`,
              performedBy: cashier || req.user?.name || 'Cashier',
              productId: item.productId,
            },
          })
        }
      }

      return sale
    })

    // Log audit
    if (req.user) {
      await logAudit(
        req.user.id,
        'Sale Created',
        `Created sale ${invoiceNo} for ${customer}, Total: MK ${total}`,
        req.ip,
        req.get('user-agent')
      )
    }

    res.status(201).json({
      success: true,
      data: result,
      message: 'Sale created successfully',
    })
  } catch (error: any) {
    console.error('Create sale error:', error)
    res.status(500).json({ message: 'Failed to create sale', error: error.message })
  }
}

export const updateSale = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { paymentStatus, paymentMethod, notes } = req.body

    const sale = await prisma.sale.findUnique({ where: { id } })

    if (!sale) {
      res.status(404).json({ message: 'Sale not found' })
      return
    }

    const updatedSale = await prisma.sale.update({
      where: { id },
      data: {
        ...(paymentStatus && { paymentStatus }),
        ...(paymentMethod && { paymentMethod }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Log audit
    if (req.user) {
      await logAudit(
        req.user.id,
        'Sale Updated',
        `Updated sale ${updatedSale.invoiceNo}`,
        req.ip,
        req.get('user-agent')
      )
    }

    res.json({ success: true, data: updatedSale, message: 'Sale updated successfully' })
  } catch (error: any) {
    console.error('Update sale error:', error)
    res.status(500).json({ message: 'Failed to update sale', error: error.message })
  }
}

export const deleteSale = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const sale = await prisma.sale.findUnique({
      where: { id },
      include: { items: true },
    })

    if (!sale) {
      res.status(404).json({ message: 'Sale not found' })
      return
    }

    // Restore stock in transaction
    await prisma.$transaction(async (tx) => {
      // Restore stock for each item
      for (const item of sale.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        })

        if (product) {
          const newStock = product.stock + item.quantity

          // Determine new status
          let newStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'IN_STOCK'
          if (newStock === 0) newStatus = 'OUT_OF_STOCK'
          else if (newStock <= product.minStock) newStatus = 'LOW_STOCK'

          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: newStock,
              status: newStatus,
            },
          })

          // Create stock movement for restoration
          await tx.stockMovement.create({
            data: {
              type: 'IN',
              quantity: item.quantity,
              reference: `VOID-${sale.invoiceNo}`,
              reason: 'Sale Voided',
              notes: `Sale deleted: ${sale.invoiceNo}`,
              performedBy: req.user?.name || 'Admin',
              productId: item.productId,
            },
          })
        }
      }

      // Delete sale (cascades to items)
      await tx.sale.delete({ where: { id } })
    })

    // Log audit
    if (req.user) {
      await logAudit(
        req.user.id,
        'Sale Deleted',
        `Deleted sale ${sale.invoiceNo} - Stock restored`,
        req.ip,
        req.get('user-agent')
      )
    }

    res.json({ success: true, message: 'Sale deleted and stock restored' })
  } catch (error: any) {
    console.error('Delete sale error:', error)
    res.status(500).json({ message: 'Failed to delete sale', error: error.message })
  }
}

// Get sales statistics
export const getSalesStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query
    
    const where: any = {}
    if (startDate || endDate) {
      where.saleDate = {}
      if (startDate) where.saleDate.gte = new Date(startDate as string)
      if (endDate) where.saleDate.lte = new Date(endDate as string)
    }

    const [totalSales, totalRevenue, salesByStatus, salesByMethod] = await Promise.all([
      prisma.sale.count({ where }),
      prisma.sale.aggregate({
        where,
        _sum: { total: true },
      }),
      prisma.sale.groupBy({
        by: ['paymentStatus'],
        where,
        _count: true,
        _sum: { total: true },
      }),
      prisma.sale.groupBy({
        by: ['paymentMethod'],
        where,
        _count: true,
        _sum: { total: true },
      }),
    ])

    res.json({
      success: true,
      data: {
        totalSales,
        totalRevenue: totalRevenue._sum.total || 0,
        byStatus: salesByStatus,
        byMethod: salesByMethod,
      },
    })
  } catch (error: any) {
    console.error('Get sales stats error:', error)
    res.status(500).json({ message: 'Failed to fetch sales statistics', error: error.message })
  }
}
