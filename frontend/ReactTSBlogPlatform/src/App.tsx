import Header from "./Header"
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import Footer from './Footer'; 
import HomePage from './HomePage';
import BlogPostPage from './BlogPostPage';
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";
import CreatePost from "./CreatePost";
import BlogSection from "./BlogSection";

function App() {
  return (
    <Router>
      <AuthProvider>
      <Header /> 
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blogs" element={<BlogSection />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/create-post" element={<CreatePost />} />


        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
        
      </Routes>
      <Footer /> 
      </AuthProvider>
    </Router>
  );
}

export default App;