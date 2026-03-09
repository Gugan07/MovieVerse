import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <nav className="bg-[#14181c] border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-white">
            🎬 CineVerse
          </Link>

          <div className="flex gap-8 items-center">
            <Link to="/" className="text-gray-300 hover:text-white transition text-sm font-medium">
              Home
            </Link>
            <Link to="/categories" className="text-gray-300 hover:text-white transition text-sm font-medium">
              Categories
            </Link>
            <Link to="/articles" className="text-gray-300 hover:text-white transition text-sm font-medium">
              Articles
            </Link>
            <Link to="/shortfilms" className="text-gray-300 hover:text-white transition text-sm font-medium">
              Short Films
            </Link>
            <Link to="/masterclass" className="text-gray-300 hover:text-white transition text-sm font-medium">
              Masterclass
            </Link>
            <Link to="/festivals" className="text-gray-300 hover:text-white transition text-sm font-medium">
              Festivals
            </Link>
            <Link to="/filmschools" className="text-gray-300 hover:text-white transition text-sm font-medium">
              Film Schools
            </Link>
            {user ? (
              <Link to="/profile" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-medium text-sm">
                {user.name}
              </Link>
            ) : (
              <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-medium text-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
