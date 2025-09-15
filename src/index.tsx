import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { autoCleanupSampleData, initializeServicesAndProducts } from './services/dataInitializationService';

// Limpiar proveedores de ejemplo automáticamente al cargar la aplicación
autoCleanupSampleData();

// Inicializar servicios y productos automáticamente
initializeServicesAndProducts();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
