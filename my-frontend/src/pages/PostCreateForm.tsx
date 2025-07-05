import { useEffect, useRef, useState } from "react";
import MyEditor from "../components/MyEditor";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "tom-select/dist/css/tom-select.css";
import TomSelect from "tom-select";
import { apiFetch } from "../utils/api";

// fallback types cho CKEditor
interface Writer {
  unwrap: (el: { name: string }) => void;
}

interface ContentNode {
  name: string;
  getChildren?: () => Iterable<ContentNode>;
}

interface Editor {
  plugins: {
    get: (pluginName: string) => {
      on: (
        event: string,
        callback: (_evt: unknown, data: { content: { getChildren?: () => Iterable<ContentNode> } }) => void
      ) => void;
    };
  };
  model: {
    change: (callback: (writer: Writer) => void) => void;
  };
  getData: () => string;
}

interface Category {
  id: string;
  name: string;
  children?: Category[];
}

interface Tag {
  id: string;
  name: string;
}

const PostCreateForm = () => {
  const titleRef = useRef<HTMLInputElement>(null!);
  const categoryRef = useRef<HTMLSelectElement>(null!);
  const tagRef = useRef<HTMLSelectElement>(null!);
  const [editorData, setEditorData] = useState<string>("");

  useEffect(() => {
    loadSelect("categories", categoryRef, flattenCategories);
    loadSelect("tags", tagRef);
  }, []);

  const notify = (text: string, backgroundColor: string) => {
    Toastify({ text, duration: 3000, gravity: "top", position: "right", backgroundColor }).showToast();
  };

  const flattenCategories = (categories: Category[], level = 0): { id: string; label: string }[] => {
    return categories.flatMap(cat => [
      { id: cat.id, label: `${"— ".repeat(level)}${cat.name}` },
      ...(cat.children ? flattenCategories(cat.children, level + 1) : [])
    ]);
  };

  const loadSelect = async (
    endpoint: "categories" | "tags",
    ref: React.RefObject<HTMLSelectElement>,
    formatter?: (data: { id: string; name: string; label?: string }[]) => { id: string; label: string }[]
  ) => {
    try {
      const data: { id: string; name: string; label?: string }[] = await apiFetch(endpoint);

      const select = ref.current;
      if (!select) return;

      const options = formatter ? formatter(data) : data.map(item => ({ id: item.id, label: item.name }));
      options.forEach(item => {
        const option = new Option(item.label, item.id);
        select.appendChild(option);
      });

      if (!select.classList.contains("tomselected")) {
        new TomSelect(select, {
          plugins: ["remove_button"],
          maxItems: endpoint === "categories" ? 1 : null,
          persist: false,
          hideSelected: true,
          closeAfterSelect: false,
          create: endpoint === "tags"
        });
      }
    } catch (err) {
      console.error(`Lỗi tải ${endpoint}:`, err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const title = titleRef.current?.value.trim() || "";
    const content = editorData.trim();
    const category = categoryRef.current?.value || "";
    const tags = Array.from(tagRef.current?.selectedOptions || []).map(opt => opt.value);

    if (!title) return notify("Vui lòng nhập tiêu đề bài viết.", "#f97316");
    if (!content) return notify("Vui lòng nhập nội dung bài viết.", "#f97316");
    if (!category) return notify("Vui lòng chọn danh mục.", "#f97316");

    const post = { title, content, categoryId: category, tagIds: tags };

    try {
      await apiFetch("posts/create", {
        method: "POST",
        body: JSON.stringify(post),
      });

      notify("Đã tạo bài viết thành công!", "#22c55e");
      (e.target as HTMLFormElement).reset();
      setEditorData("");
    } catch (err) {
      console.error("Lỗi gửi bài viết:", err);
      notify("Lỗi tạo bài viết.", "#ef4444");
    }
  };

  return (
    <section className="max-w-5xl mx-auto py-10 text-white bg-gray-900 min-h-screen p-6">
      <h2 className="text-3xl font-bold text-green-400 mb-4">Tạo bài viết mới</h2>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow-lg space-y-4">
        <Input label="Tiêu đề" inputRef={titleRef} />

        <div>
          <label className="block mb-1">Nội dung</label>
          <div className="bg-white rounded  ck-editor-container text-black">
          <MyEditor
              data={editorData}
              
              onReady={(editor: Editor) => {
                const clipboard = editor.plugins.get("ClipboardPipeline");
                clipboard.on("inputTransformation", (_evt, data) => {
                  const content = data.content;
                  for (const value of content.getChildren?.() || []) {
                    for (const node of value.getChildren?.() || []) {
                      if (node.name === "a") {
                        editor.model.change((writer) => writer.unwrap(node));
                      }
                    }
                  }
                });
              }}
              onChange={(_evt: unknown, editor: Editor) => setEditorData(editor.getData())}
            />
          </div>
        </div>

        <Select label="Danh mục" selectRef={categoryRef} id="category-select" />
        <Select label="Tag" selectRef={tagRef} id="tag-select" />

        <div className="flex space-x-2">
          <button type="submit" className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-400">Lưu bài viết</button>
          <button type="reset" className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500">Hủy</button>
        </div>
      </form>
    </section>
  );
};

const Input = ({ label, inputRef }: { label: string; inputRef: React.RefObject<HTMLInputElement> }) => (
  <div>
    <label className="block mb-1">{label}</label>
    <input ref={inputRef} type="text" className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white" />
  </div>
);

const Select = ({ label, selectRef, id }: { label: string; selectRef: React.RefObject<HTMLSelectElement>; id: string }) => (
  <select
    ref={selectRef}
    id={id}
    multiple={label !== "Danh mục"}
    data-placeholder={`Chọn ${label.toLowerCase()}...`}
    className="w-full bg-gray-700 text-white border border-gray-600 rounded"
  />
);

export default PostCreateForm;
