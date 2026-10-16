import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register PWA service worker for full offline and installable support
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.log('Sand.E PWA ServiceWorker active:', reg.scope))
      .catch((err) => console.log('SW registration note:', err));
  });
}

createRoot(document.getElementById('root')!).render(<App />);
