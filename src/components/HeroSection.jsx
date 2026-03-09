import { Link } from 'react-router-dom'

const HeroSection = ({ movie }) => {
  return (
    <div className="bg-gradient-to-r from-purple-900 to-blue-900 py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <span className="bg-yellow-500 text-black px-3 py-1 rounded text-sm font-bold">
          🌟 Featured Movie
        </span>
        <h1 className="text-5xl font-bold my-4">
          {movie.title}
        </h1>
        <p className="text-xl mb-4 text-gray-200">
          {movie.description}
        </p>
        <div className="mb-6">
          <span className="text-yellow-400 text-lg">⭐ {movie.rating}/10</span>
          <span className="mx-2">|</span>
          <span>{movie.year}</span>
          <span className="mx-2">|</span>
          <span>{movie.genre}</span>
        </div>
        <Link 
          to={`/movie/${movie.id}`}
          className="bg-yellow-500 text-black px-6 py-3 rounded inline-block hover:bg-yellow-400 font-bold"
        >
          Read Review
        </Link>
      </div>
    </div>
  )
}

export default HeroSection
