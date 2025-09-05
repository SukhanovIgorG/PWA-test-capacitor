import { BleClient } from '@capacitor-community/bluetooth-le';
import { useEffect, useState } from 'react';

export const useBluetooth = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    checkBluetoothState();
  }, []);

  const checkBluetoothState = async () => {
    try {
      await BleClient.initialize();
      const state = await BleClient.isEnabled();
      setIsEnabled(state);
    } catch (error) {
      console.error('Ошибка при проверке состояния Bluetooth:', error);
    }
  };

  const toggleBluetooth = async () => {
    try {
      if (isEnabled) {
        // На мобильных устройствах нельзя программно отключить Bluetooth
        // Можно только показать системные настройки
        console.log('Откройте системные настройки для отключения Bluetooth');
      } else {
        await BleClient.initialize();
        await BleClient.enable();
        setIsEnabled(true);
      }
    } catch (error) {
      console.error('Ошибка при управлении Bluetooth:', error);
    }
  };

  return {
    isEnabled,
    toggleBluetooth
  };
};
