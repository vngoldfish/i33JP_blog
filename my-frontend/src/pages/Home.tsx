
import HeroSection from "../components/HeroSection";
import LatestPosts from "../components/LatestPosts";
import LatestVideos from "../components/LatestVideos";

const Home = () => {
  return (

        <>
        <HeroSection />
        <div className="w-1/2 border-t-4 border-gray-600 mx-auto my-12"></div>

        <LatestPosts/>
        <div className="w-1/2 border-t-4 border-gray-600 mx-auto my-12"></div>
        
        <LatestVideos/>
        </>

  );
};

export default Home;
