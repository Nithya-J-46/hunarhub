export default function ProductCard({ data }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      {data.image ? (
        <img src={data.image} alt={data.name} className="w-full h-44 object-cover" />
      ) : (
        <div className="w-full h-44 bg-indigo-50 flex items-center justify-center text-5xl">🎨</div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-lg">{data.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{data.description}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-indigo-600 font-bold text-lg">₹{data.price}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${data.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {data.stock > 0 ? `${data.stock} in stock` : 'Out of stock'}
          </span>
        </div>
        {data.entrepreneur && (
          <p className="text-xs text-gray-400 mt-2">By: {data.entrepreneur.businessName}</p>
        )}
      </div>
    </div>
  )
}
