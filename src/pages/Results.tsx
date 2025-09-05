import { useEffect, useState } from "react";
import type { ScanResultType } from "../components/ResultView";
import ResultView from "../components/ResultView";
import { clearDatabase, generateMockData, getAllScanResults, initDB } from "../utils/db";

export const ResultsPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanResultType[]>([]);

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

  const handleClearDatabase = async () => {
    try {
      setIsClearing(true);
      await clearDatabase();
      setScanHistory([]);
    } catch (error) {
      console.error('Ошибка при очистке базы данных:', error);
    } finally {
      setIsClearing(false);
    }
  };

  const handleGenerateMockData = async () => {
    try {
      setIsGenerating(true);
      await generateMockData(1000);
      // Обновляем список после генерации
      const results = await getAllScanResults();
      setScanHistory(results);
    } catch (error) {
      console.error('Ошибка при генерации моковых данных:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-between h-full">
      <h3>Результаты сканирования</h3>
      <div className="flex gap-4 w-full p-4 flex items-center">
        <button
          type="button"
          onClick={handleGenerateMockData}
          disabled={isGenerating || isClearing}
          className="btn btn-primary w-full max-w-md border-1 border-gray-200"
        >
          {isGenerating ? (
            <>
              <span className="mr-2" />
              Генерация данных...
            </>
          ) : (
            'Добавить 1000 тестовых записей'
          )}
        </button>
        <button
          type="button"
          onClick={handleClearDatabase}
          disabled={isGenerating || isClearing}
          className="btn btn-danger w-full max-w-md border-1 border-gray-200"
        >
          {isClearing ? 'Очистка...' : 'Очистить базу данных'}
        </button>
      </div>
      <span>в базе {scanHistory.length || 0} записей</span>
      <ResultView scanHistory={scanHistory} />
    </section>
  );
};