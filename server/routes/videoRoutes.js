const express = require('express');
const router = express.Router();
const { getVideos, createVideo, deleteVideo } = require('../controllers/videoController');
const { protect } = require('../middleware/authMiddleware');
const { uploadVideo } = require('../middleware/upload');

router.route('/')
  .get(getVideos)
  .post(protect, uploadVideo.single('video'), createVideo);

router.route('/:id')
  .delete(protect, deleteVideo);

module.exports = router;
