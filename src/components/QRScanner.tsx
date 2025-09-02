import { Html5Qrcode } from 'html5-qrcode';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const startScanner = async () => {
    try {
      setError(null);
      const devices = await Html5Qrcode.getCameras();

      if (devices && devices.length > 0) {
        const html5QrCode = new Html5Qrcode("reader");
        setScanning(true);

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            html5QrCode.stop();
            setScanning(false);
            navigate('/result', { state: { data: decodedText } });
          },
          (errorMessage) => {
            // Игнорируем ошибки во время сканирования
            console.log(errorMessage);
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
      setError('Ошибка при доступе к камере. Убедитесь, что вы используете HTTPS и предоставили доступ к камере.');
      setScanning(false);
      console.error(err);
    }
  };

  return (
    <div className="scanner-container">
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
        <div>
          <div id="reader"></div>
          <p>Наведите камеру на QR-код...</p>
        </div>
      )}
    </div>
  );
};

export default QRScanner;