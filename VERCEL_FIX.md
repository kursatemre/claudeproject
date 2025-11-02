# ⚠️ VERCEL DEPLOYMENT FİX

## Sorun
Vercel 404 hatası veriyor çünkü projenizde hem backend hem frontend var.

## Çözüm 1: Vercel Dashboard'da Root Directory Ayarla (EN KOLAY)

### Adımlar:

1. **Vercel Dashboard'a git**: https://vercel.com/dashboard
2. Projenizi seç: **claudeproject**
3. **Settings** → **General**
4. **Root Directory** bölümünü bul
5. **Edit** butonuna tıkla
6. `frontend` yaz (tam olarak böyle)
7. **Save** tıkla
8. **Deployments** sekmesine dön
9. **Redeploy** tıkla

### Root Directory ayarladıktan sonra:
- Build Command: `npm run build` (otomatik algılanacak)
- Output Directory: `dist` (otomatik algılanacak)
- Install Command: `npm install` (otomatik algılanacak)

---

## Çözüm 2: Alternatif vercel.json (Eğer Çözüm 1 işe yaramazsa)

Aşağıdaki `vercel.json` dosyası güncellendi. Commit ve push yap:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "npm install",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Sonra:
```bash
git add .
git commit -m "fix: Simplify Vercel configuration"
git push
```

---

## Çözüm 3: Frontend'i Ayrı Repo'ya Taşı (En Garanti)

Eğer yukarıdakiler işe yaramazsa:

1. Yeni repo oluştur: `claudeproject-frontend`
2. Frontend klasörünü oraya taşı
3. Vercel'i yeni repo'ya bağla
4. `VITE_API_URL` environment variable'ı ayarla

---

## Test Et

Deployment tamamlandıktan sonra:

1. **Vercel URL'ini aç**: https://claudeproject-opal.vercel.app
2. **Deployment loglarını kontrol et**: Vercel → Deployments → Latest → View Function Logs
3. **Hata varsa**: Screenshot at ve paylaş

---

## Hızlı Kontrol Listesi

- [ ] Vercel dashboard'da Root Directory = `frontend` olarak ayarlandı
- [ ] Deployment başarılı oldu (yeşil tick ✓)
- [ ] Frontend URL'si açılıyor
- [ ] Console'da hata yok

---

## Hala Çalışmıyor mu?

Bana şunu gönder:
1. Vercel deployment logları (screenshot)
2. Browser console hataları (F12 → Console)
3. Vercel Settings → General screenshot'u
