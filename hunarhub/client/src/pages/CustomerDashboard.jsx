import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [orders, setOrders] = useState([])
  const [tab, setTab] = useState('requests')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([
      axios.get('/api/orders/my-requests'),
      axios.get('/api/orders/my-product-orders')
    ])
      .then(([reqRes, ordRes]) => {
        setRequests(reqRes.data)
        setOrders(ordRes.data)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [user])

  const statusColors = { 
    pending: 'bg-yellow-100 text-yellow-700', 
    accepted: 'bg-green-100 text-green-700', 
    rejected: 'bg-red-100 text-red-700', 
    completed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-100 text-gray-700'
  }

  if (loading) return <div className="text-center py-20 text-gray-400 text-xl">Loading dashboard...</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Customer Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {['requests', 'orders'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 font-medium text-sm capitalize border-b-2 transition ${tab === t ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t === 'requests' ? '📩 Service Requests' : '🛍️ Product Orders'}
          </button>
        ))}
      </div>

      {/* Service Requests Tab */}
      {tab === 'requests' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">📩</div>
              <p>You haven't made any service requests yet.</p>
            </div>
          ) : requests.map(r => (
            <div key={r._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <p className="font-semibold text-gray-800">To: {r.entrepreneur?.businessName}</p>
                  <p className="text-sm text-gray-500">{r.entrepreneur?.category} · {r.entrepreneur?.location}</p>
                  <p className="text-gray-700 mt-2">{r.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium self-start sm:self-auto ${statusColors[r.status]}`}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Orders Tab */}
      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">🛍️</div>
              <p>You haven't purchased any products yet.</p>
            </div>
          ) : orders.map(o => (
            <div key={o._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex items-start gap-4">
                  {o.product?.image ? (
                    <img src={o.product.image} alt={o.product?.name} className="w-16 h-16 rounded-lg object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-indigo-50 flex items-center justify-center text-xl shrink-0">🎨</div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">{o.product?.name}</p>
                    <p className="text-sm text-gray-500">From: {o.entrepreneur?.businessName}</p>
                    <p className="text-gray-700 mt-1 font-medium">Qty: {o.quantity} | Total: ₹{o.totalPrice}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium self-start sm:self-auto ${statusColors[o.status]}`}>{o.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
