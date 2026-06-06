// src/components/PWA/PWAUpdatePrompt.jsx
// Componente para notificar actualizaciones de la PWA

import { useEffect, useState } from 'react';
import { notification, Button, Space } from 'antd';
import { ReloadOutlined, SyncOutlined } from '@ant-design/icons';
import { useRegisterSW } from 'virtual:pwa-register/react';

const PWAUpdatePrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log('✅ Service Worker registrado:', swUrl);
      
      // Verificar actualizaciones cada hora
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('❌ Error al registrar SW:', error);
    },
  });

  useEffect(() => {
    if (offlineReady) {
      notification.success({
        message: '🚀 App lista para offline',
        description: 'Puedes usar la aplicación sin conexión a Internet.',
        duration: 4,
        placement: 'bottomRight',
      });
      setOfflineReady(false);
    }
  }, [offlineReady, setOfflineReady]);

  useEffect(() => {
    if (needRefresh) {
      setShowPrompt(true);
      
      notification.info({
        key: 'pwa-update',
        message: '🔄 Nueva versión disponible',
        description: (
          <div>
            <p style={{ marginBottom: 12 }}>
              Hay una nueva versión de la aplicación disponible.
            </p>
            <Space>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={() => {
                  updateServiceWorker(true);
                  notification.destroy('pwa-update');
                }}
              >
                Actualizar ahora
              </Button>
              <Button
                onClick={() => {
                  setNeedRefresh(false);
                  notification.destroy('pwa-update');
                }}
              >
                Más tarde
              </Button>
            </Space>
          </div>
        ),
        duration: 0, // No cerrar automáticamente
        placement: 'bottomRight',
        icon: <SyncOutlined spin style={{ color: '#1890ff' }} />,
      });
    }
  }, [needRefresh, setNeedRefresh, updateServiceWorker]);

  return null; // Este componente no renderiza nada visible directamente
};

export default PWAUpdatePrompt;
