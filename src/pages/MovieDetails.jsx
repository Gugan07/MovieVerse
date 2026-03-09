import { useParams } from 'react-router-dom'
import { getMovieById, movies } from '../data/movies'
import MovieCard from '../components/MovieCard'

const MovieDetails = () => {
  const { id } = useParams()
  const movie = getMovieById(id)

  if (!movie) {
    return <div className="max-w-6xl mx-auto px-4 py-16 text-center">Movie not found</div>
  }

  const relatedMovies = movies.filter(m => m.genre === movie.genre && m.id !== movie.id).slice(0, 3)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div>
          <img 
            src={movie.poster} 
            alt={movie.title}
            className="w-full rounded"
          />
          <div className="mt-4 bg-gray-800 rounded p-4">
            <h3 className="font-bold mb-3">Movie Info</h3>
            <p className="text-sm mb-2"><strong>Director:</strong> {movie.director}</p>
            <p className="text-sm mb-2"><strong>Genre:</strong> {movie.genre}</p>
            <p className="text-sm mb-2"><strong>Year:</strong> {movie.year}</p>
            <p className="text-sm"><strong>Cast:</strong> {movie.cast.join(', ')}</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-3">{movie.title}</h1>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-yellow-500 text-black px-3 py-1 rounded font-bold">
              ⭐ {movie.rating}/10
            </span>
            <span className="text-gray-400">{movie.year}</span>
            <span className="text-gray-400">{movie.genre}</span>
          </div>

          <h2 className="text-2xl font-bold mb-3">Review</h2>
          <p className="text-gray-300 leading-relaxed">
            {movie.fullReview}
          </p>
        </div>
      </div>

      {relatedMovies.length > 0 && (
        <div className="border-t border-gray-700 pt-8">
          <h2 className="text-2xl font-bold mb-6">More {movie.genre} Movies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gray-700 mt-12 pt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <div className="bg-gray-800 rounded p-4 mb-6">
          <textarea 
            className="w-full bg-gray-700 text-white rounded p-3 mb-3"
            rows="3"
            placeholder="Write your comment..."
          ></textarea>
          <button className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400">
            Post Comment
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-800 rounded p-4">
            <p className="font-bold mb-1">John Doe</p>
            <p className="text-sm text-gray-400 mb-2">2 days ago</p>
            <p className="text-gray-300">Great movie! Really enjoyed it.</p>
          </div>

          <div className="bg-gray-800 rounded p-4">
            <p className="font-bold mb-1">Sarah M</p>
            <p className="text-sm text-gray-400 mb-2">5 days ago</p>
            <p className="text-gray-300">Nice review, I agree with your points!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
