import { useState, useEffect, useRef } from 'react'
import { searchMovies } from '../services/tmdb'
import { normaliseTmdb } from './useTMDB'

// Debounce search to avoid too many API calls
export const useSearch = (delay = 400) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    clearTimeout(timerRef.current)

    timerRef.current = setTimeout(async () => {
      try {
        const data = await searchMovies(query)
        setResults((data.results ?? []).map(normaliseTmdb))
        setError(null)
      } catch (e) {
        setError(e.message)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, delay)

    return () => clearTimeout(timerRef.current)
  }, [query, delay])

  return { query, setQuery, results, loading, error }
}
