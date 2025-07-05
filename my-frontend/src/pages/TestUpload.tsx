import React, { useState, useEffect } from 'react';

const TestUpload = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [allImages, setAllImages] = useState<string[]>([]);

  // Hàm xử lý upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });

      const url = await res.text(); // nếu backend trả chuỗi
      setImageUrl(url);

      // Load lại danh sách sau khi upload thành công
      fetchAllImages();
    } catch (error) {
      alert('Upload lỗi!');
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy danh sách ảnh từ backend
  const fetchAllImages = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/cloudinary/images');
      const data = await res.json();
      setAllImages(data);
    } catch (error) {
      console.error('Lỗi lấy danh sách ảnh:', error);
    }
  };

  // Tự động gọi khi component được mount
  useEffect(() => {
    fetchAllImages();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>📤 Upload ảnh</h2>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {loading && <p>Đang upload...</p>}
      {imageUrl && (
        <div style={{ marginTop: 20 }}>
          <p>✅ Link ảnh vừa upload: <a href={imageUrl} target="_blank" rel="noreferrer">{imageUrl}</a></p>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '300px', marginTop: 10 }} />
        </div>
      )}

      <hr style={{ margin: '30px 0' }} />

      <h3>🖼️ Tất cả ảnh đã upload:</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 15 }}>
        {allImages.map((url, idx) => (
          <img key={idx} src={url} alt={`img-${idx}`} style={{ width: 150, height: 150, objectFit: 'cover' }} />
        ))}
      </div>
    </div>
  );
};

export default TestUpload;
