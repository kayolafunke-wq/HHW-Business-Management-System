import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { Pagination, usePagination } from '@/components/ui/Pagination'
import { UserPlus, X } from 'lucide-react'
import { createSecondaryFirebaseUser } from '@/config/firebase'
import toast from 'react-hot-toast'
import { API_BASE_URL } from '@/services/api'

interface User {
  id: string
  name: string
  username: string
  role: 'Administrator' | 'Sales User' | 'Inventory User' | 'HR User' | 'Accountant'
  status: 'Active' | 'Inactive'
  lastLogin: string
}

function getInitials(name: string): string {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return parts[0][0] + parts[1][0]
  }
  return parts[0][0] + parts[0][1]
}

function getRoleBadgeVariant(role: string): 'info' | 'success' | 'warning' | 'default' {
  switch (role) {
    case 'Administrator':
      return 'info'
    case 'Sales User':
      return 'info'
    case 'Inventory User':
      return 'info'
    case 'HR User':
      return 'info'
    default:
      return 'default'
  }
}

// Create User Modal
function CreateUserModal({ 
  onClose, 
  onSave 
}: { 
  onClose: () => void; 
  onSave: (userData: { name: string; email: string; password: string; role: string }) => Promise<boolean> | boolean
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Sales User' as 'Administrator' | 'Sales User' | 'Inventory User' | 'HR User' | 'Accountant',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter full name')
      return
    }
    if (!formData.email.trim()) {
      toast.error('Please enter email')
      return
    }
    if (!formData.password.trim() || formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const success = await onSave({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      })
      if (success) {
        onClose()
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">Create User</div>
          <button onClick={onClose} className="icon-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="modal-body">
          <div className="space-y-4">
            {/* Full Name */}
            <div className="field">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Full Name</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>

            {/* Email */}
            <div className="field">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@hhw.com"
              />
            </div>

            {/* Password and Role - 2 columns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Password</label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 6 characters"
                />
              </div>

              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Role</label>
                <select
                  className="input w-full"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Sales User">Sales User</option>
                  <option value="Inventory User">Inventory User</option>
                  <option value="HR User">HR User</option>
                  <option value="Accountant">Accountant</option>
                </select>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              User will receive login credentials at the provided email.
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create User'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Reset Password Modal
function ResetPasswordModal({ 
  user, 
  onClose, 
  onConfirm 
}: { 
  user: User; 
  onClose: () => void; 
  onConfirm: (password: string) => void 
}) {
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const generatePassword = () => {
    // Generate a random password: 8 characters with letters and numbers
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let password = ''
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setNewPassword(password)
  }

  const handleSubmit = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await onConfirm(newPassword)
      onClose()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">Reset Password</div>
          <button onClick={onClose} className="icon-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="modal-body">
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Reset password for <strong>{user.name}</strong> ({user.username})
            </div>

            <div className="field">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">New Password</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 chars)"
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={generatePassword}
                  type="button"
                >
                  Generate
                </Button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
              <strong>Important:</strong> Copy this password and give it to the user. They should change it after first login.
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch users on mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Convert database format to UI format
        const formattedUsers = result.data.map((user: any) => ({
          id: user.id,
          name: user.name,
          username: user.username || user.email,
          role: formatRole(user.role),
          status: user.status === 'ACTIVE' ? 'Active' : 'Inactive',
          lastLogin: user.lastLogin ? new Date(user.lastLogin).toISOString().replace('T', ' ').substring(0, 16) : 'Never'
        }))
        setUsers(formattedUsers)
      } else {
        toast.error('Failed to load users')
      }
    } catch (error) {
      console.error('Fetch users error:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  // Convert database role format (SALES_USER) to UI format (Sales User)
  const formatRole = (role: string): User['role'] => {
    const roleMap: Record<string, User['role']> = {
      'ADMINISTRATOR': 'Administrator',
      'SALES_USER': 'Sales User',
      'INVENTORY_USER': 'Inventory User',
      'HR_USER': 'HR User',
      'ACCOUNTANT': 'Accountant'
    }
    return roleMap[role] || role as User['role']
  }

  // Pagination
  const { currentPage, totalPages, paginatedItems, setCurrentPage, totalItems, itemsPerPage } = usePagination(users, 10)

  const handleCreateUser = async (userData: { name: string; email: string; password: string; role: string }): Promise<boolean> => {
    try {
      // 1. Create Firebase user using isolated secondary app so administrator session is NEVER disturbed
      let firebaseUid: string | undefined
      try {
        firebaseUid = await createSecondaryFirebaseUser(userData.email.trim(), userData.password)
      } catch (fbError: any) {
        if (fbError.code === 'auth/email-already-in-use') {
          toast.error('An account with this email already exists in Firebase Authentication.')
          return false
        } else if (fbError.code === 'auth/invalid-email') {
          toast.error('Invalid email address format.')
          return false
        } else if (fbError.code === 'auth/weak-password') {
          toast.error('Password must be at least 6 characters.')
          return false
        }
        console.warn('Firebase secondary user creation warning:', fbError)
      }

      // 2. Register user in database using current admin session token
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: userData.name.trim(),
          email: userData.email.trim().toLowerCase(),
          password: userData.password,
          firebaseUid,
          role: userData.role.replace(/ /g, '_').toUpperCase() // Convert to DB format (e.g., SALES_USER)
        })
      })

      const result = await response.json()

      if (response.ok && (result.success !== false)) {
        toast.success(`User ${userData.name} created successfully!`)
        // Refresh the users list
        await fetchUsers()
        return true
      } else {
        toast.error(result.message || 'Failed to create user in database')
        return false
      }
    } catch (error: any) {
      console.error('Create user error:', error)
      toast.error(error.message || 'Failed to create user')
      return false
    }
  }

  const handleDeactivate = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'INACTIVE' })
      })

      if (response.ok) {
        toast.success('User deactivated successfully')
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: 'Inactive' as const } : user
        ))
      } else {
        toast.error('Failed to deactivate user')
      }
    } catch (err) {
      toast.error('Failed to deactivate user')
    }
  }

  const handleActivate = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'ACTIVE' })
      })

      if (response.ok) {
        toast.success('User activated successfully')
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: 'Active' as const } : user
        ))
      } else {
        toast.error('Failed to activate user')
      }
    } catch (err) {
      toast.error('Failed to activate user')
    }
  }

  const handleResetPassword = async (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setSelectedUser(user)
      setShowResetPasswordModal(true)
    }
  }

  const confirmResetPassword = async (newPassword: string) => {
    if (!selectedUser) return

    try {
      // Get the user's email - we need to find it from the current user list
      // since we already have the user object with all needed info
      const userEmail = selectedUser.username.includes('@') 
        ? selectedUser.username 
        : `${selectedUser.username.replace('@', '')}@hhw.com`
      
      // Update password in Firebase using Admin SDK through backend
      const resetResponse = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          email: userEmail,
          newPassword
        })
      })

      const resetResult = await resetResponse.json()

      if (resetResponse.ok && resetResult.success) {
        if (resetResult.data.requiresManualUpdate) {
          // Firebase Admin not configured - manual update needed
          toast.error(
            `⚠️ Manual update required!\n\nPassword for ${selectedUser.name}:\n${newPassword}\n\nGo to Firebase Console → Authentication → Users → ${selectedUser.name} → Reset password → Set to: ${newPassword}`,
            { duration: 15000 }
          )
        } else {
          // Password updated successfully
          toast.success(
            `✅ Password reset for ${selectedUser.name}!\n\nNew password: ${newPassword}\n\n(Give this password to the user)`,
            { duration: 10000 }
          )
        }
      } else {
        toast.error(resetResult.message || 'Failed to reset password')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('Failed to reset password')
    }
  }

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)

  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-sub">Control access to HHW Business Manager</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <UserPlus className="w-4 h-4" />
          Create User
        </Button>
      </div>

      <Card>
        {/* Mobile Connected Box Cards View - No Horizontal Scroll Needed */}
        <div className="md:hidden space-y-3 p-4">
          {paginatedItems.map((user) => (
            <div 
              key={user.id}
              className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-blue-200 transition-colors"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div 
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                    style={{ background: '#2f5df5' }}
                  >
                    {getInitials(user.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{user.name}</div>
                    <div className="text-[11px] text-gray-500 truncate">{user.username}</div>
                  </div>
                </div>
                <Badge variant={user.status === 'Active' ? 'success' : 'default'}>
                  {user.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-2.5 border-y border-gray-100 my-1">
                <div>
                  <span className="text-gray-400 block text-[10px]">System Role</span>
                  <div className="mt-0.5">
                    <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Last Login</span>
                  <span className="text-gray-600 mt-0.5 block">{user.lastLogin}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                {user.status === 'Active' ? (
                  <button
                    className="px-2.5 py-1.5 bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-gray-200"
                    onClick={() => handleDeactivate(user.id)}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M4.93 4.93l14.14 14.14"/>
                    </svg>
                    Deactivate
                  </button>
                ) : (
                  <button
                    className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-emerald-200"
                    onClick={() => handleActivate(user.id)}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <path d="m22 4-10 10-3-3"/>
                    </svg>
                    Activate
                  </button>
                )}
                <button
                  className="px-2.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  onClick={() => handleResetPassword(user.id)}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-3-6.7"/>
                    <path d="M21 3v6h-6"/>
                  </svg>
                  Reset Password
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0"
                        style={{ background: '#2f5df5' }}
                      >
                        {getInitials(user.name)}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-700">{user.username}</div>
                  </td>
                  <td>
                    <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                  </td>
                  <td>
                    <Badge variant={user.status === 'Active' ? 'success' : 'default'}>
                      {user.status}
                    </Badge>
                  </td>
                  <td>
                    <div className="text-sm text-gray-700">{user.lastLogin}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {user.status === 'Active' ? (
                        <button
                          className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
                          onClick={() => handleDeactivate(user.id)}
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M4.93 4.93l14.14 14.14"/>
                          </svg>
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="text-xs text-[#0ea885] hover:text-[#0d9575] flex items-center gap-1 font-medium"
                          onClick={() => handleActivate(user.id)}
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <path d="m22 4-10 10-3-3"/>
                          </svg>
                          Activate
                        </button>
                      )}
                      <button
                        className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
                        onClick={() => handleResetPassword(user.id)}
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12a9 9 0 1 1-3-6.7"/>
                          <path d="M21 3v6h-6"/>
                        </svg>
                        Reset Password
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      </Card>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateUser}
        />
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && selectedUser && (
        <ResetPasswordModal
          user={selectedUser}
          onClose={() => {
            setShowResetPasswordModal(false)
            setSelectedUser(null)
          }}
          onConfirm={confirmResetPassword}
        />
      )}
    </div>
  )
}
