const router = require('express').Router()
const ShortFilm = require('../models/ShortFilm')

// GET all short films
router.get('/', async (req, res) => {
  try {
    const films = await ShortFilm.find().sort({ createdAt: -1 })
    res.json(films)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create short film
router.post('/', async (req, res) => {
  try {
    const film = await ShortFilm.create(req.body)
    res.status(201).json(film)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE short film
router.delete('/:id', async (req, res) => {
  try {
    await ShortFilm.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST toggle like
router.post('/:id/like', async (req, res) => {
  try {
    const { userEmail } = req.body
    const film = await ShortFilm.findById(req.params.id)
    if (!film) return res.status(404).json({ error: 'Not found' })
    const idx = film.likedBy.indexOf(userEmail)
    if (idx === -1) {
      film.likedBy.push(userEmail)
      film.likes += 1
    } else {
      film.likedBy.splice(idx, 1)
      film.likes = Math.max(0, film.likes - 1)
    }
    await film.save()
    res.json({ liked: idx === -1, likes: film.likes })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST add comment
router.post('/:id/comments', async (req, res) => {
  try {
    const { author, text } = req.body
    const film = await ShortFilm.findById(req.params.id)
    if (!film) return res.status(404).json({ error: 'Not found' })
    const comment = {
      author: author?.trim() || 'Anonymous',
      text: text.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: Date.now(),
    }
    film.comments.unshift(comment)
    await film.save()
    res.status(201).json(film.comments[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE comment
router.delete('/:id/comments/:commentId', async (req, res) => {
  try {
    const film = await ShortFilm.findById(req.params.id)
    if (!film) return res.status(404).json({ error: 'Not found' })
    film.comments = film.comments.filter(c => String(c._id) !== req.params.commentId)
    await film.save()
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
