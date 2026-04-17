import { filmSchools } from '../data/filmSchools'

const FilmSchools = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0f12] fade-in">
      {/* Hero Section */}
      <div className="bg-white dark:bg-[#0f1218] border-b border-black/5 dark:border-white/5 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(#e8a020 0.5px, transparent 0.5px)',
          backgroundSize: '24px 24px'
        }} />
        <div className="relative max-w-6xl mx-auto px-5 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#e8a020]" />
            <span className="text-[#e8a020] text-[10px] font-black uppercase tracking-[0.3em]">Academic Excellence</span>
            <div className="h-px w-10 bg-[#e8a020]" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight font-playfair">
            Film Schools
          </h1>
          <p className="text-slate-500 dark:text-[#7a8694] text-lg max-w-2xl mx-auto leading-relaxed mb-12">
            Master the craft at the world's most elite cinematography and directing institutions.
          </p>
          
          <div className="flex justify-center gap-10 md:gap-16">
            <div className="text-center">
              <p className="text-4xl font-black text-[#e8a020] mb-1 font-playfair">{filmSchools.length}</p>
              <p className="text-slate-400 dark:text-[#4a5462] text-[10px] font-black uppercase tracking-widest">Global Schools</p>
            </div>
            <div className="w-px h-12 bg-black/5 dark:bg-white/5" />
            <div className="text-center">
              <p className="text-4xl font-black text-[#e8a020] mb-1 font-playfair">25+</p>
              <p className="text-slate-400 dark:text-[#4a5462] text-[10px] font-black uppercase tracking-widest">Specializations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schools Grid */}
      <div className="max-w-6xl mx-auto px-5 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filmSchools.map((school, i) => (
            <div 
              key={school.id}
              className="group bg-white dark:bg-[#0f1218] rounded-3xl overflow-hidden border border-black/5 dark:border-white/5 hover:border-[#e8a020]/30 transition-all duration-500 flex flex-col fade-up shadow-sm hover:shadow-2xl dark:shadow-none"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative h-64 bg-slate-100 dark:bg-[#131720] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 dark:from-[#0f1218] via-transparent to-transparent opacity-80" />
                <span className="text-8xl transform group-hover:scale-110 transition-transform duration-1000">🏫</span>
                <div className="absolute top-6 left-6">
                  <span className="bg-[#e8a020] text-[#0d0f12] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
                    {school.country}
                  </span>
                </div>
              </div>
              
              <div className="p-10 flex-1 flex flex-col">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-[#e8a020] transition-colors font-playfair">
                  {school.name}
                </h3>
                <div className="flex items-center gap-3 text-slate-400 dark:text-[#5a6472] mb-6">
                  <span className="text-sm">📍</span>
                  <span className="text-xs font-bold uppercase tracking-widest">{school.location}</span>
                </div>
                
                <p className="text-slate-500 dark:text-[#7a8694] mb-8 leading-relaxed text-sm italic">
                  {school.description}
                </p>
                
                <div className="mb-8">
                  <p className="text-[10px] font-black text-slate-400 dark:text-[#4a5462] uppercase tracking-[0.2em] mb-4">Core Programs</p>
                  <div className="flex flex-wrap gap-2">
                    {school.programs.map((program, index) => (
                      <span 
                        key={index}
                        className="bg-slate-100 dark:bg-[#1a1e26] text-[#e8a020]/90 border border-black/5 dark:border-white/10 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest font-semibold"
                      >
                        {program}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-10 py-6 border-y border-black/5 dark:border-white/5">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-[#4a5462] uppercase tracking-widest mb-1.5">Tuition</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{school.tuition}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-[#4a5462] uppercase tracking-widest mb-1.5">Duration</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{school.duration}</p>
                  </div>
                </div>
                
                <a
                  href={school.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto block w-full bg-[#e8a020] text-[#0d0f12] font-black py-4 rounded-2xl hover:bg-[#f5c842] transition-all duration-300 text-center text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#e8a020]/10"
                >
                  Visit Academy Website
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application CTA */}
      <div className="bg-white dark:bg-[#0f1218] py-24 mt-12 border-t border-black/5 dark:border-white/5 shadow-inner">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <div className="text-4xl mb-6">🎓</div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight font-playfair">Launch Your Career</h2>
          <p className="text-slate-500 dark:text-[#7a8694] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            From portfolio preparation to application strategies, our guides provide everything you need to secure your spot at a top-tier institution.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <button className="bg-[#e8a020] text-[#0d0f12] px-10 py-4 rounded-2xl font-black hover:bg-[#f5c842] transition-all shadow-xl shadow-[#e8a020]/10 uppercase text-xs tracking-widest">
              Application Guide
            </button>
            <button className="bg-transparent border border-black/10 dark:border-white/10 text-slate-400 dark:text-[#7a8694] hover:text-slate-900 dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 px-10 py-4 rounded-2xl font-black transition-all uppercase text-xs tracking-widest">
              Compare Schools
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilmSchools
