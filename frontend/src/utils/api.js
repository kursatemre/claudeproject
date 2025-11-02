import axios from 'axios';

// Environment'a göre API URL'i belirle
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - her istekte token'ı ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersizse logout yap
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me')
};

// Menu API
export const menuAPI = {
  getMenu: () => api.get('/menu'),
  getAllCategories: () => api.get('/menu/categories'),
  getAllProducts: () => api.get('/menu/products'),
  addCategory: (data) => api.post('/menu/categories', data),
  updateCategory: (id, data) => api.put(`/menu/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/menu/categories/${id}`),
  addProduct: (data) => api.post('/menu/products', data),
  updateProduct: (id, data) => api.put(`/menu/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/menu/products/${id}`)
};

// Orders API
export const ordersAPI = {
  getAllOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post('/orders', data),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
  getOrderStats: () => api.get('/orders/stats')
};

// Settings API
export const settingsAPI = {
  getSettings: () => api.get('/settings'),
  updateRestaurantInfo: (data) => api.put('/settings/restaurant', data),
  updateTheme: (data) => api.put('/settings/theme', data),
  generateQRCode: (url) => api.post('/settings/qrcode', { url })
};

export default api;
