const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  submitBlog,
  getMyBlogs,
  getPendingBlogs,
  approveBlog,
  rejectBlog,
} = require('../controllers/blogController');
const { authenticate, requireRole, protect } = require('../middleware/authMiddleware');
const { processImage } = require('../middleware/upload');

// ─── Specific routes first (must come before /:slug and /:id below) ─────────
router.get('/mine', authenticate, getMyBlogs);
router.get('/pending', protect, getPendingBlogs);
router.post('/submit', authenticate, requireRole('student', 'teacher'), processImage('image'), submitBlog);
router.put('/:id/approve', protect, approveBlog);
router.put('/:id/reject', protect, rejectBlog);

// ─── Admin direct CRUD (existing) ────────────────────────────────────────────
router.route('/')
  .get(getBlogs)
  .post(protect, processImage('image'), createBlog);

router.route('/:slug')
  .get(getBlogBySlug);

router.route('/:id')
  .put(protect, processImage('image'), updateBlog)
  .delete(protect, deleteBlog);

module.exports = router;
