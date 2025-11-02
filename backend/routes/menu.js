const express = require('express');
const router = express.Router();
const {
  getMenu,
  getAllCategories,
  getAllProducts,
  addCategory,
  updateCategory,
  deleteCategory,
  addProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/menuController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
// @route   GET /api/menu
// @desc    Menüyü getir (müşteriler için)
// @access  Public
router.get('/', getMenu);

// Admin routes - Kategori yönetimi
// @route   GET /api/menu/categories
// @desc    Tüm kategorileri getir
// @access  Private/Admin
router.get('/categories', protect, adminOnly, getAllCategories);

// @route   POST /api/menu/categories
// @desc    Yeni kategori ekle
// @access  Private/Admin
router.post('/categories', protect, adminOnly, addCategory);

// @route   PUT /api/menu/categories/:id
// @desc    Kategori güncelle
// @access  Private/Admin
router.put('/categories/:id', protect, adminOnly, updateCategory);

// @route   DELETE /api/menu/categories/:id
// @desc    Kategori sil
// @access  Private/Admin
router.delete('/categories/:id', protect, adminOnly, deleteCategory);

// Admin routes - Ürün yönetimi
// @route   GET /api/menu/products
// @desc    Tüm ürünleri getir
// @access  Private/Admin
router.get('/products', protect, adminOnly, getAllProducts);

// @route   POST /api/menu/products
// @desc    Yeni ürün ekle
// @access  Private/Admin
router.post('/products', protect, adminOnly, addProduct);

// @route   PUT /api/menu/products/:id
// @desc    Ürün güncelle
// @access  Private/Admin
router.put('/products/:id', protect, adminOnly, updateProduct);

// @route   DELETE /api/menu/products/:id
// @desc    Ürün sil
// @access  Private/Admin
router.delete('/products/:id', protect, adminOnly, deleteProduct);

module.exports = router;
