import { useState, useEffect } from 'react';
import { ordersAPI, menuAPI } from '../utils/api';
import AdminLayout from '../components/admin/AdminLayout';
import '../styles/AdminOrders.css';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersResponse, menuResponse] = await Promise.all([
        ordersAPI.getAllOrders(),
        menuAPI.getMenu()
      ]);
      setOrders(ordersResponse.data.data);
      setProducts(menuResponse.data.data.products);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateOrderStatus(orderId, newStatus);
      await fetchData();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Sipariş durumu güncellenirken bir hata oluştu');
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Bu siparişi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await ordersAPI.deleteOrder(orderId);
      await fetchData();
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Sipariş silinirken bir hata oluştu');
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

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.status === filter);

  if (loading) {
    return (
      <AdminLayout title="Sipariş Yönetimi">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Sipariş Yönetimi">
      <div className="orders-page">
        {/* Filtreler ve Butonlar */}
        <div className="orders-header card">
          <div className="filter-buttons">
            <button
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('all')}
            >
              Tümü ({orders.length})
            </button>
            <button
              className={`btn ${filter === 'Yeni' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('Yeni')}
            >
              Yeni ({orders.filter(o => o.status === 'Yeni').length})
            </button>
            <button
              className={`btn ${filter === 'Hazırlanıyor' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('Hazırlanıyor')}
            >
              Hazırlanıyor ({orders.filter(o => o.status === 'Hazırlanıyor').length})
            </button>
            <button
              className={`btn ${filter === 'Hazır' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('Hazır')}
            >
              Hazır ({orders.filter(o => o.status === 'Hazır').length})
            </button>
            <button
              className={`btn ${filter === 'Tamamlandı' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('Tamamlandı')}
            >
              Tamamlandı ({orders.filter(o => o.status === 'Tamamlandı').length})
            </button>
          </div>
        </div>

        {/* Siparişler Listesi */}
        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="card no-orders">
              <p>Bu kategoride sipariş bulunmuyor</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="order-card card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Sipariş #{order.id}</h3>
                    <p>Masa: {order.tableNumber} | {order.customerName}</p>
                    <small>{new Date(order.createdAt).toLocaleString('tr-TR')}</small>
                  </div>
                  <div className="order-status">
                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="order-total">{order.totalPrice.toFixed(2)} ₺</p>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Ürünler:</h4>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.quantity}x {item.productName} - {(item.price * item.quantity).toFixed(2)} ₺
                      </li>
                    ))}
                  </ul>
                  {order.notes && (
                    <div className="order-notes">
                      <strong>Not:</strong> {order.notes}
                    </div>
                  )}
                </div>

                <div className="order-actions">
                  {order.status === 'Yeni' && (
                    <button
                      className="btn btn-primary"
                      onClick={() => updateOrderStatus(order.id, 'Hazırlanıyor')}
                    >
                      Hazırlamaya Başla
                    </button>
                  )}
                  {order.status === 'Hazırlanıyor' && (
                    <button
                      className="btn btn-success"
                      onClick={() => updateOrderStatus(order.id, 'Hazır')}
                    >
                      Hazır Olarak İşaretle
                    </button>
                  )}
                  {order.status === 'Hazır' && (
                    <button
                      className="btn btn-success"
                      onClick={() => updateOrderStatus(order.id, 'Tamamlandı')}
                    >
                      Tamamlandı Olarak İşaretle
                    </button>
                  )}
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteOrder(order.id)}
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminOrders;
