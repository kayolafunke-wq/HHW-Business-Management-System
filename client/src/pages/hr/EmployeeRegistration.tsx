import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export default function EmployeeRegistration() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    empId: `EMP-${112 + Math.floor(Math.random() * 100)}`,
    name: '',
    position: '',
    department: 'Sales',
    dateEmployed: new Date().toISOString().split('T')[0],
    phone: '',
    email: '',
    salary: '',
    address: '',
    emergencyContact: '',
    status: 'Active',
  })

  const departments = ['Sales', 'Inventory', 'Finance', 'HR', 'Operations']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
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

    // Here you would normally save to backend/store
    console.log('Registering employee:', formData)
    alert('Employee registered successfully!')
    navigate('/employees')
  }

  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <h1 className="page-title">Employee Registration</h1>
          <p className="page-sub">Register a new employee</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
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
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={() => navigate('/employees')}>
              Cancel
            </Button>
            <Button type="submit">
              Register Employee
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
