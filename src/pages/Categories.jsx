import { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import { movies as editorialMovies } from '../data/movies'
import { useMoviesByGenre, usePopularMovies } from '../hooks/useTMDB'
import { useSearch } from '../hooks/useSearch'
import { GENRE_MAP } from '../services/tmdb'
import { useSearchParams } from 'react-router-dom'

const CardSkeleton = () => (
  <div className="rounded-lg overflow-hidden bg-slate-100 dark:bg-[#131720] animate-pulse" style={{ aspectRatio: '2/3' }}>
    <div className="w-full h-full bg-slate-200 dark:bg-[#1e2536]" />
  </div>
)

const ALL_GENRES = ['All', 'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller']

const Categories = () => {
  const [searchParams] = useSearchParams()
  const urlGenre = searchParams.get('genre')
  const [selectedGenre, setSelectedGenre] = useState(urlGenre || 'All')

  useEffect(() => { if (urlGenre) setSelectedGenre(urlGenre) }, [urlGenre])

  // TMDB search (debounced, calls API)
  const { query, setQuery, results: searchResults, loading: searchLoading } = useSearch(400)

  // Genre browse (when not searching)
  const genreId = selectedGenre !== 'All' ? GENRE_MAP[selectedGenre] : null
  const { movies: genreMovies, loading: genreLoading } = useMoviesByGenre(genreId)
  const { movies: popularMovies, loading: popularLoading } = usePopularMovies()

  const isSearching = query.trim().length > 0
  const browseMovies = genreId ? genreMovies : popularMovies
  const browseLoading = genreId ? genreLoading : popularLoading

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0f12] fade-in transform-gpu">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#0f1218] border-b border-black/5 dark:border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-1 h-10 bg-[#e8a020] rounded-full mt-1 shadow-[0_0_10px_rgba(232,160,32,0.3)]" />
            <div>
              <p className="text-[#e8a020] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Explore</p>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white font-playfair">
                Browse Films
              </h1>
              <p className="text-slate-500 dark:text-[#5a6472] text-sm mt-1">Search any film from TMDB's entire library</p>
            </div>
          </div>

          {/* ── Search bar — calls TMDB API ── */}
          <div className="relative max-w-lg mb-6">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#4a5462]">🔍</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search any film (e.g. Inception, RRR, Tamasha)…"
              className="w-full bg-slate-50 dark:bg-[#131720] border border-black/10 dark:border-white/8 text-slate-900 dark:text-white rounded-lg pl-10 pr-10 py-3 text-sm outline-none focus:border-[#e8a020] transition-all placeholder-slate-400 dark:placeholder-[#4a5462] shadow-sm dark:shadow-none"
            />
            {searchLoading && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                <span className="inline-block w-4 h-4 border-2 border-[#e8a020] border-t-transparent rounded-full animate-spin" />
              </span>
            )}
            {query && !searchLoading && (
              <button onClick={() => setQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4a5462] hover:text-white text-sm">✕</button>
            )}
          </div>

          {/* ── Genre filters (hidden when searching) ── */}
          {!isSearching && (
            <div className="flex flex-wrap gap-2">
              {ALL_GENRES.map(genre => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm ${
                    selectedGenre === genre
                      ? 'bg-[#e8a020] text-[#0d0f12]'
                      : 'bg-white dark:bg-[#1a1e26] text-slate-500 dark:text-[#7a8694] hover:text-slate-900 dark:hover:text-white border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/15'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 py-12">

        {/* ── SEARCH RESULTS ── */}
        {isSearching && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-[#e8a020] rounded-full" />
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
                  Results for <span className="text-[#e8a020]">"{query}"</span>
                  {!searchLoading && searchResults.length > 0 && (
                    <span className="text-slate-400 dark:text-[#4a5462] font-normal ml-2 text-xs normal-case tracking-normal">
                      ({searchResults.length} found)
                    </span>
                  )}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#e8a020] animate-pulse" />
                <span className="text-slate-400 dark:text-[#5a6472] text-[10px] uppercase tracking-widest">Live TMDB Search</span>
              </div>
            </div>

            {searchLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
                {Array(16).fill(0).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🎬</div>
                <h3 className="text-slate-900 dark:text-white font-black text-xl mb-2 font-playfair">
                  No films found for "{query}"
                </h3>
                <p className="text-slate-500 dark:text-[#5a6472] text-sm">Try a different spelling or search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-2.5">
                {searchResults.map(movie => (
                  <MovieCard key={movie.tmdbId} movie={movie} isTmdb />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── BROWSE MODE (no search) ── */}
        {!isSearching && (
          <>
            {/* Editorial section */}
            {(selectedGenre === 'All' ||
              editorialMovies.filter(m => m.genre?.toLowerCase() === selectedGenre.toLowerCase()).length > 0) && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1 h-5 bg-[#e8a020] rounded-full" />
                  <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
                    Our Reviews
                    <span className="text-slate-400 dark:text-[#4a5462] font-normal ml-2 normal-case tracking-normal text-xs">
                      ({selectedGenre === 'All' ? editorialMovies.length : editorialMovies.filter(m => m.genre?.toLowerCase() === selectedGenre.toLowerCase()).length})
                    </span>
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
                  {(selectedGenre === 'All'
                    ? editorialMovies
                    : editorialMovies.filter(m => m.genre?.toLowerCase() === selectedGenre.toLowerCase())
                  ).map(movie => <MovieCard key={movie.id} movie={movie} />)}
                </div>
              </div>
            )}

            {/* TMDB browse movies */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-[#e8a020] rounded-full" />
                  <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
                    {selectedGenre === 'All' ? 'Popular on TMDB' : selectedGenre}
                    {!browseLoading && (
                      <span className="text-slate-400 dark:text-[#4a5462] font-normal ml-2 normal-case tracking-normal text-xs">
                        ({browseMovies.length})
                      </span>
                    )}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#e8a020] animate-pulse" />
                  <span className="text-slate-400 dark:text-[#5a6472] text-[10px] uppercase tracking-wider font-bold">Live TMDB</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-2.5">
                {browseLoading
                  ? Array(16).fill(0).map((_, i) => <CardSkeleton key={i} />)
                  : browseMovies.map(movie => <MovieCard key={movie.tmdbId} movie={movie} isTmdb />)
                }
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Categories
