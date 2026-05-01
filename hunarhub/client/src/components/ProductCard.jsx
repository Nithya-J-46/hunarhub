import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function ProductCard({ data }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const handleBuy = async () => {
    if (!user) return setMsg('Please login to buy')
    if (user.role !== 'customer') return setMsg('Only customers can buy')
    
    setLoading(true)
    try {
      await axios.post('/api/orders/product', { product: data._id, quantity: 1 })
      setMsg('✅ Order placed!')
    } catch (err) {
      setMsg('❌ Failed to order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
      {data.image ? (
        <img src={data.image} alt={data.name} className="w-full h-44 object-cover" />
      ) : (
        <div className="w-full h-44 bg-indigo-50 flex items-center justify-center text-5xl">🎨</div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-800 text-lg">{data.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">{data.description}</p>
        <div className="flex justify-between items-center mt-3 mb-1">
          <span className="text-indigo-600 font-bold text-lg">₹{data.price}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${data.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {data.stock > 0 ? `${data.stock} in stock` : 'Out of stock'}
          </span>
        </div>
        {data.entrepreneur && (
          <p className="text-xs text-gray-400">By: {data.entrepreneur.businessName || data.entrepreneur}</p>
        )}
        
        {user?.role === 'customer' && data.stock > 0 && (
          <button 
            onClick={handleBuy} 
            disabled={loading || msg === '✅ Order placed!'}
            className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : (msg === '✅ Order placed!' ? 'Ordered' : 'Buy Now')}
          </button>
        )}
        {msg && <p className={`text-xs text-center mt-2 font-medium ${msg.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      </div>
    </div>
  )
}
