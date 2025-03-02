const Footer = () => {
    return (
      <footer className="w-full bg-gray-900 border-t border-gray-700 mt-auto relative">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row justify-around items-center text-center py-6">
          <div className="w-full lg:w-auto text-center py-4">
            <div className="text-4xl font-bold text-white">0</div>
            <div className="text-gray-400">Years of Experience</div>
          </div>
          <div className="w-full lg:w-auto text-center py-4">
            <div className="text-4xl font-bold text-white">0</div>
            <div className="text-gray-400">Projects Completed</div>
          </div>
          <div className="w-full lg:w-auto text-center py-4">
            <div className="text-4xl font-bold text-white">0</div>
            <div className="text-gray-400">Technologies Mastered</div>
          </div>
          <div className="w-full lg:w-auto text-center py-4">
            <div className="text-4xl font-bold text-white">0</div>
            <div className="text-gray-400">Code Commits</div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;