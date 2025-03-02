const LatestPosts = () => {
    const posts = [
      {
        title: "Làm sao để học ReactJS hiệu quả?",
        date: "02/03/2025",
        link: "bai-viet-1.html",
        image: "https://cloudmatetechnologies.com/wp-content/uploads/2024/06/react.js.png",
      },
      {
        title: "Hướng dẫn cài đặt môi trường phát triển Java",
        date: "01/03/2025",
        link: "bai-viet-2.html",
        image: "https://cdn.bap-software.net/2024/01/03211643/How-is-AI-applied-to-Java-programming-e1704266486769.jpg",
      },
      {
        title: "Lộ trình học tiếng Nhật từ N5 đến N1",
        date: "28/02/2025",
        link: "bai-viet-3.html",
        image: "https://duhocicc.edu.vn/wp-content/uploads/2024/06/hoc-tieng-nhat-can-ban-lo-trinh-cho-nguoi-moi-bat-dau-cung-icc.jpeg",
      },
    ];
  
    return (
      <section className="w-full max-w-5xl mx-auto pb-20">
        <h2 className="text-3xl font-bold text-green-400 text-center mb-6">Bài Viết Mới Nhất</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <article key={index} className="bg-gray-700 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
              <img src={post.image} alt="Thumbnail bài viết" className="rounded-lg" />
              <h3 className="text-xl font-semibold text-white mt-4">{post.title}</h3>
              <p className="text-gray-400 text-sm">Ngày đăng: {post.date}</p>
              <a href={post.link} className="text-green-500 hover:underline mt-2 inline-block">Đọc thêm →</a>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <a href="blog.html" className="bg-green-500 text-black px-6 py-3 rounded-full font-bold hover:bg-green-400 transition">
            Xem tất cả bài viết
          </a>
        </div>
      </section>
    );
  };
  
  export default LatestPosts;
  