import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-[#080a0d] border-t border-white/5 mt-16">
      {/* Amber top accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#e8a020] to-transparent opacity-40" />

      <div className="max-w-7xl mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand logo removed */}

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
          <p className="text-[#2a2e38] text-xs">© 2024 FilmVerse. Built for cinephiles.</p>
          <p className="text-[#2a2e38] text-xs">Film journalism reimagined.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
