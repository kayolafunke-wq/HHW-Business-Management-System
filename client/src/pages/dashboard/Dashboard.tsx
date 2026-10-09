export default function Dashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Overview of your business today</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="text-3xl font-display font-bold text-gray-900">{i * 25}</div>
            <div className="text-sm text-gray-600 mt-1">KPI Metric {i}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <p className="text-sm text-gray-600">Dashboard content coming soon...</p>
      </div>
    </div>
  )
}
