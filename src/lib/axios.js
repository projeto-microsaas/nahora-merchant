import axios from 'axios';
import { io } from 'socket.io-client';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'http://backend:5000',
});

// Interceptador de requisições para adicionar o token de autenticação
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptador de respostas para redirecionar em caso de erro 401
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Configuração do WebSocket com protocolo ws://
export const socket = io(process.env.NODE_ENV === 'development' ? 'ws://localhost:5000' : 'wss://backend:5000', {
  auth: (cb) => cb({ token: localStorage.getItem('authToken') }),
  transports: ['websocket'], // Força o uso de WebSocket em vez de polling
});

export default instance;