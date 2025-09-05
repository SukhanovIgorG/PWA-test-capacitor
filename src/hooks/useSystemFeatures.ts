import { useCallback, useEffect, useState } from 'react';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

interface NetworkState {
  isOnline: boolean;
  connectionType: string | null;
  downlink: number | null;
}

interface BluetoothState {
  isAvailable: boolean;
  error: string | null;
}

interface BatteryState {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
}

export const useGeolocation = () => {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
  });

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'Геолокация не поддерживается' }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => {
        setState(prev => ({ ...prev, error: error.message }));
      }
    );
  }, []);

  return { ...state, getLocation };
};

export const useNetwork = () => {
  const [state, setState] = useState<NetworkState>({
    isOnline: navigator.onLine,
    connectionType: null,
    downlink: null,
  });

  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if ('connection' in navigator) {
      const connection = (navigator as any).connection;

      const handleChange = () => {
        setState({
          isOnline: navigator.onLine,
          connectionType: connection.effectiveType,
          downlink: connection.downlink,
        });
      };

      connection.addEventListener('change', handleChange);
      handleChange();

      return () => {
        connection.removeEventListener('change', handleChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return state;
};

export const useBluetooth = () => {
  const [state, setState] = useState<BluetoothState>({
    isAvailable: false,
    error: null,
  });

  const checkAvailability = useCallback(async () => {
    if (!('bluetooth' in navigator)) {
      setState({ isAvailable: false, error: 'Bluetooth API не поддерживается' });
      return;
    }

    try {
      const available = await (navigator as any).bluetooth.getAvailability();
      setState({ isAvailable: available, error: null });
    } catch (error) {
      setState({ isAvailable: false, error: (error as Error).message });
    }
  }, []);

  return { ...state, checkAvailability };
};

export const useBattery = () => {
  const [state, setState] = useState<BatteryState>({
    level: 1,
    charging: false,
    chargingTime: 0,
    dischargingTime: 0,
  });

  useEffect(() => {
    const getBattery = async () => {
      if (!('getBattery' in navigator)) {
        return;
      }

      try {
        const battery: any = await (navigator as any).getBattery();

        const updateBatteryState = () => {
          setState({
            level: battery.level,
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
          });
        };

        updateBatteryState();

        battery.addEventListener('levelchange', updateBatteryState);
        battery.addEventListener('chargingchange', updateBatteryState);
        battery.addEventListener('chargingtimechange', updateBatteryState);
        battery.addEventListener('dischargingtimechange', updateBatteryState);

        return () => {
          battery.removeEventListener('levelchange', updateBatteryState);
          battery.removeEventListener('chargingchange', updateBatteryState);
          battery.removeEventListener('chargingtimechange', updateBatteryState);
          battery.removeEventListener('dischargingtimechange', updateBatteryState);
        };
      } catch (error) {
        console.error('Ошибка при получении информации о батарее:', error);
      }
    };

    getBattery();
  }, []);

  return state;
};
