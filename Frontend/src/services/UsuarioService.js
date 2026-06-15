const DJANGO_URL = import.meta.env.VITE_DJANGO_BACKEND_URL || "http://localhost:8000";

const getAuthHeaders = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return {};
  try {
    const user = JSON.parse(userStr);
    if (user && user.token) {
      return {
        "Authorization": `Bearer ${user.token}`,
        "Content-Type": "application/json"
      };
    }
  } catch (e) {
    console.error("Error parsing user token:", e);
  }
  return { "Content-Type": "application/json" };
};

const formatUsuario = (item) => {
  if (!item) return null;
  
  // Dividir el nombre completo para obtener nombre y apellido
  const nameParts = item.nombre ? item.nombre.trim().split(/\s+/) : [""];
  const nombre = nameParts[0] || "";
  const apellido = nameParts.slice(1).join(" ") || "";
  
  return {
    id: item.id,
    nombre: nombre,
    apellido: apellido,
    correo: item.email || "",
    celular: item.telefono ? String(item.telefono) : "",
    organizacion: "",
    rol: item.rol || "usuario_normal",
    estado: true, // El modelo Django no posee estado en la base de datos, por defecto es true (activo)
    createdAt: item.fecha_registro,
    updatedAt: item.fecha_registro
  };
};

const UsuarioService = {
  // Obtener todos los usuarios
  getAllUsuarios: async () => {
    try {
      const response = await fetch(`${DJANGO_URL}/api/users/usuarios/`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("No se pudieron obtener los usuarios");
      }
      const data = await response.json();
      return (data || []).map(formatUsuario);
    } catch (error) {
      throw error.message || "Error al obtener usuarios";
    }
  },

  // Obtener usuario por ID
  getUsuarioById: async (id) => {
    try {
      const response = await fetch(`${DJANGO_URL}/api/users/usuarios/${id}/`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("No se pudo obtener el usuario");
      }
      const data = await response.json();
      return formatUsuario(data);
    } catch (error) {
      throw error.message || "Error al obtener usuario";
    }
  },

  // Crear usuario
  createUsuario: async (usuarioData) => {
    try {
      const payload = {
        nombre: `${usuarioData.nombre} ${usuarioData.apellido || ""}`.trim(),
        email: usuarioData.correo,
        password: usuarioData.password,
        rol: usuarioData.rol || "usuario_normal",
        telefono: usuarioData.celular ? parseInt(String(usuarioData.celular).replace(/\D/g, "")) : null,
      };

      const response = await fetch(`${DJANGO_URL}/api/users/usuarios/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        const errMessage = Object.values(errData).flat().join(", ") || "Error al crear usuario";
        throw new Error(errMessage);
      }

      const data = await response.json();
      return formatUsuario(data);
    } catch (error) {
      throw error.message || "Error al crear usuario";
    }
  },

  // Actualizar usuario
  updateUsuario: async (id, usuarioData) => {
    try {
      const payload = {};
      
      if (usuarioData.nombre !== undefined || usuarioData.apellido !== undefined) {
        const currentName = usuarioData.nombre || "";
        const currentLastName = usuarioData.apellido || "";
        payload.nombre = `${currentName} ${currentLastName}`.trim();
      }
      
      if (usuarioData.correo !== undefined) {
        payload.email = usuarioData.correo;
      }
      
      if (usuarioData.rol !== undefined) {
        payload.rol = usuarioData.rol;
      }
      
      if (usuarioData.celular !== undefined) {
        payload.telefono = usuarioData.celular ? parseInt(String(usuarioData.celular).replace(/\D/g, "")) : null;
      }
      
      if (usuarioData.password !== undefined) {
        payload.password = usuarioData.password;
      }

      const response = await fetch(`${DJANGO_URL}/api/users/auth/usuario/update/${id}/`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        const errMessage = Object.values(errData).flat().join(", ") || "Error al actualizar usuario";
        throw new Error(errMessage);
      }

      const data = await response.json();
      return formatUsuario(data);
    } catch (error) {
      throw error.message || "Error al actualizar usuario";
    }
  },

  // Eliminar usuario
  deleteUsuario: async (id) => {
    try {
      const response = await fetch(`${DJANGO_URL}/api/users/usuarios/${id}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Error al eliminar usuario");
      }
      return true;
    } catch (error) {
      throw error.message || "Error al eliminar usuario";
    }
  },

  // Cambiar estado del usuario
  toggleEstado: async (id) => {
    // Mock para compatibilidad en el frontend ya que Django no persiste estado en DB
    return { id, estado: true };
  },
};

export default UsuarioService;
