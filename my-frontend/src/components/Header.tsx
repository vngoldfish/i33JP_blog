import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {  useSelector } from "react-redux";
import { RootState } from "../reducers";
import { menuLinks, profileLinks } from "../routes"; // Import routes

const Header: React.FC = () => {
  const location = useLocation();

  // Lấy trạng thái đăng nhập và thông tin người dùng từ Redux
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);  // Trạng thái cho menu profile
  const menuRef = useRef<HTMLDivElement>(null);

  // Các thông báo mẫu
  const notifications = [
    { id: 1, message: "Bạn có một bình luận mới trên bài viết của mình." },
    { id: 2, message: "Người theo dõi mới: @user123" },
    { id: 3, message: "Bài viết của bạn đã được phê duyệt!" }
  ];

  // Refs để kiểm tra click bên ngoài popup
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node) &&
        profileRef.current &&
        !profileRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
        setShowProfileMenu(false); // Đóng menu profile khi click bên ngoài
        setIsMenuOpen(false); // Đóng menu mobile nếu click ra ngoài
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false); // Đóng menu khi resize lên PC
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleNotificationPopup = () => {
    setIsNotificationOpen((prev) => !prev);
    setShowProfileMenu(false); // Đóng menu profile khi click vào thông báo
  };

  const toggleProfilePopup = () => {
    setShowProfileMenu((prev) => !prev); // Chuyển đổi trạng thái của menu profile
    setIsNotificationOpen(false); // Đóng menu thông báo nếu mở menu profile
  };

  const handleMouseLeave = (setState: React.Dispatch<React.SetStateAction<boolean>>) => {
    setTimeout(() => {
      setState(false);
    }, 200);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 shadow-lg z-50 border-b border-gray-700 h-14 lg:h-20 flex items-center">
      <div className="max-w-5xl mx-auto flex items-center w-full px-4 lg:px-6 relative">
        {/* Nút Menu Mobile (Hamburger) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="absolute left-4 lg:hidden text-green-500 text-2xl"
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Logo */}
        <div className="flex flex-col lg:flex-row items-center lg:items-center font-bold text-3xl lg:text-4xl mx-auto lg:mx-0 text-center lg:text-left leading-none">
          I33JP
          <span className="text-green-500 text-sm inline-block lg:ml-2">Home</span>
        </div>

        {/* Menu Desktop */}
        <nav className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
          {menuLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${
                location.pathname === link.to
                  ? "border-b-2 border-green-500 text-green-500"
                  : "text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Avatar, Nút thông báo & Popup */}
        <div className="absolute right-4 flex items-center space-x-4 z-50">
          {isAuthenticated ? (
            <>
              {/* Nút thông báo */}
              <div className="relative" ref={notificationRef}>
                <i
                  className="fas fa-bell text-gray-400 text-lg cursor-pointer"
                  onClick={toggleNotificationPopup}
                ></i>

                {/* Popup thông báo */}
                {isNotificationOpen && (
                  <div
                    className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg text-black z-50"
                    onMouseLeave={() => handleMouseLeave(setIsNotificationOpen)}
                  >
                    <div className="p-4 border-b">
                      <p className="font-bold text-lg">Thông báo</p>
                    </div>
                    <div className="py-2 max-h-60 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div key={notification.id} className="px-4 py-2 border-b hover:bg-gray-100">
                            {notification.message}
                          </div>
                        ))
                      ) : (
                        <p className="px-4 py-2 text-gray-500">Không có thông báo mới.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Avatar & Popup */}
              <div className="relative" ref={profileRef}>
                <img
                  src={userInfo?.avatarUrl || "https://dthezntil550i.cloudfront.net/ax/latest/ax1611050402029950001833695/1280_960/cddaa3b2-c03b-4aa5-916f-b7a8392479ec.png"} // Lấy avatar từ Redux state
                  alt="Avatar"
                  className="w-8 h-8 rounded-full cursor-pointer"
                  onClick={toggleProfilePopup}
                />

                {/* Popup thông tin tài khoản */}
                {showProfileMenu && (
                  <div
                    className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg text-black z-50"
                    onMouseLeave={() => handleMouseLeave(setShowProfileMenu)}
                  >
                    <div className="p-4 border-b">
                      <p className="font-bold">{userInfo?.fullName}</p> {/* Hiển thị tên người dùng */}
                      <p className="text-gray-500 text-sm">@{userInfo?.username}</p> {/* Tên người dùng */}
                    </div>
                    <div className="py-2">
                      {profileLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button className="bg-green-500 text-black px-3 py-1 rounded-md text-sm font-bold">
              Đăng nhập
            </button>
          )}
        </div>
      </div>

      {/* Menu Mobile Popup */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)} // Bấm ra ngoài cũng tắt menu
          ></div>

          <div
            ref={menuRef}
            className="absolute top-full left-0 w-full bg-gray-900 shadow-lg z-50 lg:hidden transition-all duration-300"
          >
            <button
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={() => setIsMenuOpen(false)}
            >
              ✕
            </button>

            <nav className="flex flex-col space-y-4 text-white text-lg py-4 w-full text-center">
              {menuLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 transition-all duration-200 transform ${
                    location.pathname === link.to ||
                    (link.to === "/" && location.pathname === "/")
                      ? "border-b-[1px] border-green-500 text-green-500 scale-105" // Gạch chân ngắn hơn & chữ phóng to nhẹ khi active
                      : "text-white"
                  } hover:scale-110 hover:text-green-400 hover:border-b-[1px] hover:border-green-400 w-max mx-auto`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
