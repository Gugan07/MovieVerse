const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  author:    { type: String, default: 'Anonymous' },
  text:      { type: String, required: true },
  date:      { type: String },
  timestamp: { type: Number, default: Date.now },
})

const articleSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  author:    { type: String, required: true },
  film:      { type: String, default: '' },
  year:      { type: String, default: '' },
  tag:       { type: String, default: '' },
  readTime:  { type: String, default: '' },
  image:     { type: String, default: '' },
  excerpt:   { type: String, default: '' },
  content:   { type: String, default: '' },
  date:      { type: String },
  likes:     { type: Number, default: 0 },
  likedBy:   [{ type: String }],   // stores user emails/ids
  comments:  [commentSchema],
}, { timestamps: true })

module.exports = mongoose.model('Article', articleSchema)
