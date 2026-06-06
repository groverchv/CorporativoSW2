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

const formatSubMenu = (item) => {
  if (!item) return null;
  return {
    ...item,
    usuario_id: item.usuario_id ? { id: item.usuario_id } : null,
    menu_id: item.menu ? item.menu : (item.menu_id ? { id: item.menu_id } : null),
    menu: item.menu || (item.menu_id ? { id: item.menu_id } : null)
  };
};

const Sub_MenuService = {
  // Obtener todos
  getAllSubMenu: async () => {
    try {
      const { data, error } = await supabase
        .from("sub_menu")
        .select("*, menu:menu_id(*)")
        .order("orden", { ascending: true });
      if (error) throw error;
      return (data || []).map(formatSubMenu);
    } catch (error) {
      throw error.message || "Error al obtener sub-menús";
    }
  },

  // Obtener por ID
  getSubMenuById: async (id) => {
    try {
      const { data, error } = await supabase
        .from("sub_menu")
        .select("*, menu:menu_id(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return formatSubMenu(data);
    } catch (error) {
      throw error.message || "Error al obtener sub-menú";
    }
  },

  // Crear
  createSubMenu: async (data) => {
    try {
      const userId = getUsuarioActualId();
      const menuId = data.menu_id?.id || data.menu_id;

      if (!menuId) {
        throw new Error("menu_id es obligatorio");
      }

      const { data: result, error } = await supabase
        .from("sub_menu")
        .insert({
          titulo: data.titulo,
          ruta: data.ruta,
          icono: data.icono,
          orden: data.orden,
          estado: data.estado !== undefined ? data.estado : true,
          usuario_id: userId,
          menu_id: menuId
        })
        .select()
        .single();

      if (error) throw error;
      return formatSubMenu(result);
    } catch (error) {
      throw error.message || "Error al crear sub-menú";
    }
  },

  // Actualizar
  updateSubMenu: async (id, data) => {
    try {
      const userId = getUsuarioActualId();
      const menuId = data.menu_id?.id || data.menu_id;

      if (!menuId) {
        throw new Error("menu_id es obligatorio");
      }

      const { data: result, error } = await supabase
        .from("sub_menu")
        .update({
          titulo: data.titulo,
          ruta: data.ruta,
          icono: data.icono,
          orden: data.orden,
          estado: data.estado,
          usuario_id: userId,
          menu_id: menuId
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return formatSubMenu(result);
    } catch (error) {
      throw error.message || "Error al actualizar sub-menú";
    }
  },

  // Eliminar
  deleteSubMenu: async (id) => {
    try {
      const { error } = await supabase
        .from("sub_menu")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return true;
    } catch (error) {
      throw error.message || "Error al eliminar sub-menú";
    }
  }
};

export default Sub_MenuService;