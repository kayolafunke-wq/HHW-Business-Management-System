import { useState } from 'react'
import { Plus, Edit, Search, Package, X } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useApiStore } from '@/store/apiStore'
import toast from 'react-hot-toast'
import { API_BASE_URL } from '@/services/api'

function money(n: number): string {
  return (
    'MK ' +
    Number(n).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  )
}

export default function ProductsList() {
  const { products, addProduct, loadingProducts } = useApiStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: 'ELECTRONICS',
    cost: '',
    price: '',
    stock: '',
    minStock: ''
  })

  console.log('ProductsList render - showAddModal:', showAddModal)

  // Calculate KPIs
  const totalProducts = products.length
  const stockValue = products.reduce((sum, p) => sum + p.cost * p.stock, 0)
  const lowStock = products.filter(p => p.status === 'LOW_STOCK')
  const outOfStock = products.filter(p => p.status === 'OUT_OF_STOCK')

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))]

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleAddProduct = async () => {
    // Validate form
    if (!newProduct.name || !newProduct.sku || !newProduct.cost || !newProduct.price || !newProduct.stock || !newProduct.minStock) {
      toast.error('Please fill all fields')
      return
    }

    const cost = parseFloat(newProduct.cost)
    const price = parseFloat(newProduct.price)
    const stock = parseInt(newProduct.stock)
    const minStock = parseInt(newProduct.minStock)

    if (isNaN(cost) || isNaN(price) || isNaN(stock) || isNaN(minStock)) {
      toast.error('Please enter valid numbers')
      return
    }

    if (cost < 0 || price < 0 || stock < 0 || minStock < 0) {
      toast.error('Numbers cannot be negative')
      return
    }

    try {
      await addProduct({
        sku: newProduct.sku,
        name: newProduct.name,
        category: newProduct.category,
        cost,
        price,
        stock,
        minStock,
      })

      toast.success('Product added successfully')
      setShowAddModal(false)
      setNewProduct({
        name: '',
        sku: '',
        category: 'ELECTRONICS',
        cost: '',
        price: '',
        stock: '',
        minStock: ''
      })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add product')
    }
  }

  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-sub">Manage your product catalogue</p>
        </div>
        <Button onClick={() => {
          console.log('Add Product clicked!')
          setShowAddModal(true)
        }}>
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-4 mb-5">
        <Card className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon bg-[#e8eefd]">
              <Package className="w-4 h-4 text-[#2f5df5]" strokeWidth={2.5} />
            </div>
          </div>
          <div className="kpi-label">Total Products</div>
          <div className="kpi-value">{totalProducts}</div>
        </Card>

        <Card className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon bg-[#efeafb]">
              <svg className="w-4 h-4 text-[#6a4fd6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                <path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>
              </svg>
            </div>
          </div>
          <div className="kpi-label">Stock Value</div>
          <div className="kpi-value">{money(stockValue)}</div>
        </Card>

        <Card className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon bg-[#fbf0dd]">
              <svg className="w-4 h-4 text-[#c97a1a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/>
                <path d="M12 9v4M12 17h.01"/>
              </svg>
            </div>
          </div>
          <div className="kpi-label">Low Stock</div>
          <div className="kpi-value">{lowStock.length}</div>
        </Card>

        <Card className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon bg-[#fbe9e7]">
              <svg className="w-4 h-4 text-[#c2372c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="m15 9-6 6m0-6 6 6"/>
              </svg>
            </div>
          </div>
          <div className="kpi-label">Out of Stock</div>
          <div className="kpi-value">{outOfStock.length}</div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="toolbar">
          <div className="toolbar-left">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search product or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <select
              className="input filter-input"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              className="input filter-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="IN_STOCK">In Stock</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>
          <div className="text-xs text-gray-500">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Products Table */}
        <div>
          {loadingProducts ? (
            <div className="empty-state">
              <div className="text-sm font-semibold text-gray-700 mb-1">Loading products...</div>
            </div>
          ) : (
            <>
              {/* Mobile Connected Box Cards View - No Horizontal Scroll Needed */}
              <div className="md:hidden space-y-3 mb-4">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-900 truncate">
                        {product.name}
                      </span>
                      <Badge
                        variant={
                          product.status === 'IN_STOCK'
                            ? 'green'
                            : product.status === 'LOW_STOCK'
                            ? 'amber'
                            : 'red'
                        }
                      >
                        {product.status === 'IN_STOCK' ? 'In Stock' : product.status === 'LOW_STOCK' ? 'Low Stock' : 'Out of Stock'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs py-2.5 border-y border-gray-100 my-1">
                      <div>
                        <span className="text-gray-400 block text-[10px]">SKU</span>
                        <span className="font-mono text-gray-700 text-xs font-semibold">{product.sku}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Category</span>
                        <span className="text-gray-700">{product.category}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Current Stock</span>
                        <span className="font-bold text-gray-900">{product.stock} units</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Cost / Unit</span>
                        <span className="text-gray-600">{money(product.cost)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-[10px] text-gray-400 block">Selling Price</span>
                        <span className="text-base font-bold text-blue-600">{money(product.price)}</span>
                      </div>
                      <button 
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        onClick={() => {
                          setEditingProduct(product)
                          setShowEditModal(true)
                        }}
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Cost</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Min</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="cell-sub">{product.sku}</div>
                        </td>
                        <td>
                          <div className="cell-strong">{product.name}</div>
                        </td>
                        <td>
                          <div className="text-gray-700">{product.category}</div>
                        </td>
                        <td>
                          <div className="text-gray-700">{money(product.cost)}</div>
                        </td>
                        <td>
                          <div className="cell-strong">{money(product.price)}</div>
                        </td>
                        <td>
                          <div className="text-gray-900 font-semibold">{product.stock}</div>
                        </td>
                        <td>
                          <div className="text-gray-500">{product.minStock}</div>
                        </td>
                        <td>
                          <Badge
                            variant={
                              product.status === 'IN_STOCK'
                                ? 'green'
                                : product.status === 'LOW_STOCK'
                                ? 'amber'
                                : 'red'
                            }
                          >
                            {product.status === 'IN_STOCK' ? 'In Stock' : product.status === 'LOW_STOCK' ? 'Low Stock' : 'Out of Stock'}
                          </Badge>
                        </td>
                        <td>
                          <button 
                            className="btn btn-ghost btn-sm"
                            onClick={() => {
                              setEditingProduct(product)
                              setShowEditModal(true)
                            }}
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <Package className="w-10 h-10 text-gray-400 mb-3" />
            <div className="text-sm font-semibold text-gray-700 mb-1">No products found</div>
            <div className="text-xs text-gray-500">Try adjusting your search or filters</div>
          </div>
        )}
      </Card>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2 className="modal-title">Add New Product</h2>
              <button onClick={() => setShowAddModal(false)} className="icon-btn">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>
                    Product Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter product name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>
                    SKU *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., SKU-ELE-001"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>
                    Category *
                  </label>
                  <select
                    className="input"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    <option value="ELECTRONICS">Electronics</option>
                    <option value="GROCERIES">Groceries</option>
                    <option value="BEVERAGES">Beverages</option>
                    <option value="STATIONERY">Stationery</option>
                    <option value="HOUSEHOLD">Household</option>
                    <option value="CLOTHING">Clothing</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>
                    Cost Price (MK) *
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newProduct.cost}
                    onChange={(e) => setNewProduct({...newProduct, cost: e.target.value})}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>
                    Selling Price (MK) *
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>
                    Initial Stock *
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>
                    Minimum Stock Alert *
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newProduct.minStock}
                    onChange={(e) => setNewProduct({...newProduct, minStock: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="modal-foot">
              <Button variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2 className="modal-title">Edit Product</h2>
              <button onClick={() => setShowEditModal(false)} className="icon-btn">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>
                    Product Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Samsung TV"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>
                    SKU *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. ELEC-001"
                    value={editingProduct.sku}
                    disabled
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>
                    Category *
                  </label>
                  <select
                    className="input w-full"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                  >
                    <option value="ELECTRONICS">Electronics</option>
                    <option value="GROCERIES">Groceries</option>
                    <option value="BEVERAGES">Beverages</option>
                    <option value="STATIONERY">Stationery</option>
                    <option value="HOUSEHOLD">Household</option>
                    <option value="CLOTHING">Clothing</option>
                    <option value="HARDWARE">Hardware</option>
                    <option value="BUILDING_MATERIALS">Building Materials</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>
                    Cost Price (MK) *
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={editingProduct.cost}
                    onChange={(e) => setEditingProduct({...editingProduct, cost: parseFloat(e.target.value)})}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>
                    Selling Price (MK) *
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>
                    Current Stock *
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>
                    Minimum Stock Alert *
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={editingProduct.minStock}
                    onChange={(e) => setEditingProduct({...editingProduct, minStock: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <div className="modal-foot">
              <Button variant="ghost" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={async () => {
                try {
                  const token = localStorage.getItem('token')
                  const response = await fetch(`${API_BASE_URL}/products/${editingProduct.id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                      name: editingProduct.name,
                      category: editingProduct.category,
                      cost: editingProduct.cost,
                      price: editingProduct.price,
                      stock: editingProduct.stock,
                      minStock: editingProduct.minStock
                    })
                  })
                  const result = await response.json()
                  if (result.success) {
                    toast.success('Product updated successfully')
                    setShowEditModal(false)
                    window.location.reload()
                  } else {
                    toast.error(result.message || 'Failed to update product')
                  }
                } catch (error) {
                  toast.error('Failed to update product')
                }
              }}>
                <Edit className="w-4 h-4" />
                Update Product
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
