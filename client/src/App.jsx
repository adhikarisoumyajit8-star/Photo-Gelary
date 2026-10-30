import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PhotoProvider } from './context/PhotoContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import CategoryPage from './pages/CategoryPage';
import PhotoDetailPage from './pages/PhotoDetailPage';
import UploadPage from './pages/UploadPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

/**
 * App — Root component
 * Demonstrates: BrowserRouter, Routes, Route with dynamic params,
 * Context Provider wrapping the entire app, layout composition
 */
export default function App() {
  return (
    <BrowserRouter>
      {/* PhotoProvider wraps everything — all children can access context */}
      <AuthProvider>
      <PhotoProvider>
        {/* Layout: Navbar always visible at top */}
        <Navbar />

        {/* Routes — each path renders a different page component */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          {/* Dynamic route with URL parameter :name */}
          <Route path="/category/:name" element={<CategoryPage />} />
          {/* Dynamic route with URL parameter :id */}
          <Route path="/photo/:id" element={<PhotoDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute adminOnly><UploadPage /></ProtectedRoute>} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>

        {/* Footer always visible at bottom */}
        <Footer />
      </PhotoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
