const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    validate: [validator.isEmail, 'البريد الإلكتروني غير صحيح'],
  },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student',
  },
  joinedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);