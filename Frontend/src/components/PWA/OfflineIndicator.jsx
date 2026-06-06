// src/components/PWA/OfflineIndicator.jsx
// Indicador de estado de conexión

import { useState, useEffect } from 'react';
import { Alert, Space } from 'antd';
import { WifiOutlined, DisconnectOutlined } from '@ant-design/icons';
import './OfflineIndicator.css';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // No mostrar nada si está online y no hay mensaje de reconexión
  if (isOnline && !showReconnected) return null;

  return (
    <div className={`offline-indicator ${isOnline ? 'online' : 'offline'}`}>
      {!isOnline ? (
        <Alert
          type="warning"
          showIcon
          icon={<DisconnectOutlined />}
          message={
            <Space>
              <span>Sin conexión a Internet</span>
              <span className="offline-subtext">Algunas funciones pueden no estar disponibles</span>
            </Space>
          }
          banner
          className="offline-banner"
        />
      ) : showReconnected ? (
        <Alert
          type="success"
          showIcon
          icon={<WifiOutlined />}
          message="Conexión restablecida"
          banner
          className="online-banner"
        />
      ) : null}
    </div>
  );
};

export default OfflineIndicator;
