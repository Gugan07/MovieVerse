import { Link } from 'react-router-dom'

const MovieCard = ({ movie }) => {
  return (
    <div className="bg-gray-800 rounded p-4">
      <img 
        src={movie.poster} 
        alt={movie.title}
        className="w-full h-64 object-cover rounded mb-3"
      />
      <div className="bg-yellow-500 text-black px-2 py-1 rounded inline-block text-sm font-bold mb-2">
        ⭐ {movie.rating}
      </div>
      <h3 className="text-xl font-bold mb-2">
        {movie.title}
      </h3>
      <p className="text-gray-400 text-sm mb-3">
        {movie.description.substring(0, 100)}...
      </p>
      <Link 
        to={`/movie/${movie.id}`}
        className="bg-yellow-500 text-black px-4 py-2 rounded inline-block hover:bg-yellow-400"
      >
        Read More
      </Link>
    </div>
  )
}

export default MovieCard
