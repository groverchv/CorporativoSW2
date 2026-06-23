import { supabase } from "../api/supabase";

const DJANGO_URL = import.meta.env.VITE_DJANGO_BACKEND_URL || "https://defensasw2.jorgechoquecalle.engineer";

const AuthService = {
  // Login
  login: async (correo, password) => {
    try {
      const response = await fetch(`${DJANGO_URL}/api/users/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: correo,
          password: password,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Credenciales inválidas");
      }

      const data = await response.json();

      const userData = {
        token: data.access,
        refreshToken: data.refresh,
        id: data.usuario.id,
        correo: data.usuario.email,
        nombre: data.usuario.nombre || "",
        apellido: data.usuario.apellido || "",
        rol: data.usuario.rol || "usuario_normal",
        profesion: data.usuario.profesion || "estudiante",
        fecha_nacimiento: data.usuario.fecha_nacimiento || "",
        telefono: data.usuario.telefono || "",
        url: data.usuario.url || "",
      };

      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error.message || "Error al iniciar sesión";
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem("user");
  },

  // Register
  register: async (userData) => {
    try {
      const response = await fetch(`${DJANGO_URL}/api/users/auth/registro/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: userData.nombre,
          apellido: userData.apellido || "",
          email: userData.correo,
          password: userData.password,
          rol: userData.rol || "usuario_normal",
          profesion: userData.profesion || "estudiante",
          fecha_nacimiento: userData.fecha_nacimiento || null,
          telefono: userData.celular ? parseInt(userData.celular.toString().replace(/\D/g, "")) : null,
          acepta_politicas: userData.acepta_politicas || false,
          fecha_aceptacion: userData.fecha_aceptacion || null,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        const errMessage = Object.values(errData).flat().join(", ") || "Error al registrar usuario";
        throw new Error(errMessage);
      }

      const data = await response.json();
      return { 
        message: "Usuario registrado exitosamente",
        user: data
      };
    } catch (error) {
      throw error.message || "Error al registrar usuario";
    }
  },

  // Get current user
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("user"));
  },

  // Refresh token
  refreshToken: async () => {
    const user = AuthService.getCurrentUser();
    if (user && user.refreshToken) {
      return user.token;
    }
    throw new Error("No session active");
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    const user = AuthService.getCurrentUser();
    return !!user?.token;
  },

  // Obtener el token
  getToken: () => {
    const user = AuthService.getCurrentUser();
    return user?.token;
  },

  // Refrescar datos del usuario desde el backend (después de pago)
  refreshUserData: async () => {
    const user = AuthService.getCurrentUser();
    if (!user?.token || !user?.id) return null;

    try {
      const response = await fetch(`${DJANGO_URL}/api/users/usuarios/${user.id}/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) return null;

      const data = await response.json();
      const updatedUser = {
        ...user,
        rol: data.rol || user.rol,
        nombre: data.nombre || user.nombre,
        apellido: data.apellido || user.apellido,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error("Error refreshing user data:", error);
      return null;
    }
  },

  // Crear sesión de Stripe Checkout
  createCheckoutSession: async (plan) => {
    const user = AuthService.getCurrentUser();
    if (!user?.token) throw new Error("No autenticado");

    const response = await fetch(`${DJANGO_URL}/api/users/stripe/create-checkout-session/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Error al crear sesión de pago");
    }

    return await response.json();
  },

  // Confirmar pago de Stripe (alternativa al webhook)
  confirmPayment: async (sessionId) => {
    const user = AuthService.getCurrentUser();
    if (!user?.token) throw new Error("No autenticado");

    const response = await fetch(`${DJANGO_URL}/api/users/stripe/confirm-payment/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ session_id: sessionId }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Error al confirmar pago");
    }

    return await response.json();
  },
};

export default AuthService;

