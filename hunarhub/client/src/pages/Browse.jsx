import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import EntrepreneurCard from '../components/EntrepreneurCard'

const CATEGORIES = ['All', 'Cobbler', 'Potter', 'Tailor', 'Artisan', 'Vendor']

export default function Browse() {
  const [entrepreneurs, setEntrepreneurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    location: ''
  })

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.location) params.set('location', filters.location)
    axios.get(`/api/entrepreneurs?${params.toString()}`)
      .then(res => setEntrepreneurs(res.data))
      .catch(() => setEntrepreneurs([]))
      .finally(() => setLoading(false))
  }, [filters])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Entrepreneurs</h1>
      <p className="text-gray-500 mb-6">Discover skilled local micro-entrepreneurs near you</p>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8 flex flex-wrap gap-4 items-center">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat}
              onClick={() => setFilters({ ...filters, category: cat === 'All' ? '' : cat })}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                (cat === 'All' && !filters.category) || filters.category === cat
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-gray-300 text-gray-600 hover:border-indigo-400'
              }`}>
              {cat}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="🔍 Search by location..."
          className="ml-auto border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          value={filters.location}
          onChange={e => setFilters({ ...filters, location: e.target.value })}
        />
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 text-lg">Loading entrepreneurs...</div>
      ) : entrepreneurs.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg">No entrepreneurs found. Try different filters.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{entrepreneurs.length} entrepreneur(s) found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entrepreneurs.map(e => <EntrepreneurCard key={e._id} data={e} />)}
          </div>
        </>
      )}
    </div>
  )
}
