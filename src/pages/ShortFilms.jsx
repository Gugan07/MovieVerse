import { useState } from 'react'
import { languages, genres } from '../data/shortFilms'
import {
  getShortFilms, saveShortFilm,
  isFilmLiked, toggleFilmLike, getFilmLikeCount,
  getFilmComments, addFilmComment, deleteFilmComment,
} from '../services/storage'

const GENRE_COLORS = {
  Animation: '#e8a020',
  Drama: '#a78bfa',
  Comedy: '#34d399',
  Thriller: '#60a5fa',
  Horror: '#f87171',
  Romance: '#f472b6',
}

const LANG_COLORS = {
  Tamil: { bg: '#e8a020', text: '#0d0f12' },
  Hindi: { bg: '#a78bfa', text: '#0d0f12' },
  English: { bg: '#34d399', text: '#0d0f12' },
}

const LANG_FLAGS = { Tamil: '🇮🇳', Hindi: '🇮🇳', English: '🇬🇧' }


const extractYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : url
}

const VideoModal = ({ film, onClose }) => {
  const accentColor = GENRE_COLORS[film.genre] || '#e8a020'

  // Like state
  const [liked, setLiked] = useState(() => isFilmLiked(film.id))
  const [likeCount, setLikeCount] = useState(() => getFilmLikeCount(film.id))
  const [shareCopied, setShareCopied] = useState(false)

  // Comment state
  const [comments, setComments] = useState(() => getFilmComments(film.id))
  const [commentAuthor, setCommentAuthor] = useState('')
  const [commentText, setCommentText] = useState('')
  const [posted, setPosted] = useState(false)

  const handleLike = () => {
    const nowLiked = toggleFilmLike(film.id)
    setLiked(nowLiked)
    setLikeCount(getFilmLikeCount(film.id))
  }

  const handleShare = async () => {
    const text = `${film.title} (${film.year}) — Dir. ${film.director}`
    const url = `https://www.youtube.com/watch?v=${film.youtubeId}`
    if (navigator.share) {
      try { await navigator.share({ title: film.title, text, url }) } catch { }
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2500)
    }
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    addFilmComment(film.id, { author: commentAuthor, text: commentText })
    setComments(getFilmComments(film.id))
    setCommentText(''); setCommentAuthor('')
    setPosted(true); setTimeout(() => setPosted(false), 2000)
  }

  const handleDeleteComment = (commentId) => {
    deleteFilmComment(film.id, commentId)
    setComments(getFilmComments(film.id))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.95)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#0d0f12] border border-black/10 dark:border-white/8"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {film.language && (
                  <span
                    className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
                    style={LANG_COLORS[film.language] || { backgroundColor: '#2a2e38', color: '#a0aab4' }}
                  >
                    {LANG_FLAGS[film.language]} {film.language}
                  </span>
                )}
                <span
                  className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
                  style={{ backgroundColor: accentColor, color: '#0d0f12' }}
                >
                  {film.genre}
                </span>
              </div>
              <h2 className="text-slate-900 dark:text-white font-black text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                {film.title}
              </h2>
              <p className="text-slate-500 dark:text-[#7a8694] text-sm">Dir. {film.director} · {film.year} · {film.duration}</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center text-[#7a8694] hover:text-white border border-white/10 hover:border-white/30 rounded-lg transition-colors ml-4 flex-shrink-0 text-lg"
            >
              ✕
            </button>
          </div>

          {/* Player */}
          <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl" style={{ aspectRatio: '16/9' }}>
            <iframe
              src={`https://www.youtube.com/embed/${film.youtubeId}?autoplay=1&rel=0`}
              title={film.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* Note */}
          <div className="mt-4 bg-slate-50 dark:bg-[#0f1218] rounded-xl px-5 py-4 border border-black/5 dark:border-white/5 border-l-2" style={{ borderLeftColor: accentColor }}>
            <p className="text-slate-500 dark:text-[#a0aab4] text-sm leading-relaxed italic">"{film.note}"</p>
            {film.awards && (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[#e8a020]">🏆</span>
                <span className="text-[#e8a020] text-xs font-black uppercase tracking-wider">{film.awards}</span>
              </div>
            )}
          </div>

          {/* ── Actions bar ── */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
            {/* Like */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all ${liked ? 'bg-red-500 text-white hover:bg-red-600' : 'text-[#0d0f12] hover:brightness-110'
                }`}
              style={!liked ? { backgroundColor: accentColor } : {}}
            >
              <span>{liked ? '♥' : '♡'}</span>
              <span>{liked ? 'Liked' : 'Like'}</span>
              {likeCount > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${liked ? 'bg-white/20' : 'bg-black/15'}`}>
                  {likeCount}
                </span>
              )}
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 border border-black/10 dark:border-white/10 text-slate-500 dark:text-[#7a8694] px-4 py-2 rounded-lg text-xs font-semibold hover:text-slate-900 dark:hover:text-white hover:border-black/20 dark:hover:border-white/20 transition-colors"
            >
              {shareCopied ? '✓ Copied!' : '↗ Share'}
            </button>
          </div>

          {/* ── Comment section ── */}
          <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-0.5 h-5 rounded-full" style={{ backgroundColor: accentColor }} />
              <h3 className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-wider">Discussion</h3>
              <span
                className="text-[10px] font-black px-2 py-0.5 rounded-full"
                style={{ backgroundColor: accentColor + '22', color: accentColor }}
              >
                {comments.length} comment{comments.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Comment form */}
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="bg-slate-50 dark:bg-[#131720] border border-black/5 dark:border-white/5 rounded-xl p-4 focus-within:border-black/15 dark:focus-within:border-white/15 transition-colors">
                <input
                  type="text" value={commentAuthor} onChange={e => setCommentAuthor(e.target.value)}
                  placeholder="Your name (optional)" maxLength={40}
                  className="w-full bg-transparent text-slate-900 dark:text-white text-xs mb-3 outline-none placeholder-slate-400 dark:placeholder-[#3a4048] font-semibold"
                />
                <textarea
                  value={commentText} onChange={e => setCommentText(e.target.value)}
                  placeholder="Share your thoughts about this film..." rows={3} required
                  className="w-full bg-transparent text-[#c0cad4] text-sm outline-none placeholder-[#3a4048] resize-none leading-relaxed"
                />
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <span className="text-[#3a4048] text-[10px]">
                    {commentText.length > 0 ? `${commentText.length} chars` : 'Be respectful & constructive'}
                  </span>
                  <button
                    type="submit" disabled={!commentText.trim()}
                    className="px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider text-[#0d0f12] transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
                    style={{ backgroundColor: accentColor }}
                  >
                    {posted ? '✓ Posted!' : 'Post'}
                  </button>
                </div>
              </div>
            </form>

            {/* Comments list */}
            {comments.length === 0 ? (
              <div className="text-center py-8 bg-white dark:bg-[#0f1218] rounded-xl border border-black/5 dark:border-white/5">
                <div className="text-3xl mb-2">💬</div>
                <p className="text-slate-500 dark:text-[#4a5462] text-sm">No comments yet. Start the discussion!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map(c => (
                  <div key={c.id} className="group bg-white dark:bg-[#0f1218] border border-black/5 dark:border-white/5 rounded-xl px-5 py-4 hover:border-black/10 dark:hover:border-white/10 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0"
                          style={{ backgroundColor: accentColor + '30', color: accentColor }}
                        >
                          {c.author?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <span className="text-slate-900 dark:text-white text-xs font-black">{c.author}</span>
                          <span className="text-slate-400 dark:text-[#3a4048] text-[10px] ml-2">{c.date}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="opacity-0 group-hover:opacity-100 text-[#3a4048] hover:text-red-400 text-[11px] transition-all"
                        title="Delete"
                      >🗑️</button>
                    </div>
                    <p className="text-[#9aa4ae] text-sm leading-relaxed pl-9">{c.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const ShortFilmCard = ({ film, onPlay, featured = false }) => {
  const accentColor = GENRE_COLORS[film.genre] || '#e8a020'
  const langStyle = LANG_COLORS[film.language] || { backgroundColor: '#2a2e38', color: '#a0aab4' }
  const thumb = film.thumbnail || `https://i.ytimg.com/vi/${film.youtubeId}/hqdefault.jpg`

  if (featured) {
    return (
      <div className="group relative rounded-2xl overflow-hidden bg-white dark:bg-[#0f1218] border border-black/5 dark:border-white/5 hover:border-[#e8a020]/40 transition-all duration-300 md:col-span-2 lg:col-span-3 shadow-xl">
        <div className="flex flex-col lg:flex-row">
          {/* Thumbnail */}
          <div
            className="relative lg:w-[480px] h-64 lg:h-auto flex-shrink-0 overflow-hidden cursor-pointer"
            onClick={() => onPlay(film)}
          >
            <img
              src={thumb}
              alt={film.title}
              className="w-full h-full object-cover brightness-70 group-hover:scale-105 transition-transform duration-700"
              onError={e => { e.target.src = `https://i.ytimg.com/vi/${film.youtubeId}/hqdefault.jpg` }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white dark:to-[#0f1218] opacity-60 hidden lg:block" />
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 ring-4 ring-white/10"
                style={{ backgroundColor: accentColor }}
              >
                <svg viewBox="0 0 24 24" className="w-9 h-9 fill-[#0d0f12] ml-1.5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              <span
                className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow"
                style={{ backgroundColor: accentColor, color: '#0d0f12' }}
              >
                {film.genre}
              </span>
              {film.language && (
                <span
                  className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow"
                  style={langStyle}
                >
                  {LANG_FLAGS[film.language]} {film.language}
                </span>
              )}
            </div>
            {/* Duration */}
            <div className="absolute bottom-3 right-3 bg-black/80 text-[#e8a020] text-xs px-2.5 py-1 rounded-md font-mono font-bold">
              🕒 {film.duration}
            </div>
          </div>

          {/* Info panel */}
          <div className="p-7 flex flex-col justify-center flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] text-[#e8a020] font-black uppercase tracking-widest border border-[#e8a020]/40 px-2.5 py-0.5 rounded-md">
                ✧ Featured
              </span>
              {film.awards && (
                <span className="text-[10px] text-[#f5c842] font-bold">🏆 {film.awards}</span>
              )}
            </div>

            <h2
              className="text-3xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-[#e8a020] transition-colors leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {film.title}
            </h2>
            <p className="text-[#5a6472] text-sm mb-5">
              Dir. <span className="text-[#a0aab4] font-semibold">{film.director}</span> · {film.year}
            </p>

            <blockquote className="border-l-2 pl-4 mb-6" style={{ borderColor: accentColor }}>
              <p className="text-[#8a96a4] text-sm leading-relaxed italic line-clamp-3">{film.note}</p>
            </blockquote>

            <div className="flex flex-wrap gap-1.5 mb-6">
              {film.tags?.map(t => (
                <span key={t} className="text-[10px] text-[#5a6472] bg-[#131720] border border-white/5 px-2 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>

            <button
              onClick={() => onPlay(film)}
              className="w-fit flex items-center gap-2.5 font-black text-sm uppercase tracking-wider px-6 py-3 rounded-xl transition-all hover:brightness-110 hover:shadow-lg shadow"
              style={{ backgroundColor: accentColor, color: '#0d0f12' }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current ml-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Now
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Standard card
  return (
    <div className="group rounded-2xl overflow-hidden bg-white dark:bg-[#0f1218] border border-black/5 dark:border-white/5 hover:border-[#e8a020]/30 transition-all duration-300 flex flex-col shadow-md hover:shadow-xl hover:-translate-y-0.5">
      {/* Thumbnail */}
      <div
        className="relative overflow-hidden cursor-pointer flex-shrink-0"
        style={{ aspectRatio: '16/9' }}
        onClick={() => onPlay(film)}
      >
        <img
          src={thumb}
          alt={film.title}
          className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = `https://i.ytimg.com/vi/${film.youtubeId}/hqdefault.jpg` }}
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 ring-2 ring-white/20"
            style={{ backgroundColor: accentColor }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#0d0f12] ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          <span
            className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow"
            style={{ backgroundColor: accentColor, color: '#0d0f12' }}
          >
            {film.genre}
          </span>
          {film.language && (
            <span
              className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow"
              style={langStyle}
            >
              {LANG_FLAGS[film.language]} {film.language}
            </span>
          )}
        </div>

        {/* Duration */}
        <div className="absolute bottom-2.5 right-2.5 bg-black/80 text-[#e8a020] text-[10px] px-2 py-0.5 rounded font-mono font-bold">
          🕒 {film.duration}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {film.awards && (
          <p className="text-[9px] text-[#f5c842] font-black uppercase tracking-wider mb-1.5">🏆 {film.awards}</p>
        )}

        <h3
          className="text-slate-900 dark:text-white font-black text-[0.92rem] mb-1 group-hover:text-[#e8a020] transition-colors leading-snug line-clamp-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {film.title}
        </h3>
        <p className="text-slate-500 dark:text-[#4a5462] text-[10px] mb-3">
          Dir. {film.director} · {film.year}
        </p>

        <p className="text-[#6a7480] text-xs leading-relaxed line-clamp-3 flex-1 italic">
          {film.note}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <div className="flex flex-wrap gap-1">
            {film.tags?.slice(0, 2).map(t => (
              <span key={t} className="text-[9px] text-[#4a5462] bg-[#131720] px-1.5 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
          <button
            onClick={() => onPlay(film)}
            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider transition-colors hover:brightness-125"
            style={{ color: accentColor }}
          >
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Upload Form ─────────────────────────────────────────────────────────────────
const UploadForm = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    title: '', director: '', year: '', duration: '', genre: 'Drama',
    language: 'Tamil', youtubeId: '', note: '', awards: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const ytId = extractYouTubeId(form.youtubeId)
    onSubmit({
      ...form,
      id: Date.now(),
      youtubeId: ytId,
      thumbnail: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
      tags: [form.language, form.genre],
    })
  }

  const inputCls = "w-full bg-[#131720] border border-white/5 text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#e8a020] transition-colors placeholder-[#3a4048]"

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0f1218] border-l-2 border-[#e8a020] rounded-2xl p-8 mb-10 border border-black/5 dark:border-white/5 shadow-sm">
      <h2 className="text-xl font-black text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
        Submit a Short Film
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {[
          ['Film Title', 'title', 'text', true],
          ['Director', 'director', 'text', true],
          ['Year', 'year', 'number', false],
          ['Duration (e.g. 12 min)', 'duration', 'text', false],
          ['Awards / Recognition', 'awards', 'text', false],
        ].map(([lbl, key, type, req]) => (
          <div key={key}>
            <label className="block text-[10px] font-black text-[#5a6472] uppercase tracking-widest mb-1.5">{lbl}</label>
            <input
              type={type} value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              placeholder={lbl} required={req} className={inputCls}
            />
          </div>
        ))}

        <div>
          <label className="block text-[10px] font-black text-[#5a6472] uppercase tracking-widest mb-1.5">Language</label>
          <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} className={inputCls}>
            {['Tamil', 'Hindi', 'English'].map(l => <option key={l}>{l}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black text-[#5a6472] uppercase tracking-widest mb-1.5">Genre</label>
          <select value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))} className={inputCls}>
            {['Animation', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Romance'].map(g => <option key={g}>{g}</option>)}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] font-black text-[#5a6472] uppercase tracking-widest mb-1.5">YouTube URL or Video ID</label>
          <input
            type="text" value={form.youtubeId}
            onChange={e => setForm(f => ({ ...f, youtubeId: e.target.value }))}
            placeholder="https://www.youtube.com/watch?v=... or video ID"
            required className={inputCls}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] font-black text-[#5a6472] uppercase tracking-widest mb-1.5">Editorial Note</label>
          <textarea
            value={form.note}
            onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            placeholder="Write a short note about why this film is worth watching..."
            required
            className={`${inputCls} resize-none h-24`}
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" className="bg-[#e8a020] text-[#0d0f12] px-7 py-2.5 rounded-lg font-black text-sm uppercase tracking-wider hover:bg-[#f5c842] transition-colors">
          Submit Film
        </button>
        <button type="button" onClick={onCancel} className="border border-white/10 text-[#7a8694] px-5 py-2.5 rounded-lg text-sm font-semibold hover:text-white hover:border-white/20 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const ShortFilms = () => {
  const [films, setFilms] = useState(() => getShortFilms())
  const [playingFilm, setPlayingFilm] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [activeLang, setActiveLang] = useState('All')
  const [activeGenre, setActiveGenre] = useState('All')

  const filteredFilms = films.filter(f => {
    const matchLang = activeLang === 'All' || f.language === activeLang
    const matchGenre = activeGenre === 'All' || f.genre === activeGenre
    return matchLang && matchGenre
  })

  const handleAddFilm = (newFilm) => {
    const updated = saveShortFilm(newFilm)
    setFilms(updated)
    setShowForm(false)
  }

  // Language section counts for stats
  const tamil = films.filter(f => f.language === 'Tamil').length
  const hindi = films.filter(f => f.language === 'Hindi').length
  const english = films.filter(f => f.language === 'English').length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0f12] fade-in">
      {/* Video Modal */}
      {playingFilm && <VideoModal film={playingFilm} onClose={() => setPlayingFilm(null)} />}

      {/* ── Header ── */}
      <div className="bg-white dark:bg-[#0f1218] border-b border-black/5 dark:border-white/5 py-16 relative overflow-hidden">
        {/* Film strip decoration */}
        <div className="absolute top-0 left-0 right-0 h-2.5 flex gap-2 px-2 overflow-hidden opacity-30">
          {Array(80).fill(0).map((_, i) => (
            <div key={i} className="h-full w-6 bg-[#e8a020] rounded-b flex-shrink-0" />
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-1 h-14 bg-[#e8a020] rounded-full mt-1" />
              <div>
                <p className="text-[#e8a020] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Cinema Shorts</p>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white font-playfair">
                  Short Films
                </h1>
                <p className="text-slate-500 dark:text-[#5a6472] text-sm mt-1.5">
                  Award-winning shorts in Tamil, Hindi & English — free on YouTube
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowForm(f => !f)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-colors ${showForm ? 'bg-[#1a1e26] text-[#7a8694] border border-white/10' : 'bg-[#e8a020] text-[#0d0f12] hover:bg-[#f5c842]'
                }`}
            >
              {showForm ? '✕ Cancel' : '+ Submit Film'}
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-white/5">
            {[
              { val: films.length, label: 'Total Films' },
              { val: tamil, label: 'Tamil' },
              { val: hindi, label: 'Hindi' },
              { val: english, label: 'English' },
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

        {/* ── Language tabs ── */}
        <div className="mb-4">
          <p className="text-[#3a4048] text-[10px] font-black uppercase tracking-widest mb-2">Language</p>
          <div className="flex flex-wrap gap-2">
            {languages.map(lang => {
              const lc = LANG_COLORS[lang]
              const isActive = activeLang === lang
              return (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ${isActive ? '' : 'bg-[#1a1e26] text-[#5a6472] border border-white/5 hover:text-white'
                    }`}
                  style={isActive ? { backgroundColor: lc?.bg || '#e8a020', color: lc?.text || '#0d0f12' } : {}}
                >
                  {lang !== 'All' && LANG_FLAGS[lang]} {lang}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Genre filter ── */}
        <div className="mb-8">
          <p className="text-[#3a4048] text-[10px] font-black uppercase tracking-widest mb-2">Genre</p>
          <div className="flex flex-wrap gap-2 items-center">
            {['All', ...Object.keys(GENRE_COLORS)].map(g => (
              <button
                key={g}
                onClick={() => setActiveGenre(g)}
                className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ${activeGenre === g ? 'text-[#0d0f12]' : 'bg-[#1a1e26] text-[#5a6472] hover:text-white border border-white/5'
                  }`}
                style={activeGenre === g ? { backgroundColor: GENRE_COLORS[g] || '#e8a020' } : {}}
              >
                {g}
              </button>
            ))}
            <span className="ml-auto text-[#3a4048] text-[10px] uppercase tracking-widest self-center">
              {filteredFilms.length} film{filteredFilms.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFilms.map((film, i) => (
            <ShortFilmCard
              key={film.id}
              film={film}
              onPlay={setPlayingFilm}
              featured={i === 0 && activeLang === 'All' && activeGenre === 'All'}
            />
          ))}
        </div>

        {/* Empty state */}
        {filteredFilms.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-white font-black text-xl mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              No films found
            </h3>
            <p className="text-[#5a6472] text-sm mb-5">
              Try a different language or genre filter.
            </p>
            <button
              onClick={() => { setActiveLang('All'); setActiveGenre('All') }}
              className="bg-[#e8a020] text-[#0d0f12] px-6 py-2.5 rounded-lg font-black text-xs uppercase tracking-wider hover:bg-[#f5c842] transition-colors"
            >
              Show All
            </button>
          </div>
        )}

        {/* CTA footer */}
        <div className="mt-16 bg-white dark:bg-[#0f1218] rounded-2xl border border-black/5 dark:border-white/5 border-l-4 border-l-[#e8a020] p-8 text-center shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Know a Great Short Film?
          </h2>
          <p className="text-slate-500 dark:text-[#5a6472] text-sm mb-5 max-w-md mx-auto">
            Submit a YouTube link in Tamil, Hindi or English and we'll feature it in the collection.
          </p>
          <button
            onClick={() => { setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="bg-[#e8a020] text-[#0d0f12] px-8 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#f5c842] transition-colors"
          >
            + Submit Your Film
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShortFilms
