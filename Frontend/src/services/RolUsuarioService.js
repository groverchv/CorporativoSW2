import { supabase } from "../api/supabase";

const formatRolUsuario = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    rol: item.rol || { id: item.rol_id },
    usuario: item.usuario || { id: item.usuario_id }
  };
};

const RolUsuarioService = {
  // Obtener todas las asignaciones de roles a usuarios
  getAllRolUsuarios: async () => {
    try {
      const { data, error } = await supabase
        .from("rol_usuario")
        .select("id, rol:rol_id(*), usuario:usuario_id(*)");
      if (error) throw error;
      return (data || []).map(formatRolUsuario);
    } catch (error) {
      throw error.message || "Error al obtener asignaciones de roles";
    }
  },

  // Obtener una asignación específica por ID
  getRolUsuarioById: async (id) => {
    try {
      const { data, error } = await supabase
        .from("rol_usuario")
        .select("id, rol:rol_id(*), usuario:usuario_id(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return formatRolUsuario(data);
    } catch (error) {
      throw error.message || "Error al obtener la asignación de rol";
    }
  },

  // Crear una nueva asignación (Asignar rol a usuario)
  createRolUsuario: async (rolUsuarioData) => {
    try {
      const rolId = rolUsuarioData.rol_id || rolUsuarioData.rol?.id;
      const usuarioId = rolUsuarioData.usuario_id || rolUsuarioData.usuario?.id;

      if (!rolId || !usuarioId) {
        throw new Error("rol_id y usuario_id son obligatorios");
      }

      const { data, error } = await supabase
        .from("rol_usuario")
        .insert({
          rol_id: rolId,
          usuario_id: usuarioId
        })
        .select("id, rol:rol_id(*), usuario:usuario_id(*)")
        .single();

      if (error) throw error;
      return formatRolUsuario(data);
    } catch (error) {
      throw error.message || "Error al asignar el rol al usuario";
    }
  },

  // Actualizar una asignación existente
  updateRolUsuario: async (id, rolUsuarioData) => {
    try {
      const rolId = rolUsuarioData.rol_id || rolUsuarioData.rol?.id;
      const usuarioId = rolUsuarioData.usuario_id || rolUsuarioData.usuario?.id;

      if (!rolId || !usuarioId) {
        throw new Error("rol_id y usuario_id son obligatorios");
      }

      const { data, error } = await supabase
        .from("rol_usuario")
        .update({
          rol_id: rolId,
          usuario_id: usuarioId
        })
        .eq("id", id)
        .select("id, rol:rol_id(*), usuario:usuario_id(*)")
        .single();

      if (error) throw error;
      return formatRolUsuario(data);
    } catch (error) {
      throw error.message || "Error al actualizar la asignación de rol";
    }
  },

  // Eliminar una asignación (Desasignar rol)
  deleteRolUsuario: async (id) => {
    try {
      const { error } = await supabase
        .from("rol_usuario")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return true;
    } catch (error) {
      throw error.message || "Error al eliminar la asignación de rol";
    }
  }
};

export default RolUsuarioService;