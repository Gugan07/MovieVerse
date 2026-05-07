// ─── Base URL ────────────────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ─── Helper: safe fetch with fallback ────────────────────────────────────────
const api = async (path, options = {}) => {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch {
    return null   // signals caller to use localStorage fallback
  }
}

// ─── localStorage helpers (fallback) ─────────────────────────────────────────
const LS = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)) ?? null } catch { return null } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} },
}

const KEYS = {
  ratings: 'cv_ratings', comments: 'cv_comments', watchlist: 'cv_watchlist',
  likes: 'cv_likes', user: 'user', articles: 'cv_articles',
  shortFilms: 'cv_shortfilms', articleLikeCounts: 'cv_article_likecounts',
  articleComments: 'cv_article_comments', filmLikes: 'cv_film_likes',
  filmLikeCounts: 'cv_film_likecounts', filmComments: 'cv_film_comments',
}

const getUser = () => LS.get(KEYS.user)

// ─── Ratings ─────────────────────────────────────────────────────────────────
export const getRating = (movieId) => {
  const all = LS.get(KEYS.ratings) ?? {}
  return all[String(movieId)] ?? 0
}

export const setRating = async (movieId, rating) => {
  // persist locally always
  const all = LS.get(KEYS.ratings) ?? {}
  all[String(movieId)] = rating
  LS.set(KEYS.ratings, all)
  // sync to DB
  const user = getUser()
  if (user?.email) {
    await api(`/userdata/${encodeURIComponent(user.email)}/ratings`, {
      method: 'PUT', body: { movieId, stars: rating },
    })
  }
}

export const getAllRatings = () => LS.get(KEYS.ratings) ?? {}

// ─── Movie Comments ───────────────────────────────────────────────────────────
export const getComments = (movieId) => {
  const all = LS.get(KEYS.comments) ?? {}
  return all[String(movieId)] ?? []
}

export const addComment = async (movieId, text) => {
  const user = getUser()
  const author = user?.name ?? 'Anonymous'
  const newComment = {
    id: Date.now(),
    text,
    author,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timestamp: Date.now(),
  }
  // localStorage
  const all = LS.get(KEYS.comments) ?? {}
  all[String(movieId)] = [newComment, ...(all[String(movieId)] ?? [])]
  LS.set(KEYS.comments, all)
  // DB
  const saved = await api(`/moviecomments/${movieId}`, { method: 'POST', body: { author, text } })
  return saved ?? newComment
}

export const deleteComment = async (movieId, commentId) => {
  const all = LS.get(KEYS.comments) ?? {}
  all[String(movieId)] = (all[String(movieId)] ?? []).filter(c => c.id !== commentId)
  LS.set(KEYS.comments, all)
  await api(`/moviecomments/${movieId}/${commentId}`, { method: 'DELETE' })
}

// ─── Watchlist ────────────────────────────────────────────────────────────────
export const getWatchlist = () => LS.get(KEYS.watchlist) ?? []

export const isInWatchlist = (movieId) =>
  getWatchlist().some(m => String(m.id) === String(movieId))

export const toggleWatchlist = async (movie) => {
  const list = getWatchlist()
  const exists = list.some(m => String(m.id) === String(movie.id))
  const updated = exists
    ? list.filter(m => String(m.id) !== String(movie.id))
    : [{ id: movie.id, title: movie.title, poster: movie.poster, year: movie.year }, ...list]
  LS.set(KEYS.watchlist, updated)
  const user = getUser()
  if (user?.email) {
    await api(`/userdata/${encodeURIComponent(user.email)}/watchlist`, { method: 'POST', body: movie })
  }
  return !exists
}

// ─── Article Likes ────────────────────────────────────────────────────────────
export const getLikes = () => LS.get(KEYS.likes) ?? {}

export const isLiked = (articleId) =>
  !!(LS.get(KEYS.likes) ?? {})[String(articleId)]

export const toggleLike = async (articleId) => {
  const all = LS.get(KEYS.likes) ?? {}
  const wasLiked = !!all[String(articleId)]
  all[String(articleId)] = !wasLiked
  LS.set(KEYS.likes, all)
  const counts = LS.get(KEYS.articleLikeCounts) ?? {}
  counts[String(articleId)] = Math.max(0, (counts[String(articleId)] ?? 0) + (wasLiked ? -1 : 1))
  LS.set(KEYS.articleLikeCounts, counts)
  const user = getUser()
  if (user?.email) {
    await api(`/articles/${articleId}/like`, { method: 'POST', body: { userEmail: user.email } })
  }
  return all[String(articleId)]
}

