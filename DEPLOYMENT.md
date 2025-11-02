# 🚀 Deployment Rehberi

Bu proje hem **frontend** (React) hem **backend** (Node.js + Express) içerdiği için ayrı ayrı deploy edilmelidir.

## 📦 Deployment Stratejisi

- **Frontend**: Vercel (veya Netlify)
- **Backend**: Render, Railway veya Heroku

---

## 1️⃣ Backend Deployment (Render.com - ÖNERİLEN)

### Adım 1: Render.com'a Kaydol
1. https://render.com adresine git
2. GitHub hesabınla giriş yap

### Adım 2: Yeni Web Service Oluştur
1. Dashboard'da "New +" butonuna tıkla
2. "Web Service" seç
3. GitHub repository'ni bağla (`kursatemre/claudeproject`)
4. Aşağıdaki ayarları yap:

**Service Detayları:**
- **Name**: `claudeproject-backend` (veya istediğin isim)
- **Region**: Frankfurt (veya size en yakın)
- **Branch**: `claude/restaurant-digital-menu-011CUjCuW2bphR1eHs6rVWd2`
- **Root Directory**: `backend`
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Environment Variables:**
```
NODE_ENV=production
PORT=5000
JWT_SECRET=restoran_dijital_menu_super_secret_key_2025_PRODUCTION
JWT_EXPIRE=7d
```

### Adım 3: Deploy Et
1. "Create Web Service" butonuna tıkla
2. Deploy işlemi 2-3 dakika sürer
3. Deploy tamamlandığında URL'i kopyala (örn: `https://claudeproject-backend.onrender.com`)

---

## 2️⃣ Frontend Deployment (Vercel)

### Adım 1: Vercel Environment Variable Ayarla

Vercel dashboard'da projenin ayarlarına git:
1. **Settings** → **Environment Variables**
2. Yeni variable ekle:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://claudeproject-backend.onrender.com/api` (Render'dan aldığın URL + /api)
   - **Environments**: Production, Preview, Development (hepsini seç)

### Adım 2: Vercel.json Kontrolü

`vercel.json` dosyası zaten eklendi. Kontrol et:

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install"
}
```

### Adım 3: Deploy Et

**Otomatik Deploy (Önerilen):**
```bash
git add .
git commit -m "fix: Add Vercel configuration and environment variables"
git push origin claude/restaurant-digital-menu-011CUjCuW2bphR1eHs6rVWd2
```

Vercel otomatik olarak yeni commit'i algılayacak ve deploy edecek.

**Manuel Deploy:**
```bash
# Vercel CLI kur
npm i -g vercel

# Deploy et
vercel --prod
```

---

## 3️⃣ Backend Deployment Alternatifleri

### Railway.app

1. https://railway.app adresine git
2. "Start a New Project" → "Deploy from GitHub repo"
3. Repository seç: `kursatemre/claudeproject`
4. **Settings** → **Service**:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
5. **Variables** sekmesinde environment variable'ları ekle
6. Deploy et

### Heroku

```bash
# Heroku CLI kur
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Yeni app oluştur
heroku create claudeproject-backend

# Environment variables ayarla
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=restoran_dijital_menu_super_secret_key_2025_PRODUCTION
heroku config:set JWT_EXPIRE=7d

# Sadece backend klasörünü deploy et
git subtree push --prefix backend heroku main
```

---

## 4️⃣ CORS Ayarları (Backend)

Backend'de CORS ayarlarını production URL'ine göre güncelle:

`backend/server.js` dosyasında:

```javascript
const cors = require('cors');

// CORS ayarları
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://claudeproject-opal.vercel.app',  // Vercel URL'ini buraya ekle
    'https://your-custom-domain.com'          // Özel domain varsa
  ],
  credentials: true
}));
```

---

## 5️⃣ Deployment Checklist

### Backend
- [ ] Render/Railway/Heroku'ya deploy edildi
- [ ] Environment variables ayarlandı
- [ ] Backend URL'i test edildi (`https://your-backend-url.com/api/health`)
- [ ] CORS ayarları güncellendi

### Frontend
- [ ] Vercel'de `VITE_API_URL` environment variable ayarlandı
- [ ] `vercel.json` dosyası commit edildi
- [ ] Deploy edildi
- [ ] Frontend URL'i test edildi
- [ ] Admin paneline giriş yapılabildi

---

## 6️⃣ Test Etme

### Backend Test:
```bash
curl https://your-backend-url.com/api/health
```

Beklenen yanıt:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-02T..."
}
```

### Frontend Test:
1. Frontend URL'ini tarayıcıda aç
2. Menü sayfasının yüklendiğini kontrol et
3. `/admin/login` sayfasına git
4. `admin` / `admin123` ile giriş yap
5. Dashboard'un yüklendiğini ve istatistiklerin göründüğünü kontrol et

---

## 7️⃣ Sorun Giderme

### Vercel 404 Hatası
- `vercel.json` dosyasının doğru olduğundan emin ol
- Vercel dashboard'da build loglarını kontrol et
- `outputDirectory` ayarının doğru olduğunu kontrol et

### CORS Hatası
- Backend'de Vercel URL'inin CORS whitelist'e eklendiğinden emin ol
- Frontend'de `VITE_API_URL` environment variable'ının doğru olduğunu kontrol et

### API Bağlantı Hatası
- Browser console'da network tab'ını kontrol et
- Backend URL'inin doğru olduğunu kontrol et
- Backend'in çalıştığını kontrol et (`/api/health` endpoint'i)

### Build Hatası
- Vercel loglarını kontrol et
- `npm install` ve `npm run build` komutlarını local'de test et
- `package.json` dosyalarının doğru olduğunu kontrol et

---

## 8️⃣ Production Önerileri

### Güvenlik
- [ ] JWT_SECRET'i production ortamı için değiştir (uzun ve rastgele)
- [ ] Admin şifresini değiştir (`admin123` yerine güçlü şifre)
- [ ] HTTPS kullan (Render ve Vercel otomatik sağlar)
- [ ] Rate limiting ekle (Express rate limit)
- [ ] Environment variables'ları güvenli tut

### Performans
- [ ] Backend için caching ekle (Redis)
- [ ] MongoDB'ye geç (JSON dosyaları yerine)
- [ ] CDN kullan (görseller için)
- [ ] Compression middleware ekle

### Monitoring
- [ ] Error tracking ekle (Sentry)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Analytics ekle (Google Analytics, Plausible)

---

## 📞 Destek

Deployment sırasında sorun yaşarsan:
1. Vercel/Render loglarını kontrol et
2. Browser console'u kontrol et
3. GitHub Issues'da destek iste

---

**Önemli Not**: Backend deploy edilmeden frontend düzgün çalışmayacaktır. Önce backend'i deploy et, sonra frontend'i!
