const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
export const IMG_BASE = 'https://image.tmdb.org/t/p'

// Image helpers
export const getPoster = (path, size = 'w500') =>
  path ? `${IMG_BASE}/${size}${path}` : null

export const getBackdrop = (path, size = 'w1280') =>
  path ? `${IMG_BASE}/${size}${path}` : null

export const getProfile = (path, size = 'w185') =>
  path ? `${IMG_BASE}/${size}${path}` : null

// Core fetch wrapper
const tmdbFetch = async (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('language', 'en-US')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`)
  return res.json()
}

// Endpoints
export const fetchPopularMovies = (page = 1) =>
  tmdbFetch('/movie/popular', { page })

export const fetchNowPlaying = (page = 1) =>
  tmdbFetch('/movie/now_playing', { page })

export const fetchTopRated = (page = 1) =>
  tmdbFetch('/movie/top_rated', { page })

export const fetchTrending = () =>
  tmdbFetch('/trending/movie/week')

export const fetchMovieDetails = (id) =>
  tmdbFetch(`/movie/${id}`, { append_to_response: 'credits,videos,similar,reviews' })

export const fetchMoviesByGenre = (genreId, page = 1) =>
  tmdbFetch('/discover/movie', { with_genres: genreId, sort_by: 'popularity.desc', page })

export const searchMovies = (query, page = 1) =>
  tmdbFetch('/search/movie', { query, page })

export const fetchGenres = () =>
  tmdbFetch('/genre/movie/list')

// TMDB genre IDs
export const GENRE_MAP = {
  'Action': 28,
  'Adventure': 12,
  'Animation': 16,
  'Comedy': 35,
  'Crime': 80,
  'Documentary': 99,
  'Drama': 18,
  'Fantasy': 14,
  'Horror': 27,
  'Mystery': 9648,
  'Romance': 10749,
  'Sci-Fi': 878,
  'Thriller': 53,
  'War': 10752,
}
