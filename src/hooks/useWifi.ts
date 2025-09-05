import { Network } from '@capacitor/network';
import { useEffect, useState } from 'react';

export const useWifi = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionType, setConnectionType] = useState('');

  useEffect(() => {
    checkNetworkStatus();
    Network.addListener('networkStatusChange', status => {
      setIsConnected(status.connected);
      setConnectionType(status.connectionType);
    });

    return () => {
      Network.removeAllListeners();
    };
  }, []);

  const checkNetworkStatus = async () => {
    try {
      const status = await Network.getStatus();
      setIsConnected(status.connected);
      setConnectionType(status.connectionType);
    } catch (error) {
      console.error('Ошибка при проверке состояния сети:', error);
    }
  };

  const openWifiSettings = async () => {
    // На большинстве устройств можно только открыть настройки WiFi
    console.log('Откройте системные настройки для управления WiFi');
  };

  return {
    isConnected,
    connectionType,
    openWifiSettings
  };
};
