import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const navigate = useNavigate();
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Проверяем, установлено ли уже приложение
    if ('getInstalledRelatedApps' in navigator) {
      (navigator as unknown as any).getInstalledRelatedApps().then((apps: any[]) => {
        console.log('Установленные приложения:', apps);
      });
    }

    // Проверяем режим отображения
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('Приложение уже установлено и запущено в режиме standalone');
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt событие сработало');
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const startScanner = async () => {
    try {
      setError(null);
      const devices = await Html5Qrcode.getCameras();

      console.log("devices", devices);

      if (devices && devices.length > 0) {
        setScanning(true);
        // Даем React время для обновления DOM
        await new Promise(resolve => setTimeout(resolve, 100));

        html5QrCodeRef.current = new Html5Qrcode("reader");
        await html5QrCodeRef.current?.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            html5QrCodeRef.current?.stop();
            setScanning(false);
            navigate('/result', { state: { data: decodedText } });
          },
          () => {
            // Игнорируем ошибки во время сканирования
          }
        ).catch((err) => {
          setError('Ошибка при запуске камеры. Пожалуйста, убедитесь, что вы предоставили доступ к камере.');
          setScanning(false);
          console.error(err);
        });
      } else {
        setError('Камера не найдена на вашем устройстве');
      }
    } catch (err) {
      console.error("Ошибка при доступе к камере", err);
      setError('Ошибка при доступе к камере. Убедитесь, что вы используете HTTPS и предоставили доступ к камере.');
      setScanning(false);
    }
  };

  const stopScanner = () => {
    setScanning(false);
    html5QrCodeRef.current?.stop();
  };

  const installPWA = async () => {
    if (deferredPrompt) {
      (deferredPrompt as any).prompt();
      const { outcome } = await (deferredPrompt as any).userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  return (
    <div className="scanner-container">
      {deferredPrompt && (
        <button
          onClick={installPWA}
          className="install-button"
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            padding: '10px 15px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Установить приложение
        </button>
      )}
      <h1>Сканер QR-кода</h1>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      {!scanning ? (
        <button onClick={startScanner} className="scan-button">
          Начать сканирование
        </button>
      ) : (
        <button onClick={stopScanner} className="scan-button">
          Остановить сканирование
        </button>
      )}
      <div id="reader" style={{ display: scanning ? 'block' : 'none' }}></div>
      {scanning && (
        <p>Наведите камеру на QR-код...</p>
      )}
    </div>
  );
};

export default QRScanner;