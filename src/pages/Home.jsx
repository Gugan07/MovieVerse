import HeroSection from '../components/HeroSection'
import MovieCard from '../components/MovieCard'
import { movies } from '../data/movies'

const Home = () => {
  const featuredMovie = movies[0]
  const latestMovies = movies.slice(1)

  return (
    <div>
      <HeroSection movie={featuredMovie} />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Latest Movie Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home