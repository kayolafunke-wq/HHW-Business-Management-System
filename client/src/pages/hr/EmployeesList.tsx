import { useState, useEffect } from 'react'
import { Search, X, UserPlus, Eye } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Pagination, usePagination } from '@/components/ui/Pagination'
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

function fmtDateShort(dstr: string): string {
  const d = new Date(dstr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getInitials(name: string): string {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return parts[0][0] + parts[1][0]
  }
  return parts[0][0] + parts[0][1]
}

interface Employee {
  id: string
  empId: string
  name: string
  position: string
  department: string
  dateEmployed: string
  status: 'Active' | 'On Leave' | 'Inactive'
  attendance: number
  phone: string
  email: string
  salary: number
  address: string
  emergencyContact: string
}

// Employee Registration Modal
function EmployeeRegistrationModal({ onClose, onSave }: { onClose: () => void; onSave: (employee: Omit<Employee, 'id' | 'attendance'>) => Promise<void> }) {
  const [formData, setFormData] = useState({
    empId: `EMP-${107 + Math.floor(Math.random() * 100)}`,
    name: '',
    position: '',
    department: 'Sales',
    dateEmployed: new Date().toISOString().split('T')[0],
    phone: '',
    email: '',
    salary: '',
    address: '',
    emergencyContact: '',
    status: 'Active' as 'Active' | 'On Leave' | 'Inactive',
  })

  const departments = ['Sales', 'Inventory', 'Finance', 'HR', 'Operations']

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name.trim()) {
      alert('Please enter full name')
      return
    }
    if (!formData.phone.trim()) {
      alert('Please enter phone number')
      return
    }
    if (!formData.email.trim()) {
      alert('Please enter email')
      return
    }
    if (!formData.position.trim()) {
      alert('Please enter position')
      return
    }
    if (!formData.salary) {
      alert('Please enter salary')
      return
    }

    try {
      await onSave({
        empId: formData.empId,
        name: formData.name,
        position: formData.position,
        department: formData.department,
        dateEmployed: formData.dateEmployed,
        phone: formData.phone,
        email: formData.email,
        salary: Number(formData.salary),
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        status: formData.status,
      })
      onClose()
    } catch (error) {
      console.error('Registration error:', error)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="modal-title">Employee Registration</div>
            <div className="text-xs text-gray-500 mt-0.5">Register a new employee</div>
          </div>
          <button onClick={onClose} className="icon-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="modal-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {/* Full Name */}
            <div className="field min-w-0">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Full Name</label>
              <Input
                type="text"
                placeholder="e.g. Chisomo Banda"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Employee ID */}
            <div className="field min-w-0">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Employee ID</label>
              <Input
                type="text"
                value={formData.empId}
                onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
              />
            </div>

            {/* Phone Number */}
            <div className="field min-w-0">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Phone Number</label>
              <Input
                type="text"
                placeholder="+265 88 000 0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {/* Email */}
            <div className="field min-w-0">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Email</label>
              <Input
                type="email"
                placeholder="name@fusionbiz.mw"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Position */}
            <div className="field min-w-0">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Position</label>
              <Input
                type="text"
                placeholder="e.g. Sales Associate"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </div>

            {/* Department */}
            <div className="field min-w-0">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Department</label>
              <select
                className="input w-full"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Employed */}
            <div className="field min-w-0">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Date Employed</label>
              <Input
                type="date"
                value={formData.dateEmployed}
                onChange={(e) => setFormData({ ...formData, dateEmployed: e.target.value })}
              />
            </div>

            {/* Salary */}
            <div className="field min-w-0">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Salary (MK)</label>
              <Input
                type="number"
                placeholder="e.g. 220000"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              />
            </div>

            {/* Address */}
            <div className="field min-w-0 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Address</label>
              <Input
                type="text"
                placeholder="e.g. Area 25, Blantyre"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            {/* Emergency Contact */}
            <div className="field min-w-0">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Emergency Contact</label>
              <Input
                type="text"
                placeholder="+265 99 000 0000"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              />
            </div>

            {/* Status */}
            <div className="field min-w-0">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Status</label>
              <select
                className="input w-full"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'On Leave' | 'Inactive' })}
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Register Employee
          </Button>
        </div>
      </div>
    </div>
  )
}

