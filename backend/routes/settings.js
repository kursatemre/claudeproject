const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateRestaurantInfo,
  updateTheme,
  generateQRCode
} = require('../controllers/settingsController');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/settings
// @desc    Ayarları getir
// @access  Public
router.get('/', getSettings);

// @route   PUT /api/settings/restaurant
// @desc    Restoran bilgilerini güncelle
// @access  Private/Admin
router.put('/restaurant', protect, adminOnly, updateRestaurantInfo);

// @route   PUT /api/settings/theme
// @desc    Tema ayarlarını güncelle
// @access  Private/Admin
router.put('/theme', protect, adminOnly, updateTheme);

// @route   POST /api/settings/qrcode
// @desc    QR kod oluştur
// @access  Private/Admin
router.post('/qrcode', protect, adminOnly, generateQRCode);

module.exports = router;
