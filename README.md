# 🍽️ Restoran Dijital Menü ve Sipariş Yönetim Sistemi

Modern, kullanıcı dostu ve işlevsel bir restoran dijital menü ve sipariş yönetim sistemi. React, Node.js ve Express ile geliştirilmiştir.

## 📋 İçindekiler

- [Özellikler](#özellikler)
- [Teknoloji Yığını](#teknoloji-yığını)
- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [Proje Yapısı](#proje-yapısı)
- [API Dokümantasyonu](#api-dokümantasyonu)
- [Örnek Veriler](#örnek-veriler)

## ✨ Özellikler

### 🎯 Müşteri Tarafı (Menü Sayfası)

- **Modern ve Responsive Tasarım**: Mobil, tablet ve masaüstü cihazlarda mükemmel görünüm
- **Kategorili Menü**: Yemekler kategorilere ayrılmış, kolay gezinme
- **Gelişmiş Arama**: Ürün adı, açıklama ve etiketlere göre arama
- **Filtreleme**: Kategorilere göre hızlı filtreleme
- **Ürün Detayları**:
  - Yüksek kaliteli görseller
  - Fiyat bilgisi
  - Detaylı açıklama
  - Alerjen bilgisi
  - Özel etiketler (Popüler, Yeni, Acı, vb.)

### 👨‍💼 Admin Paneli

#### 🔐 Güvenli Giriş
- JWT tabanlı kimlik doğrulama
- Şifreli kullanıcı yönetimi

#### 📊 Dashboard
- Genel istatistikler (toplam sipariş, yeni siparişler, gelir)
- Son siparişler listesi
- Menüdeki ürün sayısı

#### 📦 Sipariş Yönetimi
- Tüm siparişleri görüntüleme
- Sipariş durumu güncelleme (Yeni → Hazırlanıyor → Hazır → Tamamlandı)
- Sipariş detayları görüntüleme
- Filtreli sipariş görünümü
- Sipariş silme

#### 🍽️ Menü Yönetimi (CRUD)
- **Kategori Yönetimi**: Yeni kategori ekleme, düzenleme, silme, sıralama, aktif/pasif durumu
- **Ürün Yönetimi**: Yeni ürün ekleme, düzenleme, silme, görsel yönetimi, fiyat güncelleme, etiket ve alerjen yönetimi

#### ⚙️ Görünüm Ayarları
- **Restoran Bilgileri**: Ad, slogan, logo, iletişim bilgileri, çalışma saatleri, sosyal medya
- **Tema Ayarları**: Renk paleti ve font yönetimi

#### 📱 QR Kod Oluşturucu
- Menü için QR kod oluşturma ve indirme

## 🛠️ Teknoloji Yığını

### Frontend
- **React 18.2**: Modern UI geliştirme
- **React Router 6**: Sayfa yönlendirme
- **Vite**: Hızlı geliştirme ve build
- **Axios**: HTTP istekleri
- **CSS Modules**: Modüler stil yönetimi

### Backend
- **Node.js**: JavaScript runtime
- **Express 4**: Web framework
- **JWT**: Kimlik doğrulama
- **bcryptjs**: Şifre hashleme
- **QRCode**: QR kod oluşturma
- **CORS**: Cross-origin istekler

### Veri Saklama
- JSON dosyaları (kolayca MongoDB'ye geçilebilir)

## 🚀 Kurulum

### Gereksinimler
- Node.js 16+
- npm veya yarn

### Adım 1: Bağımlılıkları Yükleyin

```bash
# Tüm bağımlılıkları tek seferde yükle
npm run install-all

# Veya manuel olarak
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Adım 2: Uygulamayı Başlatın

```bash
# Development modunda (hem backend hem frontend)
npm run dev

# Veya ayrı ayrı
cd backend && npm run dev
cd frontend && npm run dev
```

### Adım 3: Uygulamaya Erişim

- **Müşteri Menü Sayfası**: http://localhost:3000
- **Admin Paneli**: http://localhost:3000/admin/login
- **Backend API**: http://localhost:5000

## 🔑 Varsayılan Admin Hesabı

```
Kullanıcı Adı: admin
Şifre: admin123
```

## 📁 Proje Yapısı

```
claudeproject/
├── backend/                    # Backend (Node.js + Express)
│   ├── controllers/           # İş mantığı
│   ├── routes/                # API endpoints
│   ├── middleware/            # Middleware'ler
│   ├── data/                  # JSON veri dosyaları
│   ├── .env                   # Ortam değişkenleri
│   └── server.js              # Ana sunucu
│
├── frontend/                   # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/        # React componentleri
│   │   ├── pages/             # Sayfalar
│   │   ├── styles/            # CSS dosyaları
│   │   └── utils/             # API utilities
│   └── vite.config.js
│
└── README.md
```

## 🔌 API Dokümantasyonu

### Authentication
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Kullanıcı bilgilerini getir

### Menu
- `GET /api/menu` - Aktif menüyü getir (Public)
- `GET /api/menu/categories` - Tüm kategoriler (Admin)
- `POST /api/menu/categories` - Kategori ekle (Admin)
- `PUT /api/menu/categories/:id` - Kategori güncelle (Admin)
- `DELETE /api/menu/categories/:id` - Kategori sil (Admin)
- `GET /api/menu/products` - Tüm ürünler (Admin)
- `POST /api/menu/products` - Ürün ekle (Admin)
- `PUT /api/menu/products/:id` - Ürün güncelle (Admin)
- `DELETE /api/menu/products/:id` - Ürün sil (Admin)

### Orders
- `GET /api/orders` - Tüm siparişler (Admin)
- `GET /api/orders/stats` - Sipariş istatistikleri (Admin)
- `POST /api/orders` - Sipariş oluştur (Admin)
- `PUT /api/orders/:id/status` - Sipariş durumu güncelle (Admin)
- `DELETE /api/orders/:id` - Sipariş sil (Admin)

### Settings
- `GET /api/settings` - Ayarları getir (Public)
- `PUT /api/settings/restaurant` - Restoran bilgileri güncelle (Admin)
- `PUT /api/settings/theme` - Tema güncelle (Admin)
- `POST /api/settings/qrcode` - QR kod oluştur (Admin)

## 📊 Örnek Veriler

Proje, aşağıdaki örnek verilerle birlikte gelir:

- **6 Kategori**: Kahvaltılıklar, Köfteler, Ana Yemekler, Salatalar, Tatlılar, İçecekler
- **24 Ürün**: Her kategoriden 3-4 örnek ürün
- **4 Örnek Sipariş**: Farklı durumlarda siparişler

## 🎨 Özelleştirme

### Tema Renklerini Değiştirme
1. Admin paneline giriş yapın
2. "Ayarlar" → "Tema Ayarları" sekmesine gidin
3. Renkleri değiştirin ve kaydedin

### Restoran Bilgilerini Güncelleme
1. Admin paneline giriş yapın
2. "Ayarlar" → "Restoran Bilgileri" sekmesine gidin
3. İstediğiniz bilgileri güncelleyin

## 🔒 Güvenlik

- JWT tabanlı kimlik doğrulama
- Şifreler bcrypt ile hashlenir
- API endpoint'leri role-based authorization ile korunur
- CORS yapılandırması

## 🚀 Production Deployment

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 📝 Gelecek Özellikler

- [ ] MongoDB entegrasyonu
- [ ] Görsel yükleme
- [ ] Müşteri sipariş verme
- [ ] Real-time bildirimler
- [ ] Ödeme entegrasyonu
- [ ] Çoklu dil desteği

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

**Not**: Bu proje eğitim ve demo amaçlıdır. Production ortamında kullanmadan önce güvenlik testlerinden geçirmeniz önerilir.