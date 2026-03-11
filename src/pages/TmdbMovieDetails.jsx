import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchMovieDetails, getPoster, getBackdrop, getProfile } from '../services/tmdb'
import MovieCard from '../components/MovieCard'
import { normaliseTmdb } from '../hooks/useTMDB'
import { getRating, setRating as saveRating, getComments, addComment, isInWatchlist, toggleWatchlist } from '../services/storage'

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
        >★</button>
      ))}
    </div>
  )
}

// ── Rate modal ──────────────────────────────────────────────────────────────
const RateModal = ({ movie, tmdbId, onClose }) => {
  const [picked, setPicked] = useState(getRating(`tmdb_${tmdbId}`))
  const handleSave = () => {
    saveRating(`tmdb_${tmdbId}`, picked)
    onClose(picked)
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
      <div className="bg-[#0f1218] border border-white/10 rounded-xl p-8 w-full max-w-sm text-center shadow-2xl">
        {movie.poster_path && (
          <img src={getPoster(movie.poster_path, 'w185')} alt={movie.title}
            className="w-20 h-28 object-cover rounded-lg mx-auto mb-4 ring-1 ring-white/10" />
        )}
        <h3 className="text-white font-black text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{movie.title}</h3>
        <p className="text-[#5a6472] text-xs mb-6">Rate this film out of 5 stars</p>
        <div className="flex justify-center mb-4">
          <StarPicker value={picked} onChange={setPicked} />
        </div>
        {picked > 0 && (
          <p className="text-[#e8a020] text-sm font-bold mb-5">
            {['', 'Poor', 'Fair', 'Good', 'Great', 'Masterpiece'][picked]} · {picked}/5
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <button onClick={handleSave} disabled={picked === 0}
            className="bg-[#e8a020] text-[#0d0f12] px-6 py-2 rounded-md font-black text-sm uppercase tracking-wider hover:bg-[#f5c842] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Save
          </button>
          <button onClick={() => onClose(null)} className="border border-white/10 text-[#7a8694] px-5 py-2 rounded-md text-sm font-semibold hover:text-white transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
const TmdbMovieDetails = () => {
  const { id } = useParams()
  const storageKey = `tmdb_${id}`

  const [movie, setMovie]               = useState(null)
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [userRating, setUserRating]     = useState(getRating(storageKey))
  const [showRateModal, setShowRateModal] = useState(false)
  const [inWatchlist, setInWatchlist]   = useState(isInWatchlist(storageKey))
  const [comments, setComments]         = useState(getComments(storageKey))
  const [commentText, setCommentText]   = useState('')
  const [watchlistAnim, setWatchlistAnim] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchMovieDetails(id)
      .then(data => setMovie(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    setUserRating(getRating(storageKey))
    setComments(getComments(storageKey))
    setInWatchlist(isInWatchlist(storageKey))
  }, [id])

  if (loading) return (
    <div className="max-w-6xl mx-auto px-5 py-24 text-center">
      <div className="inline-block w-10 h-10 border-2 border-[#e8a020] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-[#5a6472]">Loading…</p>
    </div>
  )

  if (error || !movie) return (
    <div className="max-w-6xl mx-auto px-5 py-24 text-center">
      <div className="text-5xl mb-4">🎬</div>
      <h2 className="text-2xl font-black text-white mb-4">Film Not Found</h2>
      <Link to="/" className="bg-[#e8a020] text-[#0d0f12] px-6 py-2.5 rounded font-black text-sm uppercase tracking-wider hover:bg-[#f5c842]">Back to Home</Link>
    </div>
  )

  const rating     = movie.vote_average?.toFixed(1) || '0.0'
  const director   = movie.credits?.crew?.find(c => c.job === 'Director')
  const cast       = movie.credits?.cast?.slice(0, 8) || []
  const trailer    = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')
  const similar    = (movie.similar?.results || []).slice(0, 8).map(normaliseTmdb)
  const genres     = movie.genres || []
  const year       = movie.release_date?.slice(0, 4)
  const runtime    = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null
  const posterUrl  = getPoster(movie.poster_path, 'w500') || 'https://placehold.co/500x750/131720/e8a020?text=No+Poster'
  const backdropUrl = getBackdrop(movie.backdrop_path)

  const handleWatchlist = () => {
    const movieObj = { id: storageKey, title: movie.title, poster: posterUrl, year }
    const added = toggleWatchlist(movieObj)
    setInWatchlist(added)
    setWatchlistAnim(true)
    setTimeout(() => setWatchlistAnim(false), 600)
  }

  const handleRatingClose = (picked) => {
    setShowRateModal(false)
    if (picked !== null) {
      saveRating(storageKey, picked)
      setUserRating(picked)
    }
  }

  const handlePostComment = () => {
    if (!commentText.trim()) return
    const newComment = addComment(storageKey, commentText.trim())
    setComments(prev => [newComment, ...prev])
    setCommentText('')
  }

  return (
    <div className="bg-[#0d0f12] min-h-screen">
      {showRateModal && <RateModal movie={movie} tmdbId={id} onClose={handleRatingClose} />}

      {/* Backdrop */}
      <div className="relative h-56 md:h-80 overflow-hidden">
        {backdropUrl
          ? <img src={backdropUrl} alt="" className="w-full h-full object-cover brightness-25" />
          : <div className="w-full h-full bg-[#0f1218]" />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f12] via-transparent to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-5 -mt-36 relative z-10 pb-20">
        <Link to="/categories" className="inline-flex items-center gap-1.5 text-[#e8a020] text-[11px] font-black uppercase tracking-widest mb-6 hover:text-white transition-colors">
          ← Browse Films
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-7">

          {/* ── Sidebar ── */}
          <div className="md:col-span-1">
            <div className="rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/8 mb-4">
              <img src={posterUrl} alt={movie.title} className="w-full h-auto"
                onError={e => { e.target.src = 'https://placehold.co/500x750/131720/e8a020?text=No+Poster' }} />
            </div>

            <div className="space-y-2 mb-5">
              {/* Watchlist */}
              <button onClick={handleWatchlist}
                className={`w-full py-2.5 rounded font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  inWatchlist ? 'bg-[#e8a020] text-[#0d0f12] hover:bg-red-500 hover:text-white' : 'bg-[#0f1218] border border-white/8 text-white hover:bg-[#1a1e26]'
                } ${watchlistAnim ? 'scale-95' : 'scale-100'}`}>
                {inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
              </button>

              {/* Rate */}
              <button onClick={() => setShowRateModal(true)}
                className={`w-full py-2.5 rounded font-black text-xs uppercase tracking-wider transition-all border flex items-center justify-center gap-2 ${
                  userRating > 0 ? 'border-[#e8a020]/40 bg-[#e8a020]/10 text-[#e8a020]' : 'border-white/8 bg-[#0f1218] text-white hover:bg-[#1a1e26]'
                }`}>
                {userRating > 0 ? `${'★'.repeat(userRating)}${'☆'.repeat(5 - userRating)} Your Rating` : '★ Rate This Film'}
              </button>

              {/* Trailer link */}
              {trailer && (
                <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer"
                  className="w-full py-2.5 rounded font-black text-xs uppercase tracking-wider bg-[#131720] border border-white/5 text-[#7a8694] hover:text-white flex items-center justify-center gap-2 transition-colors">
                  ▶ Trailer on YouTube
                </a>
              )}
            </div>

            {/* Film details */}
            <div className="bg-[#0f1218] rounded-lg p-4 border border-white/5">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#3a4048] mb-3">Details</h4>
              <dl className="space-y-3">
                {director && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-[#3a4048] mb-0.5">Director</dt>
                    <dd className="text-white text-sm font-semibold">{director.name}</dd>
                  </div>
                )}
                {runtime && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-[#3a4048] mb-0.5">Runtime</dt>
                    <dd className="text-white text-sm font-semibold">{runtime}</dd>
                  </div>
                )}
                {year && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-[#3a4048] mb-0.5">Released</dt>
                    <dd className="text-white text-sm font-semibold">{movie.release_date}</dd>
                  </div>
                )}
                {movie.vote_count > 0 && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-[#3a4048] mb-0.5">TMDB Votes</dt>
                    <dd className="text-white text-sm font-semibold">{movie.vote_count.toLocaleString()}</dd>
                  </div>
                )}
                {movie.budget > 0 && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-[#3a4048] mb-0.5">Budget</dt>
                    <dd className="text-white text-sm font-semibold">${(movie.budget / 1e6).toFixed(0)}M</dd>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-[#3a4048] mb-0.5">Box Office</dt>
                    <dd className="text-[#e8a020] text-sm font-black">${(movie.revenue / 1e6).toFixed(0)}M</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* ── Main content ── */}
          <div className="md:col-span-3">
            <div className="flex flex-wrap items-center gap-2 mb-3 text-[10px] uppercase tracking-widest">
              {year && <span className="text-[#5a6472]">{year}</span>}
              {runtime && <><span className="text-[#2a2e38]">·</span><span className="text-[#5a6472]">{runtime}</span></>}
              {genres.map(g => (
                <span key={g.id} className="border border-white/10 text-[#5a6472] px-2 py-0.5 rounded">{g.name}</span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white leading-[0.95] mb-2 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              {movie.title}
            </h1>
            {movie.tagline && <p className="text-[#5a6472] italic text-sm mb-3">"{movie.tagline}"</p>}
            {director && <p className="text-[#5a6472] text-sm mb-4">Directed by <span className="text-[#a0aab4] font-semibold">{director.name}</span></p>}

            {/* Ratings row */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-1.5 bg-[#0f1218] rounded-full px-3 py-1.5 border border-white/8">
                <span className="text-[#e8a020]">★</span>
                <span className="text-white font-black text-lg">{rating}</span>
                <span className="text-[#3a4048] text-xs">/10 TMDB</span>
              </div>
              {userRating > 0 && (
                <button onClick={() => setShowRateModal(true)}
                  className="bg-[#e8a020]/10 border border-[#e8a020]/25 rounded-full px-3 py-1.5 text-xs text-[#e8a020] font-bold hover:bg-[#e8a020]/20 transition-colors">
                  You: {'★'.repeat(userRating)} {userRating}/5 · Edit
                </button>
              )}
            </div>

            <div className="h-px bg-gradient-to-r from-[#e8a020]/30 to-transparent mb-6" />

            {/* Overview */}
            <div className="mb-7">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-[#3a4048] mb-3">Synopsis</h2>
              <p className="text-[#a0aab4] leading-relaxed">{movie.overview}</p>
            </div>

            {/* Cast grid */}
            {cast.length > 0 && (
              <div className="mb-7">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-[#3a4048] mb-4">Cast</h2>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {cast.map(actor => (
                    <div key={actor.id} className="text-center group">
                      <div className="w-full aspect-square rounded-lg overflow-hidden mb-1.5 bg-[#1a1e26]">
                        {actor.profile_path
                          ? <img src={getProfile(actor.profile_path)} alt={actor.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                          : <div className="w-full h-full flex items-center justify-center text-2xl text-[#3a4048] font-black">{actor.name?.[0]}</div>
                        }
                      </div>
                      <p className="text-white text-[10px] font-semibold leading-tight line-clamp-1">{actor.name}</p>
                      <p className="text-[#4a5462] text-[9px] leading-tight line-clamp-1">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Embedded trailer */}
            {trailer && (
              <div className="mb-8">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-[#3a4048] mb-4">Official Trailer</h2>
                <div className="rounded-xl overflow-hidden border border-white/5" style={{ aspectRatio: '16/9' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}?rel=0`}
                    title={`${movie.title} Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen className="w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* ── Comments ── */}
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-[#3a4048] mb-4">
                Comments <span className="text-[#e8a020]">({comments.length})</span>
              </h2>

              <div className="bg-[#0f1218] rounded-xl p-4 border border-white/5 mb-5">
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Share your thoughts on this film…"
                  className="w-full bg-[#131720] text-white rounded-lg p-3 mb-3 text-sm outline-none focus:ring-1 focus:ring-[#e8a020] placeholder-[#3a4048] resize-none border border-white/5 h-20"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[#3a4048] text-[10px]">{commentText.length}/500</span>
                  <button onClick={handlePostComment} disabled={!commentText.trim()}
                    className="bg-[#e8a020] text-[#0d0f12] px-5 py-2 rounded font-black text-xs uppercase tracking-wider hover:bg-[#f5c842] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    Post Comment
                  </button>
                </div>
              </div>

              {comments.length === 0
                ? <p className="text-[#3a4048] text-sm text-center py-6">Be the first to comment!</p>
                : (
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
                )
              }
            </div>
          </div>
        </div>

        {/* Similar films */}
        {similar.length > 0 && (
          <div className="mt-16 pt-10 border-t border-white/5">
            <div className="flex items-center gap-4 mb-7">
              <div className="w-1 h-7 bg-[#e8a020] rounded-full" />
              <div>
                <p className="text-[#e8a020] text-[10px] font-black uppercase tracking-[0.2em]">More Like This</p>
                <h2 className="text-xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Similar Films</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
              {similar.map(m => <MovieCard key={m.tmdbId} movie={m} isTmdb />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TmdbMovieDetails
