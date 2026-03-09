import { useState } from 'react'
import MovieCard from '../components/MovieCard'
import { getMoviesByGenre, genres } from '../data/movies'

const Categories = () => {
  const [selectedGenre, setSelectedGenre] = useState('All')
  const filteredMovies = getMoviesByGenre(selectedGenre)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse by Category</h1>
      
      <div className="flex flex-wrap gap-3 mb-8">
        {genres.map(genre => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-2 rounded ${
              selectedGenre === genre
                ? 'bg-yellow-500 text-black font-bold'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      <p className="text-gray-400 mb-6">
        {filteredMovies.length} movies found
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}

export default Categories
