import { supabase } from "../api/supabase";

const RolService = {
  // Obtener todos los roles
  getAllRoles: async () => {
    try {
      const { data, error } = await supabase
        .from("rol")
        .select("*")
        .order("nombre", { ascending: true });
      if (error) throw error;
      return data;
    } catch (error) {
      throw error.message || "Error al obtener roles";
    }
  },

  // Obtener rol por ID
  getRolById: async (id) => {
    try {
      const { data, error } = await supabase
        .from("rol")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      throw error.message || "Error al obtener rol";
    }
  },

  // Crear rol
  createRol: async (rolData) => {
    try {
      const { data, error } = await supabase
        .from("rol")
        .insert({
          nombre: rolData.nombre,
          estado: rolData.estado !== undefined ? rolData.estado : true
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      throw error.message || "Error al crear rol";
    }
  },

  // Actualizar rol
  updateRol: async (id, rolData) => {
    try {
      const { data, error } = await supabase
        .from("rol")
        .update({
          nombre: rolData.nombre,
          estado: rolData.estado
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      throw error.message || "Error al actualizar rol";
    }
  },

  // Eliminar rol
  deleteRol: async (id) => {
    try {
      const { error } = await supabase
        .from("rol")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return true;
    } catch (error) {
      throw error.message || "Error al eliminar rol";
    }
  }
};

export default RolService;
