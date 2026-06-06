import { supabase } from "../api/supabase";

const formatUsuario = (item) => {
  if (!item) return null;
  return {
    ...item,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  };
};

const UsuarioService = {
  // Obtener todos los usuarios
  getAllUsuarios: async () => {
    try {
      const { data, error } = await supabase
        .from("usuario")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(formatUsuario);
    } catch (error) {
      throw error.message || "Error al obtener usuarios";
    }
  },

  // Obtener usuario por ID
  getUsuarioById: async (id) => {
    try {
      const { data, error } = await supabase
        .from("usuario")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return formatUsuario(data);
    } catch (error) {
      throw error.message || "Error al obtener usuario";
    }
  },

  // Crear usuario
  createUsuario: async (usuarioData) => {
    try {
      if (usuarioData.password) {
        const { data, error } = await supabase.auth.signUp({
          email: usuarioData.correo,
          password: usuarioData.password,
          options: {
            data: {
              nombre: usuarioData.nombre,
              apellido: usuarioData.apellido,
            },
          },
        });
        if (error) throw error;
        return data.user;
      } else {
        const { data, error } = await supabase
          .from("usuario")
          .insert({
            nombre: usuarioData.nombre,
            apellido: usuarioData.apellido,
            correo: usuarioData.correo,
            estado: usuarioData.estado !== undefined ? usuarioData.estado : true
          })
          .select()
          .single();
        if (error) throw error;
        return formatUsuario(data);
      }
    } catch (error) {
      throw error.message || "Error al crear usuario";
    }
  },

  // Actualizar usuario
  updateUsuario: async (id, usuarioData) => {
    try {
      const { data, error } = await supabase
        .from("usuario")
        .update({
          nombre: usuarioData.nombre,
          apellido: usuarioData.apellido,
          correo: usuarioData.correo,
          celular: usuarioData.celular,
          organizacion: usuarioData.organizacion,
          estado: usuarioData.estado !== undefined ? usuarioData.estado : true
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return formatUsuario(data);
    } catch (error) {
      throw error.message || "Error al actualizar usuario";
    }
  },

  // Eliminar usuario
  deleteUsuario: async (id) => {
    try {
      const { error } = await supabase
        .from("usuario")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return true;
    } catch (error) {
      throw error.message || "Error al eliminar usuario";
    }
  },

  // Cambiar estado del usuario
  toggleEstado: async (id) => {
    try {
      const { data: user, error: fetchError } = await supabase
        .from("usuario")
        .select("estado")
        .eq("id", id)
        .single();
      if (fetchError) throw fetchError;

      const { data, error } = await supabase
        .from("usuario")
        .update({ estado: !user.estado })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return formatUsuario(data);
    } catch (error) {
      throw error.message || "Error al cambiar estado";
    }
  },
};

export default UsuarioService;
