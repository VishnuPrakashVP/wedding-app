import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// For Vercel deployment, use relative URLs if API is on same domain
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
  logout: () => api.post('/users/logout'),
  getProfile: () => api.get('/users/profile'),
};

// Albums API
export const albumsAPI = {
  getAll: () => api.get('/albums/'),
  getById: (id) => api.get(`/albums/${id}`),
  create: (albumData) => api.post('/albums/', albumData),
  update: (id, albumData) => api.put(`/albums/${id}`, albumData),
  delete: (id) => api.delete(`/albums/${id}`),
};

// Media API
export const mediaAPI = {
  getAll: () => api.get('/media/all'),
  getByAlbum: (albumId) => api.get(`/media/album/${albumId}`),
  upload: (formData) => api.post('/media/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  report: (mediaId) => api.post(`/media/report/${mediaId}`),
  getFlagged: () => api.get('/media/flagged'),
  approve: (mediaId) => api.patch(`/media/approve/${mediaId}`),
  reject: (mediaId) => api.delete(`/media/reject/${mediaId}`),
};

// Payments API
export const paymentsAPI = {
  createOrder: (amount, currency = 'INR', notes = {}) =>
    api.post('/payments/create-order', { amount, currency, notes }),
  verifyPayment: (paymentId, orderId, signature) =>
    api.post('/payments/verify-payment', { payment_id: paymentId, order_id: orderId, signature }),
  getPaymentDetails: (paymentId) => api.get(`/payments/payment/${paymentId}`),
  upgradePlan: (planType, userId) =>
    api.post('/payments/upgrade-plan', { plan_type: planType, user_id: userId }),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  getFlaggedMedia: () => api.get('/admin/flagged-media'),
  approveMedia: (mediaId) => api.patch(`/admin/approve-media/${mediaId}`),
  rejectMedia: (mediaId) => api.delete(`/admin/reject-media/${mediaId}`),
  getAnalytics: () => api.get('/admin/analytics'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api; 