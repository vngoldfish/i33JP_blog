import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 shadow-lg z-50 border-b border-gray-700 h-14 lg:h-20 flex items-center">
      <div className="max-w-5xl mx-auto flex items-center w-full px-4 lg:px-6">
        {/* Logo (Căn giữa trên Mobile, bên trái trên PC) */}
        <div className="flex flex-col lg:flex-row items-center lg:items-center font-bold text-3xl lg:text-4xl mx-auto lg:mx-0 text-center lg:text-left leading-none">
          I33JP  
          <span className="text-green-500 text-sm inline-block lg:ml-2">Home</span>
        </div>

        {/* Nút mở menu trên Mobile (Căn phải) */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="absolute right-3 lg:hidden text-green-500 text-2xl"
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Menu trên PC */}
        <div className="hidden lg:flex items-center space-x-6 ml-auto">
          <nav className="flex space-x-6">
            <a href="index.html" className="nav-link">Home</a>
            <a href="about.html" className="nav-link">About</a>
            <a href="blog.html" className="nav-link">Blog</a>
            <a href="categories.html" className="nav-link">Categories</a>
            <a href="contact.html" className="nav-link">Contact</a>
            <a href="resources.html" className="nav-link">Resources</a> 
            <a href="projects.html" className="nav-link">Projects</a>
          </nav>
          {/* Nút Hire Me */}
          <a className="bg-green-500 text-black px-3 py-1 rounded-full text-sm" href="#">Hire me</a>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="absolute top-14 left-0 w-full bg-gray-900 border-b border-gray-700 lg:hidden flex flex-col items-center py-4 space-y-4">
          <nav className="flex flex-col items-center space-y-4">
            <a href="index.html" className="nav-link">Home</a>
            <a href="about.html" className="nav-link">About</a>
            <a href="blog.html" className="nav-link">Blog</a>
            <a href="categories.html" className="nav-link">Categories</a>
            <a href="contact.html" className="nav-link">Contact</a>
            <a href="resources.html" className="nav-link">Resources</a> 
            <a href="projects.html" className="nav-link">Projects</a>
          </nav>
          {/* Nút Hire Me */}
          <a className="bg-green-500 text-black px-3 py-1 rounded-full text-sm" href="#">Hire me</a>
        </div>
      )}
    </header>
  );
};

export default Header;
