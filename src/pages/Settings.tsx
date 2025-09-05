import { Battery, Bluetooth, MapPin, Settings as SettingsIcon, Wifi } from 'lucide-react';
import { useBattery, useBluetooth, useGeolocation, useNetwork } from '../hooks/useSystemFeatures';

const Settings = () => {
  const { latitude, longitude, error: locationError, getLocation } = useGeolocation();
  const { isOnline, connectionType, downlink } = useNetwork();
  const { isAvailable: isBluetoothAvailable, error: bluetoothError, checkAvailability } = useBluetooth();
  const { level: batteryLevel, charging: isBatteryCharging } = useBattery();

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <SettingsIcon className="mr-2" />
        <h3 className="text-2xl font-bold">Системные функции</h3>
      </div>

      <div className="space-y-6">
        {/* Геолокация */}
        <div className="p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <MapPin className="mr-2" />
              <h2 className="text-lg font-semibold">Геолокация</h2>
            </div>
            <button
              onClick={getLocation}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Получить локацию
            </button>
          </div>
          <div className="text-gray-600">
            {locationError ? (
              <p className="text-red-500">{locationError}</p>
            ) : (
              latitude && longitude && (
                <p>
                  Широта: {latitude.toFixed(6)}, Долгота: {longitude.toFixed(6)}
                </p>
              )
            )}
          </div>
        </div>

        {/* Сеть */}
        <div className="p-4 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Wifi className="mr-2" />
            <h2 className="text-lg font-semibold">Состояние сети</h2>
          </div>
          <div className="space-y-2 text-gray-600">
            <p>Статус: {isOnline ? 'В сети' : 'Не в сети'}</p>
            {connectionType && <p>Тип соединения: {connectionType}</p>}
            {downlink && <p>Скорость: {downlink} Mbps</p>}
          </div>
        </div>

        {/* Bluetooth */}
        <div className="p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Bluetooth className="mr-2" />
              <h2 className="text-lg font-semibold">Bluetooth</h2>
            </div>
            <button
              onClick={checkAvailability}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Проверить доступность
            </button>
          </div>
          <div className="text-gray-600">
            {bluetoothError ? (
              <p className="text-red-500">{bluetoothError}</p>
            ) : (
              <p>Статус: {isBluetoothAvailable ? 'Доступен' : 'Недоступен'}</p>
            )}
          </div>
        </div>

        {/* Батарея */}
        <div className="p-4 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Battery className="mr-2" />
            <h2 className="text-lg font-semibold">Батарея</h2>
          </div>
          <div className="space-y-2 text-gray-600">
            <p>Уровень заряда: {(batteryLevel * 100).toFixed(0)}%</p>
            <p>Статус: {isBatteryCharging ? 'Заряжается' : 'Не заряжается'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
