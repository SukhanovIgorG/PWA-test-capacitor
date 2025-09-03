import ResultView from "../components/ResultView";

export const ResultsPage = () => {
  return <section className="flex flex-col items-center justify-between h-full">
    <h1>Результаты сканирования</h1>
    <ResultView />
  </section>;
};