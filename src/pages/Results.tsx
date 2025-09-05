import { useEffect, useState } from "react";
import type { ScanResultType } from "../components/ResultView";
import ResultView from "../components/ResultView";
import { generateMockData, getAllScanResults, initDB } from "../utils/db";

export const ResultsPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
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
      <h1>Результаты сканирования</h1>
      <div className="flex gap-4 w-full p-4 flex items-center">
        <button
          type="button"
          onClick={handleGenerateMockData}
          disabled={isGenerating}
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
        <span>сейчас в базе {scanHistory.length || 0} записей</span>
      </div>
      <ResultView scanHistory={scanHistory} />
    </section>
  );
};