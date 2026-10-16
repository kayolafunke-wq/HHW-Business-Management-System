import { useState } from 'react'
import { Search, X, UserPlus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Pagination, usePagination } from '@/components/ui/Pagination'

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

// Sample employees
const SAMPLE_EMPLOYEES: Employee[] = [
  {
    id: '1',
    empId: 'EMP-100',
    name: 'John Banda',
    position: 'Sales Associate',
    department: 'Sales',
    dateEmployed: '2026-03-23',
    status: 'Active',
    attendance: 100,
    phone: '+265 888101424',
    email: 'john.banda@fusionbiz.mw',
    salary: 180000,
    address: 'Area 20, Blantyre',
    emergencyContact: '+265 994657023',
  },
  {
    id: '2',
    empId: 'EMP-101',
    name: 'Grace Phiri',
    position: 'Inventory Officer',
    department: 'Inventory',
    dateEmployed: '2026-02-21',
    status: 'Active',
    attendance: 88,
    phone: '+265 991 222 333',
    email: 'grace.phiri@fusionbiz.mw',
    salary: 165000,
    address: 'Limbe, Blantyre',
    emergencyContact: '+265 999 111 222',
  },
  {
    id: '3',
    empId: 'EMP-102',
    name: 'Bright Kamanga',
    position: 'Accounts Clerk',
    department: 'Finance',
    dateEmployed: '2026-01-22',
    status: 'Active',
    attendance: 88,
    phone: '+265 995 444 555',
    email: 'bright.kamanga@fusionbiz.mw',
    salary: 175000,
    address: 'Area 15, Blantyre',
    emergencyContact: '+265 998 777 888',
  },
  {
    id: '4',
    empId: 'EMP-103',
    name: 'Alinane Mvula',
    position: 'HR Officer',
    department: 'HR',
    dateEmployed: '2025-12-23',
    status: 'Active',
    attendance: 88,
    phone: '+265 997 666 777',
    email: 'alinane.mvula@fusionbiz.mw',
    salary: 190000,
    address: 'Ndirande, Blantyre',
    emergencyContact: '+265 991 555 666',
  },
  {
    id: '5',
    empId: 'EMP-104',
    name: 'Chisomo Zulu',
    position: 'Operations Manager',
    department: 'Operations',
    dateEmployed: '2025-11-23',
    status: 'Active',
    attendance: 88,
    phone: '+265 996 333 444',
    email: 'chisomo.zulu@fusionbiz.mw',
    salary: 250000,
    address: 'Area 25, Blantyre',
    emergencyContact: '+265 992 888 999',
  },
  {
    id: '6',
    empId: 'EMP-105',
    name: 'Patricia Nkhoma',
    position: 'Sales Supervisor',
    department: 'Sales',
    dateEmployed: '2025-10-24',
    status: 'Active',
    attendance: 88,
    phone: '+265 993 222 111',
    email: 'patricia.nkhoma@fusionbiz.mw',
    salary: 210000,
    address: 'Chirimba, Blantyre',
    emergencyContact: '+265 990 444 555',
  },
  {
    id: '7',
    empId: 'EMP-106',
    name: 'Dan Chirwa',
    position: 'Store Keeper',
    department: 'Inventory',
    dateEmployed: '2025-09-24',
    status: 'Active',
    attendance: 88,
    phone: '+265 994 111 222',
    email: 'dan.chirwa@fusionbiz.mw',
    salary: 155000,
    address: 'Soche, Blantyre',
    emergencyContact: '+265 997 333 444',
  },
]

