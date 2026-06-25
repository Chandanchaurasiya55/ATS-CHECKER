import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import About from './pages/About.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Builder from './pages/Builder.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminRegister from './pages/AdminRegister.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import Pricing from './pages/Pricing.jsx';
import Recruitment from './pages/Recruitment.jsx';
import HigherEducation from './pages/HigherEducation.jsx';
import CareerCoaches from './pages/CareerCoaches.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) return null;
  if (!user) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} />;
  
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) return null;
  if (!user?.isAdmin) return <Navigate to={`/admin/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
          <div className="flex-grow">
            <Toaster position="top-center" reverseOrder={false} />
            <Navbar />
            <main className="container mx-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/recruitment" element={<Recruitment />} />
                <Route path="/higher-education" element={<HigherEducation />} />
                <Route path="/career-coaches" element={<CareerCoaches />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/register" element={<AdminRegister />} />
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <AdminPanel />
                    </AdminRoute>
                  }
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/builder" 
                  element={
                    <ProtectedRoute>
                      <Builder />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/builder/:id" 
                  element={
                    <ProtectedRoute>
                      <Builder />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
