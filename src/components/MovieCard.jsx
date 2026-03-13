import { Link } from 'react-router-dom'

const MovieCard = ({ movie, isTmdb = false }) => {
  const rating = parseFloat(movie.rating)
  const ratingColor = rating >= 8.0 ? '#e8a020' : rating >= 7.0 ? '#f5c842' : rating >= 6.0 ? '#a0aab4' : '#6a7480'

  // TMDB movies link to their TMDB detail page (within our site)
  const linkTo = isTmdb
    ? `/tmdb/${movie.tmdbId}`
    : `/movie/${movie.id}`

  const posterSrc = movie.poster || `https://via.placeholder.com/300x450/131720/e8a020?text=${encodeURIComponent(movie.title)}`

  return (
    <Link to={linkTo} className="group block cv-card rounded-2xl overflow-hidden bg-[#131720] border border-white/5 transition-all duration-500 cursor-pointer fade-up">
      {/* Poster */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '2/3' }}>
        <img
          src={posterSrc}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          loading="lazy"
          onError={e => {
            e.target.src = `https://placehold.co/300x450/131720/e8a020?text=${encodeURIComponent(movie.title?.slice(0, 12) || 'Film')}`
          }}
        />

        {/* Darker gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f12] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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
          <div className="absolute top-0 right-0 bg-[#0d0f12]/80 px-1.5 py-1 text-[9px] text-[#7a8694] font-semibold">
            {movie.year}
          </div>
        )}

        {/* Hover overlay info */}
        {/* Hover overlay info */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 bg-gradient-to-t from-[#0d0f12] via-[#0d0f12]/80 to-transparent">
          <p className="text-white/80 text-[10px] leading-relaxed line-clamp-2 mb-2 font-medium">
            {movie.description?.substring(0, 100)}...
          </p>
          <div className="flex items-center gap-1.5 text-[#e8a020] text-[9px] font-black uppercase tracking-widest">
            <span>Learn More</span>
            <span className="text-xs">→</span>
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div className="px-2.5 py-2">
        <h3 className="text-white text-[11px] font-bold leading-tight line-clamp-1 group-hover:text-[#e8a020] transition-colors">
          {movie.title}
        </h3>
        {movie.director && (
          <p className="text-[#4a5462] text-[9px] mt-0.5 line-clamp-1">{movie.director}</p>
        )}
        {/* Genre pill */}
        {movie.genre && (
          <span className="inline-block mt-1 text-[8px] text-[#5a6472] bg-[#1a1e26] px-1.5 py-0.5 rounded uppercase tracking-wider">
            {movie.genre}
          </span>
        )}
        {/* Mini star strip */}
        {rating > 0 && (
          <div className="flex gap-0.5 mt-1.5">
            {[1,2,3,4,5].map(s => (
              <span key={s} className="text-[9px]" style={{ color: s <= Math.round(rating / 2) ? ratingColor : '#2a2e38' }}>★</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

export default MovieCard
