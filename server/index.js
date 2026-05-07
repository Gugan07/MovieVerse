require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }))
app.use(express.json())

// Routes
app.use('/api/auth',          require('./routes/auth'))
app.use('/api/articles',      require('./routes/articles'))
app.use('/api/shortfilms',    require('./routes/shortFilms'))
app.use('/api/masterclasses', require('./routes/masterclasses'))
app.use('/api/userdata',      require('./routes/userData'))
app.use('/api/moviecomments', require('./routes/movieComments'))

app.get('/', (req, res) => res.json({ status: 'FilmVerse API running ✅', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }))

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas connected')
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message)
    // Still start server so frontend fallback (localStorage) works
    app.listen(PORT, () => console.log(`⚠️  Server running WITHOUT DB on http://localhost:${PORT}`))
  })
