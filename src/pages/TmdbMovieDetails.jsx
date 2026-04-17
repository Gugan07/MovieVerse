import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchMovieDetails, getPoster, getBackdrop, getProfile } from '../services/tmdb'
import MovieCard from '../components/MovieCard'
import { normaliseTmdb } from '../hooks/useTMDB'
import { getRating, setRating as saveRating, getComments, addComment, isInWatchlist, toggleWatchlist } from '../services/storage'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 dark:bg-black/85 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0f1218] border border-black/5 dark:border-white/10 rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl">
        {movie.poster_path && (
          <img src={getPoster(movie.poster_path, 'w185')} alt={movie.title}
            className="w-20 h-28 object-cover rounded-lg mx-auto mb-4 ring-1 ring-black/5 dark:ring-white/10 shadow-lg" />
        )}
        <h3 className="text-slate-900 dark:text-white font-black text-lg mb-1 font-playfair">{movie.title}</h3>
        <p className="text-slate-500 dark:text-[#5a6472] text-xs mb-6">Rate this film out of 5 stars</p>
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
            className="bg-[#e8a020] text-[#0d0f12] px-6 py-2 rounded-md font-black text-sm uppercase tracking-wider hover:bg-[#f5c842] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#e8a020]/20">
            Save
          </button>
          <button onClick={() => onClose(null)} className="border border-black/10 dark:border-white/10 text-slate-400 dark:text-[#7a8694] px-5 py-2 rounded-md text-sm font-semibold hover:text-slate-900 dark:hover:text-white transition-colors">
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

  const [movie, setMovie] = useState(null)
  const [credits, setCredits] = useState(null)
  const [videos, setVideos] = useState(null)
  const [similar, setSimilar] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userRating, setUserRating] = useState(getRating(storageKey))
  const [showRateModal, setShowRateModal] = useState(false)
  const [inWatchlist, setInWatchlist] = useState(isInWatchlist(storageKey))
  const [comments, setComments] = useState(getComments(storageKey))
  const [commentText, setCommentText] = useState('')
  const [watchlistAnim, setWatchlistAnim] = useState(false)

  // Load movie data in parallel
  useEffect(() => {
    const loadMovie = async () => {
      try {
        console.log('Fetching TMDB movie', id)
        // Basic movie first (no append - reliable)
        const movieData = await fetchMovieDetails(id)
        setMovie(movieData)
        setCredits(movieData.credits || { crew: [], cast: [] })
        setVideos(movieData.videos || { results: [] })
        setSimilar(movieData.similar?.results || [])
        setReviews(movieData.reviews?.results || [])
        setLoading(false)
      } catch (err) {
        console.error('Movie fetch failed:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    loadMovie()
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
      <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 font-playfair">Film Not Found</h2>
      <Link to="/" className="bg-[#e8a020] text-[#0d0f12] px-6 py-2.5 rounded font-black text-sm uppercase tracking-wider hover:bg-[#f5c842] shadow-lg shadow-[#e8a020]/20">Back to Home</Link>
    </div>
  )

  // Derived data with fallbacks
  const rating = movie.vote_average?.toFixed(1) || '0.0'
  const director = credits?.crew?.find(c => c.job === 'Director') || { name: 'Unknown' }
  const cast = credits?.cast?.slice(0, 8) || []
  const trailer = videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube') || null
  const similarMovies = similar.slice(0, 8).map(normaliseTmdb)
  const genres = movie.genres || []
  const year = movie.release_date?.slice(0, 4) || ''
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null
  const posterUrl = getPoster(movie.poster_path, 'w500') || 'https://placehold.co/500x750/131720/e8a020?text=No+Poster'
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
    <div className="bg-slate-50 dark:bg-[#0d0f12] min-h-screen fade-in">
      {showRateModal && <RateModal movie={movie} tmdbId={id} onClose={handleRatingClose} />}

      {/* Backdrop */}
      <div className="relative h-56 md:h-80 overflow-hidden">
        {backdropUrl
          ? <img src={backdropUrl} alt="" className="w-full h-full object-cover brightness-50 dark:brightness-25" />
          : <div className="w-full h-full bg-slate-200 dark:bg-[#0f1218]" />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#0d0f12] via-transparent to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-5 -mt-36 relative z-10 pb-20">
        <Link to="/categories" className="inline-flex items-center gap-1.5 text-[#e8a020] text-[11px] font-black uppercase tracking-[0.2em] mb-6 hover:translate-x-[-4px] transition-all">
          ← Browse Films
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-7">

          {/* ── Sidebar ── */}
          <div className="md:col-span-1">
            <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/8 mb-6 transform hover:scale-[1.02] transition-transform duration-500">
              <img src={posterUrl} alt={movie.title} className="w-full h-auto"
                onError={e => { e.target.src = 'https://placehold.co/500x750/131720/e8a020?text=No+Poster' }} />
            </div>

            <div className="space-y-2 mb-5">
              {/* Watchlist */}
              <button onClick={handleWatchlist}
                className={`w-full py-3 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg ${
                  inWatchlist ? 'bg-[#e8a020] text-[#0d0f12] shadow-[#e8a020]/20' : 'bg-white dark:bg-[#0f1218] border border-black/5 dark:border-white/8 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-[#1a1e26]'
                } ${watchlistAnim ? 'scale-95' : 'scale-100'}`}>
                {inWatchlist ? '✓ In Watchlist' : '+ Watchlist'}
              </button>

              {/* Rate */}
              <button onClick={() => setShowRateModal(true)}
                className={`w-full py-3 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all border flex items-center justify-center gap-2 ${
                  userRating > 0 ? 'border-[#e8a020]/40 bg-[#e8a020]/10 text-[#e8a020]' : 'border-black/5 dark:border-white/8 bg-white dark:bg-[#0f1218] text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-[#1a1e26]'
                }`}>
                {userRating > 0 ? `${'★'.repeat(userRating)}${'☆'.repeat(5 - userRating)} Rated ${userRating}/5` : '★ Rate Film'}
              </button>

              {/* Trailer link */}
              {trailer && (
                <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer"
                  className="w-full py-3 rounded-lg font-black text-[10px] uppercase tracking-widest bg-slate-100 dark:bg-[#131720] border border-black/5 dark:border-white/5 text-slate-400 dark:text-[#7a8694] hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-2 transition-all">
                  ▶ Watch Trailer
                </a>
              )}
            </div>

            {/* Film details */}
            <div className="bg-white dark:bg-[#0f1218] rounded-2xl p-6 border border-black/5 dark:border-white/5 shadow-sm dark:shadow-none">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-[#3a4048] mb-4">Metadata</h4>
              <dl className="space-y-4">
                {director && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-[#3a4048] mb-1 font-bold">Director</dt>
                    <dd className="text-slate-900 dark:text-white text-sm font-bold">{director.name}</dd>
                  </div>
                )}
                {runtime && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-[#3a4048] mb-1 font-bold">Runtime</dt>
                    <dd className="text-slate-900 dark:text-white text-sm font-bold">{runtime}</dd>
                  </div>
                )}
                {year && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-[#3a4048] mb-1 font-bold">Released</dt>
                    <dd className="text-slate-900 dark:text-white text-sm font-bold">{movie.release_date}</dd>
                  </div>
                )}
                {movie.vote_count > 0 && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-[#3a4048] mb-1 font-bold">TMDB Votes</dt>
                    <dd className="text-slate-900 dark:text-white text-sm font-bold">{movie.vote_count.toLocaleString()}</dd>
                  </div>
                )}
                {movie.budget > 0 && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-[#3a4048] mb-1 font-bold">Budget</dt>
                    <dd className="text-slate-900 dark:text-white text-sm font-bold">${(movie.budget / 1e6).toFixed(0)}M</dd>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-[#3a4048] mb-1 font-bold">Box Office</dt>
                    <dd className="text-[#e8a020] text-sm font-black">${(movie.revenue / 1e6).toFixed(0)}M</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* ── Main content ── */}
          <div className="md:col-span-3">
            <div className="flex flex-wrap items-center gap-2 mb-4 text-[10px] uppercase tracking-[0.2em] font-black">
              {year && <span className="text-slate-400 dark:text-[#5a6472]">{year}</span>}
              {runtime && <><span className="text-slate-300 dark:text-[#2a2e38]">·</span><span className="text-slate-400 dark:text-[#5a6472]">{runtime}</span></>}
              {genres.map(g => (
                <span key={g.id} className="bg-[#e8a020]/10 text-[#e8a020] px-2 py-1 rounded-md">{g.name}</span>
              ))}
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-3 tracking-tight font-playfair">
              {movie.title}
            </h1>
            {movie.tagline && <p className="text-slate-400 dark:text-[#5a6472] italic text-sm mb-4">"{movie.tagline}"</p>}
            {director && <p className="text-slate-500 dark:text-[#5a6472] text-sm mb-6">Directed by <span className="text-slate-900 dark:text-[#a0aab4] font-black italic">{director.name}</span></p>}

            {/* Ratings row */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white dark:bg-[#0f1218] rounded-2xl px-4 py-2 border border-black/5 dark:border-white/8 shadow-sm dark:shadow-none">
                <span className="text-[#e8a020] text-xl">★</span>
                <span className="text-slate-900 dark:text-white font-black text-2xl leading-none">{rating}</span>
                <span className="text-slate-400 dark:text-[#3a4048] text-[10px] font-bold">TMDB</span>
              </div>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className="text-2xl" style={{ color: s <= Math.round(parseFloat(rating)/2) ? '#e8a020' : '#2a2e38' }}>★</span>
                ))}
              </div>
              {userRating > 0 && (
                <button onClick={() => setShowRateModal(true)}
                  className="bg-[#e8a020]/10 border border-[#e8a020]/25 rounded-xl px-4 py-2 text-xs text-[#e8a020] font-black uppercase tracking-widest transition-all">
                  You: {userRating}/5 · Edit
                </button>
              )}
            </div>

            <div className="h-px bg-gradient-to-r from-[#e8a020]/30 to-transparent mb-6" />

            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-[#3a4048] mb-4">The Story</h2>
              <p className="text-slate-700 dark:text-[#a0aab4] leading-relaxed text-lg font-medium max-w-2xl">{movie.overview}</p>
            </div>

            {/* Cast grid */}
            {cast.length > 0 && (
              <div className="mb-10">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-[#3a4048] mb-6">Starring</h2>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
                  {cast.map(actor => (
                    <div key={actor.id} className="text-center group">
                      <div className="w-full aspect-square rounded-xl overflow-hidden mb-2.5 bg-slate-100 dark:bg-[#1a1e26] ring-1 ring-black/5 dark:ring-white/5 transition-transform duration-500 group-hover:scale-105 shadow-sm">
                        {actor.profile_path
                          ? <img src={getProfile(actor.profile_path)} alt={actor.name} className="w-full h-full object-cover object-top" />
                          : <div className="w-full h-full flex items-center justify-center text-xl text-slate-300 dark:text-[#3a4048] font-black">{actor.name?.[0]}</div>
                        }
                      </div>
                      <p className="text-slate-900 dark:text-white text-[10px] font-black leading-tight line-clamp-1">{actor.name}</p>
                      <p className="text-slate-400 dark:text-[#4a5462] text-[9px] leading-tight line-clamp-1 font-medium">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Embedded trailer */}
            {trailer && (
              <div className="mb-12">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-[#3a4048] mb-6">Official Trailer</h2>
                <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/5" style={{ aspectRatio: '16/9' }}>
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
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-[#3a4048] mb-6">
                Discussion <span className="text-[#e8a020] ml-1">({comments.length})</span>
              </h2>

              <div className="bg-white dark:bg-[#0f1218] rounded-2xl p-6 border border-black/5 dark:border-white/5 mb-8 shadow-sm">
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Share your cinematic perspective…"
                  className="w-full bg-slate-50 dark:bg-[#131720] text-slate-900 dark:text-white rounded-xl p-4 mb-4 text-sm outline-none focus:ring-1 focus:ring-[#e8a020] placeholder-slate-400 dark:placeholder-[#3a4048] resize-none border border-black/5 dark:border-white/5 h-28 transition-all"
                />
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 dark:text-[#3a4048] text-[10px] font-bold uppercase tracking-widest">{commentText.length}/500</span>
                  <button onClick={handlePostComment} disabled={!commentText.trim()}
                    className="bg-[#e8a020] text-[#0d0f12] px-8 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-[#f5c842] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#e8a020]/20">
                    Post Comment
                  </button>
                </div>
              </div>

              {comments.length === 0
                ? (
                  <div className="text-center py-12 bg-white dark:bg-[#0f1218] rounded-2xl border border-dashed border-black/10 dark:border-white/10">
                    <p className="text-slate-400 dark:text-[#3a4048] text-sm italic">Be the first to share your perspective on this film.</p>
                  </div>
                )
                : (
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
                )
              }
            </div>
          </div>
        </div>

        {/* Similar films */}
        {similarMovies.length > 0 && (
          <div className="mt-20 pt-16 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-1.5 h-10 bg-[#e8a020] rounded-full shadow-[0_0_15px_rgba(232,160,32,0.4)]" />
              <div>
                <p className="text-[#e8a020] text-[10px] font-black uppercase tracking-[0.3em] mb-1">More Like This</p>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white font-playfair">Similar Films</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {similarMovies.map(m => <MovieCard key={m.tmdbId} movie={m} isTmdb />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TmdbMovieDetails
