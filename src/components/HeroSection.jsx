import { Link } from 'react-router-dom'

const HeroSection = ({ movie }) => {
  const ratingNum = parseFloat(movie.rating)

  return (
    <div className="relative min-h-[70vh] flex items-end overflow-hidden">
      {/* Full-bleed background poster */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-[0.7] transform scale-105"
        style={{ backgroundImage: `url(${movie.poster})` }}
      />
      {/* Decorative Layer: Grain/Texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")'
      }} />

      {/* Layered overlays for editorial feel */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d0f12] via-[#0d0f12]/80 via-30% to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f12] via-transparent to-transparent" />

      {/* Decorative side element */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#e8a020] to-transparent opacity-60" />

      <div className="relative max-w-7xl mx-auto px-5 pb-20 pt-44 w-full z-10">
        <div className="max-w-2xl animate-in fade-in slide-in-from-left-4 duration-700">
          {/* Label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-[#e8a020]" />
            <span className="text-[#e8a020] text-[10px] font-black uppercase tracking-[0.3em]">Cinephile Choice</span>
          </div>

          {/* Title */}
          <h1
            className="text-6xl md:text-8xl font-black text-white leading-none mb-6 tracking-tighter"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {movie.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-4 text-xs">
            <span className="text-[#a0aab4]">{movie.year}</span>
            <span className="text-[#3a4048]">|</span>
            <span className="text-[#a0aab4]">{movie.genre}</span>
            <span className="text-[#3a4048]">|</span>
            <span className="text-[#a0aab4]">Dir. <span className="text-white font-semibold">{movie.director}</span></span>
          </div>

          {/* Description */}
          <p className="text-[#8a96a4] text-sm leading-relaxed max-w-lg mb-6">
            {movie.description}
          </p>

          {/* Rating pill */}
          <div className="flex items-center gap-4 mb-7">
            <div className="flex items-center gap-1.5 bg-[#1a1e26]/80 backdrop-blur rounded-full px-4 py-2 border border-white/8">
              <span className="text-[#e8a020] text-base">★</span>
              <span className="text-white font-black text-lg">{movie.rating}</span>
              <span className="text-[#4a5462] text-xs">/10</span>
            </div>
            {movie.cast && (
              <div className="flex flex-wrap gap-1.5">
                {movie.cast.slice(0, 3).map((a, i) => (
                  <span key={i} className="text-[11px] text-[#7a8694] bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <Link
              to={`/movie/${movie.id}`}
              className="bg-[#e8a020] text-[#0d0f12] px-6 py-2.5 rounded-md text-sm font-black uppercase tracking-wider hover:bg-[#f5c842] transition-colors shadow-lg shadow-[#e8a020]/20"
            >
              Read Review
            </Link>
            <button className="text-[#a0aab4] border border-white/10 px-5 py-2.5 rounded-md text-sm font-semibold hover:border-white/25 hover:text-white transition-colors">
              + Watchlist
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
