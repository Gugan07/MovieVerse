const mongoose = require('mongoose')

const masterclassSchema = new mongoose.Schema({
  director:    { type: String, required: true },
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  duration:    { type: String, default: '' },
  youtubeId:   { type: String, required: true },
  thumbnail:   { type: String, default: '' },
  photo:       { type: String, default: '' },
  topics:      [{ type: String }],
}, { timestamps: true })

module.exports = mongoose.model('Masterclass', masterclassSchema)
