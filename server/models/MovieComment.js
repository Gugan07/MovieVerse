const mongoose = require('mongoose')

const movieCommentSchema = new mongoose.Schema({
  movieId:   { type: String, required: true },
  author:    { type: String, default: 'Anonymous' },
  text:      { type: String, required: true },
  date:      { type: String },
  timestamp: { type: Number, default: Date.now },
}, { timestamps: true })

movieCommentSchema.index({ movieId: 1 })

module.exports = mongoose.model('MovieComment', movieCommentSchema)
