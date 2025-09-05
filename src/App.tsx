import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import BottomNavigation from './components/BottomNavigation';
import { HomePage } from './pages/Home';
import { ResultsPage } from './pages/Results';
import { ScannerPage } from './pages/Scanner';
import { SettingsPage } from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="h-[100dvh] flex flex-col">
        <main className="h-full overflow-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/scan" element={<ScannerPage />} />
            <Route path="/result" element={<ResultsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
        <BottomNavigation />
      </div>
    </Router>
  );
}

export default App;