import { useNavigate } from 'react-router-dom'

const categoryColors = {
  Cobbler: 'bg-orange-100 text-orange-700',
  Potter: 'bg-yellow-100 text-yellow-700',
  Tailor: 'bg-blue-100 text-blue-700',
  Artisan: 'bg-purple-100 text-purple-700',
  Vendor: 'bg-green-100 text-green-700',
}

export default function EntrepreneurCard({ data }) {
  const navigate = useNavigate()
  const stars = Math.round(data.rating || 0)

  return (
    <div
      onClick={() => navigate(`/entrepreneur/${data._id}`)}
      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
          {data.businessName?.[0]}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{data.businessName}</h2>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[data.category] || 'bg-gray-100 text-gray-600'}`}>
            {data.category}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-1">📍 {data.location}</p>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{data.description}</p>
      <div className="flex justify-between items-center">
        <span className="font-bold text-indigo-600">{data.pricing || 'Contact for pricing'}</span>
        <div className="text-yellow-400 text-sm">
          {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
          <span className="text-gray-400 ml-1">({data.totalReviews || 0})</span>
        </div>
      </div>
      {!data.availability && (
        <div className="mt-2 text-xs text-red-500 font-medium">⚠ Currently unavailable</div>
      )}
    </div>
  )
}
