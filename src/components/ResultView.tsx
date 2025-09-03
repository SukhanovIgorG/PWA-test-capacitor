import { useLocation, useNavigate } from 'react-router-dom';

const ResultView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scannedData = location.state?.data || 'Данные не найдены';

  return (
    <div className="max-w-600px mx-auto p-4 bg-gray-500 rounded-md shadow-md">
      <h1>Результат сканирования</h1>
      <div className="m-4 p-4 rounded-md word-break-all">
        <p>{scannedData}</p>
      </div>
      <button onClick={() => navigate('/')} className="bg-gray-500 text-white p-2 rounded-md cursor-pointer">
        Назад к сканеру
      </button>
    </div>
  );
};

export default ResultView;
