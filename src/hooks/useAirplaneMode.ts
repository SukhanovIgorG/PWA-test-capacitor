import { useEffect, useState } from 'react';

export const useAirplaneMode = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    checkAirplaneModeStatus();
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
    };
  }, []);

  const checkAirplaneModeStatus = () => {
    // К сожалению, нет прямого API для проверки статуса авиарежима
    // Можно только определить наличие подключения к сети
    setIsEnabled(!navigator.onLine);
  };

  const handleConnectionChange = () => {
    checkAirplaneModeStatus();
  };

  const openAirplaneModeSettings = () => {
    // Можно только открыть системные настройки
    console.log('Откройте системные настройки для управления авиарежимом');
  };

  return {
    isEnabled,
    openAirplaneModeSettings
  };
};
