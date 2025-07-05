import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../reducers/authSlice';
import { useEffect } from 'react';
const Logout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Sử dụng useEffect để điều hướng sau khi component render
  useEffect(() => {
    dispatch(logout());
    localStorage.removeItem('auth');
    
    // Chuyển hướng người dùng về trang Login sau khi đăng xuất
    navigate('/dangnhap');
  }, [dispatch, navigate]); // Chạy useEffect khi component được render

  return <div>Logging out...</div>; // Hiển thị trạng thái "Đang đăng xuất..."
};

export default Logout;
