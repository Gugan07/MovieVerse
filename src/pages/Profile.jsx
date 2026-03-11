import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  getWatchlist, toggleWatchlist,
  getAllRatings,
  getComments,
  getLikes
} from '../services/storage'
import { movies as editorialMovies } from '../data/movies'

// ── Helpers ───────────────────────────────────────────────────────────────────

// Build full activity feed from all localStorage data
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

  // Comments per movie (just count, link to movie)
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

// ── Sub-components ─────────────────────────────────────────────────────────────

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
    <div className="group flex items-center gap-3 bg-[#131720] rounded-lg p-2.5 border border-white/5 hover:border-[#e8a020]/25 transition-all">
      <Link to={linkTo} className="flex items-center gap-3 flex-1 min-w-0">
        {item.poster ? (
          <img src={item.poster} alt={item.title}
            className="w-10 h-14 object-cover rounded flex-shrink-0"
            onError={e => { e.target.style.display = 'none' }} />
        ) : (
          <div className="w-10 h-14 bg-[#1a1e26] rounded flex-shrink-0 flex items-center justify-center text-[#3a4048] text-xs">🎬</div>
        )}
        <div className="min-w-0">
          <p className="text-white text-xs font-bold truncate group-hover:text-[#e8a020] transition-colors">
            {item.title}
          </p>
          {item.year && <p className="text-[#4a5462] text-[10px]">{item.year}</p>}
        </div>
      </Link>
      <button
        onClick={() => onRemove(item)}
        className="text-[#3a4048] hover:text-red-400 text-xs p-1 flex-shrink-0 transition-colors"
        title="Remove from watchlist"
      >
        ✕
      </button>
    </div>
  )
}

