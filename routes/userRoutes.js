// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

router.route('/')
  .get(protect(['admin']), getAllUsers); // Admin can get all users

router.route('/:id')
  .get(protect(['admin']), getUserById)   // Admin can view any user
  .put(protect(['admin']), updateUser)   // Admin can update any user
  .delete(protect(['admin']), deleteUser); // Admin can delete any user

module.exports = router;