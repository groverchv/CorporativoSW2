import axios from "axios";

// URL base de la API
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE || "https://backend-ciencias-de-la-educacion.up.railway.app/api/";

// URL base del servidor (sin /api) para WebSocket y otros servicios
export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: API_BASE_URL.replace(/\/+$/, ""),
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// Request interceptor - Agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Renovar token automáticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no hemos intentado refrescar
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.refreshToken) {
          throw new Error("No hay refresh token disponible");
        }

        const response = await axios.post(
          `${API_BASE_URL}auth/refresh`,
          { refreshToken: user.refreshToken }
        );

        if (response.data.token) {
          const updatedUser = { ...user, token: response.data.token };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si falla el refresh, redirigir al login
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;