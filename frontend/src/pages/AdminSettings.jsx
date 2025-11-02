import { useState, useEffect } from 'react';
import { settingsAPI } from '../utils/api';
import AdminLayout from '../components/admin/AdminLayout';
import '../styles/AdminSettings.css';

function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('restaurant');

  const [restaurantForm, setRestaurantForm] = useState({
    name: '',
    slogan: '',
    logo: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    workingHours: {
      weekdays: '',
      weekend: ''
    },
    socialMedia: {
      instagram: '',
      facebook: '',
      twitter: ''
    }
  });

  const [themeForm, setThemeForm] = useState({
    primaryColor: '',
    secondaryColor: '',
    accentColor: '',
    backgroundColor: '',
    textColor: '',
    fontFamily: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.getSettings();
      const data = response.data.data;
      setSettings(data);
      setRestaurantForm(data.restaurant);
      setThemeForm(data.theme);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await settingsAPI.updateRestaurantInfo(restaurantForm);
      await fetchSettings();
      alert('Restoran bilgileri başarıyla güncellendi');
    } catch (error) {
      console.error('Error updating restaurant info:', error);
      alert('Güncelleme sırasında bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleThemeSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await settingsAPI.updateTheme(themeForm);
      await fetchSettings();
      alert('Tema ayarları başarıyla güncellendi');
    } catch (error) {
      console.error('Error updating theme:', error);
      alert('Güncelleme sırasında bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Ayarlar">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Ayarlar">
      <div className="settings-page">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'restaurant' ? 'active' : ''}`}
            onClick={() => setActiveTab('restaurant')}
          >
            Restoran Bilgileri
          </button>
          <button
            className={`tab-btn ${activeTab === 'theme' ? 'active' : ''}`}
            onClick={() => setActiveTab('theme')}
          >
            Tema Ayarları
          </button>
        </div>

        {activeTab === 'restaurant' && (
          <div className="tab-content">
            <h2>Restoran Bilgileri</h2>
            <form onSubmit={handleRestaurantSubmit}>
              <div className="form-group-inline">
                <div className="form-group">
                  <label>Restoran Adı *</label>
                  <input
                    type="text"
                    value={restaurantForm.name}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Slogan</label>
                  <input
                    type="text"
                    value={restaurantForm.slogan}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, slogan: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Logo URL</label>
                <input
                  type="text"
                  value={restaurantForm.logo}
                  onChange={(e) => setRestaurantForm({ ...restaurantForm, logo: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Açıklama</label>
                <textarea
                  value={restaurantForm.description}
                  onChange={(e) => setRestaurantForm({ ...restaurantForm, description: e.target.value })}
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Adres</label>
                <input
                  type="text"
                  value={restaurantForm.address}
                  onChange={(e) => setRestaurantForm({ ...restaurantForm, address: e.target.value })}
                />
              </div>

              <div className="form-group-inline">
                <div className="form-group">
                  <label>Telefon</label>
                  <input
                    type="tel"
                    value={restaurantForm.phone}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>E-posta</label>
                  <input
                    type="email"
                    value={restaurantForm.email}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group-inline">
                <div className="form-group">
                  <label>Çalışma Saatleri (Hafta İçi)</label>
                  <input
                    type="text"
                    value={restaurantForm.workingHours?.weekdays || ''}
                    onChange={(e) => setRestaurantForm({
                      ...restaurantForm,
                      workingHours: { ...restaurantForm.workingHours, weekdays: e.target.value }
                    })}
                    placeholder="Örn: 08:00 - 23:00"
                  />
                </div>

                <div className="form-group">
                  <label>Çalışma Saatleri (Hafta Sonu)</label>
                  <input
                    type="text"
                    value={restaurantForm.workingHours?.weekend || ''}
                    onChange={(e) => setRestaurantForm({
                      ...restaurantForm,
                      workingHours: { ...restaurantForm.workingHours, weekend: e.target.value }
                    })}
                    placeholder="Örn: 08:00 - 00:00"
                  />
                </div>
              </div>

              <h3>Sosyal Medya</h3>
              <div className="form-group-inline">
                <div className="form-group">
                  <label>Instagram</label>
                  <input
                    type="text"
                    value={restaurantForm.socialMedia?.instagram || ''}
                    onChange={(e) => setRestaurantForm({
                      ...restaurantForm,
                      socialMedia: { ...restaurantForm.socialMedia, instagram: e.target.value }
                    })}
                    placeholder="@kullanici_adi"
                  />
                </div>

                <div className="form-group">
                  <label>Facebook</label>
                  <input
                    type="text"
                    value={restaurantForm.socialMedia?.facebook || ''}
                    onChange={(e) => setRestaurantForm({
                      ...restaurantForm,
                      socialMedia: { ...restaurantForm.socialMedia, facebook: e.target.value }
                    })}
                  />
                </div>

                <div className="form-group">
                  <label>Twitter</label>
                  <input
                    type="text"
                    value={restaurantForm.socialMedia?.twitter || ''}
                    onChange={(e) => setRestaurantForm({
                      ...restaurantForm,
                      socialMedia: { ...restaurantForm.socialMedia, twitter: e.target.value }
                    })}
                    placeholder="@kullanici_adi"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="tab-content">
            <h2>Tema Ayarları</h2>
            <form onSubmit={handleThemeSubmit}>
              <div className="form-group-inline">
                <div className="form-group">
                  <label>Ana Renk</label>
                  <input
                    type="color"
                    value={themeForm.primaryColor}
                    onChange={(e) => setThemeForm({ ...themeForm, primaryColor: e.target.value })}
                  />
                  <input
                    type="text"
                    value={themeForm.primaryColor}
                    onChange={(e) => setThemeForm({ ...themeForm, primaryColor: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>İkincil Renk</label>
                  <input
                    type="color"
                    value={themeForm.secondaryColor}
                    onChange={(e) => setThemeForm({ ...themeForm, secondaryColor: e.target.value })}
                  />
                  <input
                    type="text"
                    value={themeForm.secondaryColor}
                    onChange={(e) => setThemeForm({ ...themeForm, secondaryColor: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group-inline">
                <div className="form-group">
                  <label>Vurgu Rengi</label>
                  <input
                    type="color"
                    value={themeForm.accentColor}
                    onChange={(e) => setThemeForm({ ...themeForm, accentColor: e.target.value })}
                  />
                  <input
                    type="text"
                    value={themeForm.accentColor}
                    onChange={(e) => setThemeForm({ ...themeForm, accentColor: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Arka Plan Rengi</label>
                  <input
                    type="color"
                    value={themeForm.backgroundColor}
                    onChange={(e) => setThemeForm({ ...themeForm, backgroundColor: e.target.value })}
                  />
                  <input
                    type="text"
                    value={themeForm.backgroundColor}
                    onChange={(e) => setThemeForm({ ...themeForm, backgroundColor: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group-inline">
                <div className="form-group">
                  <label>Metin Rengi</label>
                  <input
                    type="color"
                    value={themeForm.textColor}
                    onChange={(e) => setThemeForm({ ...themeForm, textColor: e.target.value })}
                  />
                  <input
                    type="text"
                    value={themeForm.textColor}
                    onChange={(e) => setThemeForm({ ...themeForm, textColor: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Font Ailesi</label>
                  <input
                    type="text"
                    value={themeForm.fontFamily}
                    onChange={(e) => setThemeForm({ ...themeForm, fontFamily: e.target.value })}
                    placeholder="Örn: Arial, sans-serif"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminSettings;
