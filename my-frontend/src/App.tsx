import { Routes, Route } from "react-router-dom"; // ❌ Không import BrowserRouter nữa
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";
import AchievementsPage from "./pages/Achievements";
import Login from "./pages/Login";


const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header />

      <div className="flex flex-col min-h-screen pt-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/dangnhap" element={<Login />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;
