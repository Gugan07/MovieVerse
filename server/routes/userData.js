const router = require('express').Router()
const UserData = require('../models/UserData')
const User = require('../models/User')

const getOrCreate = async (email) => {
  let ud = await UserData.findOne({ userEmail: email })
  if (!ud) ud = await UserData.create({ userEmail: email })
  return ud
}

// GET user data (ratings + watchlist)
router.get('/:email', async (req, res) => {
  try {
    const ud = await getOrCreate(req.params.email)
    res.json({ ratings: Object.fromEntries(ud.ratings), watchlist: ud.watchlist })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT set rating
router.put('/:email/ratings', async (req, res) => {
  try {
    const { movieId, stars } = req.body
    const ud = await getOrCreate(req.params.email)
    ud.ratings.set(String(movieId), stars)
    await ud.save()
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST toggle watchlist
router.post('/:email/watchlist', async (req, res) => {
  try {
    const movie = req.body
    const ud = await getOrCreate(req.params.email)
    const idx = ud.watchlist.findIndex(m => String(m.id) === String(movie.id))
    if (idx === -1) {
      ud.watchlist.unshift({ id: movie.id, title: movie.title, poster: movie.poster, year: movie.year })
    } else {
      ud.watchlist.splice(idx, 1)
    }
    await ud.save()
    res.json({ watchlist: ud.watchlist })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST add movie comment
router.post('/:email/comments', async (req, res) => {
  try {
    // Movie comments are stored on UserData per movie
    // We store them globally keyed by movieId in a separate approach
    // Redirect to a simple global comments collection
    res.status(501).json({ error: 'Use /api/moviecomments instead' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
