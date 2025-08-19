import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Wild Senses Admin Dashboard</h1>
          <p className="text-green-100 mt-1">Manage program registrations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdminDashboard />
      </div>
    </div>
  )
}
