import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
const App: React.FC = () => {
  return (
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
          <Header />
          <div className="flex flex-col min-h-screen pt-24">
              <Home/>
          </div>
          <Footer />
      </div>
  );
};


export default App;
