import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Printer, Calendar as CalendarIcon, Users, CheckCircle, XCircle, Clock, Coffee } from 'lucide-react'
import toast from 'react-hot-toast'

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
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    if (employees.length > 0) {
      loadAttendance()
    }
  }, [selectedDate, employees.length])

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/employees', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      
      if (data.success) {
        const empList = data.data.map((emp: any) => ({
          id: emp.id,
          empId: emp.employeeId || emp.id,
          name: emp.name,
          department: emp.department || 'N/A',
          status: 'Present' as const
        }))
        setEmployees(empList)
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error)
      toast.error('Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  const loadAttendance = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/attendance/daily/${selectedDate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()

      if (data.success && data.data.length > 0) {
        // Update employee statuses with saved attendance
        setEmployees(prevEmployees =>
          prevEmployees.map(emp => {
            const attendance = data.data.find((a: any) => a.employeeId === emp.id)
            return attendance ? { ...emp, status: attendance.status } : emp
          })
        )
      }
    } catch (error) {
      console.error('Failed to load attendance:', error)
    }
  }

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

  const handleSaveAttendance = async () => {
    try {
      const records = employees.map(emp => ({
        employeeId: emp.id,
        status: emp.status
      }))

      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/attendance/daily', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: selectedDate,
          records
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Attendance saved for ${data.data.recordCount} employee(s)`)
      } else {
        toast.error(data.message || 'Failed to save attendance')
      }
    } catch (error) {
      console.error('Save attendance error:', error)
      toast.error('Failed to save attendance')
    }
  }

  const handlePrintReport = () => {
    window.print()
  }

  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <h1 className="page-title">Attendance Management</h1>
          <p className="page-sub">Track and manage daily employee attendance</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'monthly' && (
            <Button variant="outline" onClick={handlePrintReport}>
              <Printer className="w-4 h-4" />
              Print Report
            </Button>
          )}
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
          <div className="p-6">
            {/* Date and Summary Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-[#2f5df5]" />
                  <input
                    type="date"
                    className="input text-base font-semibold"
                    style={{ width: '200px' }}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-green-700 mb-1">Present</div>
                      <div className="text-2xl font-bold text-green-900">{presentCount}</div>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-amber-700 mb-1">Late</div>
                      <div className="text-2xl font-bold text-amber-900">{lateCount}</div>
                    </div>
                    <Clock className="w-8 h-8 text-amber-600" />
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-red-700 mb-1">Absent</div>
                      <div className="text-2xl font-bold text-red-900">{absentCount}</div>
                    </div>
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-1">On Leave</div>
                      <div className="text-2xl font-bold text-gray-900">{leaveCount}</div>
                    </div>
                    <Coffee className="w-8 h-8 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Employee List */}
            {loading ? (
              <div className="text-center py-16 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Loading employees...</p>
              </div>
            ) : employees.length === 0 ? (
              <div className="text-center py-16 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-semibold text-gray-900">No employees found</p>
                <p className="text-xs mt-1">Register employees to start tracking attendance</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {employees.map((employee) => (
                    <div
                      key={employee.id}
                      className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between">
                        {/* Employee Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                            style={{ background: '#2f5df5' }}
                          >
                            {getInitials(employee.name)}
                          </div>
                          <div className="flex-1">
                            <div className="text-base font-semibold text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <span>{employee.empId}</span>
                              <span className="text-gray-300">•</span>
                              <span>{employee.department}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge and Actions */}
                        <div className="flex items-center gap-4">
                          <Badge variant={getStatusColor(employee.status)} className="px-3 py-1">
                            {employee.status}
                          </Badge>
                          
                          {/* Quick Action Buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                                employee.status === 'Present'
                                  ? 'bg-green-600 text-white shadow-sm'
                                  : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600 hover:border-green-200 border border-transparent'
                              }`}
                              onClick={() => handleStatusChange(employee.empId, 'Present')}
                            >
                              <CheckCircle className="w-3.5 h-3.5 inline mr-1" />
                              Present
                            </button>
                            <button
                              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                                employee.status === 'Late'
                                  ? 'bg-amber-600 text-white shadow-sm'
                                  : 'bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 border border-transparent'
                              }`}
                              onClick={() => handleStatusChange(employee.empId, 'Late')}
                            >
                              <Clock className="w-3.5 h-3.5 inline mr-1" />
                              Late
                            </button>
                            <button
                              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                                employee.status === 'Absent'
                                  ? 'bg-red-600 text-white shadow-sm'
                                  : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-transparent'
                              }`}
                              onClick={() => handleStatusChange(employee.empId, 'Absent')}
                            >
                              <XCircle className="w-3.5 h-3.5 inline mr-1" />
                              Absent
                            </button>
                            <button
                              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                                employee.status === 'Leave'
                                  ? 'bg-gray-600 text-white shadow-sm'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                              }`}
                              onClick={() => handleStatusChange(employee.empId, 'Leave')}
                            >
                              <Coffee className="w-3.5 h-3.5 inline mr-1" />
                              Leave
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Save Button */}
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSaveAttendance} size="lg">
                    Save Attendance
                  </Button>
                </div>
              </>
            )}
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

            {loading ? (
              <div className="text-center py-12 text-gray-400">Loading attendance data...</div>
            ) : employees.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>No attendance data available</p>
                <p className="text-xs mt-1">Add employees and track attendance to generate reports</p>
              </div>
            ) : (
              <MonthlyReportTable employees={employees} />
            )}
          </div>
        )}
      </Card>
    </div>
  )
}

// Monthly Report Component
function MonthlyReportTable({ employees }: { employees: any[] }) {
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMonthlyAttendance()
  }, [employees])

  const fetchMonthlyAttendance = async () => {
    setLoading(true)
    try {
      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth() + 1

      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/attendance/monthly/${year}/${month}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()

      if (data.success) {
        // Calculate stats for each employee
        const stats = employees.map(emp => {
          const empAttendance = data.data.filter((a: any) => a.employeeId === emp.id)
          
          const present = empAttendance.filter((a: any) => a.status === 'PRESENT').length
          const late = empAttendance.filter((a: any) => a.status === 'LATE').length
          const absent = empAttendance.filter((a: any) => a.status === 'ABSENT').length
          const leave = empAttendance.filter((a: any) => a.status === 'LEAVE').length
          
          const workingDays = empAttendance.length
          const attendancePercent = workingDays > 0 ? Math.round((present / workingDays) * 100) : 0

          return {
            name: emp.name,
            workingDays,
            present,
            late,
            absent,
            leave,
            attendancePercent
          }
        })

        setMonthlyData(stats)
      }
    } catch (error) {
      console.error('Failed to fetch monthly attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading monthly report...</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th style={{ textAlign: 'right' }}>Working Days</th>
            <th style={{ textAlign: 'right' }}>Present</th>
            <th style={{ textAlign: 'right' }}>Late</th>
            <th style={{ textAlign: 'right' }}>Absent</th>
            <th style={{ textAlign: 'right' }}>Leave</th>
            <th style={{ textAlign: 'right' }}>Attendance %</th>
          </tr>
        </thead>
        <tbody>
          {monthlyData.map((record, idx) => (
            <tr key={idx}>
              <td>
                <div className="text-sm font-medium text-gray-900">{record.name}</div>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div className="text-sm text-gray-700">{record.workingDays}</div>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div className="text-sm text-[#0ea885] font-medium">{record.present}</div>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div className="text-sm text-[#c97a1a]">{record.late}</div>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div className="text-sm text-[#c2372c]">{record.absent}</div>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div className="text-sm text-gray-600">{record.leave}</div>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div 
                  className="text-sm font-semibold"
                  style={{ 
                    color: record.attendancePercent >= 90 ? '#0ea885' : 
                           record.attendancePercent >= 70 ? '#c97a1a' : 
                           record.attendancePercent > 0 ? '#c2372c' : '#9ca3af'
                  }}
                >
                  {record.attendancePercent}%
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
