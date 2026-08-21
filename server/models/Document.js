const mongoose = require('mongoose');

// Documents uploaded by the admin for each course: exam pattern, syllabus.
// `course` uses the same key as the client route (e.g. 'iit-jee', 'mpc-iit').
const documentSchema = new mongoose.Schema({
  course: { type: String, required: true },
  section: {
    type: String,
    enum: ['exam-pattern', 'syllabus'],
    required: true
  },
  title: { type: String, required: true },
  file: { type: String, required: true }, // /uploads/documents/<filename>
  fileType: { type: String, default: '' }, // application/pdf, etc.
  fileSize: { type: Number, default: 0 }, // bytes
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);