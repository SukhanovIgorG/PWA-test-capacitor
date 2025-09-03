import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
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
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    const initializeCameras = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        const formattedDevices = devices.map(device => ({
          id: device.id,
          label: device.label
        }));
        setCameras(formattedDevices);

        // Автоматически выбираем заднюю камеру, если она доступна
        const backCamera = formattedDevices.find(device =>
          device.label.toLowerCase().includes('back') ||
          device.label.toLowerCase().includes('задняя') ||
          device.label.toLowerCase().includes('rear')
        );
        if (backCamera) {
          setSelectedCamera(backCamera.id);
        } else if (formattedDevices.length > 0) {
          setSelectedCamera(formattedDevices[0].id);
        }
      } catch (err) {
        console.error("Ошибка при получении списка камер", err);
        setError('Не удалось получить список камер. Убедитесь, что вы предоставили доступ к камере.');
      }
    };

    initializeCameras();
  }, []);

  const startScanner = async () => {
    try {
      if (!selectedCamera) {
        setError('Пожалуйста, выберите камеру');
        return;
      }

      setError(null);
      setScanning(true);

      // Даем React время для обновления DOM
      await new Promise(resolve => setTimeout(resolve, 100));

      html5QrCodeRef.current = new Html5Qrcode("reader");
      await html5QrCodeRef.current?.start(
        selectedCamera,
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

  const switchCamera = () => {
    if (cameras.length < 2) return;

    const currentIndex = cameras.findIndex(camera => camera.id === selectedCamera);
    const nextIndex = (currentIndex + 1) % cameras.length;
    setSelectedCamera(cameras[nextIndex].id);

    if (scanning) {
      stopScanner();
      setTimeout(() => {
        startScanner();
      }, 500);
    }
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
    <div className="margin-0 p-4 w-fit flex-1 flex flex-col gap-4">
      {deferredPrompt && (
        <button
          onClick={installPWA}
          className="
            btn btn-primary btn-sm
            absolute top-4 left-4 p-2 bg-primary text-white
            border-none rounded-md cursor-pointer text-sm
          "
        >
          📲
        </button>
      )}
      <h1>Сканер QR-кода</h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 m-2 border border-red-400 rounded-md text-left">
          {error}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <select
            value={selectedCamera || ''}
            onChange={(e) => setSelectedCamera(e.target.value)}
            className="flex-1 p-2 border rounded-md"
            disabled={scanning}
          >
            <option value="">Выберите камеру</option>
            {cameras.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.label}
              </option>
            ))}
          </select>

          {cameras.length > 1 && (
            <button
              onClick={switchCamera}
              className="btn btn-secondary btn-sm p-2"
              title="Переключить камеру"
            >
              📷
            </button>
          )}
        </div>

        {!scanning ? (
          <button
            onClick={startScanner}
            className="btn btn-primary btn-sm"
            disabled={!selectedCamera}
          >
            Начать сканирование
          </button>
        ) : (
          <button onClick={stopScanner} className="btn btn-primary btn-sm">
            Остановить сканирование
          </button>
        )}
      </div>
      <div id="reader" style={{ display: scanning ? 'block' : 'none' }}></div>
      {scanning && (
        <p>Наведите камеру на QR-код...</p>
      )}
    </div>
  );
};

export default QRScanner;