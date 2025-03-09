import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type LoginFormData = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  // API giả lập
  const fakeApiLogin = async (email: string, password: string) => {
    return new Promise<{ success: boolean; token?: string; message?: string }>((resolve) => {
      setTimeout(() => {
        if (email === "user@gmail.com" && password === "123456") {
          resolve({ success: true, token: "fake-jwt-token" });
        } else {
          resolve({ success: false, message: "Email hoặc mật khẩu không đúng!" });
        }
      }, 1000);
    });
  };

  // Xử lý đăng nhập
  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage("");

    const response = await fakeApiLogin(data.email, data.password);

    if (response.success && response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard"); // Chuyển hướng đến trang Dashboard
    } else {
      setErrorMessage(response.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-white">
        <h2 className="text-2xl font-bold text-center text-green-400 mb-6">Đăng Nhập</h2>

        {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email không được để trống!",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Email không hợp lệ!",
                },
              })}
              className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white focus:ring focus:ring-green-400"
              placeholder="Nhập email của bạn"
            />
            {errors.email?.message && (
              <p className="text-red-400 text-sm">{String(errors.email.message)}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">Mật khẩu</label>
            <input
              type="password"
              {...register("password", {
                required: "Mật khẩu không được để trống!",
                minLength: {
                  value: 6,
                  message: "Mật khẩu tối thiểu 6 ký tự",
                },
              })}
              className="w-full px-3 py-2 border rounded-md bg-gray-700 text-white focus:ring focus:ring-green-400"
              placeholder="Nhập mật khẩu"
            />
            {errors.password?.message && (
              <p className="text-red-400 text-sm">{String(errors.password.message)}</p>
            )}
          </div>

          {/* Nút Đăng nhập */}
          <button
            type="submit"
            className="w-full bg-green-500 text-black py-2 rounded-md font-bold hover:bg-green-600"
          >
            Đăng Nhập
          </button>
        </form>

        {/* Quên mật khẩu */}
        <div className="text-center mt-4">
          <a href="#" className="text-green-400 text-sm hover:underline">
            Quên mật khẩu?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
