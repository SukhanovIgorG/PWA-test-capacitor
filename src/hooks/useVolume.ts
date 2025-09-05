import { Volume } from '@4gency/capacitor-volume';
import { useEffect, useState } from 'react';

export const useVolume = () => {
  const [volume, setVolume] = useState(0);
  const [maxVolume, setMaxVolume] = useState(0);

  useEffect(() => {
    const getVolume = async () => {
      const result = await Volume.getVolume();
      setMaxVolume(result.volume);
    };
    getVolume();
  }, []);


  const setVolumeLevel = async (level: number) => {
    try {
      // Преобразуем значение от 0-1 в значение от 0 до maxVolume
      const volumeLevel = Math.round(level * maxVolume);
      await Volume.setVolume({ volume: volumeLevel });
      setVolume(volumeLevel);
    } catch (error) {
      console.error('Ошибка при установке громкости:', error);
    }
  };

  // Возвращаем нормализованное значение громкости (от 0 до 1)
  const normalizedVolume = maxVolume > 0 ? volume / maxVolume : 0;

  return {
    volume: normalizedVolume,
    setVolumeLevel,
    maxVolume
  };
};