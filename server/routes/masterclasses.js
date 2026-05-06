const router = require('express').Router()
const Masterclass = require('../models/Masterclass')

// GET all masterclasses
router.get('/', async (req, res) => {
  try {
    const classes = await Masterclass.find().sort({ createdAt: -1 })
    res.json(classes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create masterclass
router.post('/', async (req, res) => {
  try {
    const mc = await Masterclass.create(req.body)
    res.status(201).json(mc)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE masterclass
router.delete('/:id', async (req, res) => {
  try {
    await Masterclass.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
