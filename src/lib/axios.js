import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '/', // Use / para produção com proxy
});

instance.interceptors.request.use((config) => {
  // Não adicionar token para rotas de autenticação
  if (!config.url?.includes('/api/auth/')) {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token adicionado à requisição:', config.url, 'Token:', token.substring(0, 20) + '...');
    } else {
      console.log('❌ Token não encontrado para requisição:', config.url);
    }
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('Erro de autenticação: Limpando token e redirecionando para login');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;