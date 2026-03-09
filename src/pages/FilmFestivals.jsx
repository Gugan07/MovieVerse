import { festivals } from '../data/festivals'

const FilmFestivals = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-20 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">🎪 Film Festivals</h1>
          <p className="text-xl text-gray-200 mb-6">
            Discover the world's most prestigious film festivals and submit your work
          </p>
        </div>
      </div>

      {/* Festivals Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {festivals.map(festival => (
            <div 
              key={festival.id}
              className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition border border-gray-800"
            >
              <div className="relative h-48 bg-gray-800 flex items-center justify-center">
                <span className="text-6xl">🎬</span>
                <div className="absolute top-4 left-4">
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                    {festival.country}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{festival.name}</h3>
                <div className="flex items-center gap-2 text-yellow-400 mb-2">
                  <span>📍</span>
                  <span className="text-sm">{festival.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <span>📅</span>
                  <span className="text-sm">{festival.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 mb-3">
                  <span>💰</span>
                  <span className="text-sm">Entry: {festival.entryFee}</span>
                </div>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">{festival.description}</p>
                
                <div className="mb-4 flex flex-wrap gap-2">
                  {festival.categories.map((cat, idx) => (
                    <span key={idx} className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">
                      {cat}
                    </span>
                  ))}
                </div>
                
                <a
                  href={festival.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-yellow-500 text-black font-bold py-2 rounded-lg hover:bg-yellow-400 transition text-center"
                >
                  Visit Website
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Section */}
      <div className="bg-gray-900 py-16 mt-12 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Submit Your Film</h2>
          <p className="text-white text-lg mb-6">
            Ready to showcase your work? Submit to festivals worldwide and get discovered.
          </p>
          <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition text-lg">
            Start Submission
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilmFestivals
