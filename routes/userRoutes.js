const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

router.route('/')
  .get(protect(['admin']), getAllUsers)
  .post(protect(['admin']), createUser);

router.route('/:id')
  .get(protect(['admin']), getUserById)
  .put(protect(['admin']), updateUser)
  .delete(protect(['admin']), deleteUser);

module.exports = router;