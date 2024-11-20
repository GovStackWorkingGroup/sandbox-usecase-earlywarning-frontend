import * as React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import { App } from './app';

const root = document.getElementById('root');
if (!root) throw new Error('No root element found');
const apiUrl = (window as any).ENV?.VITE_APP_USER_API_URL || "http://localhost:8080/api";
console.log("APP_USER_API URL:", apiUrl);

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
