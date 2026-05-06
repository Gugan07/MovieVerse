const router = require('express').Router()
const Article = require('../models/Article')

// GET all articles
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 })
    res.json(articles)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create article
router.post('/', async (req, res) => {
  try {
    const article = await Article.create({
      ...req.body,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    })
    res.status(201).json(article)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update article
router.put('/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!article) return res.status(404).json({ error: 'Not found' })
    res.json(article)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE article
router.delete('/:id', async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST toggle like
router.post('/:id/like', async (req, res) => {
  try {
    const { userEmail } = req.body
    const article = await Article.findById(req.params.id)
    if (!article) return res.status(404).json({ error: 'Not found' })
    const idx = article.likedBy.indexOf(userEmail)
    if (idx === -1) {
      article.likedBy.push(userEmail)
      article.likes += 1
    } else {
      article.likedBy.splice(idx, 1)
      article.likes = Math.max(0, article.likes - 1)
    }
    await article.save()
    res.json({ liked: idx === -1, likes: article.likes })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST add comment
router.post('/:id/comments', async (req, res) => {
  try {
    const { author, text } = req.body
    const article = await Article.findById(req.params.id)
    if (!article) return res.status(404).json({ error: 'Not found' })
    const comment = {
      author: author?.trim() || 'Anonymous',
      text: text.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: Date.now(),
    }
    article.comments.unshift(comment)
    await article.save()
    res.status(201).json(article.comments[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE comment
router.delete('/:id/comments/:commentId', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
    if (!article) return res.status(404).json({ error: 'Not found' })
    article.comments = article.comments.filter(c => String(c._id) !== req.params.commentId)
    await article.save()
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
