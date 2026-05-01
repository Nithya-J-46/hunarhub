import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
    navigate('/')
  }

  const closeMenu = () => setIsMobileMenuOpen(false)

  return (
    <nav className="bg-indigo-700 text-white shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tight" onClick={closeMenu}>
          🧵 HunarHub
        </Link>
        
        {/* Hamburger Icon for Mobile */}
        <button 
          className="md:hidden text-white focus:outline-none" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/browse" className="hover:text-indigo-200 transition">Browse</Link>
          <Link to="/products" className="hover:text-indigo-200 transition">Products</Link>
          {user ? (
            <>
              {user.role === 'customer' && (
                <Link to="/my-dashboard" className="hover:text-indigo-200 transition">My Dashboard</Link>
              )}
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

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-indigo-800 border-t border-indigo-600 absolute w-full left-0 top-full shadow-xl flex flex-col px-4 py-4 space-y-4 text-sm font-medium">
          <Link to="/browse" className="block hover:text-indigo-200 transition" onClick={closeMenu}>Browse</Link>
          <Link to="/products" className="block hover:text-indigo-200 transition" onClick={closeMenu}>Products</Link>
          {user ? (
            <>
              {user.role === 'customer' && (
                <Link to="/my-dashboard" className="block hover:text-indigo-200 transition" onClick={closeMenu}>My Dashboard</Link>
              )}
              {user.role === 'entrepreneur' && (
                <Link to="/dashboard" className="block hover:text-indigo-200 transition" onClick={closeMenu}>Dashboard</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="block hover:text-indigo-200 transition" onClick={closeMenu}>Admin</Link>
              )}
              <div className="border-t border-indigo-600 pt-4 flex flex-col gap-3">
                <span className="text-indigo-200 text-xs">Logged in as {user.name}</span>
                <button onClick={handleLogout}
                  className="bg-white text-indigo-700 w-full px-4 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition text-center">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="border-t border-indigo-600 pt-4 flex flex-col gap-3">
              <Link to="/login" className="block text-center hover:text-indigo-200 transition" onClick={closeMenu}>Login</Link>
              <Link to="/register" onClick={closeMenu}
                className="bg-white text-indigo-700 block w-full text-center px-4 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
