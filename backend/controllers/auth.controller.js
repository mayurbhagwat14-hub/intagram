const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key', {
    expiresIn: '30d',
  });
};

const formatUserResponse = (user) => {
  return {
    _id: user._id,
    username: user.username,
    fullName: user.fullName || user.username,
    email: user.email || '',
    bio: user.bio || '',
    location: user.location || '',
    role: user.role || 'Member 🌟',
    loginCount: user.loginCount || 1,
    lastLogin: user.lastLogin || user.createdAt,
    ipAddress: user.ipAddress || '127.0.0.1 (Local Host)',
    userAgent: user.userAgent || 'Modern Browser Session',
    createdAt: user.createdAt,
  };
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, password, fullName, email, bio, location } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide both username and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const cleanUsername = username.toLowerCase().trim();

    // Check if user already exists
    const userExists = await User.findOne({ username: cleanUsername });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists. Please log in instead.' });
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
    const clientUA = req.headers['user-agent'] || 'Browser Client';

    // Create user with explicit values or empty strings (no hardcoded dummy values)
    const user = await User.create({
      username: cleanUsername,
      password,
      fullName: fullName ? fullName.trim() : username,
      email: email ? email.toLowerCase().trim() : '',
      bio: bio ? bio.trim() : '',
      location: location ? location.trim() : '',
      ipAddress: clientIp,
      userAgent: clientUA,
      loginCount: 1,
      lastLogin: new Date(),
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user - verify existence, update session stats, return user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide both username and password' });
    }

    const cleanUsername = username.toLowerCase().trim();

    // Find user by username
    const user = await User.findOne({ username: cleanUsername });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist. Please sign up first.' });
    }

    // Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password. Please try again.' });
    }

    // Update session statistics
    user.loginCount = (user.loginCount || 0) + 1;
    user.lastLogin = new Date();
    user.ipAddress = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || user.ipAddress || '127.0.0.1';
    user.userAgent = req.headers['user-agent'] || user.userAgent;

    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile (GET API)
// @route   GET /api/auth/me or GET /api/auth/profile
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: formatUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile details (PUT API)
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { fullName, email, bio, location } = req.body;

    if (fullName !== undefined) user.fullName = String(fullName).trim();
    if (email !== undefined) user.email = String(email).trim();
    if (bio !== undefined) user.bio = String(bio).trim();
    if (location !== undefined) user.location = String(location).trim();

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: formatUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe, updateProfile };
