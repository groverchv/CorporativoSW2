// src/components/Dashboard/ContenidoDinamico.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Spin, Empty, Alert, Divider } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import DOMPurify from 'dompurify';
import ContenidoService from "../../services/ContenidoService";
import Sub_MenuService from "../../services/Sub_MenuService";
import CacheService from "../../services/CacheService";
import ImageViewer from "./ImageViewer";
import 'react-quill-new/dist/quill.snow.css';
import '../RichTextEditor.css';
import '../QuillFonts.css';
import './ContenidoDinamico.css';

const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

export default function ContenidoDinamico() {
    const location = useLocation();
    const ruta = location.pathname;
    const contentRef = useRef(null);

    const [contenidos, setContenidos] = useState([]);
    const [subMenu, setSubMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para el visor de imágenes
    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    // Función para manejar click en imágenes
    const handleImageClick = useCallback((e) => {
        if (e.target.tagName === 'IMG' && e.target.closest('.rich-content')) {
            e.preventDefault();
            setSelectedImage(e.target.src);
            setImageViewerVisible(true);
        }
    }, []);

    // Agregar listener para clicks en imágenes
    useEffect(() => {
        const container = contentRef.current;
        if (container) {
            container.addEventListener('click', handleImageClick);
            return () => container.removeEventListener('click', handleImageClick);
        }
    }, [handleImageClick, contenidos]);

    useEffect(() => {
        const loadContenido = async () => {
            if (!ruta || ruta === '/') {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // 1. Buscar el SubMenu por su ruta (con caché)
                const allSubMenus = await CacheService.getOrFetch(
                    'all_submenus',
                    () => Sub_MenuService.getAllSubMenu()
                );

                const foundSubMenu = allSubMenus.find((sm) => sm.ruta === ruta);

                if (!foundSubMenu) {
                    setError(`No se encontró contenido para la ruta: ${ruta}`);
                    setLoading(false);
                    return;
                }

                if (!foundSubMenu.estado) {
                    setError('Este contenido no está disponible públicamente');
                    setLoading(false);
                    return;
                }

                const menu = foundSubMenu.menu_id || foundSubMenu.menu;
                if (menu && !menu.estado) {
                    setError('Este contenido no está disponible públicamente');
                    setLoading(false);
                    return;
                }

                setSubMenu(foundSubMenu);

                // 2. Obtener contenidos del SubMenu (con caché)
                const contenidosData = await CacheService.getOrFetch(
                    `contenidos_submenu_${foundSubMenu.id}`,
                    () => ContenidoService.getContenidosBySubMenu(foundSubMenu.id)
                );

                // 3. Cargar contenido completo (con caché individual)
                // Solo procesar contenidos que estén visibles (estado = true)
                const contenidosVisibles = contenidosData.filter(c => c.estado !== false);
                const contenidosConHtml = [];
                
                await Promise.all(
                    contenidosVisibles.map(async (contenido) => {
                        try {
                            const contenidoCompleto = await CacheService.getOrFetch(
                                `contenido_${contenido.id}`,
                                () => ContenidoService.getContenidoById(contenido.id)
                            );

                            // Verificar nuevamente que el contenido esté visible
                            if (contenidoCompleto.contenidoPublicado && contenidoCompleto.estado !== false) {
                                contenidosConHtml.push(contenidoCompleto);
                            }
                        } catch (err) {
                            console.error(`Error cargando contenido ${contenido.id}:`, err);
                        }
                    })
                );

                // Ordenar contenidos por orden
                contenidosConHtml.sort((a, b) => (a.orden || 0) - (b.orden || 0));
                setContenidos(contenidosConHtml);
            } catch (err) {
                console.error("Error al cargar contenido:", err);
                setError(err.toString());
            } finally {
                setLoading(false);
            }
        };

        loadContenido();
    }, [ruta]);

    if (loading) {
        return (
            <div className="contenido-loading">
                <Spin indicator={antIcon} />
                <p>Cargando contenido...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="contenido-error">
                <Alert
                    message="Error al cargar contenido"
                    description={error}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    if (!subMenu) {
        return (
            <div className="contenido-empty">
                <Empty
                    description={`No se encontró contenido para la ruta: ${ruta}`}
                />
            </div>
        );
    }

    if (contenidos.length === 0) {
        return (
            <div className="contenido-empty">
                <Empty
                    description={`La página "${subMenu.titulo}" aún no tiene contenido publicado`}
                />
            </div>
        );
    }

    const isGridLayout = contenidos.length > 1;
    return (
        <>
            <div className={`contenido-dinamico-wrapper ${isGridLayout ? 'grid-layout' : 'single-layout'}`} ref={contentRef}>
                {contenidos.map((contenido, idx) => (
                    <div 
                        key={contenido.id} 
                        className={`contenido-item ${isGridLayout && idx === 0 ? 'featured-item' : 'standard-item'}`}
                    >
                        <div className="rich-text-editor-wrapper">
                            <div
                                className="ql-editor rich-content"
                                dangerouslySetInnerHTML={{ 
                                    __html: DOMPurify.sanitize(contenido.contenidoPublicado, {
                                        ADD_ATTR: ['style', 'class']
                                    }) 
                                }}
                            />
                        </div>

                        {!isGridLayout && idx < contenidos.length - 1 && (
                            <Divider className="contenido-divider" />
                        )}
                    </div>
                ))}
            </div>

            {/* Visor de imágenes */}
            <ImageViewer
                visible={imageViewerVisible}
                imageUrl={selectedImage}
                onClose={() => setImageViewerVisible(false)}
            />
        </>
    );
}
