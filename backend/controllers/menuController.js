const fs = require('fs');
const path = require('path');

const menuPath = path.join(__dirname, '../data/menu.json');

// Tüm kategorileri ve ürünleri getir
exports.getMenu = (req, res) => {
  try {
    const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf8'));

    // Sadece aktif kategoriler ve ürünleri döndür (müşteri için)
    const activeCategories = menuData.categories.filter(cat => cat.active);
    const activeProducts = menuData.products.filter(prod => prod.active);

    res.status(200).json({
      success: true,
      data: {
        categories: activeCategories,
        products: activeProducts
      }
    });
  } catch (error) {
    console.error('GetMenu error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Admin için tüm kategorileri getir
exports.getAllCategories = (req, res) => {
  try {
    const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf8'));

    res.status(200).json({
      success: true,
      data: menuData.categories
    });
  } catch (error) {
    console.error('GetAllCategories error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Admin için tüm ürünleri getir
exports.getAllProducts = (req, res) => {
  try {
    const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf8'));

    res.status(200).json({
      success: true,
      data: menuData.products
    });
  } catch (error) {
    console.error('GetAllProducts error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Yeni kategori ekle
exports.addCategory = (req, res) => {
  try {
    const { name, description, order } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Kategori adı gereklidir'
      });
    }

    const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf8'));

    // Yeni ID oluştur
    const newId = 'cat_' + (menuData.categories.length + 1);

    const newCategory = {
      id: newId,
      name,
      description: description || '',
      order: order || menuData.categories.length + 1,
      active: true
    };

    menuData.categories.push(newCategory);
    fs.writeFileSync(menuPath, JSON.stringify(menuData, null, 2));

    res.status(201).json({
      success: true,
      message: 'Kategori başarıyla eklendi',
      data: newCategory
    });
  } catch (error) {
    console.error('AddCategory error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Kategori güncelle
exports.updateCategory = (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, order, active } = req.body;

    const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf8'));
    const categoryIndex = menuData.categories.findIndex(cat => cat.id === id);

    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Kategori bulunamadı'
      });
    }

    // Güncelle
    if (name !== undefined) menuData.categories[categoryIndex].name = name;
    if (description !== undefined) menuData.categories[categoryIndex].description = description;
    if (order !== undefined) menuData.categories[categoryIndex].order = order;
    if (active !== undefined) menuData.categories[categoryIndex].active = active;

    fs.writeFileSync(menuPath, JSON.stringify(menuData, null, 2));

    res.status(200).json({
      success: true,
      message: 'Kategori başarıyla güncellendi',
      data: menuData.categories[categoryIndex]
    });
  } catch (error) {
    console.error('UpdateCategory error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Kategori sil
exports.deleteCategory = (req, res) => {
  try {
    const { id } = req.params;

    const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf8'));
    const categoryIndex = menuData.categories.findIndex(cat => cat.id === id);

    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Kategori bulunamadı'
      });
    }

    // Kategoriye ait ürünleri kontrol et
    const hasProducts = menuData.products.some(prod => prod.categoryId === id);
    if (hasProducts) {
      return res.status(400).json({
        success: false,
        message: 'Bu kategoriye ait ürünler var. Önce ürünleri silin.'
      });
    }

    menuData.categories.splice(categoryIndex, 1);
    fs.writeFileSync(menuPath, JSON.stringify(menuData, null, 2));

    res.status(200).json({
      success: true,
      message: 'Kategori başarıyla silindi'
    });
  } catch (error) {
    console.error('DeleteCategory error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Yeni ürün ekle
exports.addProduct = (req, res) => {
  try {
    const { categoryId, name, description, price, image, tags, allergens } = req.body;

    if (!categoryId || !name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Kategori, ürün adı ve fiyat gereklidir'
      });
    }

    const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf8'));

    // Kategori kontrolü
    const categoryExists = menuData.categories.some(cat => cat.id === categoryId);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz kategori'
      });
    }

    // Yeni ID oluştur
    const newId = 'prod_' + (menuData.products.length + 1);

    const newProduct = {
      id: newId,
      categoryId,
      name,
      description: description || '',
      price: parseFloat(price),
      image: image || '/images/default-product.jpg',
      active: true,
      tags: tags || [],
      allergens: allergens || []
    };

    menuData.products.push(newProduct);
    fs.writeFileSync(menuPath, JSON.stringify(menuData, null, 2));

    res.status(201).json({
      success: true,
      message: 'Ürün başarıyla eklendi',
      data: newProduct
    });
  } catch (error) {
    console.error('AddProduct error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Ürün güncelle
exports.updateProduct = (req, res) => {
  try {
    const { id } = req.params;
    const { categoryId, name, description, price, image, active, tags, allergens } = req.body;

    const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf8'));
    const productIndex = menuData.products.findIndex(prod => prod.id === id);

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
    }

    // Güncelle
    if (categoryId !== undefined) menuData.products[productIndex].categoryId = categoryId;
    if (name !== undefined) menuData.products[productIndex].name = name;
    if (description !== undefined) menuData.products[productIndex].description = description;
    if (price !== undefined) menuData.products[productIndex].price = parseFloat(price);
    if (image !== undefined) menuData.products[productIndex].image = image;
    if (active !== undefined) menuData.products[productIndex].active = active;
    if (tags !== undefined) menuData.products[productIndex].tags = tags;
    if (allergens !== undefined) menuData.products[productIndex].allergens = allergens;

    fs.writeFileSync(menuPath, JSON.stringify(menuData, null, 2));

    res.status(200).json({
      success: true,
      message: 'Ürün başarıyla güncellendi',
      data: menuData.products[productIndex]
    });
  } catch (error) {
    console.error('UpdateProduct error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Ürün sil
exports.deleteProduct = (req, res) => {
  try {
    const { id } = req.params;

    const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf8'));
    const productIndex = menuData.products.findIndex(prod => prod.id === id);

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
    }

    menuData.products.splice(productIndex, 1);
    fs.writeFileSync(menuPath, JSON.stringify(menuData, null, 2));

    res.status(200).json({
      success: true,
      message: 'Ürün başarıyla silindi'
    });
  } catch (error) {
    console.error('DeleteProduct error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};
