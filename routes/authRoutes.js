const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); 

router.post('/register', protect(['admin']), upload.single('photo'), authController.register); // Only admin can create admin
router.post('/register/admin', protect(['admin']), upload.single('photo'), authController.registerAdmin); // Admin can create student/teacher

router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;



