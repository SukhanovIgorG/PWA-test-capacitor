import { useLocation, useNavigate } from 'react-router-dom';

const ResultView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scannedData = location.state?.data || 'Данные не найдены';

  return (
    <div className="result-container">
      <h1>Результат сканирования</h1>
      <div className="result-content">
        <p>{scannedData}</p>
      </div>
      <button onClick={() => navigate('/')} className="back-button">
        Назад к сканеру
      </button>
    </div>
  );
};

export default ResultView;
