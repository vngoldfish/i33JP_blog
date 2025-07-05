import React from "react";
import FormWrapper from "./FormWrapper";
const Main: React.FC = () => {
  return (
    <FormWrapper>
      <section className="flex flex-col lg:flex-row items-center justify-center p-10 w-full max-w-5xl mx-auto pb-20">
        {/* Form Liên Hệ (67%) */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full lg:w-2/3">
          <h2 className="text-3xl font-bold text-green-400">Let's work together</h2>
          <p className="text-gray-400 mt-2">Feel free to reach out and let's build something great together!</p>
          <form className="mt-6 space-y-4">
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-1/2 p-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-1/2 p-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none"
              />
            </div>
            <div className="flex space-x-4">
              <input
                type="email"
                placeholder="Email Address"
                className="w-1/2 p-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none"
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-1/2 p-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none"
              />
            </div>
            <select className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none">
              <option>Select a service</option>
              <option>Web Development</option>
              <option>UI/UX Design</option>
              <option>SEO & Marketing</option>
            </select>
            <textarea
              placeholder="Type Your Message"
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none h-32"
            ></textarea>
            <button className="bg-green-400 text-black px-6 py-3 rounded-full font-bold hover:bg-green-500 transition">
              Send Message
            </button>
          </form>
        </div>

        {/* Thông Tin Liên Hệ (33%) */}
        <div className="lg:w-1/3 mt-10 lg:mt-0 lg:ml-10">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-800 p-3 rounded-lg">
                <i className="fas fa-phone text-green-400 text-2xl"></i>
              </div>
              <div>
                <p className="text-gray-400">Phone</p>
                <p className="text-white font-semibold">(+84) 373 475 258</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-800 p-3 rounded-lg">
                <i className="fas fa-envelope text-green-400 text-2xl"></i>
              </div>
              <div>
                <p className="text-gray-400">Email</p>
                <p className="text-white font-semibold">thanhphamlq@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-800 p-3 rounded-lg">
                <i className="fas fa-map-marker-alt text-green-400 text-2xl"></i>
              </div>
              <div>
                <p className="text-gray-400">Address</p>
                <p className="text-white font-semibold">Hiep Phu, Quan 9, Ho Chi Minh City</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </FormWrapper>
  );
};

export default Main;
