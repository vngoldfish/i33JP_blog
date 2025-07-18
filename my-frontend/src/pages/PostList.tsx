import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import Pagination from '../components/Pagination'; // Component phân trang riêng

interface Post {
  id: number;
  title: string;
  slug: string;
  author: string;
  categoryName: string;
  tagIds: number[] | null;
  createdAt: string;
  updatedAt: string;
  shortContent: string;
}

interface PostResponse {
  totalPages: number;
  message: string;
  currentPage: number;
  totalItems: number;
  data: Post[];
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate();

  const fetchPosts = async (page: number = 0) => {
    try {
      const res = await apiFetch(`posts?page=${page}`);
      const { data, currentPage, totalPages } = res as PostResponse;
      setPosts(data);
      setCurrentPage(currentPage);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Lỗi khi lấy bài viết:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      fetchPosts(page);
    }
  };

  const handleClickPost = (id: number, slug: string) => {
    navigate(`/posts/${id}/slug/${slug}`);
  };

  return (
    <main className="flex-grow text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 w-full min-h-[calc(100vh-160px)] flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-6 text-green-400">Danh sách bài viết</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-gray-700 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer"
                onClick={() => handleClickPost(post.id, post.slug)}
              >
                <img src="data:image/jpeg;base64,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" alt="Thumbnail bài viết" className="rounded-lg" />
                <h3 className="text-xl font-semibold text-white mt-4">{post.title}</h3>
                <p className="text-gray-400 text-sm">Tác giả: {post.author}</p>
                <p className="text-gray-400 text-sm">Chuyên mục: {post.categoryName}</p>
                <p className="text-gray-300 mt-2 break-words overflow-hidden break-all">
                {post.shortContent}</p>
                <span className="text-green-500 hover:underline mt-2 inline-block">Đọc thêm →</span>
              </article>
            ))}
          </div>
        </div>

        {/* Component phân trang */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </main>
  );
};

export default PostList;
