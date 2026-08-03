const Blog = require('../models/Blog');
const fs = require('fs');
const path = require('path');

// @desc    Get all PUBLIC (approved) blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res, next) => {
  try {
    // $or here also covers blogs created before the `status` field existed —
    // those documents have no status stored at all, and should still be
    // treated as published rather than disappearing from the public site.
    const blogs = await Blog.find({
      $or: [{ status: 'Approved' }, { status: { $exists: false } }],
    }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog by slug (public — only if approved)
// @route   GET /api/blogs/:slug
// @access  Public
const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog || (blog.status && blog.status !== 'Approved')) {
      res.status(404);
      throw new Error('Blog post not found');
    }
    res.json(blog);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a blog post directly (Admin only — auto-approved)
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = async (req, res, next) => {
  try {
    const { title, slug, content, summary, author, tags } = req.body;
    let { image } = req.body;

    if (req.file) {
      image = `/uploads/images/${req.file.filename}`;
    }

    if (!title || !slug || !content) {
      res.status(400);
      throw new Error('Title, slug, and content are required');
    }

    const slugExists = await Blog.findOne({ slug });
    if (slugExists) {
      res.status(400);
      throw new Error('Blog slug already exists');
    }

    const blog = await Blog.create({
      title,
      slug,
      content,
      summary,
      author,
      image,
      tags,
      authorRole: 'admin',
      status: 'Approved',
    });

    res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog post (Admin only)
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404);
      throw new Error('Blog not found');
    }

    const { title, slug, content, summary, author, tags } = req.body;
    let { image } = req.body;

    if (req.file) {
      if (blog.image && blog.image.startsWith('/uploads/images/')) {
        const oldFilePath = path.join(__dirname, '..', blog.image);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }
      image = `/uploads/images/${req.file.filename}`;
    }

    blog.title = title || blog.title;
    blog.slug = slug || blog.slug;
    blog.content = content || blog.content;
    blog.summary = summary !== undefined ? summary : blog.summary;
    blog.author = author || blog.author;
    blog.image = image || blog.image;
    blog.tags = tags || blog.tags;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog post (Admin only)
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404);
      throw new Error('Blog not found');
    }

    if (blog.image && blog.image.startsWith('/uploads/images/')) {
      const filePath = path.join(__dirname, '..', blog.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await blog.deleteOne();
    res.json({ message: 'Blog removed successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── Student / Teacher submission workflow ───────────────────────────────────

// @desc    Submit a blog post for review (Student/Teacher)
// @route   POST /api/blogs/submit
// @access  Private (student, teacher)
const submitBlog = async (req, res, next) => {
  try {
    const { title, slug, content, summary, tags } = req.body;
    let { image } = req.body;

    if (req.file) {
      image = `/uploads/images/${req.file.filename}`;
    }

    if (!title || !slug || !content) {
      res.status(400);
      throw new Error('Title, slug, and content are required');
    }

    const slugExists = await Blog.findOne({ slug });
    if (slugExists) {
      res.status(400);
      throw new Error('That slug is already taken — please choose a different title/slug');
    }

    const blog = await Blog.create({
      title,
      slug,
      content,
      summary,
      tags,
      image,
      author: req.user.name,
      authorId: req.user._id,
      authorRole: req.user.role,
      status: 'Pending',
    });

    res.status(201).json({
      message: 'Your article has been submitted and is awaiting admin review.',
      blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get the logged-in user's own blog submissions (any status)
// @route   GET /api/blogs/mine
// @access  Private (any authenticated user)
const getMyBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ authorId: req.user._id }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pending blog submissions (Admin review queue)
// @route   GET /api/blogs/pending
// @access  Private/Admin
const getPendingBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ status: 'Pending' })
      .populate('authorId', 'name email role')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a pending blog submission
// @route   PUT /api/blogs/:id/approve
// @access  Private/Admin
const approveBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404);
      throw new Error('Blog not found');
    }
    blog.status = 'Approved';
    blog.rejectionReason = undefined;
    await blog.save();
    res.json(blog);
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a pending blog submission
// @route   PUT /api/blogs/:id/reject
// @access  Private/Admin
const rejectBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404);
      throw new Error('Blog not found');
    }
    blog.status = 'Rejected';
    blog.rejectionReason = req.body.reason || '';
    await blog.save();
    res.json(blog);
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
