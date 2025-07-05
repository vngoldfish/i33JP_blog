import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../reducers/authSlice';
import { RootState } from '../reducers';
import FormWrapper from '../components/FormWrapper';
const LoginForm: React.FC = () => {
    const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Lấy trạng thái từ Redux
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);

  // Sử dụng useEffect để gọi navigate khi người dùng đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      // Nếu đã đăng nhập, điều hướng đến trang chủ
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]); // Điều kiện để chạy effect

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMessage('Tên người dùng và mật khẩu không được để trống!');
      return;
    }

    try {
      // Gọi action login và đợi kết quả
      await dispatch(login({ username, password })).unwrap();
      // Sau khi đăng nhập thành công, điều hướng đến trang khác
      navigate('/');
    } catch (error) {
      setErrorMessage(error as string); // Hiển thị lỗi nếu có
    }
  };
return (
    <FormWrapper>
    <div className="w-full max-w-sm p-8 bg-gray-800 text-white rounded-lg shadow-lg">
  <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Đăng Nhập</h2>
  {error && <p className="text-red-500 text-center mb-4">{error}</p>}
  {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
  <form onSubmit={handleLogin} className="space-y-4">
    <div>
      <label htmlFor="username" className="block text-sm font-medium text-gray-300">Tên người dùng</label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="mt-1 p-2 w-full border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white"
      />
    </div>

    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-300">Mật khẩu</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="mt-1 p-2 w-full border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white"
      />
    </div>

    <div className="flex items-center justify-between">
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 mt-4 text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-400"
      >
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </div>

    <div className="text-center mt-4">
      <p className="text-sm text-gray-500">
        Chưa có tài khoản?{' '}
        <a href="/signup" className="text-blue-500 hover:text-blue-600">Đăng ký ngay</a>
      </p>
      <p className="text-sm text-gray-500 mt-2">
        <a href="/forgot-password" className="text-blue-500 hover:text-blue-600">Quên mật khẩu?</a>
      </p>
    </div>
  </form>
</div>
</FormWrapper>
);

};
export default LoginForm;