const express = require('express');
const router = express.Router();
const { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');
const { processImage } = require('../middleware/upload');

router.route('/')
  .get(getGalleryItems)
  .post(protect, processImage('image'), createGalleryItem);

router.route('/:id')
  .put(protect, processImage('image'), updateGalleryItem)
  .delete(protect, deleteGalleryItem);

module.exports = router;
