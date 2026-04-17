import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  getWatchlist, toggleWatchlist,
  getAllRatings,
  getComments,
  getLikes
} from '../services/storage'
import { movies as editorialMovies } from '../data/movies'
import { useTheme } from '../context/ThemeContext'


const buildActivity = () => {
  const activity = []

  // Ratings
  const ratings = getAllRatings()
  Object.entries(ratings).forEach(([movieId, stars]) => {
    if (!stars) return
    const movie = editorialMovies.find(m => String(m.id) === String(movieId))
    activity.push({
      type: 'rating',
      id: `rating_${movieId}`,
      movieId,
      title: movie?.title ?? (movieId.startsWith('tmdb_') ? 'TMDB Film' : `Film #${movieId}`),
      poster: movie?.poster ?? null,
      stars,
      isTmdb: movieId.startsWith('tmdb_'),
      tmdbId: movieId.startsWith('tmdb_') ? movieId.replace('tmdb_', '') : null,
      timestamp: Date.now() - Math.random() * 1000, // treat as recent
      label: `You rated ${['', '★', '★★', '★★★', '★★★★', '★★★★★'][stars]} (${stars}/5)`,
    })
  })

  const commentsRaw = JSON.parse(localStorage.getItem('cv_comments') || '{}')
  Object.entries(commentsRaw).forEach(([movieId, comments]) => {
    if (!Array.isArray(comments) || comments.length === 0) return
    const movie = editorialMovies.find(m => String(m.id) === String(movieId))
    comments.forEach(c => {
      activity.push({
        type: 'comment',
        id: `comment_${c.id}`,
        movieId,
        title: movie?.title ?? (movieId.startsWith('tmdb_') ? 'TMDB Film' : `Film #${movieId}`),
        poster: movie?.poster ?? null,
        text: c.text,
        date: c.date,
        isTmdb: movieId.startsWith('tmdb_'),
        tmdbId: movieId.startsWith('tmdb_') ? movieId.replace('tmdb_', '') : null,
        timestamp: c.timestamp ?? 0,
        label: `Commented: "${c.text.substring(0, 60)}${c.text.length > 60 ? '…' : ''}"`,
      })
    })
  })

  // Sort newest first
  return activity.sort((a, b) => b.timestamp - a.timestamp)
}

const STARS = ['', '★', '★★', '★★★', '★★★★', '★★★★★']



