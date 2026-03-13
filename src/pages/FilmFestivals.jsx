import { festivals } from '../data/festivals'

const FilmFestivals = () => {
  return (
    <div className="min-h-screen bg-[#0d0f12] fade-in">
      {/* Hero Section */}
      <div className="bg-[#0f1218] border-b border-white/5 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #e8a020 25%, transparent 25%, transparent 75%, #e8a020 75%, #e8a020), repeating-linear-gradient(45deg, #e8a020 25%, #0f1218 25%, #0f1218 75%, #e8a020 75%, #e8a020)',
          backgroundSize: '80px 80px',
          backgroundPosition: '0 0, 40px 40px'
        }} />
        <div className="relative max-w-6xl mx-auto px-5 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#e8a020]" />
            <span className="text-[#e8a020] text-[10px] font-black uppercase tracking-[0.3em]">Cinematic Events</span>
            <div className="h-px w-10 bg-[#e8a020]" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Film Festivals
          </h1>
          <p className="text-[#7a8694] text-lg max-w-2xl mx-auto leading-relaxed">
            Discover the world's most prestigious cinephile destinations and international platforms for cinematic excellence.
          </p>
        </div>
      </div>

      {/* Festivals Grid */}
      <div className="max-w-6xl mx-auto px-5 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {festivals.map((festival, i) => (
            <div 
              key={festival.id}
              className="group bg-[#0f1218] rounded-3xl overflow-hidden border border-white/5 hover:border-[#e8a020]/30 transition-all duration-500 flex flex-col fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative h-56 bg-[#131720] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1218] to-transparent opacity-60" />
                <span className="text-7xl group-hover:scale-110 transition-transform duration-700">🎬</span>
                <div className="absolute top-4 left-4">
                  <span className="bg-[#e8a020] text-[#0d0f12] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg shadow-[#e8a020]/20">
                    {festival.country}
                  </span>
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-[#e8a020] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {festival.name}
                </h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-3 text-[#5a6472]">
                    <span className="text-sm">📍</span>
                    <span className="text-xs font-bold uppercase tracking-wider">{festival.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#5a6472]">
                    <span className="text-sm">📅</span>
                    <span className="text-xs font-bold uppercase tracking-wider">{festival.date}</span>
                  </div>
                </div>

                <p className="text-[#7a8694] mb-6 text-sm leading-relaxed italic line-clamp-3">
                  "{festival.description}"
                </p>
                
                <div className="mb-8 flex flex-wrap gap-2">
                  {festival.categories.map((cat, idx) => (
                    <span key={idx} className="bg-[#1a1e26] text-[#e8a020]/80 border border-white/5 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                      {cat}
                    </span>
                  ))}
                </div>
                
                <a
                  href={festival.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto block w-full bg-[#1a1e26] text-white hover:bg-[#e8a020] hover:text-[#0d0f12] font-black py-4 rounded-xl transition-all duration-300 text-center text-xs uppercase tracking-widest border border-white/10 hover:border-transparent"
                >
                  Explore Festival
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Section */}
      <div className="border-t border-white/5 py-24 bg-[#0f1218]/50 overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-5 text-center relative z-10">
          <div className="text-4xl mb-6">🏆</div>
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Submit Your Vision</h2>
          <p className="text-[#7a8694] text-lg mb-10 max-w-xl mx-auto">
            Ready to showcase your storytelling craft? Join the elite circles of global cinema and get recognized by the best in the industry.
          </p>
          <button className="bg-[#e8a020] text-[#0d0f12] px-10 py-4 rounded-2xl font-black hover:bg-[#f5c842] hover:scale-105 transition-all shadow-xl shadow-[#e8a020]/10 uppercase text-sm tracking-[0.2em]">
            Begin Submission
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilmFestivals
