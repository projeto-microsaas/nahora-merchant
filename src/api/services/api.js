import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api/', // Base URL para todas as requisições
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    console.log("Token enviado:", token); // Log para depuração
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request to:', config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;