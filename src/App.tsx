import { IonApp, setupIonicReact } from '@ionic/react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import BottomNavigation from './components/BottomNavigation';
import { HomePage } from './pages/Home';
import { ResultsPage } from './pages/Results';
import { ScannerPage } from './pages/Scanner';
import { SettingsPage } from './pages/Settings';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';

setupIonicReact();

function App() {
  return (
    <IonApp>
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
    </IonApp>
  );
}

export default App;