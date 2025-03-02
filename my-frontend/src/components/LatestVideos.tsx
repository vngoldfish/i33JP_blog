
const LatestVideos = () => {
  const videos = [
    { id: 1, videoId: "o9DhvbqYzns" },
    { id: 2, videoId: "I8I51kSq448" },
    { id: 3, videoId: "IgIqM68qvF0" },
  ];

  return (
    <div>

      {/* Section Video Mới Nhất */}
      <section className="w-full max-w-5xl mx-auto pb-20">
        <h2 className="text-3xl font-bold text-green-400 text-center mb-6">
          Video Mới Nhất
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <iframe
              key={video.id}
              className="w-full aspect-video rounded-lg shadow-lg"
              src={`https://www.youtube.com/embed/${video.videoId}`}
              frameBorder="0"
              allowFullScreen
              title={`Video ${video.id}`}
            ></iframe>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://www.youtube.com/@I33JP"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-black px-6 py-3 rounded-full font-bold hover:bg-green-400 transition"
          >
            Xem tất cả video
          </a>
        </div>
      </section>
    </div>
  );
};

export default LatestVideos;
