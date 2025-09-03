import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveScanResult } from '../utils/db';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const navigate = useNavigate();
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

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
        async (decodedText) => {
          html5QrCodeRef.current?.stop();
          setScanning(false);
          await saveScanResult(decodedText);
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

  const handleImageScan = async (file: File) => {
    try {
      setError(null);
      if (scanning) {
        stopScanner();
      }

      const html5QrCode = new Html5Qrcode("reader");

      try {
        const result = await html5QrCode.scanFile(file, true);
        await saveScanResult(result);
        navigate('/result', { state: { data: result } });
      } catch (err) {
        setError('QR-код не найден на изображении');
        console.error('Ошибка при сканировании изображения:', err);
      } finally {
        html5QrCode.clear();
      }
    } catch (err) {
      setError('Ошибка при обработке изображения');
      console.error('Ошибка при обработке изображения:', err);
    }
  };



  return (
    <>
      <div className="margin-0 p-4 w-fit flex-1 flex flex-col gap-4">

        {error && (
          <div className="bg-red-100 text-red-700 p-4 m-2 border border-red-400 rounded-md text-left">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <select
                value={selectedCamera || ''}
                onChange={(e) => setSelectedCamera(e.target.value)}
                className="flex-1 p-2 border rounded-md max-w-[70%]"
                disabled={scanning}
              >
                <option className='text-black' value="">Выберите камеру</option>
                {cameras.map((camera) => (
                  <option className='text-black' key={camera.id} value={camera.id}>
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
          </div>
        </div>

        <div className="rounded-md overflow-hidden max-w-[100%] max-h-[100%]">
          <div id="reader"
            className="flex-1"
            style={{ display: scanning ? 'block' : 'none' }}>
          </div>
        </div>
      </div >

      <div className="flex w-full gap-2 p-2">
        <div className="flex flex-1 flex-col gap-2">
          <label className="
            flex gap-2 items-center justify-center p-4 
            border-2 border-dashed rounded-lg cursor-pointer 
            hover:border-[#535bf2]
          ">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageScan(file);
                }
              }}
              onClick={(e) => {
                // Сброс значения input для возможности повторной загрузки того же файла
                (e.target as HTMLInputElement).value = '';
              }}
            />
            <span className="text-sm text-center">📁 Выберите изображение</span>
          </label>
        </div>
        <button
          onClick={scanning ? stopScanner : startScanner}
          className="btn btn-secondary flex-1 border-1 border-gray-200"
          disabled={!selectedCamera}
        >
          {scanning ? "❌" : "📷"}
        </button>
      </div>
    </>
  );
};

export default QRScanner;