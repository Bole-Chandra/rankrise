const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true }, // filename or URL of the image
  category: { type: String, default: 'Events' }, // e.g. 'Campus', 'Events', 'Olympiad'
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
