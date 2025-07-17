// main.tsx
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { syncUserIdToLocalStorage } from './lib/sync';
import { syncAll } from './lib/sync.ts';
import { registerSW } from 'virtual:pwa-register';


setInterval(() => {
  if (navigator.onLine) {
    syncAll();
  }
}, 60 * 1000);

window.addEventListener('online', () => {
  syncAll();
});

syncUserIdToLocalStorage(); 
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('New content is available, please refresh.');
  },
  onOfflineReady() {
    console.log('App is ready to work offline.');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);