import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Adiciona o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getUser = async () => {
  const response = await api.get('/auth/user');
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const getDrivers = async () => {
  const response = await api.get('/auth/drivers');
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const acceptOrder = async (orderId) => {
  const response = await api.post(`/orders/${orderId}/accept`);
  return response.data;
};

export const updateUser = async (userData) => {
  const response = await api.put('/auth/user', userData);
  return response.data;
};