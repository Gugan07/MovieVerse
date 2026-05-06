require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth',          require('./routes/auth'))
app.use('/api/articles',      require('./routes/articles'))
app.use('/api/shortfilms',    require('./routes/shortFilms'))
app.use('/api/masterclasses', require('./routes/masterclasses'))
app.use('/api/userdata',      require('./routes/userData'))
app.use('/api/moviecomments', require('./routes/movieComments'))

app.get('/', (req, res) => res.json({ status: 'FilmVerse API running' }))

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    )
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })
