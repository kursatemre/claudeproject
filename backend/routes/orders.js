const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStats
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/orders
// @desc    Tüm siparişleri getir
// @access  Private/Admin
router.get('/', protect, adminOnly, getAllOrders);

// @route   GET /api/orders/stats
// @desc    Sipariş istatistiklerini getir
// @access  Private/Admin
router.get('/stats', protect, adminOnly, getOrderStats);

// @route   GET /api/orders/:id
// @desc    Tek sipariş getir
// @access  Private/Admin
router.get('/:id', protect, adminOnly, getOrder);

// @route   POST /api/orders
// @desc    Yeni sipariş oluştur
// @access  Private/Admin
router.post('/', protect, adminOnly, createOrder);

// @route   PUT /api/orders/:id/status
// @desc    Sipariş durumunu güncelle
// @access  Private/Admin
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

// @route   DELETE /api/orders/:id
// @desc    Sipariş sil
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, deleteOrder);

module.exports = router;
