import { Geolocation } from '@capacitor/geolocation';
import { useEffect, useState } from 'react';

export const useGeolocation = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentPosition();
  }, []);

  const getCurrentPosition = async () => {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      setLocation({
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude
      });
      setError(null);
    } catch (error) {
      setError('Ошибка при получении геолокации');
      console.error('Ошибка геолокации:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      const permission = await Geolocation.checkPermissions();
      if (permission.location !== 'granted') {
        await Geolocation.requestPermissions();
      }
    } catch (error) {
      console.error('Ошибка при запросе разрешений:', error);
    }
  };

  return {
    location,
    error,
    getCurrentPosition,
    requestPermissions
  };
};
