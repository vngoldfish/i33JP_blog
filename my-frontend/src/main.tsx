//import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 👈 Thêm BrowserRouter
import { Provider } from 'react-redux';
import './index.css';
import { initAuth } from "./utils/initAuth";


import App from './App.tsx';
import store from './store/index.tsx';
initAuth(store);
createRoot(document.getElementById('root')!).render(
  //<StrictMode>
     <Provider store={store}>
    <BrowserRouter>  {/* 👈 Bọc toàn bộ ứng dụng trong BrowserRouter */}
      <App />
    </BrowserRouter>
    </Provider>
  //</StrictMode>
);
