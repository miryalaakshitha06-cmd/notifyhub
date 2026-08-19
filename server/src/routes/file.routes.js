import express from 'express';
import multer from 'multer';

const router = express.Router();
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// POST /api/files/upload - Handle file upload and return Base64 representation
router.post('/upload', upload.single('attachment'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const base64Data = req.file.buffer.toString('base64');
    return res.json({
      success: true,
      file: {
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
        data: `data:${req.file.mimetype};base64,${base64Data}`,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'File upload processing failed' });
  }
});

export default router;
