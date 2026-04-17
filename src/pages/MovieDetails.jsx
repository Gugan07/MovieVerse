import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getMovieById, movies } from '../data/movies'
import MovieCard from '../components/MovieCard'
import { getRating, setRating, getComments, addComment, isInWatchlist, toggleWatchlist } from '../services/storage'
import { useTheme } from '../context/ThemeContext'

// ── Star picker ──────────────────────────────────────────────────────────────
const StarPicker = ({ value, onChange }) => {
  const { theme } = useTheme()
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          className="text-2xl transition-transform hover:scale-110"
          style={{ color: s <= (hover || value) ? '#e8a020' : (theme === 'dark' ? '#2a2e38' : '#e2e8f0') }}
        >
          ★
        </button>
      ))}
    </div>
  )
}

// ── Rate modal ───────────────────────────────────────────────────────────────
const RateModal = ({ movie, onClose }) => {
  const [picked, setPicked] = useState(getRating(movie.id))

  const handleSave = () => {
    setRating(movie.id, picked)
    onClose(picked)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 dark:bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0f1218] border border-black/5 dark:border-white/10 rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl">
        <img src={movie.poster} alt={movie.title} className="w-20 h-28 object-cover rounded-lg mx-auto mb-4 ring-1 ring-black/5 dark:ring-white/10 shadow-lg" />
        <h3 className="text-slate-900 dark:text-white font-black text-lg mb-1 font-playfair">{movie.title}</h3>
        <p className="text-slate-500 dark:text-[#5a6472] text-xs mb-6">Rate this film out of 5 stars</p>

        <div className="flex justify-center mb-6">
          <StarPicker value={picked} onChange={setPicked} />
        </div>

        {picked > 0 && (
          <p className="text-[#e8a020] text-sm font-bold mb-4">
            {['', 'Poor', 'Fair', 'Good', 'Great', 'Masterpiece'][picked]} · {picked}/5
          </p>
        )}

        <div className="flex gap-3 justify-center">
          <button onClick={handleSave} disabled={picked === 0}
            className="bg-[#e8a020] text-[#0d0f12] px-6 py-2 rounded-md font-black text-sm uppercase tracking-wider hover:bg-[#f5c842] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#e8a020]/20">
            Save Rating
          </button>
          <button onClick={() => onClose(null)} className="border border-black/10 dark:border-white/10 text-slate-400 dark:text-[#7a8694] px-5 py-2 rounded-md text-sm font-semibold hover:text-slate-900 dark:hover:text-white transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
const MovieDetails = () => {
  const { id } = useParams()
  const { theme } = useTheme()
  const movie = getMovieById(id)

  const [userRating, setUserRating] = useState(getRating(id))
  const [showRateModal, setShowRateModal]   = useState(false)
  const [inWatchlist, setInWatchlist]       = useState(isInWatchlist(id))
  const [comments, setComments]             = useState(getComments(id))
  const [commentText, setCommentText]       = useState('')
  const [watchlistAnim, setWatchlistAnim]   = useState(false)
  const [ratingAnim, setRatingAnim]         = useState(false)

  useEffect(() => {
    setUserRating(getRating(id))
    setComments(getComments(id))
    setInWatchlist(isInWatchlist(id))
  }, [id])

  if (!movie) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-24 text-center">
        <div className="text-5xl mb-4">🎬</div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 font-playfair">Film Not Found</h2>
        <Link to="/" className="bg-[#e8a020] text-[#0d0f12] px-6 py-2.5 rounded font-black text-sm uppercase tracking-wider hover:bg-[#f5c842] shadow-lg shadow-[#e8a020]/20">
          Back to Home
        </Link>
      </div>
    )
  }

  const rating = parseFloat(movie.rating)
  const relatedMovies = movies.filter(m => m.genre === movie.genre && m.id !== movie.id).slice(0, 4)

  const handleWatchlist = () => {
    const added = toggleWatchlist(movie)
    setInWatchlist(added)
    setWatchlistAnim(true)
    setTimeout(() => setWatchlistAnim(false), 600)
  }

  const handleRatingClose = (picked) => {
    setShowRateModal(false)
    if (picked !== null) {
      setRating(movie.id, picked)
      setUserRating(picked)
      setRatingAnim(true)
      setTimeout(() => setRatingAnim(false), 600)
    }
  }

  const handlePostComment = () => {
    if (!commentText.trim()) return
    const newComment = addComment(id, commentText.trim())
    setComments(prev => [newComment, ...prev])
    setCommentText('')
  }

  return (
    <div className="bg-slate-50 dark:bg-[#0d0f12] min-h-screen fade-in">
      {showRateModal && <RateModal movie={movie} onClose={handleRatingClose} />}

      {/* Blurred backdrop */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${movie.poster})`, filter: 'blur(30px) brightness(0.4)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#0d0f12] to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-5 -mt-36 relative z-10 pb-20">
        <Link to="/" className="inline-flex items-center gap-1.5 text-[#e8a020] text-[11px] font-black uppercase tracking-[0.2em] mb-6 hover:translate-x-[-4px] transition-all">
          ← Back to Cinema
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-7">

          {/* ── Sidebar ── */}
          <div className="md:col-span-1">
            <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/8 mb-6 transform hover:scale-[1.02] transition-transform duration-500">
              <img src={movie.poster} alt={movie.title} className="w-full h-auto" />
            </div>

            {/* Action buttons */}
            <div className="space-y-2 mb-5">
              {/* Watchlist */}
              <button
                onClick={handleWatchlist}
                className={`w-full py-3 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                  inWatchlist
                    ? 'bg-[#e8a020] text-[#0d0f12] shadow-[#e8a020]/20'
                    : 'bg-white dark:bg-[#0f1218] border border-black/5 dark:border-white/8 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-[#1a1e26]'
                } ${watchlistAnim ? 'scale-95' : 'scale-100'}`}
              >
                {inWatchlist ? '✓ In Watchlist' : '+ Watchlist'}
              </button>

              {/* Rate */}
              <button
                onClick={() => setShowRateModal(true)}
                className={`w-full py-3 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 border ${
                  userRating > 0
                    ? 'border-[#e8a020]/40 bg-[#e8a020]/10 text-[#e8a020]'
                    : 'border-black/5 dark:border-white/8 bg-white dark:bg-[#0f1218] text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-[#1a1e26]'
                } ${ratingAnim ? 'scale-95' : 'scale-100'}`}
              >
                {userRating > 0
                  ? `${'★'.repeat(userRating)}${'☆'.repeat(5 - userRating)} Rated ${userRating}/5`
                  : '★ Rate Film'
                }
              </button>
            </div>

            {/* Film details */}
            <div className="bg-white dark:bg-[#0f1218] rounded-2xl p-6 border border-black/5 dark:border-white/5 shadow-sm dark:shadow-none">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-[#3a4048] mb-4">Metadata</h4>
              <dl className="space-y-4">
                {[['Director', movie.director], ['Genre', movie.genre], ['Year', movie.year]].map(([l, v]) => (
                  <div key={l}>
                    <dt className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-[#3a4048] mb-1 font-bold">{l}</dt>
                    <dd className="text-slate-900 dark:text-white text-sm font-bold">{v}</dd>
                  </div>
                ))}
                <div>
                  <dt className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-[#3a4048] mb-2 font-bold">Cast</dt>
                  <dd className="flex flex-wrap gap-1.5 pt-1">
                    {movie.cast.map(a => (
                      <span key={a} className="text-[9px] text-slate-500 dark:text-[#7a8694] bg-slate-50 dark:bg-[#131720] px-2 py-1 rounded-md border border-black/5 dark:border-white/5 font-semibold">{a}</span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* ── Main content ── */}
          <div className="md:col-span-3">
            <div className="flex flex-wrap items-center gap-2 mb-4 text-[10px] text-slate-400 dark:text-[#5a6472] uppercase tracking-[0.2em] font-black">
              <span>{movie.year}</span>
              <span className="text-slate-300 dark:text-[#2a2e38]">·</span>
              <span className="bg-[#e8a020]/10 text-[#e8a020] px-2.5 py-1 rounded-md">{movie.genre}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-3 tracking-tight font-playfair">
              {movie.title}
            </h1>

            <p className="text-slate-500 dark:text-[#5a6472] text-sm mb-6">
              Directed by <span className="text-slate-900 dark:text-[#a0aab4] font-black italic">{movie.director}</span>
            </p>

            {/* Rating display */}
            <div className="flex items-center flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white dark:bg-[#0f1218] rounded-2xl px-4 py-2 border border-black/5 dark:border-white/8 shadow-sm dark:shadow-none">
                <span className="text-[#e8a020] text-xl">★</span>
                <span className="text-slate-900 dark:text-white font-black text-2xl leading-none">{movie.rating}</span>
                <span className="text-slate-400 dark:text-[#3a4048] text-xs font-bold">/10</span>
              </div>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className="text-2xl" style={{ color: s <= Math.round(rating/2) ? '#e8a020' : (theme === 'dark' ? '#2a2e38' : '#e2e8f0') }}>★</span>
                ))}
              </div>
              {userRating > 0 && (
                <div className="bg-[#e8a020]/10 border border-[#e8a020]/25 rounded-xl px-4 py-2 text-xs text-[#e8a020] font-black uppercase tracking-widest">
                  Personal: {userRating}/5
                </div>
              )}
            </div>

            <div className="h-px bg-gradient-to-r from-[#e8a020]/30 to-transparent mb-6" />

            {/* Synopsis */}
            <div className="mb-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-[#3a4048] mb-4">The Story</h2>
              <p className="text-slate-700 dark:text-[#a0aab4] leading-relaxed text-lg font-medium max-w-2xl">{movie.description}</p>
            </div>

            {/* Review */}
            <div className="bg-white dark:bg-[#0f1218] rounded-3xl border-l-[4px] border-l-[#e8a020] p-8 md:p-12 mb-16 shadow-2xl dark:shadow-none relative overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#e8a020]/5 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
              
              <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#e8a020] rounded-2xl flex items-center justify-center text-[#0d0f12] text-xl font-black shadow-xl shadow-[#e8a020]/20">V</div>
                  <div>
                    <div className="text-slate-900 dark:text-white text-xl font-black tracking-tight font-playfair">FilmVerse Editorial</div>
                    <div className="text-slate-400 dark:text-[#3a4048] text-[10px] font-black uppercase tracking-[0.3em]">Master Review</div>
                  </div>
                </div>
                <div className="text-[#e8a020] text-5xl font-black font-playfair leading-none">
                  {movie.rating}
                  <span className="text-slate-300 dark:text-[#3a4048] text-sm uppercase ml-1">/10</span>
                </div>
              </div>

              <div className="text-slate-700 dark:text-[#b0bac4] leading-[1.8] text-xl max-w-none relative z-10 font-serif italic">
                <p className="first-letter:text-7xl first-letter:font-black first-letter:text-[#e8a020] first-letter:mr-4 first-letter:float-left first-letter:leading-[0.8] first-letter:mt-2">
                  {movie.fullReview}
                </p>
              </div>
            </div>

            {/* ── Comments ── */}
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-[#3a4048] mb-6">
                Discussion <span className="text-[#e8a020] ml-1">({comments.length})</span>
              </h2>

              {/* Post comment box */}
              <div className="bg-white dark:bg-[#0f1218] rounded-2xl p-6 border border-black/5 dark:border-white/5 mb-8 shadow-sm">
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Share your cinematic perspective…"
                  className="w-full bg-slate-50 dark:bg-[#131720] text-slate-900 dark:text-white rounded-xl p-4 mb-4 text-sm outline-none focus:ring-1 focus:ring-[#e8a020] placeholder-slate-400 dark:placeholder-[#3a4048] resize-none border border-black/5 dark:border-white/5 h-28 transition-all"
                />
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 dark:text-[#3a4048] text-[10px] font-bold uppercase tracking-widest">{commentText.length}/500</span>
                  <button
                    onClick={handlePostComment}
                    disabled={!commentText.trim()}
                    className="bg-[#e8a020] text-[#0d0f12] px-8 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-[#f5c842] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#e8a020]/20"
                  >
                    Post Comment
                  </button>
                </div>
              </div>

              {/* Comment list */}
              {comments.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-[#0f1218] rounded-2xl border border-dashed border-black/10 dark:border-white/10">
                  <p className="text-slate-400 dark:text-[#3a4048] text-sm italic">Be the first to share your perspective on this masterpiece.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map(c => (
                    <div key={c.id} className="bg-white dark:bg-[#0f1218] rounded-2xl p-6 border border-black/5 dark:border-white/5 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-[#e8a020] flex items-center justify-center text-[#0d0f12] text-xs font-black shadow-lg shadow-[#e8a020]/20">
                          {c.author?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="text-slate-900 dark:text-white text-xs font-black tracking-tight">{c.author}</div>
                          <div className="text-slate-400 dark:text-[#3a4048] text-[9px] font-black uppercase tracking-widest">{c.date}</div>
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-[#8a96a4] text-sm leading-relaxed font-medium">{c.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related films */}
        {relatedMovies.length > 0 && (
          <div className="mt-20 pt-16 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-1.5 h-10 bg-[#e8a020] rounded-full shadow-[0_0_15px_rgba(232,160,32,0.4)]" />
              <div>
                <p className="text-[#e8a020] text-[10px] font-black uppercase tracking-[0.3em] mb-1">Cinephile's Choice</p>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white font-playfair">
                  Related {movie.genre} Films
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {relatedMovies.map(m => <MovieCard key={m.id} movie={m} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieDetails
