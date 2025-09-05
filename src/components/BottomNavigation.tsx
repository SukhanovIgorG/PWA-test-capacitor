import { Home, List, Scan, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      path: '/',
      icon: <Home size={24} />,
      label: 'Главная'
    },
    {
      path: '/scan',
      icon: <Scan size={24} />,
      label: 'Сканер'
    },
    {
      path: '/result',
      icon: <List size={24} />,
      label: 'Результаты'
    },
    {
      path: '/settings',
      icon: <Settings size={24} />,
      label: 'Настройки'
    }
  ];

  return (
    <nav className="border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        {navigationItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center w-full h-full
              ${location.pathname === item.path ? 'text-blue-500' : 'text-gray-500'}
              hover:text-blue-500 transition-colors rounded-none`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
