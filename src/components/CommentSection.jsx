import { useState } from 'react'

// ── CommentSection ─────────────────────────────────────────────────────────────
// Reusable comment section used on Article detail and Short Film modal
const CommentSection = ({ comments = [], onAdd, onDelete, accentColor = '#e8a020' }) => {
  const [author, setAuthor] = useState('')
  const [text, setText]     = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onAdd({ author: author.trim() || 'Anonymous', text: text.trim() })
    setText('')
    setAuthor('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2000)
  }

  return (
    <div className="mt-10 pt-8 border-t border-white/5">
      {/* Section heading */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-0.5 h-5 rounded-full" style={{ backgroundColor: accentColor }} />
        <h3 className="text-white font-black text-base uppercase tracking-wider">
          Discussion
        </h3>
        <span
          className="text-[10px] font-black px-2 py-0.5 rounded-full"
          style={{ backgroundColor: accentColor + '22', color: accentColor }}
        >
          {comments.length} comment{comments.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="bg-[#131720] border border-white/5 rounded-xl p-4 focus-within:border-[#e8a020]/40 transition-colors">
          <input
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Your name (optional)"
            maxLength={40}
            className="w-full bg-transparent text-white text-xs mb-3 outline-none placeholder-[#3a4048] font-semibold"
          />
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Share your thoughts…"
            rows={3}
            required
            className="w-full bg-transparent text-[#c0cad4] text-sm outline-none placeholder-[#3a4048] resize-none leading-relaxed"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
            <span className="text-[#3a4048] text-[10px]">
              {text.length > 0 ? `${text.length} characters` : 'Be respectful & constructive'}
            </span>
            <button
              type="submit"
              disabled={!text.trim()}
              className="px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
              style={{ backgroundColor: accentColor, color: '#0d0f12' }}
            >
              {submitted ? '✓ Posted!' : 'Post Comment'}
            </button>
          </div>
        </div>
      </form>

      {/* Comment list */}
      {comments.length === 0 ? (
        <div className="text-center py-10 bg-[#0f1218] rounded-xl border border-white/5">
          <div className="text-3xl mb-2">💬</div>
          <p className="text-[#4a5462] text-sm">No comments yet. Start the discussion!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div
              key={comment.id}
              className="group bg-[#0f1218] border border-white/5 rounded-xl px-5 py-4 hover:border-white/10 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 mb-2">
                  {/* Avatar initial */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0"
                    style={{ backgroundColor: accentColor + '33', color: accentColor }}
                  >
                    {comment.author?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <span className="text-white text-xs font-black">{comment.author}</span>
                    <span className="text-[#3a4048] text-[10px] ml-2">{comment.date}</span>
                  </div>
                </div>
                {onDelete && (
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#3a4048] hover:text-red-400 text-[10px] transition-all flex-shrink-0"
                    title="Delete comment"
                  >
                    🗑
                  </button>
                )}
              </div>
              <p className="text-[#9aa4ae] text-sm leading-relaxed pl-9">{comment.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentSection
