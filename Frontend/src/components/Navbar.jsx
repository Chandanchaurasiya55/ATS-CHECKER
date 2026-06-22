import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FileText, LogOut, User, Menu, X, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileOrgOpen, setMobileOrgOpen] = useState(false);

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
            <Link to="/about" className="text-gray-600 hover:text-primary-600 font-semibold transition-all">
              About
            </Link>
            
            {/* For Organizations dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 font-semibold transition-all focus:outline-none py-2">
                <span>For Organizations</span>
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-[480px] rounded-3xl bg-white border border-gray-100 shadow-2xl p-4 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                <div className="space-y-2">
                  {/* Recruitment */}
                  <Link to="/recruitment" className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-gray-50 transition-colors text-left block">
                    <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold text-sm">
                        Recruitment
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-xs font-normal mt-0.5 leading-relaxed">
                        ATSPro empowers your team to quickly create on-brand resumes that impress clients and land job interviews.
                      </p>
                    </div>
                  </Link>

                  {/* Higher Education */}
                  <Link to="/higher-education" className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-gray-50 transition-colors text-left block">
                    <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold text-sm">
                        Higher Education
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-xs font-normal mt-0.5 leading-relaxed">
                        Get visibility into the job-search insights of your enrollments and support more students without adding headcount.
                      </p>
                    </div>
                  </Link>

                  {/* Career Coaches */}
                  <Link to="/career-coaches" className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-gray-50 transition-colors text-left block">
                    <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold text-sm">
                        Career Coaches
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-xs font-normal mt-0.5 leading-relaxed">
                        Cut your resume creation time in half, deliver delightful ATS friendly resumes.
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <Link to="/pricing" className="text-gray-600 hover:text-primary-600 font-semibold transition-all">
              Pricing
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/builder" className="text-gray-600 hover:text-primary-600 font-semibold transition-all">
                  Resume Builder
                </Link>
                <div className="h-6 w-px bg-gray-200"></div>

                <div className="relative group">
                  <div className="flex items-center gap-2 pr-2 cursor-default">
                    <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold border-2 border-white shadow-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{user?.name}</span>
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
                    className="block text-xl font-semibold text-gray-900" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>

                  {/* For Organizations Mobile Accordion */}
                  <div className="py-1">
                    <button 
                      onClick={() => setMobileOrgOpen(!mobileOrgOpen)}
                      className="flex items-center justify-between w-full text-xl font-semibold text-gray-900 focus:outline-none"
                    >
                      <span>For Organizations</span>
                      <svg className={`w-5 h-5 transition-transform duration-200 ${mobileOrgOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    <AnimatePresence>
                      {mobileOrgOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-4 mt-2 space-y-4 border-l-2 border-primary-500 overflow-hidden"
                        >
                          <div className="py-2 space-y-4">
                            <Link to="/recruitment" className="block text-left" onClick={() => setMobileMenuOpen(false)}>
                              <div className="font-semibold text-primary-600 text-base flex items-center gap-1">
                                Recruitment
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                              <p className="text-gray-500 text-xs mt-1 leading-normal font-normal">
                                ATSPro empowers your team to quickly create on-brand resumes that impress clients and land job interviews.
                              </p>
                            </Link>
                            <Link to="/higher-education" className="block text-left" onClick={() => setMobileMenuOpen(false)}>
                              <div className="font-semibold text-primary-600 text-base flex items-center gap-1">
                                Higher Education
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                              <p className="text-gray-500 text-xs mt-1 leading-normal font-normal">
                                Get visibility into the job-search insights of your enrollments and support more students without adding headcount.
                              </p>
                            </Link>
                            <Link to="/career-coaches" className="block text-left" onClick={() => setMobileMenuOpen(false)}>
                              <div className="font-semibold text-primary-600 text-base flex items-center gap-1">
                                Career Coaches
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                              <p className="text-gray-500 text-xs mt-1 leading-normal font-normal">
                                Cut your resume creation time in half, deliver delightful ATS friendly resumes.
                              </p>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link 
                    to="/pricing" 
                    className="block text-xl font-semibold text-gray-900" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  {user?.isAdmin && (
                    <Link 
                      to="/admin" 
                      className="block text-xl font-semibold text-gray-900" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link 
                    to="/dashboard" 
                    className="block text-xl font-semibold text-gray-900" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/builder" 
                    className="block text-xl font-semibold text-gray-900" 
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
                    className="block text-xl font-semibold text-gray-900 text-center py-2" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>

                  {/* For Organizations Mobile Accordion */}
                  <div className="py-2">
                    <button 
                      onClick={() => setMobileOrgOpen(!mobileOrgOpen)}
                      className="flex items-center justify-center gap-1.5 w-full text-xl font-semibold text-gray-900 focus:outline-none"
                    >
                      <span>For Organizations</span>
                      <svg className={`w-5 h-5 transition-transform duration-200 ${mobileOrgOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    <AnimatePresence>
                      {mobileOrgOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 space-y-4 overflow-hidden bg-gray-50 rounded-2xl p-4 text-left"
                        >
                          <div className="space-y-4">
                            <Link to="/recruitment" className="block text-left" onClick={() => setMobileMenuOpen(false)}>
                              <div className="font-semibold text-primary-600 text-base flex items-center gap-1">
                                Recruitment
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                              <p className="text-gray-500 text-xs mt-1 leading-normal font-normal">
                                ATSPro empowers your team to quickly create on-brand resumes that impress clients and land job interviews.
                              </p>
                            </Link>
                            <Link to="/higher-education" className="block text-left" onClick={() => setMobileMenuOpen(false)}>
                              <div className="font-semibold text-primary-600 text-base flex items-center gap-1">
                                Higher Education
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                              <p className="text-gray-500 text-xs mt-1 leading-normal font-normal">
                                Get visibility into the job-search insights of your enrollments and support more students without adding headcount.
                              </p>
                            </Link>
                            <Link to="/career-coaches" className="block text-left" onClick={() => setMobileMenuOpen(false)}>
                              <div className="font-semibold text-primary-600 text-base flex items-center gap-1">
                                Career Coaches
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                              <p className="text-gray-500 text-xs mt-1 leading-normal font-normal">
                                Cut your resume creation time in half, deliver delightful ATS friendly resumes.
                              </p>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link 
                    to="/pricing" 
                    className="block text-xl font-semibold text-gray-900 text-center py-2" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>

                  <Link 
                    to="/login" 
                    className="block text-xl font-semibold text-gray-900 text-center py-2" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block w-full py-4 bg-primary-600 text-white rounded-2xl font-semibold text-center shadow-lg shadow-primary-600/20" 
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
