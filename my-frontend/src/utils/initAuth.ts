// src/utils/initAuth.ts
import { isTokenExpired } from "./token";
import { loginSuccess, logout } from "../reducers/authSlice";
import { authFetch } from "./authFetch";
import type { AppStore } from "../store"; // Đường dẫn đúng đến file store.ts


const API_URL = import.meta.env.VITE_API_URL;

export const initAuth = async (store: AppStore) => {
    const token: string | null = localStorage.getItem("accessToken");
  try {
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("accessToken");
      store.dispatch(logout());
      return;
    }

    // Nếu token còn hạn → gọi /auth/me để lấy lại thông tin user từ server
    const userInfo = await authFetch<{
      username: string;
      role: string;
      fullName: string;
      avatarUrl: string;
    }>(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Gán lại vào Redux
    store.dispatch(loginSuccess({ userInfo, token }));
  } catch (error) {
    console.error("Lỗi khi khôi phục auth:", error);
    localStorage.removeItem("accessToken");
    store.dispatch(logout());
  }
};
