import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.js'
import prisma from '../config/database.js'
import { generateSKU } from '../utils/helpers.js'
import { logAudit } from '../utils/logger.js'

export const getAllProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, status, search } = req.query

    const where: any = {}

    if (category) where.category = category
    if (status) where.status = status
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { sku: { contains: search as string, mode: 'insensitive' } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    res.json({ success: true, data: products })
  } catch (error: any) {
    console.error('Get products error:', error)
    res.status(500).json({ message: 'Failed to fetch products' })
  }
}

export const getProductById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        stockMovements: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!product) {
      res.status(404).json({ message: 'Product not found' })
      return
    }

    res.json({ success: true, data: product })
  } catch (error: any) {
    console.error('Get product error:', error)
    res.status(500).json({ message: 'Failed to fetch product' })
  }
}

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, category, description, cost, price, stock, minStock } = req.body

    // Generate SKU
    const productCount = await prisma.product.count()
    const sku = generateSKU(category, productCount)

    // Determine status based on stock
    let status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'IN_STOCK'
    if (stock === 0) status = 'OUT_OF_STOCK'
    else if (stock <= minStock) status = 'LOW_STOCK'

    const product = await prisma.product.create({
      data: {
        sku,
        name,
        category,
        description,
        cost,
        price,
        stock,
        minStock,
        status,
      },
    })

    // Log audit
    if (req.user) {
      await logAudit(
        req.user.id,
        'Product Created',
        `Added product: ${name} (${sku})`,
        req.ip,
        req.get('user-agent')
      )
    }

    res.status(201).json({ success: true, data: product, message: 'Product created successfully' })
  } catch (error: any) {
    console.error('Create product error:', error)
    res.status(500).json({ message: 'Failed to create product' })
  }
}

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { name, category, description, cost, price, stock, minStock } = req.body

    // Determine status based on stock
    let status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | undefined = undefined
    if (stock !== undefined) {
      if (stock === 0) status = 'OUT_OF_STOCK'
      else if (stock <= minStock) status = 'LOW_STOCK'
      else status = 'IN_STOCK'
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        category,
        description,
        cost,
        price,
        stock,
        minStock,
        ...(status && { status }),
      },
    })

    // Log audit
    if (req.user) {
      await logAudit(
        req.user.id,
        'Product Updated',
        `Updated product: ${product.name}`,
        req.ip,
        req.get('user-agent')
      )
    }

    res.json({ success: true, data: product, message: 'Product updated successfully' })
  } catch (error: any) {
    console.error('Update product error:', error)
    res.status(500).json({ message: 'Failed to update product' })
  }
}

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const product = await prisma.product.findUnique({ where: { id } })

    if (!product) {
      res.status(404).json({ message: 'Product not found' })
      return
    }

    await prisma.product.delete({ where: { id } })

    // Log audit
    if (req.user) {
      await logAudit(
        req.user.id,
        'Product Deleted',
        `Deleted product: ${product.name}`,
        req.ip,
        req.get('user-agent')
      )
    }

    res.json({ success: true, message: 'Product deleted successfully' })
  } catch (error: any) {
    console.error('Delete product error:', error)
    res.status(500).json({ message: 'Failed to delete product' })
  }
}
