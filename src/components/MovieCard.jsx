import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const MovieCard = ({ movie, isTmdb = false }) => {
  const { theme } = useTheme()
  const rating = parseFloat(movie.rating)
  const ratingColor = rating >= 8.0 ? '#e8a020' : rating >= 7.0 ? '#f5c842' : rating >= 6.0 ? '#a0aab4' : '#6a7480'

  const linkTo = isTmdb ? `/tmdb/${movie.tmdbId}` : `/movie/${movie.id}`

  const posterSrc = movie.poster || `https://via.placeholder.com/300x450/f1f5f9/e8a020?text=${encodeURIComponent(movie.title)}`

  return (
    <Link to={linkTo} className="group block cv-card rounded-2xl overflow-hidden bg-white dark:bg-[#131720] border border-black/5 dark:border-white/5 transition-all duration-500 cursor-pointer fade-up shadow-sm dark:shadow-none">
      {/* Poster */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '2/3' }}>
        <img
          src={posterSrc}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          loading="lazy"
          onError={e => {
            e.target.src = `https://placehold.co/300x450/f1f5f9/e8a020?text=${encodeURIComponent(movie.title?.slice(0, 12) || 'Film')}`
          }}
        />

        {/* Rating badge — top-left */}
        {rating > 0 && (
          <div
            className="absolute top-0 left-0 px-2 py-1 text-[10px] font-black z-10"
            style={{ backgroundColor: ratingColor, color: '#0d0f12' }}
          >
            {movie.rating}
          </div>
        )}

        {/* Year — top-right */}
        {movie.year && (
          <div className="absolute top-0 right-0 bg-white/80 dark:bg-[#0d0f12]/80 px-1.5 py-1 text-[9px] text-slate-500 dark:text-[#7a8694] font-semibold backdrop-blur-sm">
            {movie.year}
          </div>
        )}

        {/* Hover overlay info */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 bg-gradient-to-t from-slate-900 dark:from-[#0d0f12] via-slate-900/80 dark:via-[#0d0f12]/80 to-transparent">
          <p className="text-white/80 text-[10px] leading-relaxed line-clamp-2 mb-2 font-medium">
            {movie.description?.substring(0, 100)}...
          </p>
          <div className="flex items-center gap-1.5 text-[#e8a020] text-[9px] font-black uppercase tracking-widest">
            <span>Read Review</span>
            <span className="text-xs">→</span>
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div className="px-2.5 py-2">
        <h3 className="text-slate-900 dark:text-white text-[11px] font-bold leading-tight line-clamp-1 group-hover:text-[#e8a020] transition-colors">
          {movie.title}
        </h3>
        {movie.director && (
          <p className="text-slate-400 dark:text-[#4a5462] text-[9px] mt-0.5 line-clamp-1">{movie.director}</p>
        )}
        {/* Genre pill */}
        {movie.genre && (
          <span className="inline-block mt-1 text-[8px] text-slate-500 dark:text-[#5a6472] bg-slate-100 dark:bg-[#1a1e26] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold">
            {movie.genre}
          </span>
        )}
        {/* Mini star strip */}
        {rating > 0 && (
          <div className="flex gap-0.5 mt-1.5">
            {[1,2,3,4,5].map(s => (
              <span key={s} className="text-[9px]" style={{ color: s <= Math.round(rating / 2) ? ratingColor : (theme === 'dark' ? '#2a2e38' : '#e2e8f0') }}>★</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

export default MovieCard
