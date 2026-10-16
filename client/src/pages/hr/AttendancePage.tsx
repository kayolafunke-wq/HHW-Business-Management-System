import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Printer } from 'lucide-react'

interface Employee {
  id: string
  empId: string
  name: string
  department: string
  status: 'Present' | 'Late' | 'Absent' | 'Leave'
}

interface MonthlyAttendance {
  empId: string
  name: string
  workingDays: number
  present: number
  absent: number
  late: number
  leave: number
  attendancePercent: number
}

// Sample employees
const EMPLOYEES: Employee[] = [
  { id: '1', empId: 'EMP-100', name: 'John Banda', department: 'Sales', status: 'Present' },
  { id: '2', empId: 'EMP-101', name: 'Grace Phiri', department: 'Inventory', status: 'Present' },
  { id: '3', empId: 'EMP-102', name: 'Bright Kamanga', department: 'Finance', status: 'Present' },
  { id: '4', empId: 'EMP-103', name: 'Alinane Mvula', department: 'HR', status: 'Present' },
  { id: '5', empId: 'EMP-104', name: 'Chisomo Zulu', department: 'Operations', status: 'Present' },
  { id: '6', empId: 'EMP-105', name: 'Patricia Nkhoma', department: 'Sales', status: 'Present' },
  { id: '7', empId: 'EMP-106', name: 'Dan Chirwa', department: 'Inventory', status: 'Present' },
]

// Sample monthly data
const MONTHLY_DATA: MonthlyAttendance[] = [
  { empId: 'EMP-100', name: 'John Banda', workingDays: 9, present: 8, absent: 1, late: 0, leave: 0, attendancePercent: 89 },
  { empId: 'EMP-101', name: 'Grace Phiri', workingDays: 9, present: 6, absent: 1, late: 1, leave: 1, attendancePercent: 78 },
  { empId: 'EMP-102', name: 'Bright Kamanga', workingDays: 9, present: 8, absent: 0, late: 1, leave: 0, attendancePercent: 100 },
  { empId: 'EMP-103', name: 'Alinane Mvula', workingDays: 9, present: 6, absent: 3, late: 0, leave: 0, attendancePercent: 67 },
  { empId: 'EMP-104', name: 'Chisomo Zulu', workingDays: 9, present: 9, absent: 0, late: 0, leave: 0, attendancePercent: 100 },
  { empId: 'EMP-105', name: 'Patricia Nkhoma', workingDays: 9, present: 7, absent: 0, late: 2, leave: 0, attendancePercent: 100 },
  { empId: 'EMP-106', name: 'Dan Chirwa', workingDays: 9, present: 8, absent: 0, late: 0, leave: 1, attendancePercent: 89 },
]

function getInitials(name: string): string {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return parts[0][0] + parts[1][0]
  }
  return parts[0][0] + parts[0][1]
}

function getStatusColor(status: string): 'success' | 'warning' | 'danger' | 'default' {
  switch (status) {
    case 'Present':
      return 'success'
    case 'Late':
      return 'warning'
    case 'Absent':
      return 'danger'
    case 'Leave':
      return 'default'
    default:
      return 'default'
  }
}

function getAttendanceColor(percent: number): string {
  if (percent >= 90) return '#0ea885' // teal
  if (percent >= 70) return '#c97a1a' // amber
  return '#c2372c' // red
}

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [employees, setEmployees] = useState<Employee[]>(EMPLOYEES)

  // Calculate summary for daily entry
  const presentCount = employees.filter(e => e.status === 'Present').length
  const lateCount = employees.filter(e => e.status === 'Late').length
  const absentCount = employees.filter(e => e.status === 'Absent').length
  const leaveCount = employees.filter(e => e.status === 'Leave').length

  const handleStatusChange = (empId: string, newStatus: 'Present' | 'Late' | 'Absent' | 'Leave') => {
    setEmployees(employees.map(emp => 
      emp.empId === empId ? { ...emp, status: newStatus } : emp
    ))
  }

  const handlePrintReport = () => {
    window.print()
  }

  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="page-sub">Track and manage daily employee attendance</p>
        </div>
      </div>

      <Card>
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-200 px-4 pt-4">
          <button
            className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'daily'
                ? 'text-[#2f5df5] border-[#2f5df5]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('daily')}
          >
            Daily Entry
          </button>
          <button
            className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'monthly'
                ? 'text-[#2f5df5] border-[#2f5df5]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('monthly')}
          >
            Monthly Report
          </button>
        </div>

        {/* Daily Entry Tab */}
        {activeTab === 'daily' && (
          <div className="p-4">
            {/* Date Picker and Summary */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-2 block">Select Date</label>
                <input
                  type="date"
                  className="input"
                  style={{ width: '180px' }}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="font-semibold text-[#0ea885]">{presentCount} Present</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-[#c97a1a]">{lateCount} Late</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-[#c2372c]">{absentCount} Absent</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-500">{leaveCount} Leave</span>
                </div>
              </div>
            </div>

            {/* Employee List */}
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
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
                        <div className="text-sm text-gray-700">{employee.department}</div>
                      </td>
                      <td>
                        <Badge variant={getStatusColor(employee.status)}>{employee.status}</Badge>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                              employee.status === 'Present'
                                ? 'bg-[#e3f8f2] text-[#0ea885]'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            onClick={() => handleStatusChange(employee.empId, 'Present')}
                          >
                            Present
                          </button>
                          <button
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                              employee.status === 'Late'
                                ? 'bg-[#fbf0dd] text-[#c97a1a]'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            onClick={() => handleStatusChange(employee.empId, 'Late')}
                          >
                            Late
                          </button>
                          <button
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                              employee.status === 'Absent'
                                ? 'bg-[#fbe9e7] text-[#c2372c]'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            onClick={() => handleStatusChange(employee.empId, 'Absent')}
                          >
                            Absent
                          </button>
                          <button
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                              employee.status === 'Leave'
                                ? 'bg-gray-200 text-gray-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            onClick={() => handleStatusChange(employee.empId, 'Leave')}
                          >
                            Leave
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Monthly Report Tab */}
        {activeTab === 'monthly' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Monthly Attendance — October 2026</h3>
              <Button variant="outline" size="sm" onClick={handlePrintReport}>
                <Printer className="w-4 h-4" />
                Print Report
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Working Days</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Late</th>
                    <th>Leave</th>
                    <th>Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {MONTHLY_DATA.map((record) => (
                    <tr key={record.empId}>
                      <td>
                        <div className="text-sm font-medium text-gray-900">{record.name}</div>
                      </td>
                      <td>
                        <div className="text-sm text-gray-700">{record.workingDays}</div>
                      </td>
                      <td>
                        <div className="text-sm text-gray-900 font-medium">{record.present}</div>
                      </td>
                      <td>
                        <div className="text-sm text-gray-900">{record.absent}</div>
                      </td>
                      <td>
                        <div className="text-sm text-[#c97a1a]">{record.late}</div>
                      </td>
                      <td>
                        <div className="text-sm text-gray-900">{record.leave}</div>
                      </td>
                      <td>
                        <div 
                          className="text-sm font-semibold"
                          style={{ color: getAttendanceColor(record.attendancePercent) }}
                        >
                          {record.attendancePercent}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
