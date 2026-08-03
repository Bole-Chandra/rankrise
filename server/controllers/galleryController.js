const GalleryItem = require('../models/GalleryItem');
const fs = require('fs');
const path = require('path');

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = async (req, res, next) => {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a gallery item
// @route   POST /api/gallery
// @access  Private
const createGalleryItem = async (req, res, next) => {
  try {
    const { title, category } = req.body;
    let { image } = req.body;

    if (req.file) {
      image = `/uploads/images/${req.file.filename}`;
    }

    if (!title || !image) {
      res.status(400);
      throw new Error('Title and Image are required');
    }

    const item = await GalleryItem.create({
      title,
      image,
      category
    });

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a gallery item
// @route   DELETE /api/gallery/:id
// @access  Private
const deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Gallery item not found');
    }

    // Delete physical file if it exists
    if (item.image && item.image.startsWith('/uploads/images/')) {
      const filePath = path.join(__dirname, '..', item.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await item.deleteOne();
    res.json({ message: 'Gallery item removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a gallery item (title/category, and optionally replace the image)
// @route   PUT /api/gallery/:id
// @access  Private
const updateGalleryItem = async (req, res, next) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) { res.status(404); throw new Error('Gallery item not found'); }
    const { title, category } = req.body;

    if (req.file) {
      // Replacing the image — delete the old file from disk first.
      if (item.image && item.image.startsWith('/uploads/images/')) {
        const oldFilePath = path.join(__dirname, '..', item.image);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }
      item.image = `/uploads/images/${req.file.filename}`;
    }

    if (title) item.title = title;
    if (category) item.category = category;
    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
};
