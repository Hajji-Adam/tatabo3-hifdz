const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { secret } = require('../config/jwt');
const ar = require('../utils/ar');

// Any admin can create student or teacher
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: ar.forbidden });
  }

  const allowedRoles = ['student', 'teacher'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ success: false, message: ar.roleNotAllowed });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json({ success: true, message: ar.userCreated, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Only admin can create another admin
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: ar.forbidden });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    res.status(201).json({ success: true, message: ar.adminCreated, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Login existing user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ success: false, message: ar.invalidCredentials });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, secret, {
    expiresIn: '1d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    message: ar.loginSuccess,
    token,
    role: user.role,
  });
};

// Logout user
exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1,
  });

  res.json({ success: true, message: ar.logoutSuccess });
};