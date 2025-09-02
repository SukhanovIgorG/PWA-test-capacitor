import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import QRScanner from './components/QRScanner';
import ResultView from './components/ResultView';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<QRScanner />} />
          <Route path="/result" element={<ResultView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;