interface ScanResult {
  id?: number;
  result: string;
  timestamp: Date;
}

const DB_NAME = 'qr-scanner-db';
const STORE_NAME = 'scan-results';
const DB_VERSION = 1;

export const initDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true
        });
      }
    };
  });
};

export const saveScanResult = async (result: string): Promise<void> => {
  const scanResult: ScanResult = {
    result,
    timestamp: new Date()
  };

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      store.add(scanResult);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };
  });
};

export const getAllScanResults = (): Promise<ScanResult[]> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
  });
};

export const generateMockData = async (count: number = 1000): Promise<void> => {
  try {
    for (let i = 0; i < count; i++) {
      const mockData = `Mock QR Code #${Math.random().toString(36).substring(7)} - ${new Date().toISOString()}`;
      await saveScanResult(mockData);
    }
  } catch (error) {
    console.error('Ошибка при генерации моковых данных:', error);
    throw error;
  }
};
