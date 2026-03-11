import { useState, useMemo } from 'react'
import { articles as initialArticles } from '../data/articles'
import { isLiked, toggleLike } from '../services/storage'

// ── Tag colour map ─────────────────────────────────────────────────────────────
const TAG_COLOURS = {
  Analysis:    { bg: '#e8a020', text: '#0d0f12' },
  Music:       { bg: '#40bcf4', text: '#0d0f12' },
  Performance: { bg: '#a78bfa', text: '#0d0f12' },
}

const TagBadge = ({ tag }) => {
  const c = TAG_COLOURS[tag] || { bg: '#2a2e38', text: '#a0aab4' }
  return (
    <span
      className="inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {tag}
    </span>
  )
}

// ── Article detail page ────────────────────────────────────────────────────────
const ArticleDetail = ({ article, onBack }) => {
  const [liked, setLiked] = useState(isLiked(article.id))

  const handleLike = () => {
    const nowLiked = toggleLike(article.id)
    setLiked(nowLiked)
  }

  return (
  <div className="min-h-screen bg-[#0d0f12]">
    {/* Backdrop hero */}
    <div className="relative h-72 md:h-96 overflow-hidden">
      <img
        src={article.backdrop || article.image}

        alt={article.title}
        className="w-full h-full object-cover"
        style={{ filter: 'brightness(0.35)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f12] via-transparent to-transparent" />

      {/* Poster overlay */}
      <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-5 pb-0 flex items-end gap-5">
        <img
          src={article.image}
          alt={article.film}
          className="w-24 md:w-32 rounded-lg shadow-2xl ring-1 ring-white/10 -mb-12 flex-shrink-0"
        />
        <div className="pb-3">
          {article.tag && <TagBadge tag={article.tag} />}
          <h1
            className="text-2xl md:text-3xl font-black text-white mt-2 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {article.title}
          </h1>
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="max-w-4xl mx-auto px-5 pt-16 pb-16">
      {/* Back + meta */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[#e8a020] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
        >
          ← Back to Articles
        </button>
        <div className="flex items-center gap-2 text-[#4a5462] text-xs">
          <span className="text-white font-semibold">{article.author}</span>
          <span>·</span>
          <span>{article.date}</span>
          {article.readTime && <><span>·</span><span>{article.readTime}</span></>}
        </div>
      </div>

      {/* Film info pill */}
      {article.film && (
        <div className="flex items-center gap-2 mb-6 bg-[#0f1218] border border-white/5 rounded-lg px-4 py-2.5 w-fit">
          <img src={article.image} alt="" className="w-6 h-8 object-cover rounded" />
          <div>
            <div className="text-white text-xs font-bold">{article.film}</div>
            {article.year && <div className="text-[#4a5462] text-[10px]">{article.year}</div>}
          </div>
        </div>
      )}

      {/* Pull quote */}
      <blockquote className="border-l-2 border-[#e8a020] pl-5 mb-8 bg-[#0f1218] py-4 pr-4 rounded-r-lg">
        <p className="text-[#a0aab4] italic text-sm leading-relaxed">{article.excerpt}</p>
      </blockquote>

      {/* Body */}
      <div
        className="text-[#c0cad4] text-[0.95rem] leading-[1.9]"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        {article.content}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-10 pt-6 border-t border-white/5">
        <button
          onClick={handleLike}
          className={`px-5 py-2 rounded font-black text-xs uppercase tracking-wider transition-all ${
            liked
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-[#e8a020] text-[#0d0f12] hover:bg-[#f5c842]'
          }`}
        >
          {liked ? '♥ Liked' : '♡ Like'}
        </button>
        <button className="border border-white/10 text-[#7a8694] px-5 py-2 rounded text-xs font-semibold hover:text-white hover:border-white/20 transition-colors">
          Share
        </button>
      </div>
    </div>
  </div>
  )
}

// ── Main Articles list ─────────────────────────────────────────────────────────
const Articles = () => {
  const [articles, setArticles] = useState(initialArticles)
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', author: '', film: '', year: '', tag: '', readTime: '', image: '', excerpt: '', content: '' })

  // All unique tags
  const tags = ['All', ...new Set(articles.map(a => a.tag).filter(Boolean))]

  // Filtered list
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return articles.filter(a => {
      const matchTag = activeTag === 'All' || a.tag === activeTag
      const matchSearch = !q || [a.title, a.film, a.author, a.tag, a.excerpt]
        .some(field => field?.toLowerCase().includes(q))
      return matchTag && matchSearch
    })
  }, [articles, search, activeTag])

  const handlePublish = (e) => {
    e.preventDefault()
    setArticles(prev => [{ id: prev.length + 1, ...form, date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }, ...prev])
    setShowForm(false)
    setForm({ title: '', author: '', film: '', year: '', tag: '', readTime: '', image: '', excerpt: '', content: '' })
  }

  // Show detail view
  if (selected) return <ArticleDetail article={selected} onBack={() => setSelected(null)} />

  // ── List view ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0d0f12]">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-[#0f1218] border-b border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-5">

          {/* Title row */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-1 h-12 bg-[#e8a020] rounded-full" />
              <div>
                <p className="text-[#e8a020] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Film Writing</p>
                <h1 className="text-4xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Film Articles
                </h1>
                <p className="text-[#5a6472] text-sm mt-1">Critical writing on cinema, directors &amp; the art of film</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(f => !f)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-md font-black text-xs uppercase tracking-wider transition-colors ${
                showForm ? 'bg-[#1a1e26] text-[#7a8694] border border-white/10' : 'bg-[#e8a020] text-[#0d0f12] hover:bg-[#f5c842]'
              }`}
            >
              {showForm ? '✕ Cancel' : '+ Write'}
            </button>
          </div>

          {/* Search */}
          <div className="relative max-w-sm mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a5462]">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by film, author or topic…"
              className="w-full bg-[#131720] border border-white/8 text-white text-sm rounded-md pl-9 pr-8 py-2.5 outline-none focus:border-[#e8a020] transition-colors placeholder-[#4a5462]"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5462] hover:text-white text-xs">✕</button>
            )}
          </div>

          {/* Tag filters */}
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider transition-all ${
                  activeTag === tag
                    ? 'bg-[#e8a020] text-[#0d0f12]'
                    : 'bg-[#1a1e26] text-[#5a6472] border border-white/5 hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 py-10">

        {/* Publish form */}
        {showForm && (
          <form onSubmit={handlePublish} className="bg-[#0f1218] border-l-2 border-[#e8a020] rounded-xl p-8 mb-10">
            <h2 className="text-lg font-black text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Publish New Article
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[
                ['Title', 'title', true],
                ['Author', 'author', true],
                ['Film Name', 'film', false],
                ['Year', 'year', false],
                ['Tag', 'tag', false],
                ['Read Time', 'readTime', false],
                ['Image URL', 'image', true],
              ].map(([label, key, req]) => (
                <div key={key} className={key === 'image' ? 'md:col-span-2' : ''}>
                  <label className="block text-[10px] font-black text-[#5a6472] uppercase tracking-widest mb-1.5">{label}</label>
                  <input
                    type={key === 'image' ? 'url' : 'text'}
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={key === 'image' ? 'https://image.tmdb.org/...' : `Enter ${label.toLowerCase()}`}
                    required={req}
                    className="w-full bg-[#131720] border border-white/5 text-white text-sm rounded-md px-3 py-2.5 outline-none focus:border-[#e8a020] transition-colors placeholder-[#3a4048]"
                  />
                </div>
              ))}
              {[['Excerpt (short summary)', 'excerpt', 'h-20'], ['Full Content', 'content', 'h-36']].map(([label, key, h]) => (
                <div key={key} className="md:col-span-2">
                  <label className="block text-[10px] font-black text-[#5a6472] uppercase tracking-widest mb-1.5">{label}</label>
                  <textarea
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    required
                    className={`w-full bg-[#131720] border border-white/5 text-white text-sm rounded-md px-3 py-2.5 outline-none focus:border-[#e8a020] transition-colors resize-none ${h}`}
                  />
                </div>
              ))}
            </div>
            <button type="submit" className="bg-[#e8a020] text-[#0d0f12] px-8 py-2.5 rounded-md font-black text-sm uppercase tracking-wider hover:bg-[#f5c842] transition-colors">
              Publish Article
            </button>
          </form>
        )}

        {/* Search status */}
        {(search || activeTag !== 'All') && (
          <div className="flex items-center gap-3 mb-6">
            <p className="text-[#5a6472] text-sm">
              <span className="text-white font-semibold">{filtered.length}</span>
              {' '}article{filtered.length !== 1 ? 's' : ''} found
              {search && <span> for <span className="text-[#e8a020]">"{search}"</span></span>}
            </p>
            <button
              onClick={() => { setSearch(''); setActiveTag('All') }}
              className="text-[10px] text-[#e8a020] font-bold uppercase tracking-wider hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-white font-black text-xl mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              No Articles Found
            </h3>
            <p className="text-[#5a6472] text-sm mb-5">Try searching for "Tamasha", "Music", or "Ranbir"</p>
            <button
              onClick={() => { setSearch(''); setActiveTag('All') }}
              className="bg-[#e8a020] text-[#0d0f12] px-5 py-2 rounded font-black text-xs uppercase tracking-wider hover:bg-[#f5c842] transition-colors"
            >
              Show All
            </button>
          </div>
        )}

        {/* ── Featured article (first, full width) ── */}
        {filtered.length > 0 && !search && activeTag === 'All' && (
          <div
            onClick={() => setSelected(filtered[0])}
            className="group cursor-pointer flex flex-col md:flex-row rounded-xl overflow-hidden bg-[#0f1218] border border-white/5 hover:border-[#e8a020]/30 transition-all duration-300 mb-5"
          >
            {/* Image */}
            <div className="md:w-72 h-56 md:h-auto flex-shrink-0 overflow-hidden bg-[#131720]">
              <img
                src={filtered[0].image}
                alt={filtered[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Info */}
            <div className="flex flex-col justify-center p-7">
              <div className="flex items-center gap-2 mb-3">
                {filtered[0].tag && <TagBadge tag={filtered[0].tag} />}
                {filtered[0].film && (
                  <span className="text-[#5a6472] text-[10px] uppercase tracking-wider">· {filtered[0].film} ({filtered[0].year})</span>
                )}
              </div>
              <h2
                className="text-2xl font-black text-white mb-2 leading-tight group-hover:text-[#e8a020] transition-colors"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {filtered[0].title}
              </h2>
              <p className="text-[#4a5462] text-xs mb-3">
                {filtered[0].author} · {filtered[0].date}
                {filtered[0].readTime && ` · ${filtered[0].readTime}`}
              </p>
              <p className="text-[#7a8694] text-sm leading-relaxed line-clamp-2 mb-4">{filtered[0].excerpt}</p>
              <span className="text-[#e8a020] text-xs font-black uppercase tracking-wider">Read Article →</span>
            </div>
          </div>
        )}

        {/* ── Remaining cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(search || activeTag !== 'All' ? filtered : filtered.slice(1)).map(article => (
            <div
              key={article.id}
              onClick={() => setSelected(article)}
              className="group cursor-pointer flex rounded-xl overflow-hidden bg-[#0f1218] border border-white/5 hover:border-[#e8a020]/30 transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="w-32 flex-shrink-0 overflow-hidden bg-[#131720]">
                <img
                  src={article.image}
                  alt={article.film || article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              {/* Info */}
              <div className="p-4 flex flex-col justify-center flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                  {article.tag && <TagBadge tag={article.tag} />}
                  {article.film && (
                    <span className="text-[#4a5462] text-[9px] uppercase tracking-wider">· {article.film}</span>
                  )}
                </div>
                <h3
                  className="text-white font-black text-sm leading-snug mb-1 group-hover:text-[#e8a020] transition-colors line-clamp-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {article.title}
                </h3>
                <p className="text-[#3a4048] text-[10px] mb-1.5">{article.author} · {article.date}</p>
                <p className="text-[#5a6472] text-xs line-clamp-2 leading-relaxed">{article.excerpt}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Articles
