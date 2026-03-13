import HeroSection from '../components/HeroSection'
import MovieCard from '../components/MovieCard'
import { movies as editorialMovies } from '../data/movies'
import { useTrendingMovies, usePopularMovies } from '../hooks/useTMDB'
import { Link } from 'react-router-dom'

// Skeleton loader for cards
const CardSkeleton = () => (
  <div className="rounded-lg overflow-hidden bg-[#131720] animate-pulse" style={{ aspectRatio: '2/3' }}>
    <div className="w-full h-full bg-[#1e2536]" />
  </div>
)

const Home = () => {
  const { movies: trendingMovies, loading: trendingLoading } = useTrendingMovies()
  const { movies: popularMovies, loading: popularLoading } = usePopularMovies()

  // Use first trending movie as hero (fallback to editorial)
  const heroMovie = editorialMovies[0]

  return (
    <div className="bg-[#0d0f12] fade-in">
      <HeroSection movie={heroMovie} />

      {/* Trending This Week — from TMDB */}
      <div className="max-w-7xl mx-auto px-5 py-14">
        <div className="flex items-end justify-between mb-7">
          <div className="flex items-center gap-4">
            <div className="w-1 h-8 bg-[#e8a020] rounded-full" />
            <div>
              <p className="text-[#e8a020] text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">Live from TMDB</p>
              <h2 className="text-white text-2xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Trending This Week
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#e8a020] animate-pulse" />
            <span className="text-[#5a6472] text-[10px] uppercase tracking-widest">Live Data</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {trendingLoading
            ? Array(8).fill(0).map((_, i) => <CardSkeleton key={i} />)
            : trendingMovies.slice(0, 8).map(movie => (
              <MovieCard key={movie.tmdbId} movie={movie} isTmdb />
            ))
          }
        </div>
      </div>

      {/* Genre Quick Nav */}
      <div className="border-y border-white/5 bg-[#0f1218]">
        <div className="max-w-7xl mx-auto px-5 py-4">
          <div className="flex items-center gap-6 overflow-x-auto">
            <span className="text-[#3a4048] text-[10px] uppercase tracking-widest flex-shrink-0 font-bold">Browse Genre</span>
            <div className="h-4 w-px bg-[#2a2e38] flex-shrink-0" />
            {['Drama', 'Sci-Fi', 'Thriller', 'Adventure', 'Comedy', 'Horror', 'Romance', 'Animation'].map(g => (
              <Link key={g} to={`/categories?genre=${g}`}
                className="text-[#5a6472] text-[10px] uppercase tracking-widest hover:text-[#e8a020] transition-colors flex-shrink-0 font-semibold whitespace-nowrap">
                {g}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Our Editorial Reviews */}
      <div className="max-w-7xl mx-auto px-5 py-14">
        <div className="flex items-end justify-between mb-7">
          <div className="flex items-center gap-4">
            <div className="w-1 h-8 bg-[#e8a020] rounded-full" />
            <div>
              <p className="text-[#e8a020] text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">Our Picks</p>
              <h2 className="text-white text-2xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Editorial Reviews
              </h2>
            </div>
          </div>
          <Link to="/categories" className="text-[11px] text-[#e8a020] uppercase tracking-widest font-bold hover:text-white transition-colors border border-[#e8a020]/30 px-3 py-1.5 rounded hover:bg-[#e8a020]/10 transition-all">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {editorialMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      {/* Popular Right Now — TMDB */}
      <div className="bg-[#0f1218] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-5 py-14">
          <div className="flex items-end justify-between mb-7">
            <div className="flex items-center gap-4">
              <div className="w-1 h-8 bg-[#e8a020] rounded-full" />
              <div>
                <p className="text-[#e8a020] text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">TMDB Charts</p>
                <h2 className="text-white text-2xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Popular Right Now
                </h2>
              </div>
            </div>
            <Link to="/categories" className="text-[11px] text-[#e8a020] uppercase tracking-widest font-bold hover:text-white transition-colors">
              Browse All →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {popularLoading
              ? Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)
              : popularMovies.slice(0, 6).map(movie => (
                <MovieCard key={movie.tmdbId} movie={movie} isTmdb />
              ))
            }
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-5 py-20 border-t border-white/5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { val: '8', label: 'Film Reviews', icon: '🎬' },
            { val: '3', label: 'Film Articles', icon: '📝' },
            { val: '6', label: 'Masterclasses', icon: '🎓' },
            { val: '500K+', label: 'TMDB Films', icon: '🎭' },
          ].map((s, i) => (
            <div 
              key={s.label} 
              className="glass-premium rounded-2xl p-6 flex items-center gap-4 hover:border-[#e8a020]/30 transition-all duration-500 fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#e8a020]/10 flex items-center justify-center text-2xl shadow-inner">
                {s.icon}
              </div>
              <div>
                <div className="text-white text-3xl font-black leading-none mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{s.val}</div>
                <div className="text-[#5a6472] text-[10px] font-black uppercase tracking-[0.2em]">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home