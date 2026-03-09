import { useState } from 'react'
import { shortFilms } from '../data/shortFilms'

const ShortFilms = () => {
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [films, setFilms] = useState(shortFilms)
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    duration: '',
    description: '',
    videoUrl: '',
    thumbnail: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const newFilm = {
      id: films.length + 1,
      ...formData,
      uploadDate: new Date().toLocaleDateString()
    }
    setFilms([newFilm, ...films])
    setShowUploadForm(false)
    setFormData({ title: '', director: '', duration: '', description: '', videoUrl: '', thumbnail: '' })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Short Films</h1>
          <p className="text-gray-400 mt-2">Discover and share independent short films</p>
        </div>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="bg-yellow-500 text-black px-6 py-2 rounded font-bold hover:bg-yellow-400"
        >
          {showUploadForm ? 'Cancel' : 'Upload Film'}
        </button>
      </div>

      {showUploadForm && (
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Upload Your Short Film</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Film Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Director Name</label>
                <input
                  type="text"
                  value={formData.director}
                  onChange={(e) => setFormData({...formData, director: e.target.value})}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Video URL</label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  placeholder="YouTube, Vimeo, etc."
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2">Thumbnail URL</label>
                <input
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 rounded bg-gray-700 text-white h-32"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-yellow-500 text-black px-6 py-2 rounded font-bold hover:bg-yellow-400"
            >
              Upload Film
            </button>
          </form>
        </div>
      )}

      {films.length === 0 ? (
        <div className="text-center py-16 bg-gray-800 rounded-lg">
          <p className="text-2xl text-gray-400 mb-4">🎥</p>
          <p className="text-gray-400">No short films yet. Be the first to upload!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {films.map(film => (
            <div key={film.id} className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition">
              <div className="h-48 bg-gray-700 flex items-center justify-center">
                {film.thumbnail ? (
                  <img src={film.thumbnail} alt={film.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl">🎬</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{film.title}</h3>
                <p className="text-yellow-400 text-sm mb-2">By {film.director}</p>
                <p className="text-gray-400 text-sm mb-3">{film.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>⏱️ {film.duration} min</span>
                  <a
                    href={film.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-400 hover:text-yellow-300"
                  >
                    Watch →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ShortFilms
