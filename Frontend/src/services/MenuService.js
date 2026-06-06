import { supabase } from "../api/supabase";
import AuthService from "./AuthService";

const getUsuarioActualId = () => {
  try {
    const user = AuthService.getCurrentUser();
    if (!user) return null;
    return user.id || user.usuario?.id || user.user?.id || null;
  } catch (e) {
    console.error("Error obteniendo usuario en MenuService:", e);
    return null;
  }
};

const formatMenu = (item) => {
  if (!item) return null;
  return {
    ...item,
    usuario_id: item.usuario_id ? { id: item.usuario_id } : null
  };
};

const MenuService = {
  // Obtener todos los menús
  getAllMenus: async () => {
    try {
      const { data, error } = await supabase
        .from("menu")
        .select("*")
        .order("orden", { ascending: true });
      if (error) throw error;
      return (data || []).map(formatMenu);
    } catch (error) {
      throw error.message || "Error al obtener menús";
    }
  },

  // Obtener menú por ID
  getMenuById: async (id) => {
    try {
      const { data, error } = await supabase
        .from("menu")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return formatMenu(data);
    } catch (error) {
      throw error.message || "Error al obtener menú";
    }
  },

  // Crear menú
  createMenu: async (menuData) => {
    try {
      const userId = getUsuarioActualId();
      const { data, error } = await supabase
        .from("menu")
        .insert({
          titulo: menuData.titulo,
          ruta: menuData.ruta,
          icono: menuData.icono,
          orden: menuData.orden,
          estado: menuData.estado !== undefined ? menuData.estado : true,
          usuario_id: userId
        })
        .select()
        .single();
      if (error) throw error;
      return formatMenu(data);
    } catch (error) {
      throw error.message || "Error al crear menú";
    }
  },

  // Actualizar menú
  updateMenu: async (id, menuData) => {
    try {
      const userId = getUsuarioActualId();
      const { data, error } = await supabase
        .from("menu")
        .update({
          titulo: menuData.titulo,
          ruta: menuData.ruta,
          icono: menuData.icono,
          orden: menuData.orden,
          estado: menuData.estado,
          usuario_id: userId
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return formatMenu(data);
    } catch (error) {
      throw error.message || "Error al actualizar menú";
    }
  },

  // Eliminar menú
  deleteMenu: async (id) => {
    try {
      const { error } = await supabase
        .from("menu")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return true;
    } catch (error) {
      throw error.message || "Error al eliminar menú";
    }
  }
};

export default MenuService;