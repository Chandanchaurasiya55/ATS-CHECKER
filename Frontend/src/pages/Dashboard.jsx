import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, FileText, Trash2, Calendar, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import api from '../utils/api.js';
import toast from 'react-hot-toast';

const Dashboard = () => {
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
            to="/builder" 
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
            to="/builder" 
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
                  to={`/builder/${resume._id}`}
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
