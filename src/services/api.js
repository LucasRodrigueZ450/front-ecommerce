// src/services/api.js
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://back-ecommerce-7cp3.onrender.com/api";

// Criar instância do axios já configurada
const api = axios.create({
  baseURL: BASE_URL,
});

// ⬇ Envia token automaticamente para todas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔥 ROTAS DE AUTENTICAÇÃO
export const authAPI = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }),

  register: (name, email, password) =>
    api.post("/auth/register", { name, email, password }),
};

// 🔥 ROTAS DE PRODUTOS
export const productsAPI = {
  getAll: () => api.get("/products"),
  create: (productData) => api.post("/products", productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
};

// 🔥 ROTAS DE PEDIDOS
export const ordersAPI = {
  getMyOrders: () => api.get("/orders/my"),
  updatePayment: (data) => api.put("/orders/payment-update", data),
};

// Exportar instância
export default api;
