import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { PencilIcon, Trash2Icon, HomeIcon, ChevronRightIcon } from 'lucide-react';

interface CategoryDto {
  id: number;
  name: string;
  parentId?: number | null;
  parentName?: string;
}

interface PostDetail {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: string;
  breadcrumb: CategoryDto[];
  tagIds: string[];
}

const PostDetail = () => {
  const { id, slug } = useParams();
  const [post, setPost] = useState<PostDetail | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await apiFetch(`posts/${id}`);
        console.log("Dữ liệu bài viết:", res.data); // 👀 Kiểm tra tại đây

        setPost(res.data);
      } catch (error) {
        console.error('Lỗi tải bài viết:', error);
      }
    };

    if (id && slug) fetchPost();
  }, [id, slug]);

  const handleEdit = () => {
    if (post) {
      navigate(`/posts/${post.id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (post && confirm('Bạn có chắc muốn xoá bài viết này?')) {
      try {
        await apiFetch(`posts/${post.id}`, { method: 'DELETE' });
        alert('Đã xoá thành công!');
        navigate('/posts');
      } catch (err) {
        console.error('Lỗi xoá bài viết:', err);
        alert('Lỗi khi xoá bài viết!');
      }
    }
  };

  if (!post) return <p className="text-white">Đang tải bài viết...</p>;

  const renderBreadcrumb = () => {
    if (!post?.breadcrumb || post.breadcrumb.length === 0) return null;

    return (
      <nav className="text-sm text-gray-400 flex flex-wrap items-center gap-1">
        <Link to="/" className="hover:underline text-white font-semibold flex items-center gap-1">
          <HomeIcon size={16} /> Trang chủ
        </Link>
        <ChevronRightIcon size={14} className="text-gray-500" />
        {post.breadcrumb.map((cat, index) => (
          <span key={cat.id} className="flex items-center gap-1">
            <Link
              to={`/categories/${cat.id}`}
              className="hover:underline text-white"
            >
              {cat.name}
            </Link>
            {index < post.breadcrumb.length - 1 && (
              <ChevronRightIcon size={14} className="text-gray-500" />
            )}
          </span>
        ))}
        <ChevronRightIcon size={14} className="text-gray-500" />
        <span className="text-white font-medium">{post.title}</span>
      </nav>
    );
  };

  return (
    <section className="max-w-4xl mx-auto py-10 text-white bg-gray-900 min-h-screen p-6">
      <div className="text-sm text-gray-400 mb-4 flex flex-wrap items-center gap-1">
        {renderBreadcrumb()}
      </div>

      <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-3xl font-bold text-green-400 font-sans w-full md:w-auto">{post.title}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleEdit}
            className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-400 text-white px-3 py-1 rounded-md transition-colors duration-200"
            title="Sửa bài viết"
          >
            <PencilIcon size={16} /> Sửa
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-md transition-colors duration-200"
            title="Xoá bài viết"
          >
            <Trash2Icon size={16} /> Xoá
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-400 mb-6">
        Đăng bởi <strong>{post.author}</strong> vào ngày {new Date(post.createdAt).toLocaleString()}
      </div>

      <div
        className="font-sans text-white bg-gray-800 p-4 rounded leading-relaxed break-words break-all overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tagIds.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Thẻ (tags):</h3>
          <div className="flex flex-wrap gap-2">
            {post.tagIds.map(tag => (
              <Link
                key={tag}
                to={`/posts/tag/${encodeURIComponent(tag)}`}
                className="px-3 py-1 bg-gray-700 rounded-full text-sm hover:bg-gray-600"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default PostDetail;