const ActivityIcon = ({ type }) => (
  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${
    type === 'rating' ? 'bg-[#e8a020]/15 text-[#e8a020]' : 'bg-blue-500/15 text-blue-400'
  }`}>
    {type === 'rating' ? '★' : '💬'}
  </div>
)

const WatchlistCard = ({ item, onRemove }) => {
  const linkTo = item.id?.startsWith('tmdb_')
    ? `/tmdb/${item.id.replace('tmdb_', '')}`
    : `/movie/${item.id}`

  return (
    <div className="group flex items-center gap-3 bg-white dark:bg-[#131720] rounded-xl p-3 border border-black/5 dark:border-white/5 hover:border-[#e8a020]/25 transition-all shadow-sm dark:shadow-none translate-y-0 hover:-translate-y-1">
      <Link to={linkTo} className="flex items-center gap-3 flex-1 min-w-0">
        {item.poster ? (
          <img src={item.poster} alt={item.title}
            className="w-10 h-14 object-cover rounded flex-shrink-0"
            onError={e => { e.target.style.display = 'none' }} />
        ) : (
          <div className="w-10 h-14 bg-[#1a1e26] rounded flex-shrink-0 flex items-center justify-center text-[#3a4048] text-xs">🎬</div>
        )}
        <div className="min-w-0">
          <p className="text-slate-900 dark:text-white text-xs font-black truncate group-hover:text-[#e8a020] transition-colors">
            {item.title}
          </p>
          {item.year && <p className="text-slate-400 dark:text-[#4a5462] text-[10px] font-bold">{item.year}</p>}
        </div>
      </Link>
      <button
        onClick={() => onRemove(item)}
        className="text-slate-300 dark:text-[#3a4048] hover:text-red-400 text-xs p-2 flex-shrink-0 transition-colors"
        title="Remove"
      >
        ✕
      </button>
    </div>
  )
}

const Profile = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', bio: '', avatar: '' })
  const [activeTab, setActiveTab] = useState('activity')
  const [watchlist, setWatchlist]   = useState([])
  const [activity, setActivity]     = useState([])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { navigate('/login'); return }
    const parsed = JSON.parse(userData)
    setUser(parsed)
    setFormData(parsed)
    setWatchlist(getWatchlist())
    setActivity(buildActivity())
  }, [navigate])

  const handleSave = () => {
    localStorage.setItem('user', JSON.stringify(formData))
    setUser(formData)
    setIsEditing(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleRemoveWatchlist = (item) => {
    toggleWatchlist(item)
    setWatchlist(getWatchlist())
  }

  if (!user) return null

  const ratings   = getAllRatings()
  const ratingCount   = Object.values(ratings).filter(Boolean).length
  const watchlistCount = watchlist.length
  const commentCount  = activity.filter(a => a.type === 'comment').length

  const tabs = [
    { id: 'activity',  label: 'Activity',   count: activity.length },
    { id: 'watchlist', label: 'Watchlist',  count: watchlistCount },
    { id: 'ratings',   label: 'My Ratings', count: ratingCount },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0f12] fade-in">
      {/* ── Profile header banner ── */}
      <div className="bg-white dark:bg-[#0f1218] border-b border-black/5 dark:border-white/5 relative overflow-hidden">
        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")'
        }} />
        
        {/* Decorative top bar */}
        <div className="h-1 bg-gradient-to-r from-[#e8a020] via-[#f5c842] to-[#e8a020] relative z-10" />

        <div className="max-w-5xl mx-auto px-5 py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">

            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 dark:bg-[#1a1e26] border-4 border-white dark:border-[#0f1218] ring-2 ring-[#e8a020]/40 flex items-center justify-center shadow-xl">
                {formData.avatar
                  ? <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" onError={e => { e.target.style.display='none' }} />
                  : <span className="text-4xl font-black text-[#e8a020]">{user.name?.[0]?.toUpperCase()}</span>
                }
              </div>
              <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500 border-4 border-white dark:border-[#0f1218]" title="Online" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white font-playfair">
                {user.name}
              </h1>
              <p className="text-slate-500 dark:text-[#5a6472] text-sm font-bold tracking-tight">{user.email}</p>
              {user.bio && <p className="text-slate-600 dark:text-[#7a8694] text-sm mt-2 max-w-md italic">{user.bio}</p>}
              <p className="text-slate-400 dark:text-[#3a4048] text-[10px] uppercase font-black tracking-widest mt-2">
                Member since {user.joinDate ?? 'March 2024'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#e8a020] text-[#0d0f12] px-6 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-[#f5c842] transition-all shadow-lg shadow-[#e8a020]/20"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="bg-transparent border border-black/10 dark:border-white/10 text-slate-400 dark:text-[#7a8694] px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:text-red-500 hover:border-red-500/30 transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-10 md:gap-14 mt-12 pt-8 border-t border-black/5 dark:border-white/5">
            {[
              { val: ratingCount,    label: 'Films Rated' },
              { val: watchlistCount, label: 'Watchlist' },
              { val: commentCount,   label: 'Comments' },
              { val: Object.values(getLikes()).filter(Boolean).length, label: 'Articles Liked' },
            ].map((s, i) => (
              <div key={s.label} className="fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="text-[#e8a020] text-3xl font-black mb-1 font-playfair">{s.val}</div>
                <div className="text-slate-400 dark:text-[#4a5462] text-[10px] font-black uppercase tracking-[0.25em]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 dark:bg-black/85 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f1218] border border-black/5 dark:border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 font-playfair">
              Edit Profile
            </h2>
            <div className="space-y-4">
              {/* Modal form inputs */}
              {[['Name', 'name', 'text'], ['Email', 'email', 'email'], ['Avatar URL', 'avatar', 'url']].map(([lbl, key, type]) => (
                <div key={key}>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-[#5a6472] uppercase tracking-widest mb-1.5">{lbl}</label>
                  <input
                    type={type}
                    value={formData[key] ?? ''}
                    onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#131720] border border-black/5 dark:border-white/5 text-slate-900 dark:text-white text-sm rounded-lg px-4 py-3 outline-none focus:border-[#e8a020] transition-all"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-[#5a6472] uppercase tracking-widest mb-1.5">Bio</label>
                <textarea
                  value={formData.bio ?? ''}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  placeholder="Tell us about yourself…"
                  className="w-full bg-slate-50 dark:bg-[#131720] border border-black/5 dark:border-white/5 text-slate-900 dark:text-white text-sm rounded-lg px-4 py-3 outline-none focus:border-[#e8a020] transition-all resize-none shadow-inner"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={handleSave} className="bg-[#e8a020] text-[#0d0f12] px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#f5c842] transition-all shadow-lg shadow-[#e8a020]/20">
                Save Changes
              </button>
              <button onClick={() => { setFormData(user); setIsEditing(false) }}
                className="border border-black/10 dark:border-white/10 text-slate-400 dark:text-[#7a8694] px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="max-w-5xl mx-auto px-5 py-10">

        {/* Tabs */}
        <div className="flex gap-1 border-b border-black/5 dark:border-white/5 mb-10 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative flex-shrink-0 ${
                activeTab === tab.id
                  ? 'text-[#e8a020]'
                  : 'text-slate-400 dark:text-[#4a5462] hover:text-slate-600 dark:hover:text-[#7a8694]'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-md font-black ${
                  activeTab === tab.id ? 'bg-[#e8a020] text-[#0d0f12]' : 'bg-slate-100 dark:bg-[#1a1e26] text-slate-400 dark:text-[#5a6472]'
                }`}>
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e8a020] rounded-full shadow-[0_0_10px_rgba(232,160,32,0.5)]" />
              )}
            </button>
          ))}
        </div>

        {/* ── ACTIVITY TAB ── */}
        {activeTab === 'activity' && (
          <div>
            {activity.length === 0 ? (
              <div className="text-center py-24 bg-white dark:bg-[#0f1218] rounded-3xl border border-black/5 dark:border-white/5 shadow-sm">
                <div className="text-6xl mb-6">🎬</div>
                <h3 className="text-slate-900 dark:text-white font-black text-2xl mb-3 font-playfair">
                  No Activity Yet
                </h3>
                <p className="text-slate-500 dark:text-[#5a6472] text-sm mb-10 max-w-sm mx-auto">Start your journey by rating a film or contributing to a discussion.</p>
                <Link to="/" className="bg-[#e8a020] text-[#0d0f12] px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#f5c842] transition-all shadow-lg shadow-[#e8a020]/20">
                  Explore Films
                </Link>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[20px] top-6 bottom-0 w-1 bg-gradient-to-b from-slate-200 dark:from-[#2a2e38] via-slate-100 dark:via-[#1a1e26] to-transparent rounded-full" />

                <div className="space-y-6 pl-12">
                  {activity.map(item => {
                    const linkTo = item.isTmdb ? `/tmdb/${item.tmdbId}` : `/movie/${item.movieId}`
                    return (
                      <div key={item.id} className="relative group">
                        {/* Dot on timeline */}
                        <div className={`absolute -left-12 top-4 w-6 h-6 rounded-lg border-4 border-slate-50 dark:border-[#0d0f12] z-10 flex-shrink-0 shadow-lg ${
                          item.type === 'rating' ? 'bg-[#e8a020]' : 'bg-blue-500'
                        }`} />

                        <Link to={linkTo}
                          className="flex items-start gap-5 bg-white dark:bg-[#0f1218] border border-black/5 dark:border-white/5 hover:border-[#e8a020]/30 rounded-2xl p-5 transition-all duration-300 shadow-sm dark:shadow-none hover:shadow-xl dark:hover:bg-[#131720] group/card overflow-hidden relative">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-[#e8a020]/5 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover/card:scale-150 transition-transform duration-700" />
                          {/* Mini poster */}
                          {item.poster ? (
                            <img src={item.poster} alt={item.title}
                              className="w-14 h-20 object-cover rounded-lg flex-shrink-0 shadow-lg group-hover/card:scale-105 transition-transform" />
                          ) : (
                            <div className="w-14 h-20 bg-slate-100 dark:bg-[#1a1e26] rounded-lg flex-shrink-0 flex items-center justify-center text-slate-400 dark:text-[#3a4048]">🎬</div>
                          )}

                          <div className="flex-1 min-w-0 relative z-10">
                            {/* Type badge + title */}
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                item.type === 'rating' ? 'bg-[#e8a020]/15 text-[#e8a020]' : 'bg-blue-400/15 text-blue-400'
                              }`}>
                                {item.type === 'rating' ? '★ Rated' : '💬 Commented'}
                              </span>
                              {item.isTmdb && (
                                <span className="text-[9px] text-[#3a4048] uppercase tracking-wider">TMDB</span>
                              )}
                            </div>

                            <p className="text-slate-900 dark:text-white text-base font-black truncate group-hover/card:text-[#e8a020] transition-colors font-playfair mb-1 pt-1">
                              {item.title}
                            </p>

                            {/* Rating stars */}
                            {item.type === 'rating' && (
                              <div className="flex items-center gap-1 mt-1">
                                {[1,2,3,4,5].map(s => (
                                  <span key={s} className="text-sm" style={{ color: s <= item.stars ? '#e8a020' : '#2a2e38' }}>★</span>
                                ))}
                                <span className="text-[#5a6472] text-[10px] ml-1">{item.stars}/5</span>
                              </div>
                            )}

                            {/* Comment text */}
                            {item.type === 'comment' && (
                              <p className="text-slate-600 dark:text-[#7a8694] text-sm mt-2 line-clamp-2 leading-relaxed bg-slate-50 dark:bg-black/20 p-3 rounded-lg border border-black/5 dark:border-white/5 italic">
                                "{item.text}"
                              </p>
                            )}

                            {item.date && <p className="text-slate-400 dark:text-[#3a4048] text-[10px] uppercase font-black tracking-widest mt-3">{item.date}</p>}
                          </div>
                        </Link>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── WATCHLIST TAB ── */}
        {activeTab === 'watchlist' && (
          <div>
            {watchlist.length === 0 ? (
              <div className="text-center py-24 bg-white dark:bg-[#0f1218] rounded-3xl border border-black/5 dark:border-white/5 shadow-sm">
                <div className="text-6xl mb-6">🎞️</div>
                <h3 className="text-slate-900 dark:text-white font-black text-2xl mb-3 font-playfair">
                  Watchlist is Empty
                </h3>
                <p className="text-slate-500 dark:text-[#5a6472] text-sm mb-10 max-w-sm mx-auto">Build your personal cinema archive by exploring our collection.</p>
                <Link to="/" className="bg-[#e8a020] text-[#0d0f12] px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#f5c842] transition-all shadow-lg shadow-[#e8a020]/20">
                  Find Films
                </Link>
              </div>
            ) : (
              <>
                <p className="text-slate-500 dark:text-[#5a6472] text-[10px] font-black uppercase tracking-widest mb-6 bg-white dark:bg-[#0f1218] inline-block px-4 py-1.5 rounded-full border border-black/5 dark:border-white/5">
                  {watchlist.length} film{watchlist.length !== 1 ? 's' : ''} saved
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {watchlist.map(item => (
                    <WatchlistCard key={item.id} item={item} onRemove={handleRemoveWatchlist} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── RATINGS TAB ── */}
        {activeTab === 'ratings' && (
          <div>
            {ratingCount === 0 ? (
              <div className="text-center py-24 bg-white dark:bg-[#0f1218] rounded-3xl border border-black/5 dark:border-white/5 shadow-sm">
                <div className="text-6xl mb-6">⭐</div>
                <h3 className="text-slate-900 dark:text-white font-black text-2xl mb-3 font-playfair">
                  No Ratings Yet
                </h3>
                <p className="text-slate-500 dark:text-[#5a6472] text-sm mb-10 max-w-sm mx-auto">Share your voice. Log your first rating from any film page.</p>
                <Link to="/" className="bg-[#e8a020] text-[#0d0f12] px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#f5c842] transition-all shadow-lg shadow-[#e8a020]/20">
                  Rate Films
                </Link>
              </div>
            ) : (
              <>
                {/* Rating distribution chart */}
                <div className="bg-white dark:bg-[#0f1218] rounded-2xl border border-black/5 dark:border-white/5 p-8 mb-10 shadow-sm dark:shadow-none">
                  <h3 className="text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6">Review Spectrum</h3>
                  <div className="space-y-2">
                    {[5,4,3,2,1].map(star => {
                      const count = Object.values(ratings).filter(r => r === star).length
                      const pct   = ratingCount ? Math.round((count / ratingCount) * 100) : 0
                      return (
                        <div key={star} className="flex items-center gap-5">
                          <span className="text-[#e8a020] text-xs font-black w-6">{star}★</span>
                          <div className="flex-1 h-3 bg-slate-100 dark:bg-[#1a1e26] rounded-full overflow-hidden shadow-inner">
                            <div
                              className="h-full bg-gradient-to-r from-[#e8a020] to-[#f5c842] rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(232,160,32,0.4)]"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-slate-400 dark:text-[#4a5462] text-[10px] font-black w-10 text-right uppercase">{count} log{count !== 1 ? 's' : ''}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Rated films list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activity.filter(a => a.type === 'rating').map(item => {
                    const linkTo = item.isTmdb ? `/tmdb/${item.tmdbId}` : `/movie/${item.movieId}`
                    return (
                      <Link key={item.id} to={linkTo}
                        className="group flex items-center gap-4 bg-white dark:bg-[#0f1218] border border-black/5 dark:border-white/5 hover:border-[#e8a020]/30 rounded-2xl p-4 transition-all duration-300 shadow-sm dark:shadow-none hover:shadow-xl dark:hover:bg-[#131720]">
                        {item.poster ? (
                          <img src={item.poster} alt={item.title}
                            className="w-14 h-20 object-cover rounded-lg flex-shrink-0 shadow-md group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-14 h-20 bg-slate-100 dark:bg-[#1a1e26] rounded-lg flex-shrink-0 flex items-center justify-center text-slate-400 dark:text-[#3a4048]">🎬</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-900 dark:text-white text-base font-black truncate group-hover:text-[#e8a020] transition-colors font-playfair mb-1">
                            {item.title}
                          </p>
                          <div className="flex gap-1 mb-2">
                            {[1,2,3,4,5].map(s => (
                              <span key={s} className="text-lg" style={{ color: s <= item.stars ? '#e8a020' : (theme === 'dark' ? '#2a2e38' : '#e2e8f0') }}>★</span>
                            ))}
                          </div>
                          <p className="text-slate-400 dark:text-[#4a5462] text-[10px] font-black uppercase tracking-widest">
                            {['', 'Poor', 'Fair', 'Good', 'Great', 'Masterpiece'][item.stars]}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default Profile
