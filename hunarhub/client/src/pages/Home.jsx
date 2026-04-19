import { Link } from 'react-router-dom'

const categories = [
  { name: 'Cobbler', emoji: '👞', desc: 'Shoe repair & leather craft' },
  { name: 'Potter', emoji: '🏺', desc: 'Clay & ceramic artisans' },
  { name: 'Tailor', emoji: '🧵', desc: 'Custom stitching & alterations' },
  { name: 'Artisan', emoji: '🎨', desc: 'Handmade art & crafts' },
  { name: 'Vendor', emoji: '🛒', desc: 'Local goods & products' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-700 to-indigo-500 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Discover Local Talent. <br /> Support Local Skills.
        </h1>
        <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
          HunarHub connects you with skilled local micro-entrepreneurs — cobblers, potters,
          tailors, artisans, and more. Browse, book, and buy locally.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/browse"
            className="bg-white text-indigo-700 font-semibold px-8 py-3 rounded-full hover:bg-indigo-50 transition text-lg">
            Browse Entrepreneurs
          </Link>
          <Link to="/register"
            className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-indigo-600 transition text-lg">
            Join as Entrepreneur
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map(cat => (
            <Link key={cat.name} to={`/browse?category=${cat.name}`}
              className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-2">{cat.emoji}</div>
              <div className="font-semibold text-gray-800">{cat.name}</div>
              <div className="text-xs text-gray-500 mt-1">{cat.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-indigo-50 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Browse', desc: 'Search and discover local micro-entrepreneurs near you', icon: '🔍' },
              { step: '2', title: 'Connect', desc: 'View profiles, products, and place service requests', icon: '🤝' },
              { step: '3', title: 'Support', desc: 'Rate your experience and help grow local businesses', icon: '⭐' },
            ].map(item => (
              <div key={item.step} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Are you a local entrepreneur?</h2>
        <p className="text-gray-500 mb-8 max-w-xl mx-auto">
          Register your business on HunarHub and reach thousands of customers looking for your skills.
        </p>
        <Link to="/register"
          className="bg-indigo-600 text-white font-semibold px-10 py-3 rounded-full hover:bg-indigo-700 transition text-lg">
          Get Started for Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-6 text-sm">
        © 2024 HunarHub – Empowering Local Micro-Entrepreneurs
      </footer>
    </div>
  )
}
