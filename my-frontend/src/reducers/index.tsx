import { combineReducers } from 'redux';
import authReducer from './authSlice'; // Import reducer cho auth

// Kết hợp tất cả các reducer lại với nhau
const rootReducer = combineReducers({
  auth: authReducer, // Reducer của auth

});

// Định nghĩa RootState từ các reducer
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
