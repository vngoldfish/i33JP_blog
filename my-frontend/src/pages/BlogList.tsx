import { motion } from "framer-motion";

const blogPosts = [
  {
    id: 1,
    author: "Nguyễn Tuấn",
    avatar: "https://source.unsplash.com/50x50/?man,avatar",
    date: "07/03/2025",
    time: "08:45 AM",
    content: "Hôm nay trời trong xanh, mình dành thời gian ngồi quán cafe quen, đọc sách và cảm thấy nhẹ nhàng...",
    image: "https://source.unsplash.com/600x400/?peace,nature",
  },
  {
    id: 2,
    author: "Trần Mai",
    avatar: "https://source.unsplash.com/50x50/?woman,avatar",
    date: "06/03/2025",
    time: "10:30 AM",
    content: "Chỉ cần một tin nhắn động viên từ bạn bè cũng đủ khiến ngày của mình trở nên ý nghĩa hơn...",
    image: "https://source.unsplash.com/600x400/?happiness,smile",
  },
  {
    id: 3,
    author: "Lê Quân",
    avatar: "https://source.unsplash.com/50x50/?boy,avatar",
    date: "05/03/2025",
    time: "06:00 AM",
    content: "Sáng nay mình chạy bộ quanh công viên, không khí trong lành và cảm thấy năng lượng tràn đầy...",
    image: "https://source.unsplash.com/600x400/?running,morning",
  },
];

const Blog = () => {
  return (
    <motion.div
      className="max-w-2xl mx-auto p-6 text-white"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <motion.h1
        className="text-4xl font-bold text-green-400 text-center mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        📖 Nhật Ký Cảm Nghĩ (Tất Cả Thành Viên)
      </motion.h1>

      <div className="space-y-8">
        {blogPosts.map((post, index) => (
          <motion.div
            key={post.id}
            className="bg-gray-800 p-4 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeInOut" }}
          >
            {/* Tác giả + Avatar */}
            <div className="flex items-center space-x-3 mb-2">
              <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full" />
              <div>
                <h2 className="text-lg font-semibold text-green-300">{post.author}</h2>
                <p className="text-gray-400 text-sm">{post.time} • {post.date}</p>
              </div>
            </div>

            {/* Nội dung bài viết */}
            <p className="text-gray-300">{post.content}</p>

            {/* Ảnh bài viết */}
            <img
              src={post.image}
              alt="Hình ảnh bài viết"
              className="mt-4 rounded-lg w-full object-cover"
            />

            {/* Nút Like, Comment, Share giống Facebook */}
            <div className="flex justify-between text-gray-400 text-sm mt-4">
              <button className="hover:text-green-400 transition">👍 Thích</button>
              <button className="hover:text-green-400 transition">💬 Bình luận</button>
              <button className="hover:text-green-400 transition">🔄 Chia sẻ</button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Blog;
