import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.tsx'
import './index.css'
import { initDB } from './utils/db'

// Register service worker
const updateSW = registerSW({
  immediate: false,
  onNeedRefresh() {
    if (confirm('Доступно обновление. Перезагрузить?')) {
      updateSW()
    }
  },
  onOfflineReady() {
    console.log('Приложение готово к работе офлайн')
  },
  onRegisteredSW(swUrl) {
    console.log('Service Worker registered:', swUrl)
  }
})

// Инициализируем базу данных
initDB().catch(console.error);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
