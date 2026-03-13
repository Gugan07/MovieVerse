// ─── localStorage keys ─────────────────────────────────────────────────────
const KEYS = {
  ratings:          'cv_ratings',
  comments:         'cv_comments',       // movie comments
  watchlist:        'cv_watchlist',
  likes:            'cv_likes',          // article liked booleans
  user:             'user',
  articles:         'cv_articles',
  shortFilms:       'cv_shortfilms',
  articleLikeCounts:'cv_article_likecounts',
  articleComments:  'cv_article_comments',
  filmLikes:        'cv_film_likes',     // film liked booleans
  filmLikeCounts:   'cv_film_likecounts',
  filmComments:     'cv_film_comments',
  masterclasses:    'cv_masterclasses',
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

// ─── Movie Comments ──────────────────────────────────────────────────────────
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
  return !exists
}

// ─── Article Likes (boolean — did this user like it) ────────────────────────
export const getLikes = () => get(KEYS.likes) ?? {}

export const isLiked = (articleId) => {
  return !!(get(KEYS.likes) ?? {})[String(articleId)]
}

export const toggleLike = (articleId) => {
  const all = get(KEYS.likes) ?? {}
  const wasLiked = !!all[String(articleId)]
  all[String(articleId)] = !wasLiked
  set(KEYS.likes, all)
  // Update count
  const counts = get(KEYS.articleLikeCounts) ?? {}
  counts[String(articleId)] = Math.max(0, (counts[String(articleId)] ?? 0) + (wasLiked ? -1 : 1))
  set(KEYS.articleLikeCounts, counts)
  return all[String(articleId)]
}

export const getArticleLikeCount = (articleId) => {
  return (get(KEYS.articleLikeCounts) ?? {})[String(articleId)] ?? 0
}

// ─── Article Comments ────────────────────────────────────────────────────────
export const getArticleComments = (articleId) => {
  return (get(KEYS.articleComments) ?? {})[String(articleId)] ?? []
}

export const addArticleComment = (articleId, { author, text }) => {
  const all = get(KEYS.articleComments) ?? {}
  const existing = all[String(articleId)] ?? []
  const newComment = {
    id: Date.now(),
    author: author.trim() || 'Anonymous',
    text: text.trim(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timestamp: Date.now(),
  }
  all[String(articleId)] = [newComment, ...existing]
  set(KEYS.articleComments, all)
  return newComment
}

export const deleteArticleComment = (articleId, commentId) => {
  const all = get(KEYS.articleComments) ?? {}
  all[String(articleId)] = (all[String(articleId)] ?? []).filter(c => c.id !== commentId)
  set(KEYS.articleComments, all)
}

// ─── Articles ────────────────────────────────────────────────────────────────
export const getArticles = () => get(KEYS.articles) ?? []

export const saveArticle = (article) => {
  const all = getArticles()
  const newArticle = { ...article, id: Date.now() }
  const updated = [newArticle, ...all]
  set(KEYS.articles, updated)
  return updated
}

export const updateArticle = (id, changes) => {
  const all = getArticles()
  const updated = all.map(a => String(a.id) === String(id) ? { ...a, ...changes } : a)
  set(KEYS.articles, updated)
  return updated
}

export const deleteArticle = (id) => {
  const updated = getArticles().filter(a => String(a.id) !== String(id))
  set(KEYS.articles, updated)
  return updated
}

// ─── Short Films ─────────────────────────────────────────────────────────────
export const getShortFilms = () => get(KEYS.shortFilms) ?? []

export const saveShortFilm = (film) => {
  const all = getShortFilms()
  const newFilm = { ...film, id: Date.now() }
  const updated = [newFilm, ...all]
  set(KEYS.shortFilms, updated)
  return updated
}

// ─── Film Likes ───────────────────────────────────────────────────────────────
export const isFilmLiked = (filmId) => {
  return !!(get(KEYS.filmLikes) ?? {})[String(filmId)]
}

export const toggleFilmLike = (filmId) => {
  const all = get(KEYS.filmLikes) ?? {}
  const wasLiked = !!all[String(filmId)]
  all[String(filmId)] = !wasLiked
  set(KEYS.filmLikes, all)
  // Update count
  const counts = get(KEYS.filmLikeCounts) ?? {}
  counts[String(filmId)] = Math.max(0, (counts[String(filmId)] ?? 0) + (wasLiked ? -1 : 1))
  set(KEYS.filmLikeCounts, counts)
  return all[String(filmId)]
}

export const getFilmLikeCount = (filmId) => {
  return (get(KEYS.filmLikeCounts) ?? {})[String(filmId)] ?? 0
}

// ─── Film Comments ────────────────────────────────────────────────────────────
export const getFilmComments = (filmId) => {
  return (get(KEYS.filmComments) ?? {})[String(filmId)] ?? []
}

export const addFilmComment = (filmId, { author, text }) => {
  const all = get(KEYS.filmComments) ?? {}
  const existing = all[String(filmId)] ?? []
  const newComment = {
    id: Date.now(),
    author: author.trim() || 'Anonymous',
    text: text.trim(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timestamp: Date.now(),
  }
  all[String(filmId)] = [newComment, ...existing]
  set(KEYS.filmComments, all)
  return newComment
}

export const deleteFilmComment = (filmId, commentId) => {
  const all = get(KEYS.filmComments) ?? {}
  all[String(filmId)] = (all[String(filmId)] ?? []).filter(c => c.id !== commentId)
  set(KEYS.filmComments, all)
}

// ─── Masterclasses ────────────────────────────────────────────────────────────
export const getMasterclasses = () => get(KEYS.masterclasses) ?? []

export const saveMasterclass = (mc) => {
  const all = getMasterclasses()
  const newMc = { ...mc, id: Date.now() }
  const updated = [newMc, ...all]
  set(KEYS.masterclasses, updated)
  return updated
}

export const deleteMasterclass = (id) => {
  const updated = getMasterclasses().filter(m => String(m.id) !== String(id))
  set(KEYS.masterclasses, updated)
  return updated
}
