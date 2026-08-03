const mongoose = require('mongoose');

const admissionFormSchema = new mongoose.Schema({
  name: { type: String, required: true },
  father_name: { type: String, required: true },
  phone: { type: String, required: true },
  course: { type: String, required: true },
  program: { type: String, required: true },
  email: { type: String }, // Optional
  location: { type: String }, // Optional
  status: { type: String, enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdmissionForm', admissionFormSchema);
