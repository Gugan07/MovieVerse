import { useState } from 'react'
import { shortFilms as initialFilms, genres } from '../data/shortFilms'

// ── Genre tag colours ─────────────────────────────────────────────────────────
const GENRE_COLORS = {
  Animation: '#e8a020',
  Drama:     '#a78bfa',
  Comedy:    '#34d399',
  Thriller:  '#60a5fa',
  Horror:    '#f87171',
}

// ── Inline YouTube player modal ───────────────────────────────────────────────
const VideoModal = ({ film, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: 'rgba(0,0,0,0.92)' }}
    onClick={onClose}
  >
    <div className="w-full max-w-4xl" onClick={e => e.stopPropagation()}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-white font-black text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            {film.title}
          </h2>
          <p className="text-[#7a8694] text-sm">Dir. {film.director} · {film.year} · {film.duration}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center text-[#7a8694] hover:text-white border border-white/10 rounded transition-colors ml-4 flex-shrink-0"
        >
          ✕
        </button>
      </div>

      {/* Player */}
      <div className="rounded-xl overflow-hidden border border-white/8 shadow-2xl" style={{ aspectRatio: '16/9' }}>
        <iframe
          src={`https://www.youtube.com/embed/${film.youtubeId}?autoplay=1&rel=0`}
          title={film.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>

      {/* Editorial note below player */}
      <div className="mt-4 bg-[#0f1218]/80 rounded-lg px-5 py-4 border border-white/5 border-l-2 border-l-[#e8a020]">
        <p className="text-[#a0aab4] text-sm leading-relaxed italic">"{film.note}"</p>
        {film.awards && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[#e8a020]">🏆</span>
            <span className="text-[#e8a020] text-xs font-black uppercase tracking-wider">{film.awards}</span>
          </div>
        )}
      </div>
    </div>
  </div>
)

// ── Film Card ─────────────────────────────────────────────────────────────────
const ShortFilmCard = ({ film, onPlay, featured = false }) => {
  const accentColor = GENRE_COLORS[film.genre] || '#e8a020'

  if (featured) {
    // Large featured card (first film)
    return (
      <div className="group relative rounded-xl overflow-hidden bg-[#0f1218] border border-white/5 hover:border-[#e8a020]/30 transition-all duration-300 md:col-span-2 lg:col-span-2">
        <div className="flex flex-col md:flex-row">
          {/* Thumbnail */}
          <div className="relative md:w-96 h-56 md:h-auto flex-shrink-0 overflow-hidden cursor-pointer" onClick={() => onPlay(film)}>
            <img
              src={film.thumbnail}
              alt={film.title}
              className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-500"
              onError={e => { e.target.src = `https://i.ytimg.com/vi/${film.youtubeId}/hqdefault.jpg` }}
            />
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: accentColor }}>
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#0d0f12] ml-1">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            {/* Duration */}
            <div className="absolute bottom-3 right-3 bg-[#0d0f12]/85 text-[#e8a020] text-xs px-2 py-0.5 rounded font-mono font-bold">
              {film.duration}
            </div>
            {/* Genre */}
            <div className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ backgroundColor: accentColor, color: '#0d0f12' }}>
              {film.genre}
            </div>
          </div>

          {/* Info panel */}
          <div className="p-6 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] text-[#e8a020] font-black uppercase tracking-widest border border-[#e8a020]/30 px-2 py-0.5 rounded">
                  ✦ Featured
                </span>
                {film.awards && (
                  <span className="text-[10px] text-[#f5c842] font-bold">🏆 {film.awards}</span>
                )}
              </div>

              <h2 className="text-2xl font-black text-white mb-1 group-hover:text-[#e8a020] transition-colors"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                {film.title}
              </h2>
              <p className="text-[#5a6472] text-sm mb-4">
                Dir. <span className="text-[#a0aab4] font-semibold">{film.director}</span> · {film.year}
              </p>

              {/* Editorial note */}
              <blockquote className="border-l-2 pl-4 mb-5" style={{ borderColor: accentColor }}>
                <p className="text-[#8a96a4] text-sm leading-relaxed italic">{film.note}</p>
              </blockquote>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {film.tags?.map(t => (
                  <span key={t} className="text-[10px] text-[#5a6472] bg-[#131720] border border-white/5 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onPlay(film)}
              className="mt-5 w-fit flex items-center gap-2 font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-md transition-colors"
              style={{ backgroundColor: accentColor, color: '#0d0f12' }}
            >
              ▶ Watch Now
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Standard card
  return (
    <div className="group rounded-xl overflow-hidden bg-[#0f1218] border border-white/5 hover:border-[#e8a020]/30 transition-all duration-300 flex flex-col"
      style={{ '--accent': accentColor }}>
      {/* Thumbnail */}
      <div className="relative overflow-hidden cursor-pointer flex-shrink-0" onClick={() => onPlay(film)} style={{ aspectRatio: '16/9' }}>
        <img
          src={film.thumbnail}
          alt={film.title}
          className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = `https://i.ytimg.com/vi/${film.youtubeId}/hqdefault.jpg` }}
        />
        {/* Play */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundColor: accentColor }}>
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#0d0f12] ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* Duration + Genre overlays */}
        <div className="absolute bottom-2 right-2 bg-[#0d0f12]/85 text-[#e8a020] text-[10px] px-2 py-0.5 rounded font-mono font-bold">
          {film.duration}
        </div>
        <div className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
          style={{ backgroundColor: accentColor, color: '#0d0f12' }}>
          {film.genre}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Award badge */}
        {film.awards && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-[9px] text-[#f5c842] font-black uppercase tracking-wider">🏆 {film.awards}</span>
          </div>
        )}

        <h3 className="text-white font-black text-sm mb-1 group-hover:text-[#e8a020] transition-colors leading-snug"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          {film.title}
        </h3>
        <p className="text-[#4a5462] text-[10px] mb-3">
          Dir. {film.director} · {film.year}
        </p>

        {/* Editorial note */}
        <p className="text-[#6a7480] text-xs leading-relaxed line-clamp-3 flex-1 italic">
          {film.note}
        </p>

        {/* Tags + Watch link */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <div className="flex flex-wrap gap-1">
            {film.tags?.slice(0, 2).map(t => (
              <span key={t} className="text-[9px] text-[#4a5462] bg-[#131720] px-1.5 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
          <button
            onClick={() => onPlay(film)}
            className="text-[10px] font-black uppercase tracking-wider transition-colors"
            style={{ color: accentColor }}
          >
            ▶ Watch
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Upload Form ───────────────────────────────────────────────────────────────
const UploadForm = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({ title: '', director: '', year: '', duration: '', genre: 'Drama', youtubeId: '', note: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      id: Date.now(),
      youtubeId: form.youtubeId.replace('https://www.youtube.com/watch?v=', '').replace('https://youtu.be/', '').trim(),
      thumbnail: `https://i.ytimg.com/vi/${form.youtubeId}/hqdefault.jpg`,
      tags: [form.genre],
      awards: '',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f1218] border-l-2 border-[#e8a020] rounded-xl p-7 mb-10">
      <h2 className="text-lg font-black text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
        Submit a Short Film
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {[
          ['Film Title', 'title', 'text', true],
          ['Director', 'director', 'text', true],
          ['Year', 'year', 'number', false],
          ['Duration', 'duration', 'text', false],
        ].map(([lbl, key, type, req]) => (
          <div key={key}>
            <label className="block text-[10px] font-black text-[#5a6472] uppercase tracking-widest mb-1.5">{lbl}</label>
            <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              placeholder={lbl} required={req}
              className="w-full bg-[#131720] border border-white/5 text-white text-sm rounded-md px-3 py-2.5 outline-none focus:border-[#e8a020] transition-colors" />
          </div>
        ))}

        <div>
          <label className="block text-[10px] font-black text-[#5a6472] uppercase tracking-widest mb-1.5">Genre</label>
          <select value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))}
            className="w-full bg-[#131720] border border-white/5 text-white text-sm rounded-md px-3 py-2.5 outline-none focus:border-[#e8a020] transition-colors">
            {['Animation', 'Drama', 'Comedy', 'Thriller', 'Horror'].map(g => <option key={g}>{g}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black text-[#5a6472] uppercase tracking-widest mb-1.5">YouTube ID or URL</label>
          <input type="text" value={form.youtubeId} onChange={e => setForm(f => ({ ...f, youtubeId: e.target.value }))}
            placeholder="e.g. dQw4w9WgXcQ"
            required
            className="w-full bg-[#131720] border border-white/5 text-white text-sm rounded-md px-3 py-2.5 outline-none focus:border-[#e8a020] transition-colors" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] font-black text-[#5a6472] uppercase tracking-widest mb-1.5">Editorial Note</label>
          <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            placeholder="Write a short note about why this film is worth watching…"
            required
            className="w-full bg-[#131720] border border-white/5 text-white text-sm rounded-md px-3 py-2.5 outline-none focus:border-[#e8a020] transition-colors resize-none h-24" />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" className="bg-[#e8a020] text-[#0d0f12] px-6 py-2.5 rounded-md font-black text-sm uppercase tracking-wider hover:bg-[#f5c842] transition-colors">
          Submit
        </button>
        <button type="button" onClick={onCancel} className="border border-white/10 text-[#7a8694] px-5 py-2.5 rounded-md text-sm font-semibold hover:text-white transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const ShortFilms = () => {
  const [films, setFilms]           = useState(initialFilms)
  const [playingFilm, setPlayingFilm] = useState(null)
  const [showForm, setShowForm]     = useState(false)
  const [activeGenre, setActiveGenre] = useState('All')

  const filteredFilms = activeGenre === 'All'
    ? films
    : films.filter(f => f.genre === activeGenre)

  const handleAddFilm = (newFilm) => {
    setFilms(prev => [newFilm, ...prev])
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-[#0d0f12]">
      {/* Video Modal */}
      {playingFilm && <VideoModal film={playingFilm} onClose={() => setPlayingFilm(null)} />}

      {/* ── Header ── */}
      <div className="bg-[#0f1218] border-b border-white/5 py-14 relative overflow-hidden">
        {/* Decorative film strip top */}
        <div className="absolute top-0 left-0 right-0 h-2 flex gap-2 px-2 overflow-hidden opacity-30">
          {Array(40).fill(0).map((_, i) => (
            <div key={i} className="h-full w-6 bg-[#e8a020] rounded-b flex-shrink-0" />
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-1 h-12 bg-[#e8a020] rounded-full mt-1" />
              <div>
                <p className="text-[#e8a020] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Cinema Shorts</p>
                <h1 className="text-4xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Short Films
                </h1>
                <p className="text-[#5a6472] text-sm mt-1">
                  Award-winning short films. Big stories. Small runtime.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowForm(f => !f)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-md font-black text-xs uppercase tracking-wider transition-colors ${
                showForm ? 'bg-[#1a1e26] text-[#7a8694] border border-white/10' : 'bg-[#e8a020] text-[#0d0f12] hover:bg-[#f5c842]'
              }`}
            >
              {showForm ? '✕ Cancel' : '+ Submit Film'}
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-8 pt-6 border-t border-white/5">
            {[
              { val: films.length, label: 'Films' },
              { val: '9', label: 'Award Winners' },
              { val: '< 15 min', label: 'Avg Runtime' },
              { val: 'Free', label: 'On YouTube' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-[#e8a020] text-xl font-black">{s.val}</div>
                <div className="text-[#4a5462] text-[10px] uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-12">
        {/* Upload form */}
        {showForm && <UploadForm onSubmit={handleAddFilm} onCancel={() => setShowForm(false)} />}

        {/* Genre filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['All', 'Animation', 'Drama', 'Comedy', 'Thriller', 'Horror'].map(g => (
            <button
              key={g}
              onClick={() => setActiveGenre(g)}
              className={`px-3 py-1.5 rounded text-[11px] font-black uppercase tracking-wider transition-all ${
                activeGenre === g
                  ? 'text-[#0d0f12]'
                  : 'bg-[#1a1e26] text-[#5a6472] hover:text-white border border-white/5'
              }`}
              style={activeGenre === g ? { backgroundColor: GENRE_COLORS[g] || '#e8a020' } : {}}
            >
              {g}
            </button>
          ))}
          <span className="ml-auto text-[#3a4048] text-[10px] uppercase tracking-widest self-center">
            {filteredFilms.length} films
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFilms.map((film, i) => (
            <ShortFilmCard
              key={film.id}
              film={film}
              onPlay={setPlayingFilm}
              featured={i === 0 && activeGenre === 'All'}
            />
          ))}
        </div>

        {/* Empty state */}
        {filteredFilms.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎬</div>
            <h3 className="text-white font-black text-xl mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              No {activeGenre} films yet
            </h3>
            <button onClick={() => setActiveGenre('All')} className="bg-[#e8a020] text-[#0d0f12] px-5 py-2 rounded font-black text-xs uppercase tracking-wider hover:bg-[#f5c842] transition-colors">
              Show All
            </button>
          </div>
        )}

        {/* CTA footer */}
        <div className="mt-16 bg-[#0f1218] rounded-xl border border-white/5 border-l-2 border-l-[#e8a020] p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Made a Short Film?
          </h2>
          <p className="text-[#5a6472] text-sm mb-5 max-w-md mx-auto">
            Share your work with the CineVerse community. Submit a YouTube link and we'll feature it on this page.
          </p>
          <button
            onClick={() => { setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="bg-[#e8a020] text-[#0d0f12] px-8 py-3 rounded-md font-black text-sm uppercase tracking-wider hover:bg-[#f5c842] transition-colors"
          >
            + Submit Your Film
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShortFilms
