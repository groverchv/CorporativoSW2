// src/pages/Dashboard/Contenido/ContentEditor.jsx
import React, { useState, useEffect, useRef } from "react";
import { Button, Space, Typography, message, Modal } from "antd";
import {
    SaveOutlined,
    FullscreenOutlined,
    ArrowLeftOutlined,
    UploadOutlined,
    DownloadOutlined,
    ClearOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
// PresentationMode removed - was part of block system

import ContenidoService from "../../../../services/ContenidoService";
import RichTextEditor from "../../../../components/RichTextEditorFull";
import { useImportarWord, useExportarWord, useImageConfig } from "./Funcionalidades";
import ImageContextMenu from "./ImageContextMenu";
import ImageConfigModal from "./ImageConfigModal";
import "./ContentEditor.css";

const { Title, Text } = Typography;

export default function ContentEditor() {
    const { contenidoId } = useParams();
    const navigate = useNavigate();
    const quillRef = useRef(null);
    const [modal, contextHolder] = Modal.useModal();

    // Estado del contenido
    const [contenido, setContenido] = useState(null);
    const [loading, setLoading] = useState(true);

    // Estado del contenido HTML (borrador)
    const [contenidoHtml, setContenidoHtml] = useState('');
    // Contenido publicado actual (para comparación)
    const [contenidoPublicado, setContenidoPublicado] = useState('');
    const [saving, setSaving] = useState(false);
    // Presentation mode removed - was part of block system

    // Hooks de funcionalidades Word
    const { importar: importFromWord } = useImportarWord(quillRef, setContenidoHtml);
    const { exportar: exportToWord } = useExportarWord(quillRef);

    // Hook para configuración de imágenes
    const {
        modalVisible: imageModalVisible,
        selectedImage,
        contextMenu,
        clipboard,
        openConfigFromMenu,
        applyImageConfig,
        deleteImage,
        copyImage,
        cutImage,
        pasteImage,
        rotateImage,
        openCropModal,
        closeModal: closeImageModal,
        alignLeft,
        alignCenter,
        alignRight
    } = useImageConfig(quillRef, contenidoHtml);

    // Cargar contenido al montar
    useEffect(() => {
        const loadContenido = async () => {
            if (!contenidoId) return;

            setLoading(true);
            try {
                // Cargar información del contenido
                const contenidoData = await ContenidoService.getContenidoById(contenidoId);
                setContenido(contenidoData);

                // Cargar el contenido HTML (borrador) si existe
                setContenidoHtml(contenidoData.contenidoHtml || '');
                // Guardar el contenido publicado actual para referencia
                setContenidoPublicado(contenidoData.contenidoPublicado || '');
            } catch (error) {
                message.error("Error al cargar contenido");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadContenido();
    }, [contenidoId]);

    // Guardar Interno - guarda el borrador SIN cambiar el estado de publicación
    // El contenido publicado anteriormente sigue visible para los usuarios
    const handleSaveInternal = async () => {
        if (!contenido) return;

        setSaving(true);
        try {
            await ContenidoService.updateContenido(contenido.id, {
                contenidoHtml: contenidoHtml
                // NO enviamos 'estado' para no afectar la publicación actual
            });
            message.success("¡Borrador guardado! El contenido publicado sigue visible para los usuarios.");

        } catch (error) {
            message.error("Error al guardar contenido");
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    // Publicar - muestra confirmación y guarda con estado = true
    const handlePublishWithConfirmation = () => {
        if (!contenido) return;

        modal.confirm({
            title: '¿Confirmar Publicación?',
            icon: <ExclamationCircleOutlined />,
            content: <div>
                <p>¿Estás seguro de que deseas publicar este contenido?</p>
                <p><strong>"{contenido.titulo}"</strong></p>
                <p style={{ color: '#52c41a', marginTop: 12 }}>
                    Al publicar, el contenido será visible para todos los usuarios que visiten la página pública.
                </p>
            </div>,
            okText: 'Sí, publicar',
            okType: 'primary',
            okButtonProps: {
                style: { background: '#52c41a', borderColor: '#52c41a' }
            },
            cancelText: 'Cancelar',
            async onOk() {
                setSaving(true);
                try {
                    await ContenidoService.updateContenido(contenido.id, {
                        contenidoHtml: contenidoHtml,
                        estado: true // Publicar
                    });
                    message.success("¡Contenido publicado exitosamente!");

                    // Actualizar el estado local
                    setContenido({ ...contenido, estado: true });
                    // El borrador actual ahora es el publicado
                    setContenidoPublicado(contenidoHtml);
                } catch (error) {
                    message.error("Error al publicar contenido");
                    console.error(error);
                } finally {
                    setSaving(false);
                }
            },
            onCancel() {
                console.log('Publicación cancelada por el usuario');
            },
        });
    };

    // Volver sin guardar
    const handleGoBack = () => {
        navigate('/dashboard/contenido');
    };

    // Limpiar todo el contenido con confirmación
    const handleClearAll = () => {
        console.log('🗑️ Botón Limpiar Todo clickeado');

        modal.confirm({
            title: '¿Estás seguro de que quieres limpiar todo el contenido?',
            icon: <ExclamationCircleOutlined />,
            content: 'Esta acción no se puede deshacer. Todo el contenido del editor será eliminado.',
            okText: 'Sí, limpiar todo',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                console.log('✅ Usuario confirmó limpieza');
                try {
                    // 1. Limpiar directamente el editor Quill para feedback inmediato
                    if (quillRef.current) {
                        const editor = quillRef.current.getEditor();
                        editor.setContents([]);
                        console.log('✅ Editor Quill limpiado directamente');
                    }

                    // 2. Actualizar el estado
                    setContenidoHtml('');
                    message.success('Contenido limpiado correctamente');
                } catch (error) {
                    console.error('❌ Error al limpiar:', error);
                    message.error('Error al limpiar el contenido');
                }
            },
            onCancel() {
                console.log('❌ Limpieza cancelada por el usuario');
            },
        });
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <Title level={3}>Cargando editor...</Title>
            </div>
        );
    }

    if (!contenido) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <Title level={3}>Contenido no encontrado</Title>
                <Button onClick={handleGoBack}>Volver</Button>
            </div>
        );
    }

    return (
        <>
            {contextHolder}
            <div className="content-editor-wrapper">
                {/* Header */}
                <div className="editor-header">
                    <div className="editor-header-content">
                        <div className="editor-title-section">
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={handleGoBack}
                            >
                                Volver
                            </Button>
                            <div>
                                <Title level={4} style={{ margin: 0 }}>
                                    {contenido.titulo || 'Sin título'}
                                </Title>
                                <Text type="secondary">
                                    ID: {contenido.id} | 
                                    {contenidoPublicado ? (
                                        contenidoHtml !== contenidoPublicado ? (
                                            <span style={{ color: '#faad14' }}> 🟡 Cambios sin publicar</span>
                                        ) : (
                                            <span style={{ color: '#52c41a' }}> 🟢 Publicado (sin cambios)</span>
                                        )
                                    ) : (
                                        <span style={{ color: '#ff4d4f' }}> 🔴 Nunca publicado</span>
                                    )}
                                </Text>
                            </div>
                        </div>
                        <Space className="editor-actions">
                            <Button
                                icon={<UploadOutlined />}
                                onClick={importFromWord}
                                title="Importar desde Word (.docx)"
                            >
                                Importar Word
                            </Button>
                            <Button
                                icon={<DownloadOutlined />}
                                onClick={exportToWord}
                                disabled={!contenidoHtml || contenidoHtml.trim() === ''}
                                title="Exportar a Word (.docx)"
                            >
                                Exportar Word
                            </Button>
                            <Button
                                icon={<ClearOutlined />}
                                onClick={handleClearAll}
                                disabled={!contenidoHtml || contenidoHtml.trim() === ''}
                                danger
                                title="Limpiar todo el contenido"
                            >
                                Limpiar Todo
                            </Button>
                            {/* Vista Previa removed - was part of block system */}
                            <Button
                                onClick={handleSaveInternal}
                                loading={saving}
                                icon={<SaveOutlined />}
                                title="Guardar cambios sin publicar"
                            >
                                Guardar Interno
                            </Button>
                            <Button
                                type="primary"
                                onClick={handlePublishWithConfirmation}
                                loading={saving}
                                style={{ background: '#52c41a', borderColor: '#52c41a' }}
                                title="Publicar contenido para hacerlo visible al público"
                            >
                                Publicar
                            </Button>
                        </Space>
                    </div>
                </div>

                {/* Editor de Texto Libre - Ocupa todo el espacio */}
                <div className="editor-main-area">
                    <div className="rich-text-wrapper">
                        <RichTextEditor
                            externalRef={quillRef}
                            value={contenidoHtml}
                            onChange={setContenidoHtml}
                            placeholder="Comienza a escribir tu contenido aquí... Puedes usar todas las herramientas de formato como en Microsoft Word."
                            height="calc(100vh - 300px)"
                            toolbar="full"
                        />
                    </div>
                </div>
            </div>

            {/* Presentation Mode removed - was part of block system */}

            {/* Menú contextual para imágenes */}
            <ImageContextMenu
                visible={contextMenu.visible}
                x={contextMenu.x}
                y={contextMenu.y}
                imageRect={contextMenu.imageRect}
                onConfigure={openConfigFromMenu}
                onDelete={deleteImage}
                onCopy={copyImage}
                onCut={cutImage}
                onPaste={pasteImage}
                onCrop={openCropModal}
                onRotate={rotateImage}
                onAlignLeft={alignLeft}
                onAlignCenter={alignCenter}
                onAlignRight={alignRight}
                hasClipboard={clipboard !== null}
            />

            {/* Modal de configuración de imagen */}
            <ImageConfigModal
                visible={imageModalVisible}
                onCancel={closeImageModal}
                onApply={applyImageConfig}
                imageElement={selectedImage}
            />
        </>
    );
}
