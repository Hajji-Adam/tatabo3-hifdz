const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');


router.post('/register', protect(['admin']), authController.register);           // Admin can create student/teacher
router.post('/register/admin', protect(['admin']), authController.registerAdmin); // Only admin can create admin

router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;