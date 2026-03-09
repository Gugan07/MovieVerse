import { filmSchools } from '../data/filmSchools'

const FilmSchools = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-20 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">🎓 Film Schools</h1>
          <p className="text-xl text-gray-200 mb-6">
            Explore top film schools and start your journey to becoming a filmmaker
          </p>
          <div className="flex justify-center gap-8 mt-8">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <p className="text-3xl font-bold text-yellow-400">{filmSchools.length}</p>
              <p className="text-gray-300">Top Schools</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <p className="text-3xl font-bold text-yellow-400">20+</p>
              <p className="text-gray-300">Programs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schools Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filmSchools.map(school => (
            <div 
              key={school.id}
              className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition border border-gray-800"
            >
              <div className="relative h-56 bg-gray-800 flex items-center justify-center">
                <span className="text-6xl">🏫</span>
                <div className="absolute top-4 left-4">
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                    {school.country}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{school.name}</h3>
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <span>📍</span>
                  <span className="text-sm">{school.location}</span>
                </div>
                <p className="text-gray-400 mb-4 leading-relaxed">{school.description}</p>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Programs Offered:</p>
                  <div className="flex flex-wrap gap-2">
                    {school.programs.map((program, index) => (
                      <span 
                        key={index}
                        className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs"
                      >
                        {program}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Tuition</p>
                    <p className="text-lg font-bold text-yellow-400">{school.tuition}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-lg font-bold text-yellow-400">{school.duration}</p>
                  </div>
                </div>
                
                <a
                  href={school.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition text-center"
                >
                  Visit Website
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Section */}
      <div className="bg-gray-900 py-16 mt-12 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Apply?</h2>
          <p className="text-white text-lg mb-6">
            Get personalized guidance on film school applications and portfolio preparation.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition">
              Application Guide
            </button>
            <button className="bg-gray-800 border-2 border-gray-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-700 transition">
              Compare Schools
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilmSchools
