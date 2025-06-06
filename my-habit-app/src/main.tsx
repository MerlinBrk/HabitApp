// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { syncUserIdToLocalStorage } from './lib/auth';
import { registerSW } from 'virtual:pwa-register';
import { syncHabitsWithSupabase, syncHabitLogsWithSupabase, syncAll} from './lib/sync';
import { pullHabitsFromSupabase, pullHabitLogsFromSupabase } from './lib/sync';
import { useUserId } from './services/useUserId.ts';




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