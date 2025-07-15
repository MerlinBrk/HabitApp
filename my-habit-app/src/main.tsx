// main.tsx
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { syncUserIdToLocalStorage } from './lib/sync';
import { syncAll } from './lib/sync.ts';


setInterval(() => {
  if (navigator.onLine) {
    syncAll();
  }
}, 60 * 1000); // jede Minuten

// Bei Internetverbindung
window.addEventListener('online', () => {
  syncAll();
});

syncUserIdToLocalStorage(); 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);