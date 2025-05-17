import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Autenticación
export const auth = {
  login: data => api.post('/auth/login', data),
  register: data => api.post('/auth/register', data),
};

// Productos
export const products = {
  list: () => api.get('/products'),
  create: formData => api.post('/products', formData),
  update: (id, formData) => api.put(`/products/${id}`, formData),
  remove: id => api.delete(`/products/${id}`),
};

// Pedidos
export const orders = {
  create: data => api.post('/orders', data),
  my: () => api.get('/orders/me'),
  list: () => api.get('/orders'),
  byUser: userId => api.get(`/orders/user/${userId}`), // ✅ para ver pedidos por usuario
  markDelivered: id => api.put(`/orders/${id}`, { status: 'delivered' }),
  remove: id => api.delete(`/orders/${id}`),
};

// Usuarios (solo admin)
export const users = {
  list: () => api.get('/users'),
  update: (id, data) => api.put(`/users/${id}`, data),
  remove: id => api.delete(`/users/${id}`),
};
