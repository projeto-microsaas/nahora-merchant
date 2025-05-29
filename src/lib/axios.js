import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Confirme que essa é a base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adicionar token ao header de todas as requisições
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;