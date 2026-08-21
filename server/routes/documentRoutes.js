const express = require('express');
const router = express.Router();
const {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const { uploadDocument } = require('../middleware/upload');

router.get('/', getDocuments);
router.post('/', protect, uploadDocument.single('file'), createDocument);

router.put('/:id', protect, uploadDocument.single('file'), updateDocument);
router.delete('/:id', protect, deleteDocument);

module.exports = router;