import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FileText, LogOut, User, Menu, X, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105">
              <div className="bg-primary-600 p-2.5 rounded-[12px] shadow-lg shadow-primary-600/30">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tight">ATS<span className="text-primary-600">Pro</span></span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/about" className="text-gray-600 hover:text-primary-600 font-bold transition-all">
              About
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-primary-600 font-bold transition-all">
              Pricing
            </Link>
            {!isAuthenticated && (
              <>
                <Link to="/admin/login" className="text-gray-600 hover:text-primary-600 font-bold transition-all">
                  Admin Login
                </Link>
                <Link to="/admin/register" className="text-gray-600 hover:text-primary-600 font-bold transition-all">
                  Admin Register
                </Link>
              </>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/builder" className="text-gray-600 hover:text-primary-600 font-bold transition-all">
                  Resume Builder
                </Link>
                <div className="h-6 w-px bg-gray-200"></div>

                <div className="relative group">
                  <div className="flex items-center gap-2 pr-2 cursor-default">
                    <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold border-2 border-white shadow-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-gray-700">{user?.name}</span>
                  </div>

                  <div className="absolute right-0 top-full mt-3 w-56 rounded-2xl bg-white border border-gray-100 shadow-xl p-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                    {user?.isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-700 font-semibold transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-700 font-semibold transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-semibold transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-gray-600 hover:bg-gray-50 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-50 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-4">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/about" 
                    className="block text-xl font-bold text-gray-900" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    to="/pricing" 
                    className="block text-xl font-bold text-gray-900" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  {user?.isAdmin && (
                    <Link 
                      to="/admin" 
                      className="block text-xl font-bold text-gray-900" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link 
                    to="/dashboard" 
                    className="block text-xl font-bold text-gray-900" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/builder" 
                    className="block text-xl font-bold text-gray-900" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Resume Builder
                  </Link>
                  <hr className="border-gray-50" />
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-900">{user?.name}</span>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 rounded-2xl font-bold"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/about" 
                    className="block text-xl font-bold text-gray-900 text-center py-2" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    to="/pricing" 
                    className="block text-xl font-bold text-gray-900 text-center py-2" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link 
                    to="/admin/login" 
                    className="block text-xl font-bold text-gray-900 text-center py-2" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Login
                  </Link>
                  <Link 
                    to="/admin/register" 
                    className="block text-xl font-bold text-gray-900 text-center py-2" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Register
                  </Link>
                  <Link 
                    to="/login" 
                    className="block text-xl font-bold text-gray-900 text-center py-2" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block w-full py-4 bg-primary-600 text-white rounded-2xl font-bold text-center shadow-lg shadow-primary-600/20" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
