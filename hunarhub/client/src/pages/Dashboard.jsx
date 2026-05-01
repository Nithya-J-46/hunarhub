import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = ['Cobbler', 'Potter', 'Tailor', 'Artisan', 'Vendor']

export default function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [requests, setRequests] = useState([])
  const [products, setProducts] = useState([])
  const [productOrders, setProductOrders] = useState([])
  const [tab, setTab] = useState('profile')
  const [form, setForm] = useState({ businessName: '', category: 'Cobbler', skills: '', location: '', description: '', pricing: '', availability: true })
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', stock: 1, image: '' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    axios.get(`/api/entrepreneurs/by-user/${user.id}`)
      .then(res => {
        if (res.data) {
          setProfile(res.data)
          setForm({ ...res.data, skills: res.data.skills?.join(', ') || '' })
          return Promise.all([
            axios.get(`/api/orders/entrepreneur/${res.data._id}`),
            axios.get(`/api/products?entrepreneur=${res.data._id}`),
            axios.get(`/api/orders/entrepreneur-products/${res.data._id}`)
          ])
        }
      })
      .then(results => {
        if (results) {
          setRequests(results[0].data)
          setProducts(results[1].data)
          setProductOrders(results[2].data)
        }
      })
      .finally(() => setLoading(false))
  }, [user])

  const saveProfile = async () => {
    try {
      const data = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) }
      if (profile) {
        const res = await axios.put(`/api/entrepreneurs/${profile._id}`, data)
        setProfile(res.data)
      } else {
        const res = await axios.post('/api/entrepreneurs', data)
        setProfile(res.data)
      }
      setMsg('✅ Profile saved successfully!')
    } catch { setMsg('❌ Failed to save profile.') }
  }

  const updateRequestStatus = async (id, status) => {
    await axios.put(`/api/orders/${id}`, { status })
    setRequests(requests.map(r => r._id === id ? { ...r, status } : r))
  }

  const updateProductOrderStatus = async (id, status) => {
    await axios.put(`/api/orders/product/${id}`, { status })
    setProductOrders(productOrders.map(o => o._id === id ? { ...o, status } : o))
    
    // Refresh profile to get updated earnings if delivered
    if (status === 'delivered') {
      const res = await axios.get(`/api/entrepreneurs/by-user/${user.id}`)
      setProfile(res.data)
    }
  }

  const addProduct = async () => {
    try {
      if (!profile) return setMsg('Save your profile first!')
      const res = await axios.post('/api/products', { ...productForm, price: +productForm.price, stock: +productForm.stock, entrepreneur: profile._id })
      setProducts([...products, res.data])
      setProductForm({ name: '', description: '', price: '', stock: 1, image: '' })
      setMsg('✅ Product added!')
    } catch { setMsg('❌ Failed to add product.') }
  }

  const deleteProduct = async (id) => {
    await axios.delete(`/api/products/${id}`)
    setProducts(products.filter(p => p._id !== id))
  }

  if (loading) return <div className="text-center py-20 text-gray-400 text-xl">Loading dashboard...</div>

  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', accepted: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700', completed: 'bg-blue-100 text-blue-700' }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Entrepreneur Dashboard</h1>
        {profile && <span className={`px-3 py-1 rounded-full text-sm font-medium ${profile.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {profile.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
        </span>}
      </div>

      {/* Stats */}
      {profile && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Service Requests', value: requests.length, icon: '📩' },
            { label: 'Pending', value: requests.filter(r => r.status === 'pending').length, icon: '⏳' },
            { label: 'Products Listed', value: products.length, icon: '🎨' },
            { label: 'Rating', value: `${profile.rating || 0} ⭐`, icon: '⭐' },
            { label: 'Earnings', value: `₹${profile.earnings || 0}`, icon: '💰' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <div className="text-2xl">{stat.icon}</div>
              <div className="text-2xl font-bold text-indigo-600 mt-1">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b overflow-x-auto whitespace-nowrap pb-1">
        {['profile', 'requests', 'productOrders', 'products'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 font-medium text-sm capitalize border-b-2 transition ${tab === t ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t === 'profile' ? '👤 Profile' : t === 'requests' ? '📩 Service Requests' : t === 'productOrders' ? '🛍️ Product Orders' : '🎨 Products'}
          </button>
        ))}
      </div>

      {msg && <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg px-4 py-2 text-sm mb-4">{msg}</div>}

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="font-bold text-xl text-gray-800">{profile ? 'Edit Profile' : 'Create Your Profile'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Business Name', key: 'businessName', placeholder: 'e.g. Raju Cobbler Works' },
              { label: 'Location', key: 'location', placeholder: 'e.g. Chandni Chowk, Delhi' },
              { label: 'Pricing', key: 'pricing', placeholder: 'e.g. Starting ₹50' },
              { label: 'Skills (comma separated)', key: 'skills', placeholder: 'e.g. Shoe repair, Leather work' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input type="text" placeholder={field.placeholder}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  value={form[field.key] || ''} onChange={e => setForm({ ...form, [field.key]: e.target.value })} />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value === 'true' })}>
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              rows={3} placeholder="Tell customers about your work..."
              value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <button onClick={saveProfile}
            className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition">
            {profile ? 'Update Profile' : 'Create Profile'}
          </button>
        </div>
      )}

      {/* Requests Tab */}
      {tab === 'requests' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">📩</div>
              <p>No service requests yet.</p>
            </div>
          ) : requests.map(r => (
            <div key={r._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <p className="font-semibold text-gray-800">{r.customer?.name}</p>
                  <p className="text-sm text-gray-500">{r.customer?.email}</p>
                  <p className="text-gray-700 mt-2">{r.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium self-start sm:self-auto ${statusColors[r.status]}`}>{r.status}</span>
              </div>
              {r.status === 'pending' && (
                <div className="mt-3 flex gap-2">
                  <button onClick={() => updateRequestStatus(r._id, 'accepted')}
                    className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 transition">Accept</button>
                  <button onClick={() => updateRequestStatus(r._id, 'rejected')}
                    className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 transition">Reject</button>
                </div>
              )}
              {r.status === 'accepted' && (
                <button onClick={() => updateRequestStatus(r._id, 'completed')}
                  className="mt-3 bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition">Mark Completed</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Product Orders Tab */}
      {tab === 'productOrders' && (
        <div className="space-y-4">
          {productOrders.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">🛍️</div>
              <p>No product orders yet.</p>
            </div>
          ) : productOrders.map(o => (
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
                    <p className="text-sm text-gray-500">Buyer: {o.customer?.name} <span className="hidden sm:inline">({o.customer?.email})</span></p>
                    <p className="text-gray-700 mt-1 font-medium">Qty: {o.quantity} | Earnings: ₹{o.totalPrice}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium self-start sm:self-auto ${statusColors[o.status] || 'bg-gray-100'}`}>{o.status}</span>
              </div>
              {o.status === 'pending' && (
                <button onClick={() => updateProductOrderStatus(o._id, 'shipped')}
                  className="mt-4 bg-purple-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-purple-600 transition">Mark Shipped</button>
              )}
              {o.status === 'shipped' && (
                <button onClick={() => updateProductOrderStatus(o._id, 'delivered')}
                  className="mt-4 bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 transition">Mark Delivered</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Products Tab */}
      {tab === 'products' && (
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-lg text-gray-800 mb-4">Add New Product</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Product Name', key: 'name', placeholder: 'e.g. Handmade Clay Pot' },
                { label: 'Price (₹)', key: 'price', placeholder: '250', type: 'number' },
                { label: 'Stock', key: 'stock', placeholder: '10', type: 'number' },
                { label: 'Image URL (optional)', key: 'image', placeholder: 'https://...' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input type={field.type || 'text'} placeholder={field.placeholder}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={productForm[field.key]} onChange={e => setProductForm({ ...productForm, [field.key]: e.target.value })} />
                </div>
              ))}
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                rows={2} placeholder="Describe your product..."
                value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} />
            </div>
            <button onClick={addProduct}
              className="mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition">
              Add Product
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => (
              <div key={p._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {p.image ? <img src={p.image} alt={p.name} className="w-full h-36 object-cover" />
                  : <div className="w-full h-36 bg-indigo-50 flex items-center justify-center text-4xl">🎨</div>}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{p.name}</h3>
                  <p className="text-indigo-600 font-bold">₹{p.price}</p>
                  <p className="text-xs text-gray-400">Stock: {p.stock}</p>
                  <button onClick={() => deleteProduct(p._id)}
                    className="mt-2 text-xs text-red-500 hover:text-red-700 transition">🗑 Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
