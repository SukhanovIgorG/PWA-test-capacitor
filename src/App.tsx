import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import QRScanner from './components/QRScanner';
import ResultView from './components/ResultView';

function App() {
  return (
    <Router>
      <div className="
        h-[100dvh]
        flex flex-col items-center justify-center p-4
      bg-gray-500 flex-1 box-border text-center">
        <Routes>
          <Route path="/" element={<QRScanner />} />
          <Route path="/result" element={<ResultView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;