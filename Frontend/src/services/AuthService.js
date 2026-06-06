import { supabase } from "../api/supabase";

const AuthService = {
  // Login
  login: async (correo, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: correo,
        password: password,
      });
      if (error) throw error;

      const session = data.session;
      const user = data.user;

      // Obtener perfil público de la tabla usuario
      const { data: profile, error: profileError } = await supabase
        .from("usuario")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error al obtener perfil público:", profileError);
      }

      const userData = {
        token: session.access_token,
        refreshToken: session.refresh_token,
        id: user.id,
        correo: user.email,
        nombre: profile?.nombre || "",
        apellido: profile?.apellido || "",
        celular: profile?.celular || "",
        organizacion: profile?.organizacion || "",
      };

      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error.message || "Error al iniciar sesión";
    }
  },

  // Logout
  logout: () => {
    supabase.auth.signOut().catch((err) => console.error("Error al desloguear de Supabase:", err));
    localStorage.removeItem("user");
  },

  // Register
  register: async (userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.correo,
        password: userData.password,
        options: {
          data: {
            nombre: userData.nombre,
            apellido: userData.apellido,
            celular: userData.celular || "",
            organizacion: userData.organizacion || "",
          },
        },
      });
      if (error) throw error;

      // Si Supabase devuelve una sesión activa (Email Confirmation desactivado en Consola)
      if (data?.session) {
        const session = data.session;
        const user = data.user;
        const userDataLocal = {
          token: session.access_token,
          refreshToken: session.refresh_token,
          id: user.id,
          correo: user.email,
          nombre: userData.nombre,
          apellido: userData.apellido,
          celular: userData.celular || "",
          organizacion: userData.organizacion || "",
        };
        localStorage.setItem("user", JSON.stringify(userDataLocal));
      }

      return { 
        message: "Usuario registrado exitosamente",
        session: data?.session,
        user: data?.user
      };
    } catch (error) {
      throw error.message || "Error al registrar usuario";
    }
  },

  // Get current user
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("user"));
  },

  // Refresh token (mocked since Supabase auto-refreshes)
  refreshToken: async () => {
    const sessionRes = await supabase.auth.getSession();
    const session = sessionRes.data?.session;
    if (session) {
      const user = AuthService.getCurrentUser();
      const updatedUser = { ...user, token: session.access_token, refreshToken: session.refresh_token };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return session.access_token;
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
};

export default AuthService;
