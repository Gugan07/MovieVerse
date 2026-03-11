import { useState, useEffect } from 'react'
import { fetchPopularMovies, fetchTrending, fetchMoviesByGenre, fetchTopRated, getPoster, getBackdrop } from '../services/tmdb'

// Normalise a raw TMDB movie object into our app's shape
export const normaliseTmdb = (m) => ({
  id: m.id,
  tmdbId: m.id,
  title: m.title,
  description: m.overview,
  poster: getPoster(m.poster_path, 'w500') || 'https://via.placeholder.com/500x750?text=No+Image',
  backdrop: getBackdrop(m.backdrop_path) || null,
  rating: m.vote_average?.toFixed(1) || 'N/A',
  year: m.release_date?.slice(0, 4) || '',
  genre: m.genre_ids?.[0] ? GENRE_ID_MAP[m.genre_ids[0]] || 'Film' : 'Film',
  director: '',
  cast: [],
  fullReview: '',
})

const GENRE_ID_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 14: 'Fantasy',
  27: 'Horror', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  53: 'Thriller', 10752: 'War', 37: 'Western',
}

export const useTrendingMovies = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTrending()
      .then(data => setMovies(data.results?.map(normaliseTmdb) || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { movies, loading, error }
}

export const usePopularMovies = (page = 1) => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchPopularMovies(page)
      .then(data => {
        setMovies(data.results?.map(normaliseTmdb) || [])
        setTotalPages(Math.min(data.total_pages || 1, 500))
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [page])

  return { movies, loading, error, totalPages }
}

export const useTopRatedMovies = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopRated()
      .then(data => setMovies(data.results?.map(normaliseTmdb) || []))
      .finally(() => setLoading(false))
  }, [])

  return { movies, loading }
}

export const useMoviesByGenre = (genreId) => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!genreId) return
    setLoading(true)
    fetchMoviesByGenre(genreId)
      .then(data => setMovies(data.results?.map(normaliseTmdb) || []))
      .finally(() => setLoading(false))
  }, [genreId])

  return { movies, loading }
}
