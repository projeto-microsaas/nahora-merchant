import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL: config.apiBaseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const login = async (email, password, role) => {
  return api.post("/auth/login", { email, password, role });
};

const fetchDrivers = async () => {
  return api.get("/drivers");
};

const fetchOrders = async () => {
  return api.get("/orders");
};

const createOrder = async (orderData) => {
  return api.post("/orders", orderData);
};

export { login, fetchDrivers, fetchOrders, createOrder };