export const getArticleLikeCount = (articleId) =>
  (LS.get(KEYS.articleLikeCounts) ?? {})[String(articleId)] ?? 0

// ─── Article Comments ─────────────────────────────────────────────────────────
export const getArticleComments = (articleId) =>
  (LS.get(KEYS.articleComments) ?? {})[String(articleId)] ?? []

export const addArticleComment = async (articleId, { author, text }) => {
  const newComment = {
    id: Date.now(),
    author: author?.trim() || 'Anonymous',
    text: text.trim(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timestamp: Date.now(),
  }
  const all = LS.get(KEYS.articleComments) ?? {}
  all[String(articleId)] = [newComment, ...(all[String(articleId)] ?? [])]
  LS.set(KEYS.articleComments, all)
  const saved = await api(`/articles/${articleId}/comments`, { method: 'POST', body: { author: newComment.author, text } })
  return saved ?? newComment
}

export const deleteArticleComment = async (articleId, commentId) => {
  const all = LS.get(KEYS.articleComments) ?? {}
  all[String(articleId)] = (all[String(articleId)] ?? []).filter(c => c.id !== commentId)
  LS.set(KEYS.articleComments, all)
  await api(`/articles/${articleId}/comments/${commentId}`, { method: 'DELETE' })
}

// ─── Articles ─────────────────────────────────────────────────────────────────
export const getArticles = async () => {
  const remote = await api('/articles')
  if (remote) {
    // normalise _id -> id for frontend compatibility
    const normalised = remote.map(a => ({ ...a, id: a._id ?? a.id }))
    LS.set(KEYS.articles, normalised)
    return normalised
  }
  return LS.get(KEYS.articles) ?? []
}

export const saveArticle = async (article) => {
  const saved = await api('/articles', { method: 'POST', body: article })
  const newArticle = saved ? { ...saved, id: saved._id ?? Date.now() } : { ...article, id: Date.now() }
  const all = [newArticle, ...(LS.get(KEYS.articles) ?? [])]
  LS.set(KEYS.articles, all)
  return all
}

export const updateArticle = async (id, changes) => {
  await api(`/articles/${id}`, { method: 'PUT', body: changes })
  const all = (LS.get(KEYS.articles) ?? []).map(a => String(a.id) === String(id) ? { ...a, ...changes } : a)
  LS.set(KEYS.articles, all)
  return all
}

export const deleteArticle = async (id) => {
  await api(`/articles/${id}`, { method: 'DELETE' })
  const all = (LS.get(KEYS.articles) ?? []).filter(a => String(a.id) !== String(id))
  LS.set(KEYS.articles, all)
  return all
}

// ─── Short Films ──────────────────────────────────────────────────────────────
export const getShortFilms = async () => {
  const remote = await api('/shortfilms')
  if (remote) {
    const normalised = remote.map(f => ({ ...f, id: f._id ?? f.id }))
    LS.set(KEYS.shortFilms, normalised)
    return normalised
  }
  return LS.get(KEYS.shortFilms) ?? []
}

export const saveShortFilm = async (film) => {
  const saved = await api('/shortfilms', { method: 'POST', body: film })
  const newFilm = saved ? { ...saved, id: saved._id ?? Date.now() } : { ...film, id: Date.now() }
  const all = [newFilm, ...(LS.get(KEYS.shortFilms) ?? [])]
  LS.set(KEYS.shortFilms, all)
  return all
}

// ─── Film Likes ───────────────────────────────────────────────────────────────
export const isFilmLiked = (filmId) =>
  !!(LS.get(KEYS.filmLikes) ?? {})[String(filmId)]

export const toggleFilmLike = async (filmId) => {
  const all = LS.get(KEYS.filmLikes) ?? {}
  const wasLiked = !!all[String(filmId)]
  all[String(filmId)] = !wasLiked
  LS.set(KEYS.filmLikes, all)
  const counts = LS.get(KEYS.filmLikeCounts) ?? {}
  counts[String(filmId)] = Math.max(0, (counts[String(filmId)] ?? 0) + (wasLiked ? -1 : 1))
  LS.set(KEYS.filmLikeCounts, counts)
  const user = getUser()
  if (user?.email) {
    await api(`/shortfilms/${filmId}/like`, { method: 'POST', body: { userEmail: user.email } })
  }
  return all[String(filmId)]
}

export const getFilmLikeCount = (filmId) =>
  (LS.get(KEYS.filmLikeCounts) ?? {})[String(filmId)] ?? 0

// ─── Film Comments ────────────────────────────────────────────────────────────
export const getFilmComments = (filmId) =>
  (LS.get(KEYS.filmComments) ?? {})[String(filmId)] ?? []

export const addFilmComment = async (filmId, { author, text }) => {
  const newComment = {
    id: Date.now(),
    author: author?.trim() || 'Anonymous',
    text: text.trim(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timestamp: Date.now(),
  }
  const all = LS.get(KEYS.filmComments) ?? {}
  all[String(filmId)] = [newComment, ...(all[String(filmId)] ?? [])]
  LS.set(KEYS.filmComments, all)
  const saved = await api(`/shortfilms/${filmId}/comments`, { method: 'POST', body: { author: newComment.author, text } })
  return saved ?? newComment
}

export const deleteFilmComment = async (filmId, commentId) => {
  const all = LS.get(KEYS.filmComments) ?? {}
  all[String(filmId)] = (all[String(filmId)] ?? []).filter(c => c.id !== commentId)
  LS.set(KEYS.filmComments, all)
  await api(`/shortfilms/${filmId}/comments/${commentId}`, { method: 'DELETE' })
}

// ─── Masterclasses ───────────────────────────────────────────────────────────
const MC_KEY = 'cv_masterclasses'

export const getMasterclasses = async () => {
  const remote = await api('/masterclasses')
  if (remote) {
    const normalised = remote.map(m => ({ ...m, id: m._id ?? m.id }))
    LS.set(MC_KEY, normalised)
    return normalised
  }
  return LS.get(MC_KEY) ?? []
}

export const saveMasterclass = async (mc) => {
  const saved = await api('/masterclasses', { method: 'POST', body: mc })
  const newMc = saved ? { ...saved, id: saved._id ?? Date.now() } : { ...mc, id: Date.now() }
  const all = [newMc, ...(LS.get(MC_KEY) ?? [])]
  LS.set(MC_KEY, all)
  return all
}

export const deleteMasterclass = async (id) => {
  await api(`/masterclasses/${id}`, { method: 'DELETE' })
  const all = (LS.get(MC_KEY) ?? []).filter(m => String(m.id) !== String(id))
  LS.set(MC_KEY, all)
  return all
}
export const registerUser = async (name, email, password) => {
  const res = await api('/auth/register', { method: 'POST', body: { name, email, password } })
  if (res && !res.error) {
    const user = { name: res.name, email: res.email, bio: res.bio, avatar: res.avatar, joinDate: res.joinDate }
    LS.set(KEYS.user, user)
    return { success: true, user }
  }
  return { success: false, error: res?.error ?? 'Registration failed' }
}

export const loginUser = async (email, password) => {
  const res = await api('/auth/login', { method: 'POST', body: { email, password } })
  if (res && !res.error) {
    const user = { name: res.name, email: res.email, bio: res.bio, avatar: res.avatar, joinDate: res.joinDate }
    LS.set(KEYS.user, user)
    return { success: true, user }
  }
  return { success: false, error: res?.error ?? 'Login failed' }
}

export const updateUserProfile = async (updates) => {
  const user = getUser()
  if (!user?.email) return null
  const res = await api('/auth/profile', { method: 'PUT', body: { email: user.email, ...updates } })
  const updated = res && !res.error ? { ...user, ...updates } : { ...user, ...updates }
  LS.set(KEYS.user, updated)
  return updated
}

// ─── Sync user data from DB on login ─────────────────────────────────────────
export const syncUserData = async () => {
  const user = getUser()
  if (!user?.email) return
  const data = await api(`/userdata/${encodeURIComponent(user.email)}`)
  if (!data) return
  if (data.ratings) LS.set(KEYS.ratings, data.ratings)
  if (data.watchlist) LS.set(KEYS.watchlist, data.watchlist)
}
