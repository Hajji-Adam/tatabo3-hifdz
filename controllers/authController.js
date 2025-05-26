const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { secret } = require('../config/jwt');
const ar = require('../utils/ar');
const { bucket } = require('../config/firebase');

// Register Student or Teacher (Admin Only)
exports.register = async (req, res) => {
  const { name, phone, password, role, gender, category } = req.body;

  let photoUrl = null;

  // Upload photo to Firebase if provided
  if (req.file) {
    const fileName = `photos/${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(fileName);

    try {
      await file.save(req.file.buffer, {
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      // Get public URL
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-09-2100', // Set expiration date far into the future
      });
      photoUrl = url;
    } catch (error) {
      console.error('Error uploading to Firebase Storage:', error);
      return res.status(500).json({ success: false, message: ar.serverError });
    }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
      role,
      gender,
      category,
      photo: photoUrl,
    });

    res.status(201).json({ success: true, message: ar.userCreated, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Register Admin (Admin Only)
exports.registerAdmin = async (req, res) => {
  const { name, phone, password, gender } = req.body;

  let photoUrl = null;

  // Upload photo to Firebase if provided
  if (req.file) {
    const fileName = `photos/${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(fileName);

    try {
      await file.save(req.file.buffer, {
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      // Get public URL
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-09-2100', // Set expiration date far into the future
      });
      photoUrl = url;
    } catch (error) {
      console.error('Error uploading to Firebase Storage:', error);
      return res.status(500).json({ success: false, message: ar.serverError });
    }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
      role: 'admin',
      gender,
      photo: photoUrl,
    });

    res.status(201).json({ success: true, message: ar.adminCreated, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Login via Phone
exports.login = async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone }).select('+password');

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

// Logout
exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1,
  });

  res.json({ success: true, message: ar.logoutSuccess });
};