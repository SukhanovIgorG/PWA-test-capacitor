import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllScanResults, initDB } from '../utils/db';

interface ScanResult {
  id?: number;
  result: string;
  timestamp: Date;
}

const ResultView = () => {
  const location = useLocation();
  const scannedData = location.state?.data || 'Данные не найдены';
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await initDB();
        const results = await getAllScanResults();
        setScanHistory(results);
      } catch (error) {
        console.error('Ошибка при загрузке истории сканирований:', error);
      }
    };
    loadData();
  }, []);

  return (
    <div className="max-w-600px mx-auto p-4 shadow-md w-full h-full flex flex-col gap-4">
      <div className="p-4 rounded-md word-break-all border-2 border-dashed border-yellow-700 min-h-40 max-h-40 overflow-y-auto">
        <p>{scannedData}</p>
      </div>

      <div className="flex-1 p-4 rounded-md word-break-all border-2 border-gray-200">
        <h2 className="mb-4">История сканирований:</h2>
        <div className="flex-1" >
          {scanHistory.map((scan) => (
            <div key={scan.id} className="mb-4 p-2 border-b">
              <p className="font-bold">{scan.result}</p>
              <p className="text-sm">
                {new Date(scan.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultView;
