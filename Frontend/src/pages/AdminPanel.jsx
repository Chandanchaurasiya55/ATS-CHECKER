import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, FileText, ShieldCheck } from 'lucide-react';
import api from '../utils/api.js';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get('/admin/overview');
        setOverview(res.data.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Could not load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Monitor users, resumes, and platform activity from a single dashboard.
          </p>
        </div>
        <div className="inline-flex items-center gap-3 rounded-3xl bg-primary-50 px-5 py-4 shadow-sm border border-primary-100">
          <ShieldCheck className="w-5 h-5 text-primary-600" />
          <span className="text-sm font-semibold text-primary-700">Admin access only</span>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-12 shadow-sm text-center text-gray-500">Loading admin overview...</div>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-gray-500">Users</div>
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-4xl font-black text-gray-900">{overview?.totalUsers ?? 0}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-gray-500">Resumes</div>
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-4xl font-black text-gray-900">{overview?.totalResumes ?? 0}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-gray-500">Admins</div>
                <ShieldCheck className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-4xl font-black text-gray-900">{overview?.totalAdmins ?? 0}</div>
            </motion.div>
          </div>

          <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Resumes</h2>
            {overview?.recentResumes?.length ? (
              <div className="space-y-3">
                {overview.recentResumes.map((resume) => (
                  <div key={resume._id} className="rounded-2xl border border-gray-200 p-4 hover:border-primary-200 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{resume.personalInfo?.fullName || 'Untitled'}</div>
                        <div className="text-sm text-gray-500">{resume.user?.name} • {resume.user?.email}</div>
                      </div>
                      <div className="text-sm font-bold text-primary-600">Score {resume.atsScore || 'N/A'}</div>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">Created {new Date(resume.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No resume activity yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
