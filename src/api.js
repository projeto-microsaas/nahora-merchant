import axios from 'axios';
  import { API_BASE_URL } from './config';

  console.log('API_BASE_URL configurado:', API_BASE_URL); // Log para verificar o URL

  const api = axios.create({
    baseURL: API_BASE_URL,
  });

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('userToken');
      console.log('Token enviado na requisição:', token);
      console.log('Configuração da requisição:', config);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error('Erro no interceptor de requisição:', error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log('Resposta recebida:', response);
      return response;
    },
    (error) => {
      console.error('Erro na resposta:', error.message);
      if (error.response) {
        console.error('Detalhes do erro:', error.response.data);
      }
      return Promise.reject(error);
    }
  );

  export const login = (email, password, role) =>
    api.post('/api/auth/login', { email, password, role });

  export const fetchDrivers = () => api.get('/api/auth/drivers');

  export const fetchOrders = () => api.get('/api/orders');

  export const createOrder = (orderData) => api.post('/api/orders', orderData);

  export default api;
