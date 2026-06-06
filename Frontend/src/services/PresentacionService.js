import { supabase } from "../api/supabase";
import AuthService from "./AuthService";

const getUsuarioActualId = () => {
  try {
    const user = AuthService.getCurrentUser();
    if (!user) return null;
    return user.id || user.usuario?.id || user.user?.id || null;
  } catch (e) {
    console.error("Error al obtener usuario:", e);
    return null;
  }
};

const formatPresentacion = (item) => {
  if (!item) return null;
  return {
    ...item,
    usuario_id: item.usuario_id ? { id: item.usuario_id } : null
  };
};

export const ImagenesAPI = {
  // LISTAR (GET /presentacion)
  list: async () => {
    try {
      const { data, error } = await supabase
        .from("presentacion")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(formatPresentacion);
    } catch (error) {
      throw error.message || "Error al obtener presentaciones";
    }
  },

  // OBTENER (GET /presentacion/{id})
  get: async (id) => {
    try {
      const { data, error } = await supabase
        .from("presentacion")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return formatPresentacion(data);
    } catch (error) {
      throw error.message || "Error al obtener presentación";
    }
  },

  // CREAR (POST /presentacion)
  create: async (payload) => {
    try {
      const userId = getUsuarioActualId();
      const { data, error } = await supabase
        .from("presentacion")
        .insert({
          url: payload.url,
          estado: payload.estado !== undefined ? payload.estado : true,
          usuario_id: userId
        })
        .select()
        .single();
      if (error) throw error;
      return formatPresentacion(data);
    } catch (error) {
      throw error.message || "Error al crear presentación";
    }
  },

  // ACTUALIZAR (PUT /presentacion/{id})
  update: async (id, payload) => {
    try {
      const userId = getUsuarioActualId();
      const { data, error } = await supabase
        .from("presentacion")
        .update({
          url: payload.url,
          estado: payload.estado,
          usuario_id: userId
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return formatPresentacion(data);
    } catch (error) {
      throw error.message || "Error al actualizar presentación";
    }
  },

  // ELIMINAR (DELETE /presentacion/{id})
  remove: async (id) => {
    try {
      const { error } = await supabase
        .from("presentacion")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return true;
    } catch (error) {
      throw error.message || "Error al eliminar presentación";
    }
  },
};
