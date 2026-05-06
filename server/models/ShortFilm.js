const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  author:    { type: String, default: 'Anonymous' },
  text:      { type: String, required: true },
  date:      { type: String },
  timestamp: { type: Number, default: Date.now },
})

const shortFilmSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  director:  { type: String, required: true },
  year:      { type: String, default: '' },
  duration:  { type: String, default: '' },
  genre:     { type: String, default: '' },
  language:  { type: String, default: '' },
  youtubeId: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  note:      { type: String, default: '' },
  awards:    { type: String, default: '' },
  tags:      [{ type: String }],
  likes:     { type: Number, default: 0 },
  likedBy:   [{ type: String }],
  comments:  [commentSchema],
}, { timestamps: true })

module.exports = mongoose.model('ShortFilm', shortFilmSchema)
