import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers';  // Import rootReducer đã tạo ở trên

// Lấy thông tin từ localStorage nếu có
const savedAuth = localStorage.getItem('auth');
const initialAuthState = savedAuth
  ? JSON.parse(savedAuth)  // Nếu có thông tin lưu trữ, parse và sử dụng
  : { 
      isAuthenticated: false, 
      userInfo: null, 
      token: null, 
      error: null, 
      loading: false 
    }; // Giá trị mặc định nếu không có thông tin

const store = configureStore({
  reducer: rootReducer,  // Dùng rootReducer đã kết hợp tất cả reducers
  preloadedState: { auth: initialAuthState }, // Đặt trạng thái khởi tạo cho 'auth' từ localStorage
});

export default store;
export type AppStore = typeof store; // ✅ dòng này thêm vào
