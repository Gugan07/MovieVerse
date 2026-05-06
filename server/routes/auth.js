const router = require('express').Router()
const User = require('../models/User')

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ error: 'Email already registered' })
    const user = await User.create({ name, email, password })
    const { password: _, ...safe } = user.toObject()
    res.status(201).json(safe)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email, password })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const { password: _, ...safe } = user.toObject()
    res.json(safe)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/auth/profile
router.put('/profile', async (req, res) => {
  try {
    const { email, ...updates } = req.body
    delete updates.password
    const user = await User.findOneAndUpdate({ email }, updates, { new: true })
    if (!user) return res.status(404).json({ error: 'User not found' })
    const { password: _, ...safe } = user.toObject()
    res.json(safe)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
