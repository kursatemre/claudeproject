const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// @route   POST /api/auth/login
// @desc    Kullanıcı girişi
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Giriş yapan kullanıcının bilgilerini getir
// @access  Private
router.get('/me', protect, getMe);

module.exports = router;
