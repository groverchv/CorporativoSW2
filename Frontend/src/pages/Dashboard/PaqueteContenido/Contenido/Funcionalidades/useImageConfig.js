// src/pages/Dashboard/PaqueteContenido/Contenido/Funcionalidades/useImageConfig.js
import { useState, useCallback, useEffect } from 'react';

export default function useImageConfig(quillRef, contenidoHtml) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
    const [clipboard, setClipboard] = useState(null); // Internal clipboard for copy/paste

    // Helper para obtener el editor de forma segura
    const getQuillEditor = useCallback(() => {
        try {
            if (!quillRef?.current) return null;
            const editor = quillRef.current.getEditor?.();
            return editor || null;
        } catch (error) {
            console.warn('Error al obtener editor:', error);
            return null;
        }
    }, [quillRef]);

    // Configurar event listeners en imágenes - SE EJECUTA CUANDO CAMBIA EL CONTENIDO
    useEffect(() => {
        // No ejecutar si no hay contenido
        if (!contenidoHtml) return;

        // Esperar un momento para que Quill procese el contenido
        const timer = setTimeout(() => {
            const quill = getQuillEditor();
            if (!quill) {
                return;
            }

            const editorElement = quill.root;

            // Configurar imágenes
            const configureImages = () => {
                const images = editorElement.querySelectorAll('img');

                images.forEach((img) => {
                    // Click IZQUIERDO: Seleccionar para redimensionar y arrastrar
                    img.onclick = (e) => {
                        e.stopPropagation();

                        // Seleccionar la imagen en Quill para activar resize handles
                        const editor = getQuillEditor();
                        if (editor) {
                            try {
                                const imgBlot = editor.constructor.find(img);
                                if (imgBlot) {
                                    const imgIndex = editor.getIndex(imgBlot);
                                    editor.setSelection(imgIndex, 1, 'user');
                                }
                            } catch (err) {
                                console.warn('Error seleccionando imagen:', err);
                            }
                        }
                    };

                    // Click DERECHO: Menú contextual
                    img.oncontextmenu = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const imgRect = img.getBoundingClientRect();
                        setSelectedImage(img);
                        setContextMenu({
                            visible: true,
                            x: e.clientX,
                            y: e.clientY,
                            imageRect: {
                                left: imgRect.left,
                                top: imgRect.top,
                                right: imgRect.right,
                                bottom: imgRect.bottom,
                                width: imgRect.width,
                                height: imgRect.height
                            }
                        });
                        return false;
                    };

                    img.style.cursor = 'pointer';
                });
            };

            // Configurar imágenes existentes
            configureImages();

            // Observer para nuevas imágenes
            const observer = new MutationObserver(() => {
                configureImages();
            });

            observer.observe(editorElement, { childList: true, subtree: true });

            // Escuchar cambios de Quill
            quill.on('text-change', () => {
                setTimeout(configureImages, 100);
            });

            // Cleanup en el return del timeout
            return () => {
                observer.disconnect();
            };
        }, 500);

        // Cleanup del timer
        return () => clearTimeout(timer);
    }, [contenidoHtml, getQuillEditor]); // Usar contenidoHtml como dependencia

    // Cerrar menú al hacer click fuera
    useEffect(() => {
        const handleClickOutside = () => {
            if (contextMenu.visible) {
                setContextMenu({ visible: false, x: 0, y: 0 });
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [contextMenu.visible]);

    // Abrir modal desde menú contextual
    const openConfigFromMenu = useCallback(() => {
        setContextMenu({ visible: false, x: 0, y: 0 });
        setModalVisible(true);
    }, []);

    // Alineación rápida
    const applyQuickAlignment = useCallback((alignment) => {
        if (!selectedImage) return;

        const quill = getQuillEditor();
        if (!quill) return;

        selectedImage.classList.remove('align-left', 'align-center', 'align-right');

        if (alignment) {
            selectedImage.classList.add(`align-${alignment}`);
        }

        selectedImage.style.display = 'block';

        if (alignment === 'center') {
            selectedImage.style.marginLeft = 'auto';
            selectedImage.style.marginRight = 'auto';
        } else if (alignment === 'left') {
            selectedImage.style.marginLeft = '0';
            selectedImage.style.marginRight = 'auto';
        } else if (alignment === 'right') {
            selectedImage.style.marginLeft = 'auto';
            selectedImage.style.marginRight = '0';
        }

        try {
            quill.updateContents([{ retain: quill.getLength() }], 'user');
        } catch (err) {
            console.warn('Error actualizando contenido:', err);
        }

        setContextMenu({ visible: false, x: 0, y: 0 });
    }, [selectedImage, getQuillEditor]);

    const alignLeft = useCallback(() => applyQuickAlignment('left'), [applyQuickAlignment]);
    const alignCenter = useCallback(() => applyQuickAlignment('center'), [applyQuickAlignment]);
    const alignRight = useCallback(() => applyQuickAlignment('right'), [applyQuickAlignment]);

    // Copy image
    const copyImage = useCallback(() => {
        if (!selectedImage) return;
        setClipboard({
            src: selectedImage.src,
            alt: selectedImage.getAttribute('alt') || '',
            title: selectedImage.getAttribute('title') || '',
            style: selectedImage.getAttribute('style') || '',
            className: selectedImage.className || ''
        });
        setContextMenu({ visible: false, x: 0, y: 0 });
    }, [selectedImage]);

    // Cut image
    const cutImage = useCallback(() => {
        if (!selectedImage) return;
        setClipboard({
            src: selectedImage.src,
            alt: selectedImage.getAttribute('alt') || '',
            title: selectedImage.getAttribute('title') || '',
            style: selectedImage.getAttribute('style') || '',
            className: selectedImage.className || ''
        });
        const quill = getQuillEditor();
        if (quill) {
            try {
                const imgBlot = quill.constructor.find(selectedImage);
                if (imgBlot) {
                    const index = quill.getIndex(imgBlot);
                    quill.deleteText(index, 1);
                }
            } catch (err) {
                console.warn('Error cortando imagen:', err);
            }
        }
        setContextMenu({ visible: false, x: 0, y: 0 });
        setSelectedImage(null);
    }, [selectedImage, getQuillEditor]);

    // Paste image
    const pasteImage = useCallback(() => {
        if (!clipboard) return;
        const quill = getQuillEditor();
        if (!quill) return;
        
        try {
            const range = quill.getSelection() || { index: 0 };
            quill.insertEmbed(range.index, 'image', clipboard.src);
            setTimeout(() => {
                const images = quill.root.querySelectorAll('img');
                const newImg = images[images.length - 1];
                if (newImg && newImg.src === clipboard.src) {
                    if (clipboard.alt) newImg.setAttribute('alt', clipboard.alt);
                    if (clipboard.title) newImg.setAttribute('title', clipboard.title);
                    if (clipboard.style) newImg.setAttribute('style', clipboard.style);
                    if (clipboard.className) newImg.className = clipboard.className;
                }
            }, 50);
        } catch (err) {
            console.warn('Error pegando imagen:', err);
        }
        setContextMenu({ visible: false, x: 0, y: 0 });
    }, [clipboard, getQuillEditor]);

    // Rotate image
    const rotateImage = useCallback(() => {
        if (!selectedImage) return;
        const currentRotation = parseInt(selectedImage.getAttribute('data-rotation') || '0');
        const newRotation = (currentRotation + 90) % 360;
        selectedImage.setAttribute('data-rotation', newRotation);
        selectedImage.style.transform = `rotate(${newRotation}deg)`;
        setContextMenu({ visible: false, x: 0, y: 0 });
    }, [selectedImage]);

    // Open crop modal
    const openCropModal = useCallback(() => {
        setContextMenu({ visible: false, x: 0, y: 0 });
        setModalVisible(true);
    }, []);

    // Aplicar configuración completa
    const applyImageConfig = useCallback((config) => {
        if (!selectedImage) return;
        const quill = getQuillEditor();
        if (!quill) return;
        
        try {
            Object.entries(config.styles).forEach(([key, value]) => {
                selectedImage.style[key] = value;
            });
            if (config.alt !== undefined) selectedImage.setAttribute('alt', config.alt);
            if (config.title !== undefined) selectedImage.setAttribute('title', config.title);
            const parentLink = selectedImage.closest('a');
            if (config.linkUrl) {
                if (parentLink) {
                    parentLink.setAttribute('href', config.linkUrl);
                    parentLink.setAttribute('target', config.linkTarget);
                } else {
                    const link = document.createElement('a');
                    link.setAttribute('href', config.linkUrl);
                    link.setAttribute('target', config.linkTarget);
                    const parent = selectedImage.parentElement;
                    parent.insertBefore(link, selectedImage);
                    link.appendChild(selectedImage);
                }
            } else if (parentLink) {
                const parent = parentLink.parentElement;
                parent.insertBefore(selectedImage, parentLink);
                parent.removeChild(parentLink);
            }

        if (config.alignment) {
            selectedImage.classList.remove('align-left', 'align-center', 'align-right');
            selectedImage.classList.add(`align-${config.alignment}`);

            selectedImage.style.display = 'block';
            if (config.alignment === 'center') {
                selectedImage.style.marginLeft = 'auto';
                selectedImage.style.marginRight = 'auto';
            } else if (config.alignment === 'left') {
                selectedImage.style.marginLeft = '0';
                selectedImage.style.marginRight = 'auto';
            } else if (config.alignment === 'right') {
                selectedImage.style.marginLeft = 'auto';
                selectedImage.style.marginRight = '0';
            }
        }

        if (config.styles.float && config.styles.float !== 'none') {
            selectedImage.style.display = 'inline-block';
            selectedImage.style.verticalAlign = 'top';
            selectedImage.classList.remove('align-left', 'align-center', 'align-right');

            if (config.styles.float === 'left') {
                selectedImage.style.marginRight = selectedImage.style.marginRight || '15px';
            } else if (config.styles.float === 'right') {
                selectedImage.style.marginLeft = selectedImage.style.marginLeft || '15px';
            }
        }

        quill.updateContents([{ retain: quill.getLength() }], 'user');
        } catch (err) {
            console.warn('Error aplicando configuración de imagen:', err);
        }

        setModalVisible(false);
        setSelectedImage(null);
    }, [selectedImage, getQuillEditor]);

    // Borrar imagen
    const deleteImage = useCallback(() => {
        if (!selectedImage) return;
        const quill = getQuillEditor();
        if (!quill) return;
        
        try {
            const imgBlot = quill.constructor.find(selectedImage);
            if (imgBlot) {
                const index = quill.getIndex(imgBlot);
                quill.deleteText(index, 1);
            }
        } catch (err) {
            console.warn('Error eliminando imagen:', err);
        }
        setContextMenu({ visible: false, x: 0, y: 0 });
        setSelectedImage(null);
    }, [selectedImage, getQuillEditor]);

    const closeModal = useCallback(() => {
        setModalVisible(false);
        setSelectedImage(null);
    }, []);

    return {
        modalVisible,
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
        closeModal,
        closeContextMenu: () => setContextMenu({ visible: false, x: 0, y: 0 }),
        alignLeft,
        alignCenter,
        alignRight
    };
}
