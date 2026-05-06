const router = require('express').Router()
const MovieComment = require('../models/MovieComment')

// GET comments for a movie
router.get('/:movieId', async (req, res) => {
  try {
    const comments = await MovieComment.find({ movieId: req.params.movieId }).sort({ timestamp: -1 })
    res.json(comments)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST add comment
router.post('/:movieId', async (req, res) => {
  try {
    const { author, text } = req.body
    const comment = await MovieComment.create({
      movieId: req.params.movieId,
      author: author?.trim() || 'Anonymous',
      text: text.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: Date.now(),
    })
    res.status(201).json(comment)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE comment
router.delete('/:movieId/:commentId', async (req, res) => {
  try {
    await MovieComment.findByIdAndDelete(req.params.commentId)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
