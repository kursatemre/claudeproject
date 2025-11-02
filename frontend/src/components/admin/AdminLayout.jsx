import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../styles/AdminLayout.css';

function AdminLayout({ children, title }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/admin/dashboard" className="nav-item">
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </NavLink>
          <NavLink to="/admin/orders" className="nav-item">
            <span className="nav-icon">📦</span>
            <span className="nav-text">Siparişler</span>
          </NavLink>
          <NavLink to="/admin/menu" className="nav-item">
            <span className="nav-icon">🍽️</span>
            <span className="nav-text">Menü Yönetimi</span>
          </NavLink>
          <NavLink to="/admin/settings" className="nav-item">
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Ayarlar</span>
          </NavLink>
          <NavLink to="/admin/qrcode" className="nav-item">
            <span className="nav-icon">📱</span>
            <span className="nav-text">QR Kod</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-icon">👤</span>
            <span className="user-name">{user.fullName || 'Admin'}</span>
          </div>
          <button onClick={handleLogout} className="btn btn-danger btn-block">
            Çıkış Yap
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            ☰
          </button>
          <h1>{title}</h1>
          <div className="header-actions">
            <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              Menüyü Görüntüle
            </a>
          </div>
        </header>

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
