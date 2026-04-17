import { Link, NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
  const [user, setUser] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { to: '/', label: 'Films' },
    { to: '/categories', label: 'Categories' },
    { to: '/articles', label: 'Articles' },
    { to: '/shortfilms', label: 'Short Films' },
    { to: '/masterclass', label: 'Masterclass' },
    { to: '/festivals', label: 'Festivals' },
    { to: '/filmschools', label: 'Film Schools' },
  ]

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'glass-premium py-1 shadow-2xl' 
        : 'bg-white dark:bg-[#0d0f12] py-2 border-b border-black/5 dark:border-white/5'
    }`}>
      {/* Amber top accent bar */}
      <div className={`h-0.5 bg-gradient-to-r from-[#e8a020] via-[#f5c842] to-[#e8a020] absolute top-0 left-0 right-0 transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-40'}`} />

      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-between items-center h-14">

          {/* Logo — unique wordmark style */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded bg-[#e8a020] flex items-center justify-center flex-shrink-0 group-hover:rotate-3 transition-transform duration-200">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#0d0f12]">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </div>
            <div className="leading-none">
              <span className="text-slate-900 dark:text-white font-black text-lg tracking-tight font-playfair">Film</span>
              <span className="text-[#e8a020] font-black text-lg tracking-tight font-playfair">Verse</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-5">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300 relative px-1 ${
                    isActive
                      ? 'text-[#e8a020]'
                      : 'text-slate-500 dark:text-[#5a6472] hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#e8a020] rounded-full shadow-[0_0_8px_#e8a020]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-slate-500 dark:text-[#5a6472]"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4-9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M7.757 6.343l.707.707M12 8a4 4 0 110 8 4 4 0 010-8z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Auth */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <Link to="/profile" className="flex items-center gap-2 bg-slate-100 dark:bg-[#1a1e26] text-slate-900 dark:text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-slate-200 dark:hover:bg-[#22273a] transition-colors border border-black/5 dark:border-white/8">
                  <div className="w-5 h-5 rounded-full bg-[#e8a020] flex items-center justify-center text-[#0d0f12] text-xs font-black">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  {user.name}
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-[#7a8694] hover:text-slate-900 dark:hover:text-white transition-colors">
                    Sign In
                  </Link>
                  <Link to="/login" className="bg-[#e8a020] text-[#0d0f12] px-3.5 py-1.5 rounded-md text-[11px] font-black uppercase tracking-wider hover:bg-[#f5c842] transition-colors">
                    Join
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-slate-500 dark:text-[#a0aab4] p-1.5">
              <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current">
                {menuOpen
                  ? <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                  : <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden dark:bg-[#111318] bg-white border-t border-black/5 dark:border-white/5 px-5 py-4">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm text-slate-500 dark:text-[#7a8694] hover:text-slate-900 dark:hover:text-white font-medium border-b border-black/5 dark:border-white/5 last:border-0">
              {link.label}
            </Link>
          ))}
          <Link to="/login" onClick={() => setMenuOpen(false)}
            className="mt-3 inline-block bg-[#e8a020] text-[#0d0f12] px-5 py-2 rounded-md text-xs font-black uppercase tracking-wider">
            Sign In / Join
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar
