const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Ensure directories exist
const imgDir = path.join(__dirname, '../uploads/images');
const vidDir = path.join(__dirname, '../uploads/videos');

if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
if (!fs.existsSync(vidDir)) fs.mkdirSync(vidDir, { recursive: true });

// ─── Images: held in memory first, then converted to WebP on disk ───────────
// Every uploaded image (blog covers, gallery photos) is automatically
// converted to WebP — typically 25-35% smaller than JPEG/PNG at the same
// visual quality, which directly speeds up page loads. Also caps the max
// dimension so nobody can accidentally upload a 6000px camera photo that
// tanks page speed.
const imageStorage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Not an image! Please upload an image.'), false);
};

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB (pre-conversion)
});

const MAX_IMAGE_DIMENSION = 1920; // px, longest side
const WEBP_QUALITY = 82; // good visual quality, meaningfully smaller than default

/**
 * Runs after uploadImage.single(fieldName) — converts req.file.buffer to
 * WebP, writes it to disk, and rewrites req.file.filename/path so every
 * existing controller (which just reads req.file.filename) keeps working
 * completely unchanged.
 */
const convertToWebp = async (req, res, next) => {
  if (!req.file) return next(); // no file on this request — nothing to do

  try {
    const filename = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.webp`;
    const outputPath = path.join(imgDir, filename);

    await sharp(req.file.buffer)
      .rotate() // auto-orient based on EXIF, then strip it
      .resize({ width: MAX_IMAGE_DIMENSION, height: MAX_IMAGE_DIMENSION, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);

    req.file.filename = filename;
    req.file.path = outputPath;
    req.file.mimetype = 'image/webp';
    next();
  } catch (error) {
    console.error('⚠️  Image conversion to WebP failed:', error.message);
    next(error);
  }
};

/** Combined middleware: multer parse + WebP conversion, for a given form field name. */
const processImage = (fieldName) => [uploadImage.single(fieldName), convertToWebp];

// ─── Videos: unchanged, straight to disk ─────────────────────────────────────
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, vidDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'))
});

const videoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) cb(null, true);
  else cb(new Error('Not a video! Please upload a video file.'), false);
};

const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

module.exports = { uploadImage, uploadVideo, processImage };
