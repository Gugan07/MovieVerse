import { useState, useMemo } from 'react'
import {
  isLiked, toggleLike,
  getArticleLikeCount,
  getArticleComments, addArticleComment, deleteArticleComment,
  getArticles, saveArticle, updateArticle, deleteArticle,
} from '../services/storage'

// ── Tag colour map ─────────────────────────────────────────────────────────────
const TAG_COLOURS = {
  Analysis:    { bg: '#e8a020', text: '#0d0f12' },
  Music:       { bg: '#40bcf4', text: '#0d0f12' },
  Performance: { bg: '#a78bfa', text: '#0d0f12' },
}

const EMPTY_FORM = { title: '', author: '', film: '', year: '', tag: '', readTime: '', image: '', excerpt: '', content: '' }

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

// ── Shared Article Form ────────────────────────────────────────────────────────
const ArticleForm = ({ initialData = EMPTY_FORM, onSubmit, onCancel, onDelete, isEdit = false }) => {
  const [form, setForm] = useState(initialData)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0f1218] border-l-2 border-[#e8a020] rounded-xl p-8 mb-10 animate-[fadeIn_0.2s_ease]"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
          {isEdit ? '✏️ Edit Article' : 'Publish New Article'}
        </h2>
        {isEdit && onDelete && (
          <div className="flex items-center gap-2">
            {confirmDelete ? (
              <>
                <span className="text-[#5a6472] text-xs">Are you sure?</span>
                <button
                  type="button"
                  onClick={() => onDelete()}
                  className="px-3 py-1.5 bg-red-600 text-white text-xs font-black rounded uppercase tracking-wider hover:bg-red-500 transition-colors"
                >
                  Yes, Delete
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 bg-[#1a1e26] text-[#7a8694] text-xs font-black rounded uppercase tracking-wider border border-white/10 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[#7a8694] text-xs font-black rounded uppercase tracking-wider border border-white/10 hover:border-red-500/50 hover:text-red-400 transition-colors"
              >
                🗑 Delete
              </button>
            )}
          </div>
        )}
      </div>

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

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="bg-[#e8a020] text-[#0d0f12] px-8 py-2.5 rounded-md font-black text-sm uppercase tracking-wider hover:bg-[#f5c842] transition-colors"
        >
          {isEdit ? 'Save Changes' : 'Publish Article'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-md font-black text-xs uppercase tracking-wider bg-[#1a1e26] text-[#7a8694] border border-white/10 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

// ── Article Comment Section ────────────────────────────────────────────────────
const ArticleComments = ({ articleId }) => {
  const [comments, setComments] = useState(() => getArticleComments(articleId))
  const [author, setAuthor]     = useState('')
  const [text, setText]         = useState('')
  const [posted, setPosted]     = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    addArticleComment(articleId, { author, text })
    setComments(getArticleComments(articleId))
    setText(''); setAuthor('')
    setPosted(true); setTimeout(() => setPosted(false), 2000)
  }

  const handleDelete = (commentId) => {
    deleteArticleComment(articleId, commentId)
    setComments(getArticleComments(articleId))
  }

  return (
    <div className="mt-10 pt-8 border-t border-white/5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-0.5 h-5 bg-[#e8a020] rounded-full" />
        <h3 className="text-white font-black text-sm uppercase tracking-wider">Discussion</h3>
        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#e8a020]/15 text-[#e8a020]">
          {comments.length} comment{comments.length !== 1 ? 's' : ''}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="bg-[#131720] border border-white/5 rounded-xl p-4 focus-within:border-[#e8a020]/40 transition-colors">
          <input
            type="text" value={author} onChange={e => setAuthor(e.target.value)}
            placeholder="Your name (optional)" maxLength={40}
            className="w-full bg-transparent text-white text-xs mb-3 outline-none placeholder-[#3a4048] font-semibold"
          />
          <textarea
            value={text} onChange={e => setText(e.target.value)}
            placeholder="Share your thoughts on this article…" rows={3} required
            className="w-full bg-transparent text-[#c0cad4] text-sm outline-none placeholder-[#3a4048] resize-none leading-relaxed"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
            <span className="text-[#3a4048] text-[10px]">{text.length > 0 ? `${text.length} chars` : 'Be respectful & constructive'}</span>
            <button
              type="submit" disabled={!text.trim()}
              className="px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider bg-[#e8a020] text-[#0d0f12] transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f5c842]"
            >
              {posted ? '✓ Posted!' : 'Post'}
            </button>
          </div>
        </div>
      </form>

      {comments.length === 0 ? (
        <div className="text-center py-10 bg-[#0f1218] rounded-xl border border-white/5">
          <div className="text-3xl mb-2">💬</div>
          <p className="text-[#4a5462] text-sm">No comments yet. Start the discussion!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(c => (
            <div key={c.id} className="group bg-[#0f1218] border border-white/5 rounded-xl px-5 py-4 hover:border-white/10 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 bg-[#e8a020]/20 text-[#e8a020]">
                    {c.author?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <span className="text-white text-xs font-black">{c.author}</span>
                    <span className="text-[#3a4048] text-[10px] ml-2">{c.date}</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(c.id)}
                  className="opacity-0 group-hover:opacity-100 text-[#3a4048] hover:text-red-400 text-[11px] transition-all"
                  title="Delete">🗑</button>
              </div>
              <p className="text-[#9aa4ae] text-sm leading-relaxed pl-9">{c.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Article detail page ────────────────────────────────────────────────────────
const ArticleDetail = ({ article, onBack, onEdit }) => {
  const [liked, setLiked]             = useState(isLiked(article.id))
  const [likeCount, setLikeCount]     = useState(() => getArticleLikeCount(article.id))
  const [shareCopied, setShareCopied] = useState(false)

  const handleLike = () => {
    const nowLiked = toggleLike(article.id)
    setLiked(nowLiked)
    setLikeCount(getArticleLikeCount(article.id))
  }

  const handleShare = async () => {
    const shareText = `${article.title} — ${article.author}`
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: article.title, text: shareText, url }) } catch {}
    } else {
      await navigator.clipboard.writeText(`${shareText}\n${url}`)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2500)
    }
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
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[#4a5462] text-xs">
            <span className="text-white font-semibold">{article.author}</span>
            <span>·</span>
            <span>{article.date}</span>
            {article.readTime && <><span>·</span><span>{article.readTime}</span></>}
          </div>
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded border border-white/10 text-[#7a8694] hover:border-[#e8a020]/50 hover:text-[#e8a020] transition-colors"
          >
            ✏️ Edit
          </button>
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
        className="text-[#c0cad4] text-[0.95rem] leading-[1.9] whitespace-pre-wrap"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        {article.content}
      </div>

      {/* Actions bar */}
      <div className="flex gap-3 mt-10 pt-6 border-t border-white/5 items-center">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-5 py-2 rounded font-black text-xs uppercase tracking-wider transition-all ${
            liked ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-[#e8a020] text-[#0d0f12] hover:bg-[#f5c842]'
          }`}
        >
          <span>{liked ? '♥' : '♡'}</span>
          <span>{liked ? 'Liked' : 'Like'}</span>
          {likeCount > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${liked ? 'bg-white/20' : 'bg-black/15'}`}>
              {likeCount}
            </span>
          )}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 border border-white/10 text-[#7a8694] px-5 py-2 rounded text-xs font-semibold hover:text-white hover:border-white/20 transition-colors"
        >
          {shareCopied ? '✓ Copied!' : '↗ Share'}
        </button>
      </div>

      {/* Comment section */}
      <ArticleComments articleId={article.id} />
    </div>
  </div>
  )
}

// ── Main Articles list ─────────────────────────────────────────────────────────
const Articles = () => {
  const [articles, setArticles] = useState(() => getArticles())
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(null)   // article being edited (or null)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('All')
  const [showForm, setShowForm] = useState(false)

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

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handlePublish = (form) => {
    const articleData = {
      ...form,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }
    const updated = saveArticle(articleData)
    setArticles(updated)
    setShowForm(false)
  }

  const handleSaveEdit = (form) => {
    const updated = updateArticle(editing.id, form)
    setArticles(updated)
    // If currently viewing the edited article, refresh it
    if (selected && String(selected.id) === String(editing.id)) {
      setSelected(updated.find(a => String(a.id) === String(editing.id)) || null)
    }
    setEditing(null)
  }

  const handleDelete = (id) => {
    const updated = deleteArticle(id)
    setArticles(updated)
    setEditing(null)
    setSelected(null)
  }

  // ── Edit modal overlay ───────────────────────────────────────────────────────
  if (editing) {
    return (
      <div className="min-h-screen bg-[#0d0f12]">
        <div className="bg-[#0f1218] border-b border-white/5 py-8">
          <div className="max-w-4xl mx-auto px-5">
            <p className="text-[#e8a020] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Film Writing</p>
            <h1 className="text-3xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Edit Article
            </h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-5 py-10">
          <ArticleForm
            initialData={{
              title: editing.title || '',
              author: editing.author || '',
              film: editing.film || '',
              year: editing.year || '',
              tag: editing.tag || '',
              readTime: editing.readTime || '',
              image: editing.image || '',
              excerpt: editing.excerpt || '',
              content: editing.content || '',
            }}
            onSubmit={handleSaveEdit}
            onCancel={() => setEditing(null)}
            onDelete={() => handleDelete(editing.id)}
            isEdit
          />
        </div>
      </div>
    )
  }

  // ── Detail view ──────────────────────────────────────────────────────────────
  if (selected) {
    return (
      <ArticleDetail
        article={selected}
        onBack={() => setSelected(null)}
        onEdit={() => { setEditing(selected); setSelected(null) }}
      />
    )
  }

  // ── List view ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0d0f12] fade-in">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-[#0f1218] border-b border-white/5 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url('https://www.transparenttextures.com/patterns/carbon-fibre.png')`
        }} />
        <div className="max-w-6xl mx-auto px-5 relative z-10">

          {/* Title row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="flex items-start gap-5">
              <div className="w-1.5 h-14 bg-[#e8a020] rounded-full shadow-[0_0_15px_rgba(232,160,32,0.4)]" />
              <div>
                <p className="text-[#e8a020] text-[10px] font-black uppercase tracking-[0.3em] mb-1.5">Film Journalism</p>
                <h1 className="text-5xl font-black text-white leading-none tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Film Articles
                </h1>
                <p className="text-[#5a6472] text-sm mt-3 max-w-md leading-relaxed">Critical writing on cinema, legendary directors and the evolving art of visual storytelling.</p>
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
          <ArticleForm
            onSubmit={handlePublish}
            onCancel={() => setShowForm(false)}
          />
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
              {search || activeTag !== 'All' ? 'No Articles Found' : 'No Articles Yet'}
            </h3>
            <p className="text-[#5a6472] text-sm mb-5">
              {search || activeTag !== 'All'
                ? 'Try a different search term or tag.'
                : 'Be the first! Click "+ Write" to publish your article.'}
            </p>
            {(search || activeTag !== 'All') && (
              <button
                onClick={() => { setSearch(''); setActiveTag('All') }}
                className="bg-[#e8a020] text-[#0d0f12] px-5 py-2 rounded font-black text-xs uppercase tracking-wider hover:bg-[#f5c842] transition-colors"
              >
                Show All
              </button>
            )}
          </div>
        )}

        {/* ── Featured article (first, full width) ── */}
        {filtered.length > 0 && !search && activeTag === 'All' && (
          <div className="relative group mb-5">
            <div
              onClick={() => setSelected(filtered[0])}
              className="cursor-pointer flex flex-col md:flex-row rounded-2xl overflow-hidden bg-[#0f1218] border border-white/5 group-hover:border-[#e8a020]/30 transition-all duration-500 fade-up glass-premium"
            >
              {/* Image */}
              <div className="md:w-[400px] h-64 md:h-auto flex-shrink-0 overflow-hidden bg-[#131720]">
                <img
                  src={filtered[0].image}
                  alt={filtered[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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
            {/* Edit button on featured card */}
            <button
              onClick={(e) => { e.stopPropagation(); setEditing(filtered[0]) }}
              className="absolute top-3 right-3 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider rounded bg-[#1a1e26]/90 text-[#7a8694] border border-white/10 hover:border-[#e8a020]/50 hover:text-[#e8a020] transition-colors opacity-0 group-hover:opacity-100"
              title="Edit article"
            >
              ✏️ Edit
            </button>
          </div>
        )}

        {/* ── Remaining cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(search || activeTag !== 'All' ? filtered : filtered.slice(1)).map(article => (
            <div
              key={article.id}
              className="group relative flex rounded-2xl overflow-hidden bg-[#0f1218] border border-white/5 hover:border-[#e8a020]/30 transition-all duration-500 fade-up"
            >
              {/* Clickable area */}
              <div
                onClick={() => setSelected(article)}
                className="cursor-pointer flex flex-1 min-w-0"
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
                <div className="p-4 flex flex-col justify-center flex-1 min-w-0 pr-10">
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

              {/* Edit pencil button — appears on hover */}
              <button
                onClick={() => setEditing(article)}
                className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded bg-[#1a1e26]/90 border border-white/10 text-[#5a6472] hover:border-[#e8a020]/50 hover:text-[#e8a020] transition-colors opacity-0 group-hover:opacity-100"
                title="Edit article"
              >
                ✏️
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Articles
