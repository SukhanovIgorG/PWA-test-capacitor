import { useEffect, useState } from "react";
import logo from '../assets/react.svg';

export const HomePage = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installedApps, setInstalledApps] = useState<any>([]);

  useEffect(() => {
    // Проверяем, установлено ли уже приложение
    if ('getInstalledRelatedApps' in navigator) {
      (navigator as unknown as any).getInstalledRelatedApps().then((apps: any[]) => {
        console.log('Установленные приложения:', apps);
        setInstalledApps(apps);
      });
    }

    // Проверяем режим отображения
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('Приложение уже установлено и запущено в режиме standalone');
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const installPWA = async () => {
    if (deferredPrompt) {
      (deferredPrompt as any).prompt();
      const { outcome } = await (deferredPrompt as any).userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  console.log('deferredPrompt :>> ', deferredPrompt);

  return <section className="flex flex-col items-center justify-between h-full p-4">
    <h1>Главная страница</h1>
    <div className="flex flex-col gap-4 border-2 border-primary rounded-xl p-4">
      <div className="flex gap-4 items-center">
        <img src={logo} alt="logo" className="w-10 h-10" />
        <p>Установите приложение на свой телефон или компьютер</p>
      </div>
      <p className="text-center">{installedApps.length === 0 ? 'Приложение еще не установлено ❌' : 'Приложение уже установлено ✅'}</p>
      {deferredPrompt && (
        <button
          onClick={installPWA}
          className="
      btn btn-primary btn-sm
      p-2 bg-primary text-white
      border-none rounded-md cursor-pointer text-sm
      "
        >
          📲
        </button>
      )}
    </div>
  </section>;
};