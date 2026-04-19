import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ProductCard'

export default function EntrepreneurProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [requestDesc, setRequestDesc] = useState('')
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get(`/api/entrepreneurs/${id}`),
      axios.get(`/api/products?entrepreneur=${id}`),
      axios.get(`/api/reviews/${id}`)
    ]).then(([p, pr, rv]) => {
      setProfile(p.data)
      setProducts(pr.data)
      setReviews(rv.data)
    }).finally(() => setLoading(false))
  }, [id])

  const sendRequest = async () => {
    if (!user) return setMsg('Please login to send a request')
    if (!requestDesc.trim()) return setMsg('Please describe your requirement')
    try {
      await axios.post('/api/orders', { entrepreneur: id, description: requestDesc })
      setMsg('✅ Service request sent successfully!')
      setRequestDesc('')
    } catch {
      setMsg('❌ Failed to send request. Please try again.')
    }
  }

  const submitReview = async () => {
    if (!user) return setMsg('Please login to leave a review')
    try {
      await axios.post('/api/reviews', { entrepreneur: id, ...reviewForm })
      const rv = await axios.get(`/api/reviews/${id}`)
      setReviews(rv.data)
      setMsg('✅ Review submitted!')
      setReviewForm({ rating: 5, comment: '' })
    } catch {
      setMsg('❌ Failed to submit review.')
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-400 text-xl">Loading profile...</div>
  if (!profile) return <div className="text-center py-20 text-red-400">Entrepreneur not found.</div>

  const stars = Math.round(profile.rating || 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-600 shrink-0">
            {profile.businessName?.[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">{profile.businessName}</h1>
            <p className="text-indigo-600 font-medium">{profile.category}</p>
            <p className="text-gray-500 mt-1">📍 {profile.location}</p>
            <div className="text-yellow-400 mt-1">
              {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
              <span className="text-gray-400 text-sm ml-1">({profile.totalReviews} reviews)</span>
            </div>
            <div className="mt-3 flex gap-2 flex-wrap">
              {profile.skills?.map(s => (
                <span key={s} className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full">{s}</span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-700">{profile.pricing}</div>
            <span className={`text-sm px-3 py-1 rounded-full ${profile.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
              {profile.availability ? '✅ Available' : '⛔ Unavailable'}
            </span>
          </div>
        </div>
        <p className="text-gray-600 mt-4">{profile.description}</p>
      </div>

      {/* Products */}
      {products.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🎨 Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map(p => <ProductCard key={p._id} data={p} />)}
          </div>
        </div>
      )}

      {/* Service Request */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">📩 Place a Service Request</h2>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          rows={3} placeholder="Describe what you need..."
          value={requestDesc} onChange={e => setRequestDesc(e.target.value)}
        />
        <button onClick={sendRequest}
          className="mt-3 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition">
          Send Request
        </button>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">⭐ Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-3 mb-6">
            {reviews.map(r => (
              <div key={r._id} className="border-b pb-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">{r.customer?.name}</span>
                  <span className="text-yellow-400">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Leave Review */}
        {user && user.role === 'customer' && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Leave a Review</h3>
            <select className="border border-gray-300 rounded-lg px-3 py-2 mb-2 text-sm"
              value={reviewForm.rating} onChange={e => setReviewForm({ ...reviewForm, rating: +e.target.value })}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
            </select>
            <textarea className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              rows={2} placeholder="Share your experience..."
              value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} />
            <button onClick={submitReview}
              className="mt-2 bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition">
              Submit Review
            </button>
          </div>
        )}
      </div>

      {msg && (
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg px-4 py-3 text-sm">{msg}</div>
      )}
    </div>
  )
}
