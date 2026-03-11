import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-[#080a0d] border-t border-white/5 mt-16">
      {/* Amber top accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#e8a020] to-transparent opacity-40" />

      <div className="max-w-7xl mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded bg-[#e8a020] flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#080a0d]">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
              </div>
              <span className="font-black text-base text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                Cine<span className="text-[#e8a020]">Verse</span>
              </span>
            </div>
            <p className="text-[#3a4048] text-xs leading-relaxed">
              Your premier destination for film reviews, cinema culture, and director insights.
            </p>
          </div>

          {/* Nav columns */}
          {[
            ['Discover', ['Films', 'Categories', 'Articles', 'Short Films']],
            ['Learn', ['Masterclass', 'Festivals', 'Film Schools', 'Directors']],
            ['Account', ['Join Free', 'Sign In', 'Profile', 'Settings']],
          ].map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(l => (
                  <li key={l}><a href="#" className="text-[#3a4048] text-xs hover:text-[#e8a020] transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[#2a2e38] text-xs">© 2024 CineVerse. Built for cinephiles.</p>
          <p className="text-[#2a2e38] text-xs">Film journalism reimagined.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
