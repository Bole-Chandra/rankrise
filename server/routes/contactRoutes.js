const express = require('express');
const router = express.Router();
const { submitEnquiry, getEnquiries, deleteEnquiry } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(submitEnquiry)
  .get(protect, getEnquiries);

router.route('/:id')
  .delete(protect, deleteEnquiry);

module.exports = router;
