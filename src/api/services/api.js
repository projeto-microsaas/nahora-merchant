// src/api/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // Ajuste conforme a URL da sua API
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token a todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para lidar com erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Verifica se o erro é 401 (Unauthorized) e se não é uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tenta atualizar o token (você precisa implementar o endpoint de refresh)
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post("http://localhost:5000/api/auth/refresh", { refreshToken });
        const newToken = response.data.token;

        // Salva o novo token
        localStorage.setItem("token", newToken);

        // Reenvia a requisição original com o novo token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Se o refresh falhar, desloga o usuário
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Redireciona para a página de login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;