// src/hooks/usePWA.js
// Hook personalizado para funcionalidades PWA

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para detectar estado de la PWA
 */
export const usePWAInstallStatus = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Verificar si está en modo standalone (instalada)
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          window.navigator.standalone === true ||
                          document.referrer.includes('android-app://');
      setIsInstalled(isStandalone);
    };

    checkInstalled();

    // Escuchar cambios en display-mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e) => setIsInstalled(e.matches);
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    // Escuchar si se puede instalar
    const handleBeforeInstallPrompt = () => setIsInstallable(true);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Escuchar instalación exitosa
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return { isInstalled, isInstallable };
};

/**
 * Hook para estado de conexión
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (!navigator.onLine) {
        setWasOffline(true);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, wasOffline };
};

/**
 * Hook para Service Worker updates
 */
export const useServiceWorker = () => {
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [updateServiceWorker, setUpdateServiceWorker] = useState(() => () => {});

  useEffect(() => {
    // Importar dinámicamente para evitar errores en SSR
    const registerSW = async () => {
      try {
        const { registerSW } = await import('virtual:pwa-register');
        
        const updateSW = registerSW({
          onNeedRefresh() {
            setNeedsRefresh(true);
          },
          onOfflineReady() {
            setOfflineReady(true);
          },
        });

        setUpdateServiceWorker(() => updateSW);
      } catch (e) {
        console.log('Service Worker no disponible:', e);
      }
    };

    registerSW();
  }, []);

  const refresh = useCallback(() => {
    updateServiceWorker(true);
    setNeedsRefresh(false);
  }, [updateServiceWorker]);

  return { needsRefresh, offlineReady, refresh };
};

/**
 * Hook para notificaciones push
 */
export const usePushNotifications = () => {
  const [permission, setPermission] = useState('default');
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('Este navegador no soporta notificaciones');
      return 'unsupported';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
      return 'error';
    }
  }, []);

  const subscribeToPush = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push no soportado');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Obtener o crear suscripción
      let sub = await registration.pushManager.getSubscription();
      
      if (!sub) {
        // Crear nueva suscripción (necesitarías VAPID keys del servidor)
        // sub = await registration.pushManager.subscribe({
        //   userVisibleOnly: true,
        //   applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
        // });
      }

      setSubscription(sub);
      return sub;
    } catch (error) {
      console.error('Error al suscribirse a push:', error);
      return null;
    }
  }, []);

  return { permission, subscription, requestPermission, subscribeToPush };
};

/**
 * Hook combinado para todas las funcionalidades PWA
 */
export const usePWA = () => {
  const installStatus = usePWAInstallStatus();
  const onlineStatus = useOnlineStatus();
  const serviceWorker = useServiceWorker();
  const pushNotifications = usePushNotifications();

  return {
    ...installStatus,
    ...onlineStatus,
    ...serviceWorker,
    ...pushNotifications,
  };
};

export default usePWA;
