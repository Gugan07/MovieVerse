import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser, loginUser } from '../services/api'

const Login = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    let result
    if (isLogin) {
      result = await loginUser(formData.email, formData.password)
    } else {
      result = await registerUser(formData.name, formData.email, formData.password)
    }

    setLoading(false)

    if (result.success) {
      navigate('/profile')
    } else {
      // Fallback: if server is down, store locally and proceed
      if (!result.success && result.error?.includes('failed')) {
        const user = {
          name: formData.name || formData.email.split('@')[0],
          email: formData.email,
          joinDate: new Date().toLocaleDateString(),
          bio: '',
          avatar: ''
        }
        localStorage.setItem('user', JSON.stringify(user))
        navigate('/profile')
      } else {
        setError(result.error || 'Something went wrong')
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0f12] flex items-center justify-center px-4 py-24 fade-in">
      <div className="bg-white dark:bg-[#0f1218] p-10 rounded-3xl w-full max-w-md shadow-2xl border border-black/5 dark:border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#e8a020]/10 rounded-full -translate-y-16 translate-x-16 blur-3xl opacity-50" />

        <h1 className="text-4xl font-black text-center mb-2 text-slate-900 dark:text-white font-playfair">
          {isLogin ? 'Welcome Back' : 'Join FilmVerse'}
        </h1>
        <p className="text-slate-400 dark:text-[#5a6472] text-[10px] font-black uppercase tracking-[0.3em] text-center mb-8">
          {isLogin ? 'Access your collection' : 'Begin your cinematic journey'}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg px-4 py-3 mb-6 text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="fade-up">
              <label className="block text-[10px] font-black text-slate-400 dark:text-[#5a6472] uppercase tracking-widest mb-1.5 ml-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-[#131720] text-slate-900 dark:text-white border border-black/5 dark:border-white/5 focus:border-[#e8a020] outline-none transition-all"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-slate-400 dark:text-[#5a6472] uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-[#131720] text-slate-900 dark:text-white border border-black/5 dark:border-white/5 focus:border-[#e8a020] outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 dark:text-[#5a6472] uppercase tracking-widest mb-1.5 ml-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-[#131720] text-slate-900 dark:text-white border border-black/5 dark:border-white/5 focus:border-[#e8a020] outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e8a020] text-[#0d0f12] py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#f5c842] transition-all shadow-lg shadow-[#e8a020]/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait…' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-10 text-slate-400 dark:text-[#3a4048] text-[10px] font-black uppercase tracking-widest">
          {isLogin ? 'New to FilmVerse? ' : 'Already a member? '}
          <button
            onClick={() => { setIsLogin(!isLogin); setError('') }}
            className="text-[#e8a020] hover:text-[#f5c842] ml-1 transition-colors"
          >
            {isLogin ? 'Register Here' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
