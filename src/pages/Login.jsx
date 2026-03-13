import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const user = {
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      joinDate: new Date().toLocaleDateString(),
      bio: '',
      avatar: ''
    }
    localStorage.setItem('user', JSON.stringify(user))
    navigate('/profile')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          {isLogin ? 'Welcome Back' : 'Join FilmVerse'}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-yellow-500 outline-none"
                required={!isLogin}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-yellow-500 outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-yellow-500 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-black py-3 rounded font-bold hover:bg-yellow-400 transition"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-yellow-500 hover:text-yellow-400"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
