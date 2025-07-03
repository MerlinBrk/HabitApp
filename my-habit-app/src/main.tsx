// main.tsx
import React,{ StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { syncUserIdToLocalStorage } from './lib/auth';
import { registerSW } from 'virtual:pwa-register';
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

registerSW();
syncUserIdToLocalStorage(); 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);