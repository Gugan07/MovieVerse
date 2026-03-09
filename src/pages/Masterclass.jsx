import { masterclasses } from '../data/masterclasses'

const Masterclass = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-20 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">🎓 Director Masterclass</h1>
          <p className="text-xl text-gray-200 mb-6">
            Learn from the masters of cinema. Exclusive interviews and insights from legendary directors.
          </p>
          <div className="flex justify-center gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-yellow-400">{masterclasses.length}</p>
              <p className="text-gray-300">Masterclasses</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-400">6+</p>
              <p className="text-gray-300">Directors</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-400">4.5hrs</p>
              <p className="text-gray-300">Content</p>
            </div>
          </div>
        </div>
      </div>

      {/* Masterclass Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {masterclasses.map(masterclass => (
            <div 
              key={masterclass.id} 
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-2xl border border-gray-700"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={masterclass.thumbnail} 
                  alt={masterclass.director}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                    ⏱️ {masterclass.duration}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-yellow-400">{masterclass.director}</h3>
                <h4 className="text-xl font-semibold mb-3">{masterclass.title}</h4>
                <p className="text-gray-400 mb-4 leading-relaxed">{masterclass.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {masterclass.topics.map((topic, index) => (
                    <span 
                      key={index}
                      className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                
                <a 
                  href={masterclass.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition text-center"
                >
                  ▶ Watch on YouTube
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-900 py-12 mt-12 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Want to Share Your Knowledge?</h2>
          <p className="text-gray-400 mb-6">
            Are you a filmmaker with insights to share? Submit your masterclass proposal.
          </p>
          <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition">
            Submit Proposal
          </button>
        </div>
      </div>
    </div>
  )
}

export default Masterclass
