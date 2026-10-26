import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.js'
import prisma from '../config/database.js'
import { generateSKU, generateBarcode } from '../utils/helpers.js'
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
        { barcode: { contains: search as string, mode: 'insensitive' } },
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
    const { sku, barcode, name, category, description, cost, price, stock, minStock } = req.body

    // Validate required fields
    if (!name || !category || cost === undefined || price === undefined || stock === undefined || minStock === undefined) {
      res.status(400).json({ success: false, message: 'Missing required fields' })
      return
    }

    // ── Check if Product already exists (by SKU, Barcode, or Name) ────────────
    let existingProduct = null

    if (sku && sku.trim()) {
      existingProduct = await prisma.product.findUnique({ where: { sku: sku.trim() } })
    }

    if (!existingProduct && barcode && barcode.trim()) {
      existingProduct = await prisma.product.findUnique({ where: { barcode: barcode.trim() } })
    }

    if (!existingProduct && name && name.trim()) {
      existingProduct = await prisma.product.findFirst({
        where: { name: { equals: name.trim(), mode: 'insensitive' } }
      })
    }

    // IF PRODUCT EXISTS -> RESTOCK IT (Add to existing stock instead of duplicating!)
    if (existingProduct) {
      const addedQty = parseInt(stock) || 0
      const oldStock = existingProduct.stock
      const newStock = oldStock + addedQty

      let newStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'IN_STOCK'
      if (newStock === 0) newStatus = 'OUT_OF_STOCK'
      else if (newStock <= existingProduct.minStock) newStatus = 'LOW_STOCK'

      // Optionally update price/cost if provided
      const updateData: any = {
        stock: newStock,
        status: newStatus,
      }
      if (cost !== undefined && parseFloat(cost) > 0) updateData.cost = parseFloat(cost)
      if (price !== undefined && parseFloat(price) > 0) updateData.price = parseFloat(price)
      if (barcode && barcode.trim() && !existingProduct.barcode) updateData.barcode = barcode.trim()

      const updated = await prisma.product.update({
        where: { id: existingProduct.id },
        data: updateData,
      })

      // Record restock movement if addedQty > 0
      if (addedQty > 0) {
        const actorName = req.user?.name || req.user?.email || 'Admin'
        const roleSuffix = req.user?.role === 'ADMINISTRATOR' ? ' (Admin)' : (req.user?.role ? ` (${req.user.role})` : '')
        await prisma.stockMovement.create({
          data: {
            productId: existingProduct.id,
            type: 'IN',
            quantity: addedQty,
            reference: `RESTOCK-${existingProduct.sku}`,
            reason: 'Restock / Product Add',
            notes: `Added ${addedQty} units to existing stock (${oldStock} → ${newStock})`,
            performedBy: `${actorName}${roleSuffix}`,
          },
        })
      }

      // Log audit
      if (req.user) {
        await logAudit(
          req.user.id,
          'Product Restocked',
          `Restocked existing product: ${existingProduct.name} (+${addedQty} units, stock: ${oldStock} → ${newStock})`,
          req.ip,
          req.get('user-agent')
        )
      }

      res.status(200).json({
        success: true,
        isRestock: true,
        data: updated,
        message: `Found existing '${existingProduct.name}'! Added ${addedQty} units to stock (${oldStock} → ${newStock}).`,
      })
      return
    }

    // Use provided SKU or generate one
    let productSku = sku ? sku.trim() : ''
    if (!productSku) {
      const productCount = await prisma.product.count()
      productSku = generateSKU(category, productCount + 1)
    }

    // Barcode: if provided, use it; otherwise AUTO-GENERATE a unique standard EAN-13 barcode
    let productBarcode = barcode ? barcode.trim() : ''
    if (!productBarcode) {
      // Auto-generate unique barcode
      let unique = false
      let attempts = 0
      while (!unique && attempts < 10) {
        const candidate = generateBarcode()
        const found = await prisma.product.findUnique({ where: { barcode: candidate } })
        if (!found) {
          productBarcode = candidate
          unique = true
        }
        attempts++
      }
    }

    // Determine status based on stock
    let status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'IN_STOCK'
    if (stock === 0) status = 'OUT_OF_STOCK'
    else if (stock <= minStock) status = 'LOW_STOCK'

    const product = await prisma.product.create({
      data: {
        sku: productSku,
        barcode: productBarcode || null,
        name: name.trim(),
        category,
        description,
        cost: parseFloat(cost),
        price: parseFloat(price),
        stock: parseInt(stock),
        minStock: parseInt(minStock),
        status,
      },
    })

    // Record initial stock movement if stock > 0
    if (parseInt(stock) > 0) {
      const actorName = req.user?.name || req.user?.email || 'Admin'
      const roleSuffix = req.user?.role === 'ADMINISTRATOR' ? ' (Admin)' : (req.user?.role ? ` (${req.user.role})` : '')
      await prisma.stockMovement.create({
        data: {
          productId: product.id,
          type: 'IN',
          quantity: parseInt(stock),
          reference: `INIT-${productSku}`,
          reason: 'Initial stock',
          notes: `Added initial stock of ${stock} units`,
          performedBy: `${actorName}${roleSuffix}`,
        },
      })
    }

    // Log audit
    if (req.user) {
      await logAudit(
        req.user.id,
        'Product Created',
        `Added product: ${name} (SKU: ${productSku}, Barcode: ${productBarcode || 'N/A'})`,
        req.ip,
        req.get('user-agent')
      )
    }

    res.status(201).json({ success: true, data: product, message: 'Product created successfully' })
  } catch (error: any) {
    console.error('Create product error:', error)
    res.status(500).json({ success: false, message: 'Failed to create product', error: error.message })
  }
}

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { name, category, description, cost, price, stock, minStock, sku, barcode } = req.body

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({ where: { id } })
    if (!existingProduct) {
      res.status(404).json({ success: false, message: 'Product not found' })
      return
    }

    const oldStock = existingProduct.stock

    // Prepare update data
    const updateData: any = {}
    if (name !== undefined) updateData.name = name.trim()
    if (category !== undefined) updateData.category = category
    if (description !== undefined) updateData.description = description
    if (cost !== undefined) updateData.cost = parseFloat(cost)
    if (price !== undefined) updateData.price = parseFloat(price)
    if (stock !== undefined) updateData.stock = parseInt(stock)
    if (minStock !== undefined) updateData.minStock = parseInt(minStock)

    if (sku !== undefined && sku.trim() !== '') {
      const trimmedSku = sku.trim()
      if (trimmedSku !== existingProduct.sku) {
        const skuConflict = await prisma.product.findUnique({ where: { sku: trimmedSku } })
        if (skuConflict && skuConflict.id !== id) {
          res.status(400).json({ success: false, message: `SKU '${trimmedSku}' already belongs to another product` })
          return
        }
      }
      updateData.sku = trimmedSku
    }

    if (barcode !== undefined) {
      const trimmedBarcode = barcode ? barcode.trim() : null
      if (trimmedBarcode && trimmedBarcode !== existingProduct.barcode) {
        const barcodeConflict = await prisma.product.findUnique({ where: { barcode: trimmedBarcode } })
        if (barcodeConflict && barcodeConflict.id !== id) {
          res.status(400).json({ success: false, message: `Barcode '${trimmedBarcode}' already belongs to '${barcodeConflict.name}'` })
          return
        }
      }
      updateData.barcode = trimmedBarcode
    }

    // Determine status based on stock
    if (stock !== undefined || minStock !== undefined) {
      const finalStock = stock !== undefined ? parseInt(stock) : existingProduct.stock
      const finalMinStock = minStock !== undefined ? parseInt(minStock) : existingProduct.minStock
      
      if (finalStock === 0) updateData.status = 'OUT_OF_STOCK'
      else if (finalStock <= finalMinStock) updateData.status = 'LOW_STOCK'
      else updateData.status = 'IN_STOCK'
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    })

    // ── Stock Movement Tracking ──────────────────────────────────────────────
    // If stock quantity changed, record a movement with who did it
    if (stock !== undefined) {
      const newStock = parseInt(stock)
      const diff = newStock - oldStock

      if (diff !== 0) {
        const actorName = req.user?.name || req.user?.email || 'Admin'
        const roleSuffix = req.user?.role === 'ADMINISTRATOR' ? ' (Admin)' : (req.user?.role ? ` (${req.user.role})` : '')
        const performedBy = `${actorName}${roleSuffix}`
        const movementType = diff > 0 ? 'IN' : 'OUT'
        const absDiff = Math.abs(diff)

        await prisma.stockMovement.create({
          data: {
            productId: id,
            type: movementType as any,
            quantity: absDiff,
            reference: `ADJ-${existingProduct.sku}`,
            reason: 'Manual adjustment',
            notes: `Stock changed from ${oldStock} to ${newStock} (${diff > 0 ? '+' : ''}${diff})`,
            performedBy,
          },
        })
      }
    }
    // ────────────────────────────────────────────────────────────────────────

    // Log audit
    if (req.user) {
      const stockNote = stock !== undefined && parseInt(stock) !== oldStock
        ? ` | Stock: ${oldStock} → ${parseInt(stock)}`
        : ''
      await logAudit(
        req.user.id,
        'Product Updated',
        `Updated product: ${product.name}${stockNote}`,
        req.ip,
        req.get('user-agent')
      )
    }

    res.json({ success: true, data: product, message: 'Product updated successfully' })
  } catch (error: any) {
    console.error('Update product error:', error)
    res.status(500).json({ success: false, message: 'Failed to update product', error: error.message })
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
