const VideoItem = require('../models/VideoItem');
const fs = require('fs');
const path = require('path');

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
const getVideos = async (req, res, next) => {
  try {
    const videos = await VideoItem.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a video
// @route   POST /api/videos
// @access  Private
const createVideo = async (req, res, next) => {
  try {
    const { title, type, category, videoUrl, thumbnail } = req.body;

    if (!title) {
      res.status(400);
      throw new Error('Title is required');
    }

    let finalVideoUrl = videoUrl;
    let finalType = type || 'upload';

    // If file uploaded via multer
    if (req.file) {
      finalVideoUrl = `/uploads/videos/${req.file.filename}`;
      finalType = 'upload';
    } else if (type === 'upload' && !videoUrl) {
      res.status(400);
      throw new Error('Video file or URL is required');
    }

    const video = await VideoItem.create({
      title,
      type: finalType,
      category,
      videoUrl: finalVideoUrl,
      thumbnail
    });

    res.status(201).json(video);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a video
// @route   DELETE /api/videos/:id
// @access  Private
const deleteVideo = async (req, res, next) => {
  try {
    const video = await VideoItem.findById(req.params.id);
    if (!video) {
      res.status(404);
      throw new Error('Video not found');
    }

    // Delete physical file if it exists
    if (video.type === 'upload' && video.videoUrl.startsWith('/uploads/videos/')) {
      const filePath = path.join(__dirname, '..', video.videoUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await video.deleteOne();
    res.json({ message: 'Video removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVideos,
  createVideo,
  deleteVideo
};
