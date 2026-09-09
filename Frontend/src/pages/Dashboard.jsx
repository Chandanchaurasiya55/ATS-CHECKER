import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, FileText, Trash2, Calendar, Sparkles, Loader2, ArrowRight, AlertTriangle, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, isSubscriptionExpired, daysRemaining } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resumes');
      setResumes(res.data.data);
    } catch (error) {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await api.delete(`/resumes/${id}`);
      setResumes(resumes.filter(r => r._id !== id));
      toast.success('Resume deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Subscription Status Banners */}
      {isSubscriptionExpired ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 p-6 bg-gradient-to-r from-rose-50 via-red-50 to-orange-50 rounded-3xl border-2 border-rose-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 shadow-sm">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">Your subscription has been expired</h2>
              <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                Your 1-year complimentary college access has expired. Please renew your subscription to continue using all premium templates and AI tools without interruption.
              </p>
            </div>
          </div>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-rose-600/25 transition-all hover:scale-105 shrink-0"
          >
            Renew Plan Now <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      ) : user?.isCollegeTrial ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 p-5 bg-gradient-to-r from-primary-50/90 via-blue-50/50 to-white rounded-3xl border border-primary-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-md shadow-primary-600/20 shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-gray-900 text-base">College Premium Pass Active</span>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  Executive Plan Unlocked
                </span>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                Full free access to all 5 templates & AI resume features {user?.planExpiresAt ? `till ${new Date(user.planExpiresAt).toLocaleDateString()} (${daysRemaining} days left)` : ''}
              </p>
            </div>
          </div>
          <Link
            to="/resume-builder"
            className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-bold flex items-center gap-1 shrink-0"
          >
            Open Builder <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      ) : null}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Resumes</h1>
          <p className="text-gray-500 mt-2 text-lg">Manage and edit your ATS-optimized resumes</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link 
            to="/resume-builder" 
            className="group inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-500 transition-all hover:scale-105 shadow-lg shadow-primary-600/20"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> 
            Create New Resume
          </Link>
        </motion.div>
      </div>

      {resumes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 bg-white rounded-[2rem] border border-gray-100 shadow-sm"
        >
          <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary-600">
            <FileText className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No resumes yet</h2>
          <p className="text-gray-500 mb-10 max-w-sm mx-auto">
            Your dashboard is empty. Start building your high-scoring ATS resume today!
          </p>
          <Link 
            to="/resume-builder" 
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all"
          >
            Create Your First Resume <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {resumes.map((resume, idx) => (
            <motion.div
              key={resume._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary-600/5 hover:-translate-y-1 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => deleteResume(resume._id)}
                  className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                  title="Delete Resume"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 truncate pr-10">
                {resume.personalInfo?.fullName || 'Untitled Resume'}
              </h3>
              
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                <Calendar className="w-4 h-4" />
                <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm font-bold">
                  <Sparkles className="w-4 h-4" />
                  Score: {resume.atsScore || 'N/A'}
                </div>
                
                <Link
                  to="/resume-builder"
                  state={{ resumeId: resume._id }}
                  className="flex items-center gap-1 text-primary-600 font-bold hover:gap-2 transition-all"
                >
                  Edit <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
