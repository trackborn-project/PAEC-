import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { MotionPrefProvider } from './deck/MotionPref.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Respeta prefers-reduced-motion por defecto; la tecla M fuerza animación completa o reducida */}
    <MotionPrefProvider>
      <App />
    </MotionPrefProvider>
  </StrictMode>,
);
