import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import BottomNavigation from './components/BottomNavigation';
import QRScanner from './components/QRScanner';
import ResultView from './components/ResultView';

function App() {
  return (
    <Router>
      <div className="h-[100dvh] flex flex-col bg-gray-800">
        <main className="h-full overflow-auto">
          <Routes>
            <Route path="/" element={<div className="p-4 text-center">Главная страница</div>} />
            <Route path="/scan" element={<QRScanner />} />
            <Route path="/result" element={<ResultView />} />
            <Route path="/settings" element={<div className="p-4 text-center">Настройки</div>} />
          </Routes>
        </main>
        <BottomNavigation />
      </div>
    </Router>
  );
}

export default App;