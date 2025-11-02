import { useState } from 'react';
import { settingsAPI } from '../utils/api';
import AdminLayout from '../components/admin/AdminLayout';
import '../styles/AdminQRCode.css';

function AdminQRCode() {
  const [url, setUrl] = useState(window.location.origin);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateQRCode = async () => {
    if (!url) {
      alert('Lütfen bir URL girin');
      return;
    }

    setLoading(true);

    try {
      const response = await settingsAPI.generateQRCode(url);
      setQrCode(response.data.data.qrCode);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('QR kod oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCode) return;

    const link = document.createElement('a');
    link.href = qrCode;
    link.download = 'menu-qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout title="QR Kod Oluşturucu">
      <div className="qrcode-page">
        <div className="card">
          <h2>Menü QR Kodu Oluştur</h2>
          <p className="description">
            Müşterilerinizin dijital menünüze kolayca erişebilmesi için QR kod oluşturun.
            Bu QR kodu masalara, vitrinlere veya broşürlere yerleştirebilirsiniz.
          </p>

          <div className="qr-generator">
            <div className="form-group">
              <label>Menü URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
              />
              <small>Müşterilerin yönlendirileceği URL adresi</small>
            </div>

            <button
              className="btn btn-primary btn-block"
              onClick={generateQRCode}
              disabled={loading}
            >
              {loading ? 'Oluşturuluyor...' : 'QR Kod Oluştur'}
            </button>
          </div>

          {qrCode && (
            <div className="qr-result">
              <div className="qr-display">
                <img src={qrCode} alt="QR Code" />
              </div>

              <div className="qr-info">
                <p><strong>URL:</strong> {url}</p>
              </div>

              <button
                className="btn btn-success btn-block"
                onClick={downloadQRCode}
              >
                QR Kodu İndir
              </button>
            </div>
          )}
        </div>

        <div className="card qr-tips">
          <h3>💡 Kullanım İpuçları</h3>
          <ul>
            <li>QR kodu yazdırırken yüksek çözünürlükte (300 DPI) yazdırın</li>
            <li>QR kodun etrafında en az 1 cm beyaz alan bırakın</li>
            <li>QR kodu düz bir yüzeye yerleştirin</li>
            <li>Müşterilerin kolayca tarayabileceği bir yükseklikte konumlandırın</li>
            <li>QR kodun yanına "Menü için QR kodu tarayın" gibi bir açıklama ekleyin</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminQRCode;
