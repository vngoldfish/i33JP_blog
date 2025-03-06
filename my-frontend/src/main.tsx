import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 👈 Thêm BrowserRouter
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>  {/* 👈 Bọc toàn bộ ứng dụng trong BrowserRouter */}
      <App />
    </BrowserRouter>
  </StrictMode>
);
