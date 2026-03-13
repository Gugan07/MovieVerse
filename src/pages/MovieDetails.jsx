import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getMovieById, movies } from '../data/movies'
import MovieCard from '../components/MovieCard'
import { getRating, setRating, getComments, addComment, isInWatchlist, toggleWatchlist } from '../services/storage'

// ── Star picker ──────────────────────────────────────────────────────────────
const StarPicker = ({ value, onChange }) => {
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
          style={{ color: s <= (hover || value) ? '#e8a020' : '#2a2e38' }}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
      <div className="bg-[#0f1218] border border-white/10 rounded-xl p-8 w-full max-w-sm text-center">
        <img src={movie.poster} alt={movie.title} className="w-20 h-28 object-cover rounded-lg mx-auto mb-4 ring-1 ring-white/10" />
        <h3 className="text-white font-black text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{movie.title}</h3>
        <p className="text-[#5a6472] text-xs mb-6">Rate this film out of 5 stars</p>

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
            className="bg-[#e8a020] text-[#0d0f12] px-6 py-2 rounded-md font-black text-sm uppercase tracking-wider hover:bg-[#f5c842] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Save Rating
          </button>
          <button onClick={() => onClose(null)} className="border border-white/10 text-[#7a8694] px-5 py-2 rounded-md text-sm font-semibold hover:text-white transition-colors">
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
        <h2 className="text-2xl font-black text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Film Not Found</h2>
        <Link to="/" className="bg-[#e8a020] text-[#0d0f12] px-6 py-2.5 rounded font-black text-sm uppercase tracking-wider hover:bg-[#f5c842]">
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
    <div className="bg-[#0d0f12] min-h-screen">
      {showRateModal && <RateModal movie={movie} onClose={handleRatingClose} />}

      {/* Blurred backdrop */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${movie.poster})`, filter: 'blur(14px) brightness(0.18)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f12] to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-5 -mt-36 relative z-10 pb-20">
        <Link to="/" className="inline-flex items-center gap-1.5 text-[#e8a020] text-[11px] font-black uppercase tracking-widest mb-6 hover:text-white transition-colors">
          ← All Films
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-7">

          {/* ── Sidebar ── */}
          <div className="md:col-span-1">
            <div className="rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/8 mb-4">
              <img src={movie.poster} alt={movie.title} className="w-full h-auto" />
            </div>

            {/* Action buttons */}
            <div className="space-y-2 mb-5">
              {/* Watchlist */}
              <button
                onClick={handleWatchlist}
                className={`w-full py-2.5 rounded font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                  inWatchlist
                    ? 'bg-[#e8a020] text-[#0d0f12] hover:bg-red-500 hover:text-white'
                    : 'bg-[#0f1218] border border-white/8 text-white hover:bg-[#1a1e26]'
                } ${watchlistAnim ? 'scale-95' : 'scale-100'}`}
              >
                {inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
              </button>

              {/* Rate */}
              <button
                onClick={() => setShowRateModal(true)}
                className={`w-full py-2.5 rounded font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border ${
                  userRating > 0
                    ? 'border-[#e8a020]/40 bg-[#e8a020]/10 text-[#e8a020]'
                    : 'border-white/8 bg-[#0f1218] text-white hover:bg-[#1a1e26]'
                } ${ratingAnim ? 'scale-95' : 'scale-100'}`}
              >
                {userRating > 0
                  ? `${'★'.repeat(userRating)}${'☆'.repeat(5 - userRating)} Your Rating`
                  : '★ Rate This Film'
                }
              </button>
            </div>

            {/* Film details */}
            <div className="bg-[#0f1218] rounded-lg p-4 border border-white/5">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#3a4048] mb-3">Details</h4>
              <dl className="space-y-3">
                {[['Director', movie.director], ['Genre', movie.genre], ['Year', movie.year]].map(([l, v]) => (
                  <div key={l}>
                    <dt className="text-[10px] uppercase tracking-widest text-[#3a4048] mb-0.5">{l}</dt>
                    <dd className="text-white text-sm font-semibold">{v}</dd>
                  </div>
                ))}
                <div>
                  <dt className="text-[10px] uppercase tracking-widest text-[#3a4048] mb-1.5">Cast</dt>
                  <dd className="flex flex-wrap gap-1">
                    {movie.cast.map(a => (
                      <span key={a} className="text-[10px] text-[#7a8694] bg-[#131720] px-2 py-0.5 rounded border border-white/5">{a}</span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* ── Main content ── */}
          <div className="md:col-span-3">
            <div className="flex flex-wrap items-center gap-2 mb-3 text-[10px] text-[#5a6472] uppercase tracking-widest">
              <span>{movie.year}</span>
              <span className="text-[#2a2e38]">·</span>
              <span className="border border-white/10 px-2 py-0.5 rounded">{movie.genre}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white leading-[0.95] mb-2 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              {movie.title}
            </h1>

            <p className="text-[#5a6472] text-sm mb-4">
              Directed by <span className="text-[#a0aab4] font-semibold">{movie.director}</span>
            </p>

            {/* Rating display */}
            <div className="flex items-center flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-1.5 bg-[#0f1218] rounded-full px-3 py-1.5 border border-white/8">
                <span className="text-[#e8a020]">★</span>
                <span className="text-white font-black text-lg">{movie.rating}</span>
                <span className="text-[#3a4048] text-xs">/10</span>
              </div>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className="text-xl" style={{ color: s <= Math.round(rating/2) ? '#e8a020' : '#2a2e38' }}>★</span>
                ))}
              </div>
              {userRating > 0 && (
                <div className="bg-[#e8a020]/10 border border-[#e8a020]/25 rounded-full px-3 py-1 text-xs text-[#e8a020] font-bold">
                  You rated: {'★'.repeat(userRating)} {userRating}/5
                </div>
              )}
            </div>

            <div className="h-px bg-gradient-to-r from-[#e8a020]/30 to-transparent mb-6" />

            {/* Synopsis */}
            <div className="mb-7">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-[#3a4048] mb-3">Synopsis</h2>
              <p className="text-[#a0aab4] leading-relaxed">{movie.description}</p>
            </div>

            {/* Review */}
            <div className="bg-[#0f1218] rounded-3xl border border-white/5 border-l-[3px] border-l-[#e8a020] p-10 mb-12 glass-premium shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#e8a020]/5 rounded-full -translate-y-16 translate-x-16 blur-3xl" />
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#e8a020] rounded-xl flex items-center justify-center text-[#0d0f12] text-sm font-black shadow-lg shadow-[#e8a020]/20">F</div>
                  <div>
                    <div className="text-white text-base font-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>FilmVerse Editorial</div>
                    <div className="text-[#3a4048] text-[10px] font-black uppercase tracking-[0.2em]">Master Review</div>
                  </div>
                </div>
                <div className="text-[#e8a020] text-3xl font-black" style={{ fontFamily: "'Playfair Display', serif" }}>{movie.rating}<span className="text-[#3a4048] text-sm uppercase">/10</span></div>
              </div>

              <div className="text-[#b0bac4] leading-[1.8] text-lg max-w-none" style={{ fontFamily: "'Georgia', serif" }}>
                <p className="first-letter:text-6xl first-letter:font-black first-letter:text-[#e8a020] first-letter:mr-3 first-letter:float-left first-letter:leading-[1]">
                  {movie.fullReview}
                </p>
              </div>
            </div>

            {/* ── Comments ── */}
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-[#3a4048] mb-4">
                Comments <span className="text-[#e8a020]">({comments.length})</span>
              </h2>

              {/* Post comment box */}
              <div className="bg-[#0f1218] rounded-xl p-4 border border-white/5 mb-5">
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Share your thoughts on this film…"
                  className="w-full bg-[#131720] text-white rounded-lg p-3 mb-3 text-sm outline-none focus:ring-1 focus:ring-[#e8a020] placeholder-[#3a4048] resize-none border border-white/5 h-20"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[#3a4048] text-[10px]">{commentText.length}/500</span>
                  <button
                    onClick={handlePostComment}
                    disabled={!commentText.trim()}
                    className="bg-[#e8a020] text-[#0d0f12] px-5 py-2 rounded font-black text-xs uppercase tracking-wider hover:bg-[#f5c842] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Post Comment
                  </button>
                </div>
              </div>

              {/* Comment list */}
              {comments.length === 0 ? (
                <p className="text-[#3a4048] text-sm text-center py-6">Be the first to comment!</p>
              ) : (
                <div className="space-y-3">
                  {comments.map(c => (
                    <div key={c.id} className="bg-[#0f1218] rounded-xl p-4 border border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#e8a020] flex items-center justify-center text-[#0d0f12] text-[10px] font-black">
                          {c.author?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-white text-xs font-bold">{c.author}</span>
                        <span className="text-[#3a4048] text-[10px] ml-auto">{c.date}</span>
                      </div>
                      <p className="text-[#8a96a4] text-xs leading-relaxed">{c.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related films */}
        {relatedMovies.length > 0 && (
          <div className="mt-16 pt-10 border-t border-white/5">
            <div className="flex items-center gap-4 mb-7">
              <div className="w-1 h-7 bg-[#e8a020] rounded-full" />
              <div>
                <p className="text-[#e8a020] text-[10px] font-black uppercase tracking-[0.2em]">More Like This</p>
                <h2 className="text-xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Related {movie.genre} Films
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedMovies.map(m => <MovieCard key={m.id} movie={m} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieDetails
