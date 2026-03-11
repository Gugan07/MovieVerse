// ─── localStorage keys ─────────────────────────────────────────────────────
const KEYS = {
  ratings:   'cv_ratings',
  comments:  'cv_comments',
  watchlist: 'cv_watchlist',
  likes:     'cv_likes',
  user:      'user',
}

const get = (key) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? null } catch { return null }
}
const set = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

// ─── Ratings ────────────────────────────────────────────────────────────────
export const getRating = (movieId) => {
  const all = get(KEYS.ratings) ?? {}
  return all[String(movieId)] ?? 0
}

export const setRating = (movieId, rating) => {
  const all = get(KEYS.ratings) ?? {}
  all[String(movieId)] = rating
  set(KEYS.ratings, all)
}

export const getAllRatings = () => get(KEYS.ratings) ?? {}

// ─── Comments ────────────────────────────────────────────────────────────────
export const getComments = (movieId) => {
  const all = get(KEYS.comments) ?? {}
  return all[String(movieId)] ?? []
}

export const addComment = (movieId, comment) => {
  const all = get(KEYS.comments) ?? {}
  const existing = all[String(movieId)] ?? []
  const newComment = {
    id: Date.now(),
    text: comment,
    author: get(KEYS.user)?.name ?? 'Anonymous',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timestamp: Date.now(),
  }
  all[String(movieId)] = [newComment, ...existing]
  set(KEYS.comments, all)
  return newComment
}

export const deleteComment = (movieId, commentId) => {
  const all = get(KEYS.comments) ?? {}
  all[String(movieId)] = (all[String(movieId)] ?? []).filter(c => c.id !== commentId)
  set(KEYS.comments, all)
}

// ─── Watchlist ───────────────────────────────────────────────────────────────
export const getWatchlist = () => get(KEYS.watchlist) ?? []

export const isInWatchlist = (movieId) => {
  return getWatchlist().some(m => String(m.id) === String(movieId))
}

export const toggleWatchlist = (movie) => {
  const list = getWatchlist()
  const exists = list.some(m => String(m.id) === String(movie.id))
  const updated = exists
    ? list.filter(m => String(m.id) !== String(movie.id))
    : [{ id: movie.id, title: movie.title, poster: movie.poster, year: movie.year }, ...list]
  set(KEYS.watchlist, updated)
  return !exists  // returns new state
}

// ─── Article Likes ──────────────────────────────────────────────────────────
export const getLikes = () => get(KEYS.likes) ?? {}

export const isLiked = (articleId) => {
  return !!(get(KEYS.likes) ?? {})[String(articleId)]
}

export const toggleLike = (articleId) => {
  const all = get(KEYS.likes) ?? {}
  all[String(articleId)] = !all[String(articleId)]
  set(KEYS.likes, all)
  return all[String(articleId)]
}
