import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          🧵 HunarHub
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/browse" className="hover:text-indigo-200 transition">Browse</Link>
          <Link to="/products" className="hover:text-indigo-200 transition">Products</Link>
          {user ? (
            <>
              {user.role === 'entrepreneur' && (
                <Link to="/dashboard" className="hover:text-indigo-200 transition">Dashboard</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-indigo-200 transition">Admin</Link>
              )}
              <span className="bg-indigo-500 px-3 py-1 rounded-full text-xs">{user.name}</span>
              <button onClick={handleLogout}
                className="bg-white text-indigo-700 px-4 py-1.5 rounded-full font-semibold hover:bg-indigo-100 transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-200 transition">Login</Link>
              <Link to="/register"
                className="bg-white text-indigo-700 px-4 py-1.5 rounded-full font-semibold hover:bg-indigo-100 transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
