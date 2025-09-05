import { IonButton, IonContent, IonItem, IonLabel, IonList, IonPage, IonRange } from '@ionic/react';
import React from 'react';
import { useAirplaneMode } from '../hooks/useAirplaneMode';
import { useBluetooth } from '../hooks/useBluetooth';
import { useGeolocation } from '../hooks/useGeolocation';
import { useVolume } from '../hooks/useVolume';
import { useWifi } from '../hooks/useWifi';
import styles from './Settings.module.css';

export const SettingsPage: React.FC = () => {
  const { isEnabled: isBluetoothEnabled, toggleBluetooth } = useBluetooth();
  const { isConnected: isWifiConnected, connectionType, openWifiSettings } = useWifi();
  const { isEnabled: isAirplaneModeEnabled, openAirplaneModeSettings } = useAirplaneMode();
  const { location, getCurrentPosition, requestPermissions } = useGeolocation();
  const { volume, setVolumeLevel } = useVolume();

  return (
    <IonPage>
      <IonContent>
        <IonList>
          <IonItem className={styles.settingsItem}>
            <IonButton className={styles.settingsButton} onClick={toggleBluetooth}>
              {isBluetoothEnabled ? 'Выключить Bluetooth' : 'Включить Bluetooth'}
            </IonButton>
            <IonLabel className={styles.statusLabel} slot="end">
              Статус: {isBluetoothEnabled ? 'Включен' : 'Выключен'}
            </IonLabel>
          </IonItem>

          <IonItem className={styles.settingsItem}>
            <IonButton className={styles.settingsButton} onClick={openWifiSettings}>
              Настройки WiFi
            </IonButton>
            <IonLabel className={styles.statusLabel} slot="end">
              Статус: {isWifiConnected ? `Подключен (${connectionType})` : 'Отключен'}
            </IonLabel>
          </IonItem>

          <IonItem className={styles.settingsItem}>
            <IonButton className={styles.settingsButton} onClick={openAirplaneModeSettings}>
              Настройки авиарежима
            </IonButton>
            <IonLabel className={styles.statusLabel} slot="end">
              Статус: {isAirplaneModeEnabled ? 'Включен' : 'Выключен'}
            </IonLabel>
          </IonItem>

          <IonItem className={styles.settingsItem}>
            <IonButton
              className={styles.settingsButton}
              onClick={async () => {
                await requestPermissions();
                await getCurrentPosition();
              }}
            >
              Получить геолокацию
            </IonButton>
            <IonLabel className={styles.statusLabel} slot="end">
              {location ?
                `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` :
                'Нет данных'}
            </IonLabel>
          </IonItem>

          <IonItem className={styles.settingsItem}>
            <div className={styles.rangeContainer}>
              <IonLabel>Громкость</IonLabel>
              <IonRange
                value={volume}
                min={0}
                max={1}
                step={0.1}
                onIonChange={e => setVolumeLevel(e.detail.value as number)}
              />
              <IonLabel className={styles.volumeLabel}>
                {Math.round(volume * 100)}%
              </IonLabel>
            </div>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};