// Employee Registration Modal
function EmployeeRegistrationModal({ onClose, onSave }: { onClose: () => void; onSave: (employee: Omit<Employee, 'id' | 'attendance'>) => void }) {
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

  const handleSubmit = () => {
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

    onSave({
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
          <div className="grid grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="field">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Full Name</label>
              <Input
                type="text"
                placeholder="e.g. Chisomo Banda"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Employee ID */}
            <div className="field">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Employee ID</label>
              <Input
                type="text"
                value={formData.empId}
                onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
              />
            </div>

            {/* Phone Number */}
            <div className="field">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Phone Number</label>
              <Input
                type="text"
                placeholder="+265 88 000 0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {/* Email */}
            <div className="field">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Email</label>
              <Input
                type="email"
                placeholder="name@fusionbiz.mw"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Position */}
            <div className="field">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Position</label>
              <Input
                type="text"
                placeholder="e.g. Sales Associate"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </div>

            {/* Department */}
            <div className="field">
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
            <div className="field">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Date Employed</label>
              <Input
                type="date"
                value={formData.dateEmployed}
                onChange={(e) => setFormData({ ...formData, dateEmployed: e.target.value })}
              />
            </div>

            {/* Salary */}
            <div className="field">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Salary (MK)</label>
              <Input
                type="number"
                placeholder="e.g. 220000"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              />
            </div>

            {/* Address */}
            <div className="field col-span-2">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Address</label>
              <Input
                type="text"
                placeholder="e.g. Area 25, Blantyre"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            {/* Emergency Contact */}
            <div className="field">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Emergency Contact</label>
              <Input
                type="text"
                placeholder="+265 99 000 0000"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              />
            </div>

            {/* Status */}
            <div className="field">
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
          {/* Header with avatar and name */}
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base"
              style={{ background: 'linear-gradient(135deg, #2f5df5, #6a4fd6)' }}
            >
              {getInitials(employee.name)}
            </div>
            <div>
              <div className="font-semibold text-base text-gray-900">{employee.name}</div>
              <div className="text-xs text-gray-500">{employee.position} · {employee.department}</div>
            </div>
          </div>

          {/* Grid layout with 2 columns */}
          <div className="grid grid-cols-2 gap-x-8">
            {/* Employee ID */}
            <div className="flex items-center justify-between gap-3 py-2.5 pr-4 border-b" style={{ borderColor: '#f2f3f6' }}>
              <span className="text-[11px] text-gray-500 whitespace-nowrap">Employee ID</span>
              <span className="text-[13px] text-gray-900">{employee.empId}</span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between gap-3 py-2.5 pl-4 border-b" style={{ borderColor: '#f2f3f6' }}>
              <span className="text-[11px] text-gray-500 whitespace-nowrap">Status</span>
              <Badge variant="success">{employee.status}</Badge>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between gap-3 py-2.5 pr-4 border-b" style={{ borderColor: '#f2f3f6' }}>
              <span className="text-[11px] text-gray-500 whitespace-nowrap">Phone</span>
              <span className="text-[13px] text-gray-900">{employee.phone}</span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between gap-3 py-2.5 pl-4 border-b" style={{ borderColor: '#f2f3f6' }}>
              <span className="text-[11px] text-gray-500 whitespace-nowrap">Email</span>
              <span className="text-[13px] text-gray-900">{employee.email}</span>
            </div>

            {/* Date Employed */}
            <div className="flex items-center justify-between gap-3 py-2.5 pr-4 border-b" style={{ borderColor: '#f2f3f6' }}>
              <span className="text-[11px] text-gray-500 whitespace-nowrap">Date Employed</span>
              <span className="text-[13px] text-gray-900">{fmtDateShort(employee.dateEmployed)}</span>
            </div>

            {/* Salary */}
            <div className="flex items-center justify-between gap-3 py-2.5 pl-4 border-b" style={{ borderColor: '#f2f3f6' }}>
              <span className="text-[11px] text-gray-500 whitespace-nowrap">Salary</span>
              <span className="text-[13px] font-medium text-gray-900">{money(employee.salary)}</span>
            </div>

            {/* Address */}
            <div className="flex items-center justify-between gap-3 py-2.5 pr-4 border-b" style={{ borderColor: '#f2f3f6' }}>
              <span className="text-[11px] text-gray-500 whitespace-nowrap">Address</span>
              <span className="text-[13px] text-gray-900">{employee.address}</span>
            </div>

            {/* Emergency Contact */}
            <div className="flex items-center justify-between gap-3 py-2.5 pl-4 border-b" style={{ borderColor: '#f2f3f6' }}>
              <span className="text-[11px] text-gray-500 whitespace-nowrap">Emergency Contact</span>
              <span className="text-[13px] text-gray-900">{employee.emergencyContact}</span>
            </div>

            {/* Attendance */}
            <div className="flex items-center justify-between gap-3 py-2.5 pr-4">
              <span className="text-[11px] text-gray-500 whitespace-nowrap">Attendance</span>
              <span className="text-[13px] text-gray-900">{employee.attendance}%</span>
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
  const [employees, setEmployees] = useState<Employee[]>(SAMPLE_EMPLOYEES)
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('All')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  // Handle employee registration
  const handleRegisterEmployee = (employeeData: Omit<Employee, 'id' | 'attendance'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: String(employees.length + 1),
      attendance: 88, // Default attendance
    }
    setEmployees([...employees, newEmployee])
    alert('Employee registered successfully!')
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
        <div className="p-4 pb-0">
          <div className="flex items-center gap-3 mb-4">
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
            <select
              className="input"
              style={{ width: '150px' }}
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <div className="text-sm text-gray-500 whitespace-nowrap">
              {filteredEmployees.length} employees
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
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
