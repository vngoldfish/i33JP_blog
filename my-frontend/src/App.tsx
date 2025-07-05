import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";
import AchievementsPage from "./pages/Achievements";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import Logout from "./components/Logout";
import Main from "./components/Main";
import PostCreateForm from "./pages/PostCreateForm";
import CategoryManager from "./components/CategoryCreateForm";
import PostDetail from "./pages/PostDetailView";
import PostList from "./pages/PostList";
import TestUpload from "./pages/TestUpload";
const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-col mt-24">

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/dangnhap" element={<Login />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/main" element={<Main />} />
          <Route path="/createpost" element={<PostCreateForm />} />
          <Route path="/categorym" element={<CategoryManager />} />
          <Route path="/posts" element={<PostList />} />
          <Route path="/posts/:id/slug/:slug" element={<PostDetail />} />
          <Route path="/testu" element={<TestUpload />} />

        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
