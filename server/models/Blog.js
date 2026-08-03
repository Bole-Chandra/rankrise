const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  summary: { type: String },

  // Display name shown on the post (kept as a plain string for backward
  // compatibility with posts written directly by admin before this system
  // existed, and so a blog still shows a sensible byline even if the
  // author's account is later deleted).
  author: { type: String, default: 'Admin' },

  // Reference to the actual account that submitted this post, when known.
  // Null for legacy/admin-authored-directly posts.
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  authorRole: { type: String, enum: ['admin', 'teacher', 'student'], default: 'admin' },

  // Review workflow. Posts created directly by an admin (via the admin
  // panel's existing blog editor) are auto-approved. Posts submitted by a
  // student/teacher through their own dashboard start as 'Pending' and only
  // appear on the public site once an admin approves them.
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Approved' },
  rejectionReason: { type: String },

  image: { type: String }, // URL or filename of cover image
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Blog', blogSchema);
