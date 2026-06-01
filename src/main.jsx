// @ts-ignore;
import React from 'react';

import ReactDOM from 'react-dom/client';
import App from '../App';
import '../index.css';

// 动态加载 Ionic PWA Elements（仅原生环境需要）
const loadPwaElements = async () => {
  if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.()) {
    try {
      const {
        defineCustomElements
      } = await import('@ionic/pwa-elements/loader');
      defineCustomElements(window);
    } catch (e) {
      console.log('PWA Elements 加载失败:', e);
    }
  }
};

// 初始化
loadPwaElements();
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode>
    <App />
  </React.StrictMode>);