import { useState, useEffect } from 'react';
import { ordersAPI, menuAPI } from '../utils/api';
import AdminLayout from '../components/admin/AdminLayout';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    newOrders: 0,
    preparingOrders: 0,
    readyOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersResponse, statsResponse, menuResponse] = await Promise.all([
        ordersAPI.getAllOrders(),
        ordersAPI.getOrderStats(),
        menuAPI.getAllProducts()
      ]);

      setRecentOrders(ordersResponse.data.data.slice(0, 5));
      setStats(statsResponse.data.data);
      setTotalProducts(menuResponse.data.data.length);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Yeni':
        return 'badge-new';
      case 'Hazırlanıyor':
        return 'badge-preparing';
      case 'Hazır':
        return 'badge-ready';
      case 'Tamamlandı':
        return 'badge-completed';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="dashboard">
        {/* İstatistik Kartları */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Toplam Sipariş</h3>
              <p className="stat-value">{stats.total}</p>
            </div>
          </div>

          <div className="stat-card highlight-new">
            <div className="stat-icon">🆕</div>
            <div className="stat-info">
              <h3>Yeni Siparişler</h3>
              <p className="stat-value">{stats.new}</p>
            </div>
          </div>

          <div className="stat-card highlight-preparing">
            <div className="stat-icon">👨‍🍳</div>
            <div className="stat-info">
              <h3>Hazırlananlar</h3>
              <p className="stat-value">{stats.preparing}</p>
            </div>
          </div>

          <div className="stat-card highlight-ready">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>Hazır Siparişler</h3>
              <p className="stat-value">{stats.ready}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Toplam Gelir</h3>
              <p className="stat-value">{stats.totalRevenue.toFixed(2)} ₺</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🍽️</div>
            <div className="stat-info">
              <h3>Menüdeki Ürünler</h3>
              <p className="stat-value">{totalProducts}</p>
            </div>
          </div>
        </div>

        {/* Son Siparişler */}
        <div className="recent-orders card">
          <h2>Son Siparişler</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Sipariş No</th>
                  <th>Masa</th>
                  <th>Müşteri</th>
                  <th>Tutar</th>
                  <th>Durum</th>
                  <th>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      Henüz sipariş bulunmuyor
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>Masa {order.tableNumber}</td>
                      <td>{order.customerName}</td>
                      <td>{order.totalPrice.toFixed(2)} ₺</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleString('tr-TR')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
