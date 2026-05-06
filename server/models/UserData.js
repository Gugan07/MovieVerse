const mongoose = require('mongoose')

// Stores per-user data: ratings, watchlist, liked articles/films
const userDataSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true },
  ratings:   { type: Map, of: Number, default: {} },   // movieId -> stars
  watchlist: [{
    id:     String,
    title:  String,
    poster: String,
    year:   String,
  }],
}, { timestamps: true })

module.exports = mongoose.model('UserData', userDataSchema)
