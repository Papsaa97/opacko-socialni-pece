/// <reference types="vite/client" />
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

if (
  import.meta.env.PROD &&
  'serviceWorker' in navigator &&
  window.location.protocol === 'https:' &&
  Boolean(document.querySelector('link[rel="manifest"]'))
) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
