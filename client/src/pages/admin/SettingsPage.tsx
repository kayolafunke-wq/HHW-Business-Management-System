import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { 
  Building2, 
  DollarSign, 
  Mail, 
  Bell, 
  Shield, 
  Database,
  Printer,
  Globe,
  Save,
  CheckCircle
} from 'lucide-react'

export default function SettingsPage() {
  const [showSaveNotification, setShowSaveNotification] = useState(false)

  // Business Information
  const [businessInfo, setBusinessInfo] = useState({
    name: 'H.H Wholesalers',
    address: 'Area 4, Chilambura Road, Opposite Chipiku, Lilongwe, Malawi',
    phone: '+265 (0) 999 888 747',
    email: 'hhw.malawi@gmail.com',
    taxId: 'TIN-123456789',
    registrationNumber: 'BN-987654321',
  })

  // Currency & Finance
  const [financeSettings, setFinanceSettings] = useState({
    currency: 'MK',
    currencySymbol: 'MK',
    taxRate: '17.5',
    fiscalYearStart: '01',
  })

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'hhw.malawi@gmail.com',
    smtpPassword: '••••••••',
    fromEmail: 'hhw.malawi@gmail.com',
    fromName: 'H.H Wholesalers',
  })

  // Notification Settings
  const [notifications, setNotifications] = useState({
    lowStockAlerts: true,
    salesNotifications: true,
    dailyReports: false,
    weeklyReports: true,
    systemUpdates: true,
  })

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: '30',
    passwordExpiry: '90',
    twoFactorAuth: false,
    loginAttempts: '5',
  })

  // Backup Settings
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    retentionDays: '30',
  })

  const handleSaveSettings = () => {
    // Here you would save settings to backend
    setShowSaveNotification(true)
    setTimeout(() => setShowSaveNotification(false), 3000)
  }

  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-sub">Configure system and business preferences</p>
        </div>
        <Button onClick={handleSaveSettings}>
          <Save className="w-4 h-4" />
          Save All Changes
        </Button>
      </div>

      {/* Success Notification */}
      {showSaveNotification && (
        <div className="mb-4 p-4 bg-[#e3f8f2] border border-[#0ea885] rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-[#0ea885]" />
          <div>
            <div className="text-sm font-semibold text-[#0ea885]">Settings saved successfully!</div>
            <div className="text-xs text-gray-600">Your changes have been applied.</div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Business Information */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: '#e8eefd', color: '#2f5df5' }}
              >
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Business Information</h2>
                <p className="text-xs text-gray-500">Company details and contact information</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Business Name</label>
                <Input
                  type="text"
                  value={businessInfo.name}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Tax ID / TIN</label>
                <Input
                  type="text"
                  value={businessInfo.taxId}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, taxId: e.target.value })}
                />
              </div>

              <div className="field col-span-2">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Business Address</label>
                <Input
                  type="text"
                  value={businessInfo.address}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Phone Number</label>
                <Input
                  type="text"
                  value={businessInfo.phone}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Email Address</label>
                <Input
                  type="email"
                  value={businessInfo.email}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Registration Number</label>
                <Input
                  type="text"
                  value={businessInfo.registrationNumber}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, registrationNumber: e.target.value })}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Currency & Finance */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: '#e3f8f2', color: '#0ea885' }}
              >
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Currency & Finance</h2>
                <p className="text-xs text-gray-500">Financial settings and tax configuration</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Currency Code</label>
                <Input
                  type="text"
                  value={financeSettings.currency}
                  onChange={(e) => setFinanceSettings({ ...financeSettings, currency: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Currency Symbol</label>
                <Input
                  type="text"
                  value={financeSettings.currencySymbol}
                  onChange={(e) => setFinanceSettings({ ...financeSettings, currencySymbol: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Tax Rate (%)</label>
                <Input
                  type="text"
                  value={financeSettings.taxRate}
                  onChange={(e) => setFinanceSettings({ ...financeSettings, taxRate: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Fiscal Year Start (Month)</label>
                <select
                  className="input w-full"
                  value={financeSettings.fiscalYearStart}
                  onChange={(e) => setFinanceSettings({ ...financeSettings, fiscalYearStart: e.target.value })}
                >
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                  <option value="04">April</option>
                  <option value="05">May</option>
                  <option value="06">June</option>
                  <option value="07">July</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Email Configuration */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: '#efeafb', color: '#6a4fd6' }}
              >
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Email Configuration</h2>
                <p className="text-xs text-gray-500">SMTP settings for system emails</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">SMTP Server</label>
                <Input
                  type="text"
                  value={emailSettings.smtpServer}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpServer: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">SMTP Port</label>
                <Input
                  type="text"
                  value={emailSettings.smtpPort}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">SMTP Username</label>
                <Input
                  type="text"
                  value={emailSettings.smtpUsername}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpUsername: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">SMTP Password</label>
                <Input
                  type="password"
                  value={emailSettings.smtpPassword}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">From Email</label>
                <Input
                  type="email"
                  value={emailSettings.fromEmail}
                  onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">From Name</label>
                <Input
                  type="text"
                  value={emailSettings.fromName}
                  onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: '#fbf0dd', color: '#c97a1a' }}
              >
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Notification Preferences</h2>
                <p className="text-xs text-gray-500">Configure system alerts and reports</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={notifications.lowStockAlerts}
                  onChange={(e) => setNotifications({ ...notifications, lowStockAlerts: e.target.checked })}
                  className="w-4 h-4 text-[#2f5df5] rounded"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Low Stock Alerts</div>
                  <div className="text-xs text-gray-500">Receive notifications when products are running low</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={notifications.salesNotifications}
                  onChange={(e) => setNotifications({ ...notifications, salesNotifications: e.target.checked })}
                  className="w-4 h-4 text-[#2f5df5] rounded"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Sales Notifications</div>
                  <div className="text-xs text-gray-500">Get notified about new sales and transactions</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={notifications.dailyReports}
                  onChange={(e) => setNotifications({ ...notifications, dailyReports: e.target.checked })}
                  className="w-4 h-4 text-[#2f5df5] rounded"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Daily Reports</div>
                  <div className="text-xs text-gray-500">Receive daily business performance reports</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={notifications.weeklyReports}
                  onChange={(e) => setNotifications({ ...notifications, weeklyReports: e.target.checked })}
                  className="w-4 h-4 text-[#2f5df5] rounded"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Weekly Reports</div>
                  <div className="text-xs text-gray-500">Receive weekly summary reports</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={notifications.systemUpdates}
                  onChange={(e) => setNotifications({ ...notifications, systemUpdates: e.target.checked })}
                  className="w-4 h-4 text-[#2f5df5] rounded"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">System Updates</div>
                  <div className="text-xs text-gray-500">Get notified about system updates and maintenance</div>
                </div>
              </label>
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: '#fbe9e7', color: '#c2372c' }}
              >
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Security Settings</h2>
                <p className="text-xs text-gray-500">Authentication and access control</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Session Timeout (minutes)</label>
                <Input
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Password Expiry (days)</label>
                <Input
                  type="number"
                  value={securitySettings.passwordExpiry}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Max Login Attempts</label>
                <Input
                  type="number"
                  value={securitySettings.loginAttempts}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, loginAttempts: e.target.value })}
                />
              </div>

              <div className="field flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  checked={securitySettings.twoFactorAuth}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.checked })}
                  className="w-4 h-4 text-[#2f5df5] rounded"
                />
                <label className="text-sm font-medium text-gray-900">Enable Two-Factor Authentication</label>
              </div>
            </div>
          </div>
        </Card>

        {/* Backup Settings */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: '#e8eefd', color: '#2f5df5' }}
              >
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Backup & Data Management</h2>
                <p className="text-xs text-gray-500">Automated backup configuration</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="field flex items-center gap-3 col-span-2">
                <input
                  type="checkbox"
                  checked={backupSettings.autoBackup}
                  onChange={(e) => setBackupSettings({ ...backupSettings, autoBackup: e.target.checked })}
                  className="w-4 h-4 text-[#2f5df5] rounded"
                />
                <label className="text-sm font-medium text-gray-900">Enable Automatic Backups</label>
              </div>

              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Backup Frequency</label>
                <select
                  className="input w-full"
                  value={backupSettings.backupFrequency}
                  onChange={(e) => setBackupSettings({ ...backupSettings, backupFrequency: e.target.value })}
                  disabled={!backupSettings.autoBackup}
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Backup Time</label>
                <Input
                  type="time"
                  value={backupSettings.backupTime}
                  onChange={(e) => setBackupSettings({ ...backupSettings, backupTime: e.target.value })}
                  disabled={!backupSettings.autoBackup}
                />
              </div>

              <div className="field">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Retention Period (days)</label>
                <Input
                  type="number"
                  value={backupSettings.retentionDays}
                  onChange={(e) => setBackupSettings({ ...backupSettings, retentionDays: e.target.value })}
                  disabled={!backupSettings.autoBackup}
                />
              </div>

              <div className="field">
                <Button variant="outline" disabled={!backupSettings.autoBackup}>
                  <Database className="w-4 h-4" />
                  Backup Now
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Save Button at Bottom */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} size="lg">
            <Save className="w-4 h-4" />
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
