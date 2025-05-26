const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student',
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  category: {
    type: String,
    enum: ['grand', 'middle', 'small'],
    default: 'small',
  },
  photo: {
    type: String,
    default: null,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);