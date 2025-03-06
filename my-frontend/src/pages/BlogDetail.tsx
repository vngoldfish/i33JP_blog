import { useParams, Link } from "react-router-dom";

const blogPosts = [
  { id: 1, title: "Cách học ReactJS hiệu quả", content: "Nội dung chi tiết bài viết 1..." },
  { id: 2, title: "Hướng dẫn cài đặt môi trường phát triển Java", content: "Nội dung chi tiết bài viết 2..." },
  { id: 3, title: "Lộ trình học tiếng Nhật từ N5 đến N1", content: "Nội dung chi tiết bài viết 3..." }
];

const BlogDetail = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === parseInt(id));

  if (!post) {
    return <div className="text-center text-red-500 text-xl font-bold">Bài viết không tồn tại!</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-green-500">{post.title}</h1>
      <p className="text-white mt-4">{post.content}</p>
      <Link to="/" className="inline-block mt-6 bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-500">
        Quay lại danh sách
      </Link>
    </div>
  );
};

export default BlogDetail;
