import { useEffect, useState } from "react";
import logo from '../assets/react.svg';

export const HomePage = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Проверяем различные способы определения установки
    const checkInstallation = () => {
      // Проверка для iOS
      const isIOSInstalled =
        // @ts-expect-error - navigator.standalone is not defined in the global scope
        window.navigator.standalone ||
        window.matchMedia('(display-mode: standalone)').matches;

      // Проверка для Android/Desktop через display-mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

      // Проверка через getInstalledRelatedApps (если доступно)
      if ('getInstalledRelatedApps' in navigator) {
        (navigator as unknown as any).getInstalledRelatedApps().then((apps: any[]) => {
          setIsInstalled(apps.length > 0 || isIOSInstalled || isStandalone);
        });
      } else {
        setIsInstalled(isIOSInstalled || isStandalone);
      }
    };

    checkInstallation();

    // Слушаем изменения режима отображения
    const displayModeQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches);
    };
    displayModeQuery.addEventListener('change', handleDisplayModeChange);

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

  return <section className="flex flex-col items-center justify-between h-full p-4">
    <h3>Главная страница</h3>
    <div className="flex flex-col gap-4 border-2 border-primary rounded-xl p-4">
      <div className="flex gap-4 items-center">
        <img src={logo} alt="logo" className="w-10 h-10" />
        <p>Установите приложение на свой телефон или компьютер</p>
      </div>
      <p className="text-center">{isInstalled ? 'Приложение уже установлено ✅' : 'Приложение еще не установлено ❌'}</p>
      {!isInstalled && (
        <>
          {deferredPrompt ? (
            <button
              onClick={installPWA}
              className="
          btn btn-primary btn-sm
          p-2 bg-primary text-white
          border-none rounded-md cursor-pointer text-sm
          "
            >
              Установить приложение 📲
            </button>
          ) : (
            <div className="text-sm text-center">
              {/iPhone|iPad|iPod/.test(navigator.userAgent) ? (
                <p>
                  Для установки нажмите кнопку "Поделиться" (Share) в браузере Safari,<br />
                  затем выберите "На экран «Домой»" (Add to Home Screen)
                </p>
              ) : (
                <p>
                  Используйте меню браузера для установки приложения
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  </section>;
};