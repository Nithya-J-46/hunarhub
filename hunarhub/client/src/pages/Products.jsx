import { useEffect, useState } from 'react'
import axios from 'axios'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios.get('/api/products')
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Handmade Products</h1>
      <p className="text-gray-500 mb-6">Shop unique handmade products from local artisans</p>

      <div className="mb-6">
        <input type="text" placeholder="🔍 Search products..."
          className="border border-gray-300 rounded-lg px-4 py-2.5 w-full max-w-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 text-lg">Loading products...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🎨</div>
          <p className="text-gray-500">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(p => <ProductCard key={p._id} data={p} />)}
        </div>
      )}
    </div>
  )
}
