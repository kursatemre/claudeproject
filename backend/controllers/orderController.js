const fs = require('fs');
const path = require('path');

const ordersPath = path.join(__dirname, '../data/orders.json');

// Tüm siparişleri getir
exports.getAllOrders = (req, res) => {
  try {
    const ordersData = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));

    res.status(200).json({
      success: true,
      data: ordersData.orders
    });
  } catch (error) {
    console.error('GetAllOrders error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Tek sipariş getir
exports.getOrder = (req, res) => {
  try {
    const { id } = req.params;
    const ordersData = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
    const order = ordersData.orders.find(o => o.id === id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('GetOrder error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Yeni sipariş oluştur
exports.createOrder = (req, res) => {
  try {
    const { tableNumber, customerName, items, notes } = req.body;

    if (!tableNumber || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Masa numarası ve ürünler gereklidir'
      });
    }

    const ordersData = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));

    // Toplam fiyatı hesapla
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Yeni sipariş oluştur
    const newOrder = {
      id: 'order_' + ordersData.nextOrderId,
      tableNumber,
      customerName: customerName || 'Müşteri',
      items,
      totalPrice,
      status: 'Yeni',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: notes || ''
    };

    ordersData.orders.push(newOrder);
    ordersData.nextOrderId += 1;

    fs.writeFileSync(ordersPath, JSON.stringify(ordersData, null, 2));

    res.status(201).json({
      success: true,
      message: 'Sipariş başarıyla oluşturuldu',
      data: newOrder
    });
  } catch (error) {
    console.error('CreateOrder error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Sipariş durumunu güncelle
exports.updateOrderStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Yeni', 'Hazırlanıyor', 'Hazır', 'Tamamlandı', 'İptal'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz durum. Geçerli durumlar: ' + validStatuses.join(', ')
      });
    }

    const ordersData = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
    const orderIndex = ordersData.orders.findIndex(o => o.id === id);

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      });
    }

    ordersData.orders[orderIndex].status = status;
    ordersData.orders[orderIndex].updatedAt = new Date().toISOString();

    fs.writeFileSync(ordersPath, JSON.stringify(ordersData, null, 2));

    res.status(200).json({
      success: true,
      message: 'Sipariş durumu güncellendi',
      data: ordersData.orders[orderIndex]
    });
  } catch (error) {
    console.error('UpdateOrderStatus error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Siparişi sil
exports.deleteOrder = (req, res) => {
  try {
    const { id } = req.params;

    const ordersData = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
    const orderIndex = ordersData.orders.findIndex(o => o.id === id);

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      });
    }

    ordersData.orders.splice(orderIndex, 1);
    fs.writeFileSync(ordersPath, JSON.stringify(ordersData, null, 2));

    res.status(200).json({
      success: true,
      message: 'Sipariş başarıyla silindi'
    });
  } catch (error) {
    console.error('DeleteOrder error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Sipariş istatistikleri
exports.getOrderStats = (req, res) => {
  try {
    const ordersData = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));

    const stats = {
      total: ordersData.orders.length,
      new: ordersData.orders.filter(o => o.status === 'Yeni').length,
      preparing: ordersData.orders.filter(o => o.status === 'Hazırlanıyor').length,
      ready: ordersData.orders.filter(o => o.status === 'Hazır').length,
      completed: ordersData.orders.filter(o => o.status === 'Tamamlandı').length,
      totalRevenue: ordersData.orders
        .filter(o => o.status === 'Tamamlandı')
        .reduce((sum, order) => sum + order.totalPrice, 0)
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('GetOrderStats error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};
