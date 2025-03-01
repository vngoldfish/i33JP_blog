import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaYoutube, FaTiktok, FaEnvelope, FaVolumeUp, FaVolumeMute } from "react-icons/fa";

export default function ComingSoon() {
  const launchDate = new Date("2025-04-01T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isMuted, setIsMuted] = useState(true);

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const difference = launchDate - now;

    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center text-white text-center overflow-hidden">
      {/* 📹 YouTube Video Background */}
      <div className="absolute top-0 left-0 w-full h-full z-[-1]">
        <iframe
          id="youtube-video"
          className="w-full h-full absolute top-0 left-0"
          src={`https://www.youtube.com/embed/I8I51kSq448?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=I8I51kSq448&controls=0&showinfo=0&modestbranding=1`}
          title="YouTube Video Background"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>

      {/* 🎵 Nút bật/tắt âm thanh */}
      <button
        className="absolute top-5 right-5 bg-black/50 p-3 rounded-full text-white hover:bg-black/70 transition"
        onClick={() => {
          setIsMuted(!isMuted);
        }}
      >
        {isMuted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
      </button>

      {/* Overlay màu tối để dễ đọc chữ */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-0"></div>

      {/* Nội dung chính */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-extrabold text-yellow-400 drop-shadow-lg">🚀 Website Nhật Bản Sắp Ra Mắt!</h1>
        <p className="text-lg mt-2 font-semibold text-gray-300">📅 Ngày ra mắt: 01/04/2025</p>

        {/* ⏳ Đồng hồ đếm ngược */}
        <div className="mt-6 flex space-x-6 text-3xl font-bold">
          <div className="bg-white text-black px-6 py-3 rounded-lg shadow-lg">{timeLeft.days}d</div>
          <div className="bg-white text-black px-6 py-3 rounded-lg shadow-lg">{timeLeft.hours}h</div>
          <div className="bg-white text-black px-6 py-3 rounded-lg shadow-lg">{timeLeft.minutes}m</div>
          <div className="bg-white text-black px-6 py-3 rounded-lg shadow-lg">{timeLeft.seconds}s</div>
        </div>

        {/* 🌸 Mô tả về website */}
        <p className="mt-6 max-w-3xl text-lg text-gray-200 leading-relaxed">
          🌸 Chia sẻ cuộc sống, văn hóa, ẩm thực, du lịch Nhật Bản. Hãy theo dõi để không bỏ lỡ những điều thú vị! 🇯🇵
        </p>

        {/* 📨 Đăng ký nhận quà */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <input
            type="email"
            placeholder="Nhập email để nhận quà!"
            className="p-3 rounded-lg text-black w-80 text-center border-2 border-white shadow-md"
          />
          <button className="ml-3 bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition">
            Đăng ký ngay 🎁
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
