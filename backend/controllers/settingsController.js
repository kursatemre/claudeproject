const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const settingsPath = path.join(__dirname, '../data/settings.json');

// Ayarları getir
exports.getSettings = (req, res) => {
  try {
    const settingsData = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

    // Admin bilgilerini gizle
    delete settingsData.admin;

    res.status(200).json({
      success: true,
      data: settingsData
    });
  } catch (error) {
    console.error('GetSettings error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Restoran bilgilerini güncelle
exports.updateRestaurantInfo = (req, res) => {
  try {
    const { name, slogan, logo, description, address, phone, email, workingHours, socialMedia } = req.body;

    const settingsData = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

    // Güncelle
    if (name !== undefined) settingsData.restaurant.name = name;
    if (slogan !== undefined) settingsData.restaurant.slogan = slogan;
    if (logo !== undefined) settingsData.restaurant.logo = logo;
    if (description !== undefined) settingsData.restaurant.description = description;
    if (address !== undefined) settingsData.restaurant.address = address;
    if (phone !== undefined) settingsData.restaurant.phone = phone;
    if (email !== undefined) settingsData.restaurant.email = email;
    if (workingHours !== undefined) settingsData.restaurant.workingHours = workingHours;
    if (socialMedia !== undefined) settingsData.restaurant.socialMedia = socialMedia;

    fs.writeFileSync(settingsPath, JSON.stringify(settingsData, null, 2));

    res.status(200).json({
      success: true,
      message: 'Restoran bilgileri güncellendi',
      data: settingsData.restaurant
    });
  } catch (error) {
    console.error('UpdateRestaurantInfo error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Tema ayarlarını güncelle
exports.updateTheme = (req, res) => {
  try {
    const { primaryColor, secondaryColor, accentColor, backgroundColor, textColor, fontFamily } = req.body;

    const settingsData = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

    // Güncelle
    if (primaryColor !== undefined) settingsData.theme.primaryColor = primaryColor;
    if (secondaryColor !== undefined) settingsData.theme.secondaryColor = secondaryColor;
    if (accentColor !== undefined) settingsData.theme.accentColor = accentColor;
    if (backgroundColor !== undefined) settingsData.theme.backgroundColor = backgroundColor;
    if (textColor !== undefined) settingsData.theme.textColor = textColor;
    if (fontFamily !== undefined) settingsData.theme.fontFamily = fontFamily;

    fs.writeFileSync(settingsPath, JSON.stringify(settingsData, null, 2));

    res.status(200).json({
      success: true,
      message: 'Tema ayarları güncellendi',
      data: settingsData.theme
    });
  } catch (error) {
    console.error('UpdateTheme error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// QR kod oluştur
exports.generateQRCode = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL gereklidir'
      });
    }

    // QR kod oluştur
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.status(200).json({
      success: true,
      data: {
        qrCode: qrCodeDataUrl,
        url: url
      }
    });
  } catch (error) {
    console.error('GenerateQRCode error:', error);
    res.status(500).json({
      success: false,
      message: 'QR kod oluşturulamadı'
    });
  }
};
