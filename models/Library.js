// Library.js
var mongoose = require('mongoose');
var LibrarySchema = new mongoose.Schema({
  cover: String, //Base64 Encoded
  title: String,
  author: String,
  numberOfPages: Number,
  publishDate: Date,
  rating: Number,
});

LibrarySchema.index({
  title: 'text',
  author: 'text',
  numberOfPages: 'text',
  publishDate: 'text'
});

mongoose.model('Library', LibrarySchema);

module.exports = mongoose.model('Library');
