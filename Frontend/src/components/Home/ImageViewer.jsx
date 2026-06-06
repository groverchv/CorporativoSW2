// src/components/Dashboard/ImageViewer.jsx
import React, { useState, useEffect } from 'react';
import { DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import './ImageViewer.css';

export default function ImageViewer({ visible, imageUrl, onClose, imageName }) {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (visible) {
            setIsClosing(false);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [visible]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 200);
    };

    const handleDownload = async (e) => {
        e.stopPropagation();
        try {
            if (imageUrl.startsWith('data:')) {
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = imageName || 'imagen.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                try {
                    const response = await fetch(imageUrl);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = imageName || 'imagen.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                } catch (err) {
                    console.warn("Fetch falló, abriendo en nueva pestaña", err);
                    window.open(imageUrl, '_blank');
                }
            }
        } catch (error) {
            console.error('Error al descargar imagen:', error);
            window.open(imageUrl, '_blank');
        }
    };

    if (!visible) return null;

    return (
        <div 
            className={`image-viewer-overlay ${isClosing ? 'closing' : ''}`}
            onClick={handleClose}
        >
            {/* Botones flotantes */}
            <div className="image-viewer-actions" onClick={(e) => e.stopPropagation()}>
                <button 
                    className="action-btn download-btn"
                    onClick={handleDownload}
                    title="Descargar imagen"
                >
                    <DownloadOutlined />
                    {/* El texto ahora siempre se renderiza, controlado por CSS si fuera necesario */}
                    <span>Descargar</span>
                </button>
                <button 
                    className="action-btn close-btn"
                    onClick={handleClose}
                    title="Cerrar"
                >
                    <CloseOutlined />
                </button>
            </div>

            {/* Imagen */}
            <div className="image-viewer-content">
                <img
                    src={imageUrl}
                    alt="Vista ampliada"
                    onClick={(e) => e.stopPropagation()}
                    draggable={false}
                />
            </div>

            {/* Instrucción */}
            <div className="image-viewer-hint">
                Toca fuera para cerrar
            </div>
        </div>
    );
}