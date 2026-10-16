import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { Pagination, usePagination } from '@/components/ui/Pagination'
import { UserPlus, X } from 'lucide-react'

interface User {
  id: string
  name: string
  username: string
  role: 'Administrator' | 'Sales User' | 'Inventory User' | 'HR User'
  status: 'Active' | 'Inactive'
  lastLogin: string
}

const SAMPLE_USERS: User[] = [
  {
    id: '1',
    name: 'Chikondi Mvula',
    username: '@admin',
    role: 'Administrator',
    status: 'Active',
    lastLogin: '2026-10-10 10:22',
  },
  {
    id: '2',
    name: 'Grace Mwale',
    username: '@grace.sales',
    role: 'Sales User',
    status: 'Active',
    lastLogin: '2026-10-10 07:55',
  },
  {
    id: '3',
    name: 'Bright Kamanga',
    username: '@bright.sales',
    role: 'Sales User',
    status: 'Active',
    lastLogin: '2026-10-09 09:20',
  },
  {
    id: '4',
    name: 'Steven Mbewe',
    username: '@steven.inv',
    role: 'Inventory User',
    status: 'Active',
    lastLogin: '2026-10-10 08:40',
  },
  {
    id: '5',
    name: 'Faith Nyasulu',
    username: '@faith.hr',
    role: 'HR User',
    status: 'Active',
    lastLogin: '2026-10-08 10:05',
  },
  {
    id: '6',
    name: 'Moses Kachale',
    username: '@moses.inv',
    role: 'Inventory User',
    status: 'Inactive',
    lastLogin: '2026-09-26 16:33',
  },
]

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
function CreateUserModal({ onClose, onSave }: { onClose: () => void; onSave: (user: Omit<User, 'id' | 'lastLogin'>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    role: 'Administrator' as 'Administrator' | 'Sales User' | 'Inventory User' | 'HR User',
  })

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Please enter full name')
      return
    }
    if (!formData.username.trim()) {
      alert('Please enter username')
      return
    }

    onSave({
      name: formData.name,
      username: formData.username,
      role: formData.role,
      status: 'Active',
    })
    onClose()
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

            {/* Username and Role - 2 columns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Username</label>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="@username"
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
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create User
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(SAMPLE_USERS)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Pagination
  const { currentPage, totalPages, paginatedItems, setCurrentPage, totalItems, itemsPerPage } = usePagination(users, 10)

  const handleCreateUser = (userData: Omit<User, 'id' | 'lastLogin'>) => {
    const newUser: User = {
      ...userData,
      id: String(users.length + 1),
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
    }
    setUsers([...users, newUser])
    alert('User created successfully!')
  }

  const handleDeactivate = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'Inactive' as const } : user
    ))
  }

  const handleActivate = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'Active' as const } : user
    ))
  }

  const handleResetPassword = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      alert(`Password reset link sent to ${user.name}`)
    }
  }

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
        <div className="overflow-x-auto">
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
    </div>
  )
}
