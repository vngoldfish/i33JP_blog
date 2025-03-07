import { motion } from "framer-motion";

const achievements = [
  { title: "Giải Nhất Hackathon 2024", description: "Giải nhất cuộc thi lập trình sáng tạo năm 2024 với dự án AI chatbot." },
  { title: "Chứng chỉ ReactJS", description: "Hoàn thành khóa học ReactJS nâng cao với điểm số xuất sắc." },
  { title: "Top 1% IELTS Listening", description: "Đạt điểm số cao trong phần Listening của kỳ thi IELTS." },
];

const projects = [
  {
    name: "Hệ thống Tư Vấn Trực Tuyến",
    description: "Ứng dụng tư vấn trực tuyến sử dụng ReactJS, MongoDB, và Spring Boot.",
    link: "https://github.com/yourgithub/consulting-app",
  },
  {
    name: "Website Blog Cá Nhân",
    description: "Nền tảng blog cá nhân với tính năng đăng bài, bình luận và lưu bài viết yêu thích.",
    link: "https://yourblog.com",
  },
  {
    name: "Mô hình dự báo giá Carbon",
    description: "Nghiên cứu về giá năng lượng & mô hình PVAR trong phân tích giá carbon.",
    link: "https://yourresearch.com",
  },
];

const skills = [
  { name: "ReactJS", level: 85 },
  { name: "Java", level: 80 },
  { name: "Spring Boot", level: 75 },
  { name: "MongoDB", level: 70 },
  { name: "English (IELTS)", level: 90 },
];

const AchievementsPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center text-green-400">Thành Tích, Dự Án & Kỹ Năng</h1>

      {/* Thành Tích */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-green-300">🎖 Thành Tích</h2>
        <div className="space-y-4">
          {achievements.map((achieve, index) => (
            <motion.div
              key={index}
              className="p-4 bg-gray-800 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <h3 className="text-lg font-semibold text-green-200">{achieve.title}</h3>
              <p className="text-gray-300">{achieve.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dự Án */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-green-300">🚀 Dự Án</h2>
        <div className="space-y-4">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="p-4 bg-gray-800 rounded-lg shadow-md border-l-4 border-green-400"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <h3 className="text-lg font-semibold text-green-200">{project.name}</h3>
              <p className="text-gray-300">{project.description}</p>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:underline"
              >
                Xem chi tiết →
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Kỹ Năng */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-green-300">⚡ Kỹ Năng</h2>
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 p-4 rounded-lg shadow-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="flex justify-between mb-2">
                <h3 className="text-lg font-semibold text-green-200">{skill.name}</h3>
                <span className="text-gray-400">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <motion.div
                  className="bg-green-500 h-4 rounded-full"
                  style={{ width: `${skill.level}%` }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;
