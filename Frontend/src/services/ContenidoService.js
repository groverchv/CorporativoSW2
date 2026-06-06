import { supabase } from "../api/supabase";
import AuthService from "./AuthService";
import CacheService from "./CacheService";

const getUsuarioActualId = () => {
    try {
        const user = AuthService.getCurrentUser();
        if (!user) return null;
        return user.id || user.usuario?.id || user.user?.id || null;
    } catch (e) {
        console.error("Error obteniendo usuario en ContenidoService:", e);
        return null;
    }
};

const formatContenido = (item) => {
    if (!item) return null;
    return {
        ...item,
        contenidoHtml: item.contenido_html,
        contenidoPublicado: item.contenido_publicado,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        subMenu: item.sub_menu_id ? { id: item.sub_menu_id } : null,
        usuario: item.usuario_id ? { id: item.usuario_id } : null
    };
};

const ContenidoService = {
    // Obtener todos los contenidos
    getAllContenidos: async () => {
        try {
            const { data, error } = await supabase
                .from("contenido")
                .select("*")
                .order("orden", { ascending: true });
            if (error) throw error;
            return (data || []).map(formatContenido);
        } catch (error) {
            throw error.message || "Error al obtener todos los contenidos";
        }
    },

    // Obtener todos los contenidos de un SubMenu
    getContenidosBySubMenu: async (subMenuId) => {
        try {
            const { data, error } = await supabase
                .from("contenido")
                .select("*")
                .eq("sub_menu_id", subMenuId)
                .order("orden", { ascending: true });
            if (error) throw error;
            return (data || []).map(formatContenido);
        } catch (error) {
            throw error.message || "Error al obtener contenidos";
        }
    },

    // Obtener un contenido específico
    getContenidoById: async (contenidoId) => {
        try {
            const { data, error } = await supabase
                .from("contenido")
                .select("*")
                .eq("id", contenidoId)
                .single();
            if (error) throw error;
            return formatContenido(data);
        } catch (error) {
            throw error.message || "Error al obtener contenido";
        }
    },

    // Crear nuevo contenido
    createContenido: async (subMenuId, titulo) => {
        try {
            const userId = getUsuarioActualId();
            const { data, error } = await supabase
                .from("contenido")
                .insert({
                    titulo,
                    sub_menu_id: subMenuId,
                    usuario_id: userId,
                    orden: 0,
                    estado: true
                })
                .select()
                .single();

            if (error) throw error;
            return formatContenido(data);
        } catch (error) {
            throw error.message || "Error al crear contenido";
        }
    },

    // Actualizar contenido (título/estado/HTML/Publicado)
    updateContenido: async (contenidoId, updates) => {
        try {
            const payload = { ...updates };
            // Mapear de subMenu a sub_menu_id si fuera necesario
            if (payload.subMenu) {
                payload.sub_menu_id = payload.subMenu.id || payload.subMenu;
                delete payload.subMenu;
            }
            if (payload.usuario) {
                payload.usuario_id = payload.usuario.id || payload.usuario;
                delete payload.usuario;
            }
            if ('contenidoHtml' in payload) {
                payload.contenido_html = payload.contenidoHtml;
                delete payload.contenidoHtml;
            }
            if ('contenidoPublicado' in payload) {
                payload.contenido_publicado = payload.contenidoPublicado;
                delete payload.contenidoPublicado;
            }

            const { data, error } = await supabase
                .from("contenido")
                .update(payload)
                .eq("id", contenidoId)
                .select()
                .single();

            if (error) throw error;
            
            // Invalidar caché del contenido actualizado
            CacheService.invalidate(`contenido_${contenidoId}`);
            CacheService.invalidateByPrefix('contenidos_submenu_');
            
            return formatContenido(data);
        } catch (error) {
            throw error.message || "Error al actualizar contenido";
        }
    },

    // Eliminar contenido
    deleteContenido: async (contenidoId) => {
        try {
            const { error } = await supabase
                .from("contenido")
                .delete()
                .eq("id", contenidoId);
            if (error) throw error;
            
            // Invalidar caché
            CacheService.invalidate(`contenido_${contenidoId}`);
            CacheService.invalidateByPrefix('contenidos_submenu_');
            
            return true;
        } catch (error) {
            throw error.message || "Error al eliminar contenido";
        }
    }
};

export default ContenidoService;
