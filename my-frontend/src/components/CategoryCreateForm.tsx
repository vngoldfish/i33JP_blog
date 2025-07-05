import { useEffect, useState } from 'react';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { apiFetch } from '../utils/api';

interface Category {
  id: string;
  name: string;
  parentId?: string | null;
  children?: Category[];
}

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [flatCategories, setFlatCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState<string>('');
  const [form, setForm] = useState<{ id?: string; name: string; parentId: string }>({ name: '', parentId: '' });
  const [showList, setShowList] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await apiFetch('categories');
      const data: Category[] = res;
      setCategories(data);
      setFlatCategories(flatten(data));
    } catch (err) {
      toast('Lỗi tải danh mục!', true);
    }
  };

  const flatten = (tree: Category[], parentId: string | null = null): Category[] => {
    return tree.flatMap((c) => [
      { id: c.id, name: c.name, parentId },
      ...flatten(c.children || [], c.id),
    ]);
  };

  const toast = (text: string, isError = false) => {
    Toastify({
      text,
      duration: 3000,
      gravity: 'top',
      position: 'right',
      backgroundColor: isError ? '#ef4444' : '#22c55e',
    }).showToast();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = form.id ? 'PUT' : 'POST';
    const url = form.id ? `categories/${form.id}` : 'categories';
    const body = JSON.stringify({ name: form.name, parentId: form.parentId || null });

    try {
      await apiFetch(url, { method, body });
      toast(form.id ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
      resetForm();
      fetchCategories();
    } catch {
      toast('Lỗi khi gửi dữ liệu!', true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xoá?')) return;
    await apiFetch(`categories/${id}`, { method: 'DELETE' });
    toast('Đã xoá danh mục!');
    fetchCategories();
  };

  const handleEdit = (id: string) => {
    const category = flatCategories.find((c) => c.id === id);
    if (category) {
      setForm({ id: category.id, name: category.name, parentId: category.parentId || '' });
    }
  };

  const resetForm = () => {
    setForm({ name: '', parentId: '' });
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderTree = (nodes: Category[], level = 0) => {
    return (
      <ul className={`ml-${level * 4} space-y-1`}>
        {nodes.map((node) => (
          <li key={node.id} className="pl-2">
            <div className="flex items-center gap-2">
              {node.children?.length ? (
                <button onClick={() => toggleExpand(node.id)} className="text-sm bg-gray-600 rounded px-2 py-1">
                  {expanded.has(node.id) ? '−' : '+'}
                </button>
              ) : (
                <span className="w-4" />
              )}
              <span>{node.name}</span>
              <div className="ml-auto space-x-2">
                <button onClick={() => handleEdit(node.id)} className="text-green-400 hover:underline">
                  Sửa
                </button>
                <button onClick={() => handleDelete(node.id)} className="text-red-400 hover:underline">
                  Xoá
                </button>
              </div>
            </div>
            {node.children && expanded.has(node.id) && renderTree(node.children, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section className="max-w-5xl mx-auto py-10 text-white bg-gray-900 min-h-screen p-6">
      <h2 className="text-3xl font-bold text-green-400 mb-2">Quản lý danh mục</h2>
      <p className="text-sm text-gray-400 mb-4">Tổng cộng: {flatCategories.length} danh mục</p>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow-lg mb-10 space-y-4">
        <h3 className="text-xl font-bold">{form.id ? 'Cập nhật' : 'Thêm mới'}</h3>

        <div>
          <label className="block mb-1">Tên danh mục</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>

        <div>
          <label className="block mb-1">Danh mục cha</label>
          <select
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
            value={form.parentId}
            onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}
          >
            <option value="">-- Không có --</option>
            {flatCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-2">
          <button type="submit" className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-400">
            Lưu
          </button>
          <button type="button" onClick={resetForm} className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500">
            Hủy
          </button>
        </div>
      </form>

      <div className="mb-4">
        <button onClick={() => setShowList(!showList)} className="text-green-400 hover:underline">
          {showList ? 'Ẩn danh sách danh mục' : 'Hiện danh sách danh mục'}
        </button>
      </div>

      {showList && <div>{renderTree(categories)}</div>}
    </section>
  );
};

export default CategoryManager;
