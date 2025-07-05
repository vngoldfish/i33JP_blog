
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from "../utils/api"; // đường dẫn phù hợp dự án bạn

// Định nghĩa loại trạng thái cho auth
interface AuthState {
  isAuthenticated: boolean;
  userInfo: {
    username: string;
    role: string;
    fullName: string;
    avatarUrl: string;
  } | null;
  error: string | null;
  loading: boolean;

}

// Giá trị ban đầu
const initialState: AuthState = {
  isAuthenticated: false,
  userInfo: null,
  error: null,
  loading: false,

};
// Định nghĩa action async để gọi API
export const login = createAsyncThunk(
  'auth/login',
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await apiFetch<{ accessToken: string; username: string; role: string; fullName: string; avatarUrl: string }>(
        "auth/login",
        {
          method: "POST",
          body: JSON.stringify({ username, password }),
        }
      );

      return {
        userInfo: {
          username: data.username,
          role: data.role,
          fullName: data.fullName,
          avatarUrl: data.avatarUrl,
        },
        token: data.accessToken,
      };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("Đã có lỗi xảy ra.");
      }
    }
  }
);
  
// Tạo slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ userInfo: AuthState['userInfo']; token: string }>) {
      state.isAuthenticated = true;
      state.userInfo = action.payload.userInfo;
      state.error = null;
       // Lưu thông tin vào localStorage khi login thành công
      // Sau khi đăng nhập thành công:
      localStorage.setItem("accessToken", action.payload.token);

    },
    loginFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userInfo = null;
      state.error = null;
      // Xóa thông tin khỏi localStorage khi logout
      localStorage.removeItem('accessToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.userInfo = action.payload.userInfo;
        state.error = null;
        state.loading = false;
         // Lưu thông tin vào localStorage mà không có 'message'
         localStorage.setItem("accessToken", action.payload.token);

      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string; // Nếu lỗi thì cập nhật lỗi vào state
        state.loading = false;
      });
  },
});

// Xuất action creators và reducer
export const { loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
