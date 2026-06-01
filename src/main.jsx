// @ts-ignore;
import React from 'react';

import ReactDOM from 'react-dom/client';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import App from '../App';
import '../index.css';

// 注册 Ionic PWA Elements（用于 Capacitor 相机等原生功能）
defineCustomElements(window);
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode>
    <App />
  </React.StrictMode>);