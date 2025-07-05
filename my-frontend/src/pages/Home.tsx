
import HeroSection from "../components/HeroSection";
import LatestPosts from "../components/LatestPosts";
import FormWrapper from "../components/FormWrapper";
const Home = () => {
  return (
    //<main className="flex-grow flex flex-col lg:flex-row items-center justify-center text-center lg:text-left w-full max-w-5xl mx-auto pb-10 h-auto">
    <>
        <HeroSection />
        <div className="w-1/2 border-t-4 border-gray-600 mx-auto my-12"></div>

        <LatestPosts/>

        <div className="w-1/2 border-t-4 border-gray-600 mx-auto my-12"></div>

</>
  );
};

export default Home;
