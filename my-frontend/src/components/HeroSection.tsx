import FormWrapper from "./FormWrapper";
const HeroSection = () => {
    return (
      <FormWrapper>
          <div className="lg:w-2/3 flex flex-col items-center lg:items-start px-6">
            <h2 className="text-lg md:text-xl lg:text-2xl">Amateur Developer in Training</h2>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4">
              Hello, I'm <span className="text-green-500">TUAN i33JPP</span>
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-gray-400 mt-4">
              A passionate amateur developer who is constantly learning and improving every day.
              <br/>
              "I will work hard, push my limits, and strive even harder to develop myself and grow beyond expectations."
            </p>
            
            <div className="flex space-x-6 mt-8 justify-center lg:justify-start">
              <a className="text-green-500" href="https://github.com/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github fa-2x"></i>
              </a>
              <a className="text-green-500" href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin fa-2x"></i>
              </a>
              <a className="text-green-500" href="https://www.facebook.com/hirodadjp/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook fa-2x"></i>
              </a>
              <a className="text-green-500" href="https://www.youtube.com/@I33JP" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube fa-2x"></i>
              </a>
              <a className="text-green-500" href="https://www.instagram.com/hirodadjp/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram fa-2x"></i>
              </a>
              <a className="text-green-500" href="https://www.tiktok.com/@i33jp" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-tiktok fa-2x"></i>
              </a>
            </div>
          </div>
          <div className="relative mt-16 lg:mt-0 lg:w-1/3 flex justify-center px-6">
            <img 
              alt="A person with a backpack, seen from behind, with a dark background and green decorative elements" 
              className="rounded-full object-cover aspect-square w-60 md:w-80 lg:w-full lg:max-w-[300px]" 
              src="https://storage.googleapis.com/a1aa/image/wtXFUpu0sURXVo3AZWKvy_3H9nlNKz1TlNv-8p20PRA.jpg" 
            />
          </div>
        </FormWrapper>
    );
  };
  
  export default HeroSection;
  