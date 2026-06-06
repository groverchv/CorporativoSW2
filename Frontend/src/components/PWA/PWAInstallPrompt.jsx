// src/components/PWA/PWAInstallPrompt.jsx
// Componente para manejar la instalación de la PWA

import { useState, useEffect } from 'react';
import { Button, Modal, Space, Typography, Card } from 'antd';
import { 
  DownloadOutlined, 
  MobileOutlined, 
  WifiOutlined,
  BellOutlined,
  ThunderboltOutlined,
  CloseOutlined 
} from '@ant-design/icons';
import './PWAInstallPrompt.css';

const { Title, Text, Paragraph } = Typography;

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Verificar si es iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // Manejar el evento beforeinstallprompt (Chrome, Edge, Samsung Internet)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Mostrar el prompt después de un tiempo (mejor UX)
      const hasSeenPrompt = localStorage.getItem('pwa-prompt-dismissed');
      const lastDismissed = localStorage.getItem('pwa-prompt-dismissed-time');
      
      // Mostrar si nunca lo ha visto o han pasado 7 días
      if (!hasSeenPrompt || (lastDismissed && Date.now() - parseInt(lastDismissed) > 7 * 24 * 60 * 60 * 1000)) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    // Manejar instalación exitosa
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      console.log('✅ PWA instalada exitosamente');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Mostrar instrucciones de iOS si aplica
    if (isIOS && !window.matchMedia('(display-mode: standalone)').matches) {
      const hasSeenIOSPrompt = localStorage.getItem('ios-install-prompt-dismissed');
      if (!hasSeenIOSPrompt) {
        setTimeout(() => setShowIOSInstructions(true), 5000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('Usuario aceptó instalar la PWA');
      } else {
        console.log('Usuario rechazó instalar la PWA');
      }
    } catch (error) {
      console.error('Error al instalar:', error);
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
    localStorage.setItem('pwa-prompt-dismissed-time', Date.now().toString());
  };

  const handleIOSDismiss = () => {
    setShowIOSInstructions(false);
    localStorage.setItem('ios-install-prompt-dismissed', 'true');
  };

  // No mostrar nada si ya está instalada
  if (isInstalled) return null;

  const features = [
    { icon: <WifiOutlined />, text: 'Funciona sin conexión' },
    { icon: <ThunderboltOutlined />, text: 'Carga ultra rápida' },
    { icon: <BellOutlined />, text: 'Notificaciones push' },
    { icon: <MobileOutlined />, text: 'Como app nativa' },
  ];

  return (
    <>
      {/* Prompt para Android/Desktop */}
      <Modal
        open={showPrompt}
        onCancel={handleDismiss}
        footer={null}
        centered
        className="pwa-install-modal"
        closeIcon={<CloseOutlined />}
        width={400}
      >
        <div className="pwa-install-content">
          <div className="pwa-install-icon">
            <img src="/logo.svg" alt="UAGRM Logo" />
          </div>
          
          <Title level={4} style={{ marginBottom: 8 }}>
            Instalar UAGRM Educación
          </Title>
          
          <Paragraph type="secondary" style={{ marginBottom: 16 }}>
            Instala nuestra app para una mejor experiencia
          </Paragraph>

          <div className="pwa-features">
            {features.map((feature, index) => (
              <div key={index} className="pwa-feature">
                <span className="pwa-feature-icon">{feature.icon}</span>
                <Text>{feature.text}</Text>
              </div>
            ))}
          </div>

          <Space direction="vertical" style={{ width: '100%', marginTop: 20 }}>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              size="large"
              block
              onClick={handleInstall}
              className="pwa-install-btn"
            >
              Instalar Ahora
            </Button>
            <Button 
              type="text" 
              block
              onClick={handleDismiss}
            >
              Más tarde
            </Button>
          </Space>
        </div>
      </Modal>

      {/* Instrucciones para iOS */}
      <Modal
        open={showIOSInstructions}
        onCancel={handleIOSDismiss}
        footer={null}
        centered
        className="pwa-ios-modal"
        width={380}
      >
        <div className="pwa-ios-content">
          <div className="pwa-install-icon">
            <img src="/logo.svg" alt="UAGRM Logo" />
          </div>
          
          <Title level={4} style={{ marginBottom: 8 }}>
            Instalar en iPhone/iPad
          </Title>

          <div className="ios-steps">
            <div className="ios-step">
              <span className="step-number">1</span>
              <Text>Toca el botón <strong>Compartir</strong> 
                <span className="ios-share-icon">⎋</span>
              </Text>
            </div>
            <div className="ios-step">
              <span className="step-number">2</span>
              <Text>Selecciona <strong>"Añadir a pantalla de inicio"</strong></Text>
            </div>
            <div className="ios-step">
              <span className="step-number">3</span>
              <Text>Toca <strong>"Añadir"</strong> para confirmar</Text>
            </div>
          </div>

          <Button 
            type="primary" 
            block
            onClick={handleIOSDismiss}
            style={{ marginTop: 20 }}
          >
            Entendido
          </Button>
        </div>
      </Modal>

      {/* Botón flotante para instalar (solo si hay prompt disponible) */}
      {deferredPrompt && !showPrompt && (
        <Button
          type="primary"
          shape="circle"
          icon={<DownloadOutlined />}
          size="large"
          className="pwa-fab"
          onClick={() => setShowPrompt(true)}
          title="Instalar aplicación"
        />
      )}
    </>
  );
};

export default PWAInstallPrompt;