// ── Main Profile Page ──────────────────────────────────────────────────────────
const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser]         = useState(null)
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
    <div className="min-h-screen bg-[#0d0f12]">
      {/* ── Profile header banner ── */}
      <div className="bg-[#0f1218] border-b border-white/5">
        {/* Decorative top bar */}
        <div className="h-1 bg-gradient-to-r from-[#e8a020] via-[#f5c842] to-[#e8a020]" />

        <div className="max-w-5xl mx-auto px-5 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">

            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-[#1a1e26] border-4 border-[#0f1218] ring-2 ring-[#e8a020]/40 flex items-center justify-center">
                {formData.avatar
                  ? <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" onError={e => { e.target.style.display='none' }} />
                  : <span className="text-4xl font-black text-[#e8a020]">{user.name?.[0]?.toUpperCase()}</span>
                }
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0f1218]" title="Online" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                {user.name}
              </h1>
              <p className="text-[#5a6472] text-sm">{user.email}</p>
              {user.bio && <p className="text-[#7a8694] text-sm mt-1 max-w-md">{user.bio}</p>}
              <p className="text-[#3a4048] text-xs mt-1">
                Member since {user.joinDate ?? 'March 2024'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#e8a020] text-[#0d0f12] px-4 py-2 rounded-md font-black text-xs uppercase tracking-wider hover:bg-[#f5c842] transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="border border-white/10 text-[#7a8694] px-4 py-2 rounded-md text-xs font-semibold hover:text-red-400 hover:border-red-400/30 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="flex gap-8 mt-8 pt-6 border-t border-white/5">
            {[
              { val: ratingCount,    label: 'Films Rated' },
              { val: watchlistCount, label: 'Watchlist' },
              { val: commentCount,   label: 'Comments' },
              { val: Object.values(getLikes()).filter(Boolean).length, label: 'Articles Liked' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-[#e8a020] text-2xl font-black">{s.val}</div>
                <div className="text-[#4a5462] text-[10px] uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="bg-[#0f1218] border border-white/10 rounded-xl p-7 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-black text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Edit Profile
            </h2>
            <div className="space-y-4">
              {[['Name', 'name', 'text'], ['Email', 'email', 'email'], ['Avatar URL', 'avatar', 'url']].map(([lbl, key, type]) => (
                <div key={key}>
                  <label className="block text-[10px] font-black text-[#5a6472] uppercase tracking-widest mb-1.5">{lbl}</label>
                  <input
                    type={type}
                    value={formData[key] ?? ''}
                    onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full bg-[#131720] border border-white/5 text-white text-sm rounded-md px-3 py-2.5 outline-none focus:border-[#e8a020] transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[10px] font-black text-[#5a6472] uppercase tracking-widest mb-1.5">Bio</label>
                <textarea
                  value={formData.bio ?? ''}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  placeholder="Tell us about yourself…"
                  className="w-full bg-[#131720] border border-white/5 text-white text-sm rounded-md px-3 py-2.5 outline-none focus:border-[#e8a020] transition-colors resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="bg-[#e8a020] text-[#0d0f12] px-6 py-2 rounded-md font-black text-sm uppercase tracking-wider hover:bg-[#f5c842] transition-colors">
                Save
              </button>
              <button onClick={() => { setFormData(user); setIsEditing(false) }}
                className="border border-white/10 text-[#7a8694] px-5 py-2 rounded-md text-sm font-semibold hover:text-white transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="max-w-5xl mx-auto px-5 py-10">

        {/* Tabs */}
        <div className="flex gap-1 border-b border-white/5 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab.id
                  ? 'text-[#e8a020]'
                  : 'text-[#4a5462] hover:text-[#7a8694]'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-[#e8a020] text-[#0d0f12]' : 'bg-[#1a1e26] text-[#5a6472]'
                }`}>
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e8a020] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* ── ACTIVITY TAB ── */}
        {activeTab === 'activity' && (
          <div>
            {activity.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🎬</div>
                <h3 className="text-white font-black text-lg mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  No Activity Yet
                </h3>
                <p className="text-[#5a6472] text-sm mb-5">Start by rating a film or leaving a comment!</p>
                <Link to="/" className="bg-[#e8a020] text-[#0d0f12] px-5 py-2 rounded font-black text-xs uppercase tracking-wider hover:bg-[#f5c842] transition-colors">
                  Browse Films
                </Link>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[15px] top-0 bottom-0 w-px bg-gradient-to-b from-[#e8a020] via-[#2a2e38] to-transparent" />

                <div className="space-y-5 pl-10">
                  {activity.map(item => {
                    const linkTo = item.isTmdb ? `/tmdb/${item.tmdbId}` : `/movie/${item.movieId}`
                    return (
                      <div key={item.id} className="relative group">
                        {/* Dot on timeline */}
                        <div className={`absolute -left-10 top-3 w-4 h-4 rounded-full border-2 border-[#0d0f12] flex-shrink-0 ${
                          item.type === 'rating' ? 'bg-[#e8a020]' : 'bg-blue-400'
                        }`} />

                        <Link to={linkTo}
                          className="flex items-start gap-3 bg-[#0f1218] border border-white/5 hover:border-[#e8a020]/25 rounded-xl p-4 transition-all duration-200">
                          {/* Mini poster */}
                          {item.poster ? (
                            <img src={item.poster} alt={item.title}
                              className="w-10 h-14 object-cover rounded flex-shrink-0 ring-1 ring-white/8" />
                          ) : (
                            <div className="w-10 h-14 bg-[#1a1e26] rounded flex-shrink-0 flex items-center justify-center text-[#3a4048]">🎬</div>
                          )}

                          <div className="flex-1 min-w-0">
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

                            <p className="text-white text-sm font-bold truncate group-hover:text-[#e8a020] transition-colors">
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
                              <p className="text-[#7a8694] text-xs mt-1 line-clamp-2">
                                "{item.text}"
                              </p>
                            )}

                            {item.date && <p className="text-[#3a4048] text-[10px] mt-1.5">{item.date}</p>}
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
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🎞️</div>
                <h3 className="text-white font-black text-lg mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Watchlist is Empty
                </h3>
                <p className="text-[#5a6472] text-sm mb-5">Browse films and click "+ Add to Watchlist" to save them here.</p>
                <Link to="/" className="bg-[#e8a020] text-[#0d0f12] px-5 py-2 rounded font-black text-xs uppercase tracking-wider hover:bg-[#f5c842] transition-colors">
                  Browse Films
                </Link>
              </div>
            ) : (
              <>
                <p className="text-[#5a6472] text-xs mb-5">
                  {watchlist.length} film{watchlist.length !== 1 ? 's' : ''} saved · Click to view, ✕ to remove
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
              <div className="text-center py-20">
                <div className="text-5xl mb-4">⭐</div>
                <h3 className="text-white font-black text-lg mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  No Ratings Yet
                </h3>
                <p className="text-[#5a6472] text-sm mb-5">Open any film and click "★ Rate This Film" to log your rating.</p>
                <Link to="/" className="bg-[#e8a020] text-[#0d0f12] px-5 py-2 rounded font-black text-xs uppercase tracking-wider hover:bg-[#f5c842] transition-colors">
                  Browse Films
                </Link>
              </div>
            ) : (
              <>
                {/* Rating distribution chart */}
                <div className="bg-[#0f1218] rounded-xl border border-white/5 p-5 mb-6">
                  <h3 className="text-white text-xs font-black uppercase tracking-widest mb-4">Rating Distribution</h3>
                  <div className="space-y-2">
                    {[5,4,3,2,1].map(star => {
                      const count = Object.values(ratings).filter(r => r === star).length
                      const pct   = ratingCount ? Math.round((count / ratingCount) * 100) : 0
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-[#e8a020] text-sm w-4">{star}★</span>
                          <div className="flex-1 h-2 bg-[#1a1e26] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#e8a020] rounded-full transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[#4a5462] text-xs w-8 text-right">{count}</span>
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
                        className="group flex items-center gap-3 bg-[#0f1218] border border-white/5 hover:border-[#e8a020]/25 rounded-xl p-3 transition-all">
                        {item.poster ? (
                          <img src={item.poster} alt={item.title}
                            className="w-10 h-14 object-cover rounded flex-shrink-0 ring-1 ring-white/8" />
                        ) : (
                          <div className="w-10 h-14 bg-[#1a1e26] rounded flex-shrink-0 flex items-center justify-center text-[#3a4048]">🎬</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-bold truncate group-hover:text-[#e8a020] transition-colors">
                            {item.title}
                          </p>
                          <div className="flex gap-0.5 mt-1">
                            {[1,2,3,4,5].map(s => (
                              <span key={s} className="text-base" style={{ color: s <= item.stars ? '#e8a020' : '#2a2e38' }}>★</span>
                            ))}
                          </div>
                          <p className="text-[#4a5462] text-[10px] mt-1">
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
