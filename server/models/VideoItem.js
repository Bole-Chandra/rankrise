const mongoose = require('mongoose');

const videoItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  thumbnail: { type: String },
  type: { type: String, enum: ['upload', 'youtube'], default: 'upload' },
  category: { type: String, default: 'General' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VideoItem', videoItemSchema);
