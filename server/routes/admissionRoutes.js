const express = require('express');
const router = express.Router();
const { submitAdmission, getAdmissions, updateAdmissionStatus, deleteAdmission } = require('../controllers/admissionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(submitAdmission)
  .get(protect, getAdmissions);

router.route('/:id')
  .put(protect, updateAdmissionStatus)
  .delete(protect, deleteAdmission);

module.exports = router;
