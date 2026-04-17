import { useState } from 'react'
import { getMasterclasses, saveMasterclass, deleteMasterclass } from '../services/storage'

// ── YouTube ID extractor ────────────────────────────────────────────────────────
const extractYouTubeId = (url) => {
  if (!url) return ''
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : url
}

// ── Upload Form ─────────────────────────────────────────────────────────────────
const MasterclassForm = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    director: '', title: '', description: '',
    duration: '', youtubeUrl: '', photo: '', topics: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const ytId = extractYouTubeId(form.youtubeUrl)
    onSubmit({
      ...form,
      id: Date.now(),
      youtubeId: ytId,
      thumbnail: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
      topics: form.topics.split(',').map(t => t.trim()).filter(Boolean)
    })
  }

  const inputCls = "w-full bg-slate-100 dark:bg-[#131720] border border-black/5 dark:border-white/5 text-slate-900 dark:text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#e8a020] transition-colors placeholder-slate-400 dark:placeholder-[#3a4048]"

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0f1218] border-l-2 border-[#e8a020] rounded-2xl p-8 mb-10 shadow-sm dark:shadow-none animate-in fade-in slide-in-from-top-4 duration-300">
      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 font-playfair">
        Add New Masterclass
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {[
          ['Director Name', 'director', 'text', true],
          ['Session Title', 'title', 'text', true],
          ['Duration (e.g. 45 min)', 'duration', 'text', false],
          ['Director Photo URL', 'photo', 'url', false],
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

        <div className="md:col-span-2">
          <label className="block text-[10px] font-black text-[#5a6472] uppercase tracking-widest mb-1.5">YouTube URL</label>
          <input
            type="text" value={form.youtubeUrl}
            onChange={e => setForm(f => ({ ...f, youtubeUrl: e.target.value }))}
            placeholder="https://www.youtube.com/watch?v=..."
            required className={inputCls}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] font-black text-[#5a6472] uppercase tracking-widest mb-1.5">Topics (comma separated)</label>
          <input
            type="text" value={form.topics}
            onChange={e => setForm(f => ({ ...f, topics: e.target.value }))}
            placeholder="Directing, Cinematography, Screenwriting..."
            className={inputCls}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] font-black text-[#5a6472] uppercase tracking-widest mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Write a short summary of the masterclass..."
            required
            className={`${inputCls} resize-none h-24`}
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" className="bg-[#e8a020] text-[#0d0f12] px-7 py-2.5 rounded-lg font-black text-sm uppercase tracking-wider hover:bg-[#f5c842] transition-colors">
          Publish Session
        </button>
        <button type="button" onClick={onCancel} className="border border-black/10 dark:border-white/10 text-[#7a8694] px-5 py-2.5 rounded-lg text-sm font-semibold hover:text-slate-900 dark:hover:text-white transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}

const Masterclass = () => {
  const [classes, setClasses] = useState(() => getMasterclasses())
  const [activeVideo, setActiveVideo] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const handleAdd = (newMc) => {
    const updated = saveMasterclass(newMc)
    setClasses(updated)
    setShowForm(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this masterclass session?')) {
      const updated = deleteMasterclass(id)
      setClasses(updated)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0f12] fade-in">
      {/* ── Header ── */}
      <div className="bg-white dark:bg-[#0f1218] border-b border-black/5 dark:border-white/5 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 28px, #e8a020 28px, #e8a020 29px), repeating-linear-gradient(90deg, transparent, transparent 28px, #e8a020 28px, #e8a020 29px)'
        }} />
        <div className="relative max-w-6xl mx-auto px-5 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-[#e8a020]" />
            <span className="text-[#e8a020] text-[10px] font-black uppercase tracking-[0.2em]">Cinema Education</span>
            <div className="h-px w-12 bg-[#e8a020]" />
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight font-playfair">
            Director Masterclass
          </h1>
          <p className="text-slate-500 dark:text-[#7a8694] text-base max-w-xl mx-auto leading-relaxed mb-8">
            Learn the craft directly from the legends who shaped modern cinema.
          </p>

          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-8 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${showForm ? 'bg-slate-100 dark:bg-[#1a1e26] text-slate-500 dark:text-[#7a8694] border border-black/10 dark:border-white/10' : 'bg-[#e8a020] text-[#0d0f12] hover:bg-[#f5c842] shadow-lg shadow-[#e8a020]/10'
              }`}
          >
            {showForm ? '✕ Close Form' : '+ Add Masterclass'}
          </button>

          <div className="flex justify-center gap-16 mt-12">
            {[
              [classes.length, 'Sessions'],
              [new Set(classes.map(c => c.director)).size, 'Directors'],
              [classes.reduce((acc, c) => acc + (parseInt(c.duration) || 0), 0) + 'm', 'Content']
            ].map(([val, lbl]) => (
              <div key={lbl}>
                <div className="text-3xl font-black text-[#e8a020] mb-0.5 font-playfair">{val}</div>
                <div className="text-slate-400 dark:text-[#4a5462] text-[10px] uppercase tracking-widest">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inline Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 dark:bg-[#0d0f12]/95 backdrop-blur flex items-center justify-center p-4" onClick={() => setActiveVideo(null)}>
          <div className="w-full max-w-4xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-slate-900 dark:text-white font-black text-lg font-playfair">{activeVideo.director}</h2>
                <p className="text-slate-500 dark:text-[#7a8694] text-sm">{activeVideo.title}</p>
              </div>
              <button onClick={() => setActiveVideo(null)}
                className="w-8 h-8 flex items-center justify-center text-slate-500 dark:text-[#7a8694] hover:text-[#e8a020] border border-black/10 dark:border-white/10 rounded transition-colors text-sm">
                ✕
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-black/5 dark:border-white/5 shadow-2xl" style={{ aspectRatio: '16/9' }}>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-5 py-14">
        {showForm && <MasterclassForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />}

        {classes.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-[#0f1218] rounded-3xl border border-black/5 dark:border-white/5 border-dashed">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-slate-900 dark:text-white font-black text-xl mb-3 font-playfair">
              No Masterclasses Yet
            </h3>
            <p className="text-slate-500 dark:text-[#5a6472] text-sm max-w-xs mx-auto mb-8">
              Click the button above to start building your cinema education library.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((mc) => (
              <div key={mc.id} className="group bg-white dark:bg-[#0f1218] rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 hover:border-[#e8a020]/25 transition-all duration-300 flex flex-col shadow-sm dark:shadow-none">

                {/* Thumbnail */}
                <div className="relative overflow-hidden cursor-pointer" style={{ aspectRatio: '16/9' }} onClick={() => setActiveVideo(mc)}>
                  <img
                    src={mc.thumbnail}
                    alt={mc.director}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 dark:brightness-75"
                    onError={e => { e.target.src = `https://img.youtube.com/vi/${mc.youtubeId}/hqdefault.jpg` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#e8a020] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 ring-4 ring-white/5">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#0d0f12] ml-1">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/80 text-[#e8a020] text-[10px] px-2.5 py-1 rounded-md font-mono font-bold tracking-wider">
                    {mc.duration}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(mc.id) }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/40 text-white/40 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  >
                    🗑️
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Director Info */}
                  <div className="flex items-center gap-3 mb-5">
                    {mc.photo ? (
                      <img
                        src={mc.photo}
                        alt={mc.director}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/5"
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#1a1e26] flex items-center justify-center text-[#e8a020] font-black text-xs">
                        {mc.director[0]}
                      </div>
                    )}
                    <div>
                      <div className="text-slate-900 dark:text-white font-bold text-sm tracking-tight">{mc.director}</div>
                      <div className="text-slate-400 dark:text-[#4a5462] text-[10px] uppercase tracking-widest font-black">LEGEND</div>
                    </div>
                  </div>

                  <h3 className="text-slate-900 dark:text-white font-black text-base mb-2 group-hover:text-[#e8a020] transition-colors leading-snug font-playfair">
                    {mc.title}
                  </h3>
                  <p className="text-slate-500 dark:text-[#6a7480] text-xs leading-relaxed mb-5 line-clamp-2 italic">
                    {mc.description}
                  </p>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {mc.topics.map((t, i) => (
                      <span key={i} className="text-[10px] text-[#e8a020] bg-[#e8a020]/5 border border-[#e8a020]/10 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Simple Footer CTA */}
      <div className="border-t border-black/5 dark:border-white/5 py-20 bg-gradient-to-b from-transparent to-black/5 dark:to-[#0f1218]/50">
        <div className="max-w-md mx-auto px-5 text-center">
          <div className="text-3xl mb-4">🎬</div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 font-playfair">Curate Greatness</h2>
          <p className="text-slate-500 dark:text-[#5a6472] text-sm">Every masterclass added is a gift to the next generation of visual storytellers.</p>
        </div>
      </div>
    </div>
  )
}

export default Masterclass
