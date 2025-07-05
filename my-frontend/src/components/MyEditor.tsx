import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    ClassicEditor: any;
  }
}

interface MyEditorProps {
  data?: string;
  onReady?: (editor: any) => void;
  onChange?: (evt: any, editor: any) => void;
}

export default function MyEditor({ data = '', onReady, onChange }: MyEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (!editorRef.current || instanceRef.current) return;

    if (!window.ClassicEditor) {
      console.error('ClassicEditor not found! Bạn đã thêm script vào index.html chưa?');
      return;
    }

    window.ClassicEditor
      .create(editorRef.current!)
      .then(editor => {
        instanceRef.current = editor;
        if (data) editor.setData(data);
        if (onReady) onReady(editor);
        editor.model.document.on('change:data', evt => {
          if (onChange) onChange(evt, editor);
        });
      })
      .catch(err => console.error('Editor error', err));

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy().then(() => {
          instanceRef.current = null;
        });
      }
    };
  }, []);

  return <div ref={editorRef} style={{ minHeight: 400 }} />;
}
