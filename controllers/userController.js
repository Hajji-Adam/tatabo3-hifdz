const User = require('../models/User');
const ar = require('../utils/ar');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, message: ar.usersFetched, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: ar.serverError });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: ar.userNotFound });
    }
    res.json({ success: true, message: ar.usersFetched, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: ar.serverError });
  }
};

exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Only admin can create users
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: ar.forbidden });
  }

  try {
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ success: true, message: ar.userCreated, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: ar.userNotFound });
    }

    res.json({ success: true, message: ar.userUpdated, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: ar.userNotFound });
    }

    res.json({ success: true, message: ar.userDeleted });
  } catch (err) {
    res.status(500).json({ success: false, message: ar.serverError });
  }
};