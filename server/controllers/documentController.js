const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');

const SECTION_KEYS = ['exam-pattern', 'syllabus'];

// @desc    Get documents, optionally filtered by course & section
// @route   GET /api/documents?course=iit-jee&section=exam-pattern
// @access  Public
const getDocuments = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.course) query.course = req.query.course;
    if (req.query.section) query.section = req.query.section;
    const docs = await Document.find(query).sort({ createdAt: -1 });
    res.json(docs);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a document
// @route   POST /api/documents
// @access  Private
const createDocument = async (req, res, next) => {
  try {
    const { course, section, title } = req.body;

    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a PDF or Word (.doc / .docx) file');
    }

    if (!course) {
      res.status(400);
      throw new Error('Course is required');
    }

    if (!SECTION_KEYS.includes(section)) {
      res.status(400);
      throw new Error('Section must be one of: exam-pattern, syllabus');
    }

    if (!title) {
      res.status(400);
      throw new Error('Title is required');
    }

    const doc = await Document.create({
      course,
      section,
      title,
      file: `/uploads/documents/${req.file.filename}`,
      fileType: req.file.mimetype,
      fileSize: req.file.size
    });

    res.status(201).json(doc);
  } catch (error) {
    // Don't leave an orphaned file on the disk if the DB write fails.
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Update a document (title, optionally replace the file)
// @route   PUT /api/documents/:id
// @access  Private
const updateDocument = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      res.status(404);
      throw new Error('Document not found');
    }

    if (req.file) {
      // Replacing the file — delete the old one from disk first.
      if (doc.file && doc.file.startsWith('/uploads/documents/')) {
        const oldFilePath = path.join(__dirname, '..', doc.file);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }
      doc.file = `/uploads/documents/${req.file.filename}`;
      doc.fileType = req.file.mimetype;
      doc.fileSize = req.file.size;
    }

    if (req.body.title) doc.title = req.body.title;
    const updated = await doc.save();
    res.json(updated);
  } catch (error) {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      res.status(404);
      throw new Error('Document not found');
    }

    if (doc.file && doc.file.startsWith('/uploads/documents/')) {
      const filePath = path.join(__dirname, '..', doc.file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await doc.deleteOne();
    res.json({ message: 'Document removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument
};