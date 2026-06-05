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
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
          <p className="text-gray-500 mt-1">Manage and edit your ATS-optimized resumes</p>
        </div>
        <Link to="/builder" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Create New Resume
        </Link>
      </div>

      {resumes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No resumes found</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Get started by creating your first ATS-optimized resume in minutes.
          </p>
          <Link to="/builder" className="btn-primary inline-flex items-center gap-2">
            Create Your First Resume <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume, idx) => (
            <motion.div
              key={resume._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="card group hover:border-primary-300 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                  <FileText className="w-6 h-6" />
                </div>
                <button
                  onClick={() => deleteResume(resume._id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                {resume.personalInfo?.fullName || 'Untitled Resume'}
              </h3>
              
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(resume.updatedAt).toLocaleDateString()}
                </div>
                {resume.atsScore && (
                  <div className="flex items-center gap-1 text-green-600 font-semibold">
                    <Sparkles className="w-4 h-4" />
                    Score: {resume.atsScore}
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <Link to={`/builder/${resume._id}`} className="flex-1 btn-secondary text-sm py-2">
                  Edit
                </Link>
                <button
                  onClick={() => {
                    // Logic to preview/download would go here
                    // For now, let's just go to builder
                    window.location.href = `/builder/${resume._id}`;
                  }}
                  className="flex-1 btn-primary text-sm py-2"
                >
                  Preview
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