// Employee Profile Modal
function EmployeeProfileModal({ employee, onClose }: { employee: Employee; onClose: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">Employee Profile</div>
          <button onClick={onClose} className="icon-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="modal-body">
          {/* Header with avatar, name, and status badge */}
          <div className="flex items-center gap-3.5 p-3.5 bg-gray-50 rounded-xl mb-4 border border-gray-100">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #2f5df5, #6a4fd6)' }}
            >
              {getInitials(employee.name)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-base text-gray-900 truncate">{employee.name}</div>
              <div className="text-xs text-gray-500 mt-0.5 truncate">{employee.position} · {employee.department}</div>
            </div>
            <Badge variant={employee.status === 'Active' ? 'success' : employee.status === 'On Leave' ? 'warning' : 'danger'}>
              {employee.status}
            </Badge>
          </div>

          {/* Details list - single column on mobile, 2 columns on tablet/desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8">
            {/* Employee ID */}
            <div className="flex items-center justify-between gap-3 py-2.5 border-b border-gray-100 sm:pr-4">
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Employee ID</span>
              <span className="text-xs sm:text-[13px] font-semibold text-gray-900">{employee.empId}</span>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between gap-3 py-2.5 border-b border-gray-100 sm:pl-4">
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Phone</span>
              <span className="text-xs sm:text-[13px] font-semibold text-gray-900">{employee.phone}</span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between gap-3 py-2.5 border-b border-gray-100 sm:pr-4">
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Email</span>
              <span className="text-xs sm:text-[13px] font-semibold text-gray-900 break-all text-right">{employee.email}</span>
            </div>

            {/* Emergency Contact */}
            <div className="flex items-center justify-between gap-3 py-2.5 border-b border-gray-100 sm:pl-4">
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Emergency Contact</span>
              <span className="text-xs sm:text-[13px] font-semibold text-gray-900 text-right">{employee.emergencyContact || 'N/A'}</span>
            </div>

            {/* Date Employed */}
            <div className="flex items-center justify-between gap-3 py-2.5 border-b border-gray-100 sm:pr-4">
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Date Employed</span>
              <span className="text-xs sm:text-[13px] font-semibold text-gray-900">{fmtDateShort(employee.dateEmployed)}</span>
            </div>

            {/* Salary */}
            <div className="flex items-center justify-between gap-3 py-2.5 border-b border-gray-100 sm:pl-4">
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Salary</span>
              <span className="text-xs sm:text-[13px] font-semibold text-gray-900">{money(employee.salary)}</span>
            </div>

            {/* Address */}
            <div className="flex items-center justify-between gap-3 py-2.5 border-b border-gray-100 sm:pr-4">
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Address</span>
              <span className="text-xs sm:text-[13px] font-semibold text-gray-900 text-right">{employee.address || 'N/A'}</span>
            </div>

            {/* Attendance */}
            <div className="flex items-center justify-between gap-3 py-2.5 border-b border-gray-100 sm:border-b-0 sm:pl-4">
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Attendance</span>
              <span className="text-xs sm:text-[13px] font-semibold text-gray-900">{employee.attendance}%</span>
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function EmployeesList() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('All')

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await response.json()
      if (result.success) {
        // Map backend data to frontend format
        const mappedEmployees = result.data.map((emp: any) => ({
          id: emp.id,
          empId: emp.employeeId,
          name: emp.name,
          position: emp.position,
          department: emp.department,
          dateEmployed: emp.dateEmployed.split('T')[0], // Convert ISO to YYYY-MM-DD
          status: emp.status === 'ACTIVE' ? 'Active' : emp.status === 'ON_LEAVE' ? 'On Leave' : 'Inactive',
          attendance: 0, // No attendance tracking yet
          phone: emp.phone,
          email: emp.email,
          salary: emp.salary,
          address: emp.address || '',
          emergencyContact: emp.emergencyContact || ''
        }))
        setEmployees(mappedEmployees)
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error)
    } finally {
      setLoading(false)
    }
  }
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  // Handle employee registration
  const handleRegisterEmployee = async (employeeData: Omit<Employee, 'id' | 'attendance'>) => {
    console.log('Registering employee:', employeeData)
    try {
      const token = localStorage.getItem('token')
      
      // Prepare data for backend (remove empId, convert status to uppercase)
      const backendData = {
        name: employeeData.name,
        email: employeeData.email,
        phone: employeeData.phone,
        position: employeeData.position,
        department: employeeData.department,
        salary: employeeData.salary,
        dateEmployed: employeeData.dateEmployed,
        address: employeeData.address,
        emergencyContact: employeeData.emergencyContact,
        status: employeeData.status.toUpperCase().replace(' ', '_') // Convert 'Active' to 'ACTIVE', 'On Leave' to 'ON_LEAVE'
      }
      
      console.log('Sending to backend:', backendData)
      
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(backendData)
      })
      
      console.log('Response status:', response.status)
      const result = await response.json()
      console.log('Response data:', result)
      
      if (response.ok && result.success) {
        console.log('Employee created successfully, refreshing list...')
        // Refresh the employees list
        await fetchEmployees()
        alert('Employee registered successfully!')
      } else {
        console.error('Registration failed:', result)
        alert(`Failed to register employee: ${result.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to register employee:', error)
      alert('Failed to register employee. Please try again.')
    }
  }

  // Get unique departments
  const departments = ['All', ...Array.from(new Set(employees.map(e => e.department)))]

  // Filter employees
  const filteredEmployees = employees.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         e.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         e.position.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = departmentFilter === 'All' || e.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  // Pagination
  const { currentPage, totalPages, paginatedItems, setCurrentPage, totalItems, itemsPerPage } = usePagination(filteredEmployees, 15)

  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-sub">Manage your workforce</p>
        </div>
        <Button onClick={() => setShowRegisterModal(true)}>
          <UserPlus className="w-4 h-4" />
          Register Employee
        </Button>
      </div>

      <Card>
        <div className="p-4 pb-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                className="input w-full sm:w-40"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                {filteredEmployees.length} employees
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Connected Box Cards View - No Horizontal Scroll Needed */}
        <div className="md:hidden space-y-3 px-4 pb-4">
          {paginatedItems.map((employee) => (
            <div 
              key={employee.id}
              className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-blue-200 transition-colors"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div 
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                    style={{ background: '#2f5df5' }}
                  >
                    {getInitials(employee.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{employee.name}</div>
                    <div className="text-[11px] text-gray-500 font-mono">{employee.empId}</div>
                  </div>
                </div>
                <Badge variant="success">{employee.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-2.5 border-y border-gray-100 my-1">
                <div>
                  <span className="text-gray-400 block text-[10px]">Position</span>
                  <span className="font-medium text-gray-800 truncate block">{employee.position}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Department</span>
                  <span className="font-semibold text-blue-600 truncate block">{employee.department}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Employed Date</span>
                  <span className="text-gray-600">{fmtDateShort(employee.dateEmployed)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Attendance Rate</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-full bg-[#0ea885] transition-all"
                        style={{ width: `${employee.attendance}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-gray-700">{employee.attendance}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end pt-1.5">
                <button
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Date Employed</th>
                <th>Status</th>
                <th>Attendance</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <div className="text-sm font-medium text-gray-900">{employee.empId}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0"
                        style={{ background: '#2f5df5' }}
                      >
                        {getInitials(employee.name)}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-700">{employee.position}</div>
                  </td>
                  <td>
                    <div className="text-sm text-[#2f5df5] font-medium">{employee.department}</div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-700">{fmtDateShort(employee.dateEmployed)}</div>
                  </td>
                  <td>
                    <Badge variant="success">{employee.status}</Badge>
                  </td>
                  <td>
                    <div className="flex items-center gap-2" style={{ minWidth: '120px' }}>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-[#0ea885] transition-all"
                          style={{ width: `${employee.attendance}%` }}
                        ></div>
                      </div>
                      <div className="text-xs font-semibold text-gray-700 w-8">{employee.attendance}%</div>
                    </div>
                  </td>
                  <td>
                    <button
                      className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      View
                    </button>
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

      {/* Employee Registration Modal */}
      {showRegisterModal && (
        <EmployeeRegistrationModal
          onClose={() => setShowRegisterModal(false)}
          onSave={handleRegisterEmployee}
        />
      )}

      {/* Employee Profile Modal */}
      {selectedEmployee && (
        <EmployeeProfileModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  )
}
