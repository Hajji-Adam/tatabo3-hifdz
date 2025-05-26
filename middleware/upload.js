const multer = require('multer');
const path = require('path');

// Configure Multer to store images in memory (temporary storage)
const storage = multer.memoryStorage();

// Set up Multer with validation for image files
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(new Error('Only image files are allowed!'));
  }
});

module.exports = upload;