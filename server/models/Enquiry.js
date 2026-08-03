const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  father_name: { type: String, required: true },
  phone: { type: String, required: true },
  course: { type: String, required: true },
  program: { type: String, required: true },
  email: { type: String }, // Optional
  location: { type: String },
  source: { type: String, default: 'General Contact' }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enquiry', enquirySchema);
