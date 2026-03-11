import { useState } from 'react'
import { masterclasses } from '../data/masterclasses'

const Masterclass = () => {
  const [activeVideo, setActiveVideo] = useState(null)

  return (
    <div className="min-h-screen bg-[#0d0f12]">
      {/* Hero */}
      <div className="relative bg-[#0f1218] border-b border-white/5 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 28px, #e8a020 28px, #e8a020 29px), repeating-linear-gradient(90deg, transparent, transparent 28px, #e8a020 28px, #e8a020 29px)'
        }} />
        <div className="relative max-w-6xl mx-auto px-5 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-[#e8a020]" />
            <span className="text-[#e8a020] text-[10px] font-black uppercase tracking-[0.2em]">Cinema Education</span>
            <div className="h-px w-12 bg-[#e8a020]" />
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Director Masterclass
          </h1>
          <p className="text-[#7a8694] text-base max-w-xl mx-auto leading-relaxed mb-10">
            Learn the craft directly from the legends who shaped modern cinema.
          </p>
          <div className="flex justify-center gap-16">
            {[['6', 'Sessions'], ['6', 'Directors'], ['4.5hrs', 'Content']].map(([val, lbl]) => (
              <div key={lbl}>
                <div className="text-3xl font-black text-[#e8a020] mb-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>{val}</div>
                <div className="text-[#4a5462] text-[10px] uppercase tracking-widest">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inline Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-[#0d0f12]/95 backdrop-blur flex items-center justify-center p-4" onClick={() => setActiveVideo(null)}>
          <div className="w-full max-w-4xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-white font-black text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>{activeVideo.director}</h2>
                <p className="text-[#7a8694] text-sm">{activeVideo.title}</p>
              </div>
              <button onClick={() => setActiveVideo(null)}
                className="w-8 h-8 flex items-center justify-center text-[#7a8694] hover:text-white border border-white/10 rounded transition-colors text-sm">
                ✕
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-white/5" style={{ aspectRatio: '16/9' }}>
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

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-5 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {masterclasses.map((mc) => (
            <div key={mc.id} className="group bg-[#0f1218] rounded-xl overflow-hidden border border-white/5 hover:border-[#e8a020]/25 transition-all duration-300">

              {/* Thumbnail */}
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img
                  src={mc.thumbnail}
                  alt={mc.director}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75"
                  onError={e => { e.target.src = `https://img.youtube.com/vi/${mc.youtubeId}/hqdefault.jpg` }}
                />
                {/* Play */}
                <button
                  onClick={() => setActiveVideo(mc)}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[#e8a020] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#0d0f12] ml-0.5">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </button>
                {/* Duration */}
                <div className="absolute bottom-2 right-2 bg-[#0d0f12]/85 text-[#e8a020] text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                  {mc.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Director row with photo */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                  <img
                    src={mc.photo}
                    alt={mc.director}
                    className="w-10 h-10 rounded-full object-cover object-top ring-2 ring-[#e8a020]/30"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                  <div>
                    <div className="text-white font-bold text-sm">{mc.director}</div>
                    <div className="text-[#4a5462] text-[10px] uppercase tracking-widest">Director</div>
                  </div>
                </div>

                <h3 className="text-white font-black text-sm mb-2 group-hover:text-[#e8a020] transition-colors leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {mc.title}
                </h3>
                <p className="text-[#5a6472] text-xs leading-relaxed mb-4 line-clamp-2">
                  {mc.description}
                </p>

                {/* Topics */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {mc.topics.map((t, i) => (
                    <span key={i} className="text-[10px] text-[#e8a020] bg-[#e8a020]/8 border border-[#e8a020]/15 px-2 py-0.5 rounded-full font-semibold">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveVideo(mc)}
                    className="flex-1 bg-[#e8a020] text-[#0d0f12] font-black py-2 rounded text-[11px] uppercase tracking-widest hover:bg-[#f5c842] transition-colors"
                  >
                    ▶ Watch
                  </button>
                  <a
                    href={mc.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1a1e26] border border-white/8 text-[#7a8694] font-semibold py-2 px-3 rounded text-[11px] hover:text-white hover:border-white/20 transition-colors"
                  >
                    YouTube ↗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#0f1218] border-t border-white/5 py-14">
        <div className="max-w-lg mx-auto px-5 text-center">
          <h2 className="text-2xl font-black text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Want to Share Your Craft?</h2>
          <p className="text-[#5a6472] text-sm mb-6">Submit a masterclass proposal and inspire the next generation of filmmakers.</p>
          <button className="bg-[#e8a020] text-[#0d0f12] px-8 py-3 rounded-md font-black text-sm uppercase tracking-wider hover:bg-[#f5c842] transition-colors">
            Submit Proposal
          </button>
        </div>
      </div>
    </div>
  )
}

export default Masterclass
