import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminPanel() {
  const [stats, setStats] = useState(null)
  const [entrepreneurs, setEntrepreneurs] = useState([])
  const [requests, setRequests] = useState([])
  const [tab, setTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/api/admin/stats'),
      axios.get('/api/admin/entrepreneurs'),
      axios.get('/api/admin/requests')
    ]).then(([s, e, r]) => {
      setStats(s.data)
      setEntrepreneurs(e.data)
      setRequests(r.data)
    }).finally(() => setLoading(false))
  }, [])

  const toggleVerify = async (id, current) => {
    await axios.put(`/api/admin/verify/${id}`, { isVerified: !current })
    setEntrepreneurs(entrepreneurs.map(e =>
      e._id === id ? { ...e, isVerified: !current } : e
    ))
  }

  if (loading) return <div className="text-center py-20 text-gray-400 text-xl">Loading admin panel...</div>

  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', accepted: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-600', completed: 'bg-blue-100 text-blue-700' }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">⚙️ Admin Panel</h1>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats.users, icon: '👥', color: 'text-indigo-600' },
            { label: 'Entrepreneurs', value: stats.entrepreneurs, icon: '🧵', color: 'text-green-600' },
            { label: 'Service Requests', value: stats.requests, icon: '📩', color: 'text-yellow-600' },
            { label: 'Products Listed', value: stats.products, icon: '🎨', color: 'text-purple-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {['overview', 'entrepreneurs', 'requests'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 font-medium text-sm capitalize border-b-2 transition ${tab === t ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t === 'overview' ? '📊 Overview' : t === 'entrepreneurs' ? '🧵 Entrepreneurs' : '📩 Requests'}
          </button>
        ))}
      </div>

      {/* Entrepreneurs Tab */}
      {tab === 'entrepreneurs' && (
        <div className="space-y-4">
          {entrepreneurs.length === 0 ? (
            <p className="text-gray-400 text-center py-10">No entrepreneurs registered yet.</p>
          ) : entrepreneurs.map(e => (
            <div key={e._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-800">{e.businessName}</h3>
                <p className="text-sm text-gray-500">{e.category} · {e.location}</p>
                <p className="text-xs text-gray-400">{e.user?.name} ({e.user?.email})</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${e.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {e.isVerified ? '✅ Verified' : '⏳ Pending'}
                </span>
                <button onClick={() => toggleVerify(e._id, e.isVerified)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium text-white transition ${e.isVerified ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                  {e.isVerified ? 'Revoke' : 'Verify'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Requests Tab */}
      {tab === 'requests' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <p className="text-gray-400 text-center py-10">No service requests yet.</p>
          ) : requests.map(r => (
            <div key={r._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">Customer: {r.customer?.name}</p>
                  <p className="text-sm text-gray-500">For: {r.entrepreneur?.businessName}</p>
                  <p className="text-gray-700 text-sm mt-1">{r.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[r.status]}`}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-lg text-gray-800 mb-4">Platform Summary</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>✅ <strong>{entrepreneurs.filter(e => e.isVerified).length}</strong> verified entrepreneurs on platform</p>
            <p>⏳ <strong>{entrepreneurs.filter(e => !e.isVerified).length}</strong> pending verification</p>
            <p>📩 <strong>{requests.filter(r => r.status === 'pending').length}</strong> pending service requests</p>
            <p>✅ <strong>{requests.filter(r => r.status === 'completed').length}</strong> completed requests</p>
          </div>
        </div>
      )}
    </div>
  )
}
