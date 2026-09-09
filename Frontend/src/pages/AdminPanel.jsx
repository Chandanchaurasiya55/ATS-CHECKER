import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  ShieldCheck, 
  GraduationCap, 
  Plus, 
  Trash2, 
  Power, 
  Loader2, 
  CheckCircle2, 
  Building2,
  Calendar,
  Sparkles 
} from 'lucide-react';
import api from '../utils/api.js';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  // College Prefix state
  const [prefixes, setPrefixes] = useState([]);
  const [loadingPrefixes, setLoadingPrefixes] = useState(true);
  const [submittingPrefix, setSubmittingPrefix] = useState(false);
  const [newPrefix, setNewPrefix] = useState({
    prefix: '',
    collegeName: '',
    durationDays: 365,
  });

  useEffect(() => {
    fetchOverview();
    fetchPrefixes();
  }, []);

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

  const fetchPrefixes = async () => {
    try {
      setLoadingPrefixes(true);
      const res = await api.get('/admin/college-prefixes');
      setPrefixes(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load college email prefixes');
    } finally {
      setLoadingPrefixes(false);
    }
  };

  const handleAddPrefix = async (e) => {
    e.preventDefault();
    if (!newPrefix.prefix.trim()) {
      toast.error('Please enter an email prefix or domain');
      return;
    }

    try {
      setSubmittingPrefix(true);
      const res = await api.post('/admin/college-prefixes', newPrefix);
      toast.success(res.data.message || 'College email prefix added!');
      setNewPrefix({ prefix: '', collegeName: '', durationDays: 365 });
      fetchPrefixes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add prefix');
    } finally {
      setSubmittingPrefix(false);
    }
  };

  const handleTogglePrefix = async (id) => {
    try {
      const res = await api.patch(`/admin/college-prefixes/${id}/toggle`);
      toast.success(res.data.message);
      setPrefixes((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isActive: res.data.data.isActive } : item))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDeletePrefix = async (id, prefixName) => {
    if (!window.confirm(`Are you sure you want to delete prefix '${prefixName}'?`)) return;

    try {
      await api.delete(`/admin/college-prefixes/${id}`);
      toast.success('Prefix deleted successfully');
      setPrefixes((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete prefix');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2 max-w-2xl text-base">
            Platform overview, registered users, and college partner email subscription management.
          </p>
        </div>
        <div className="inline-flex items-center gap-3 rounded-2xl bg-primary-50 px-5 py-3.5 shadow-xs border border-primary-100">
          <ShieldCheck className="w-5 h-5 text-primary-600" />
          <span className="text-sm font-bold text-primary-700">Admin Control Center</span>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-12 shadow-sm text-center text-gray-500 flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          <span>Loading admin overview...</span>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Overview Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-gray-500">Total Users</div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-gray-900">{overview?.totalUsers ?? 0}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-gray-500">Total Resumes</div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-gray-900">{overview?.totalResumes ?? 0}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-gray-500">College Partners</div>
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-gray-900">{prefixes.length}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-gray-500">Admins</div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-gray-900">{overview?.totalAdmins ?? 0}</div>
            </motion.div>
          </div>

          {/* College Email Prefix Configuration Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-blue-700 text-white flex items-center justify-center shadow-lg shadow-primary-600/20">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    College Email Prefixes (1-Year Free Access)
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                      Automated
                    </span>
                  </h2>
                  <p className="text-gray-500 text-sm mt-0.5">
                    Sirf yahan daale gaye email prefix/domain se register karne wale students ko hi 1 saal ka free Executive plan milega.
                  </p>
                </div>
              </div>
            </div>

            {/* Add New Prefix Form */}
            <form onSubmit={handleAddPrefix} className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary-600" />
                Naya College Prefix / Domain Add Karein
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Email Prefix / Domain / Gmail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. @gehu.ac.in, gehu_, or student@xyz.com"
                    value={newPrefix.prefix}
                    onChange={(e) => setNewPrefix({ ...newPrefix, prefix: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 font-medium"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Prefix (jaise <code className="text-primary-600">@clg.ac.in</code> ya <code className="text-primary-600">student_</code> ya exact email)
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    College / Organization Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Graphic Era Hill University"
                    value={newPrefix.collegeName}
                    onChange={(e) => setNewPrefix({ ...newPrefix, collegeName: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 font-medium"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Student dashboard & passes par dikhega</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Free Duration (Days)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max="3650"
                      value={newPrefix.durationDays}
                      onChange={(e) => setNewPrefix({ ...newPrefix, durationDays: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 font-medium"
                    />
                    <button
                      type="submit"
                      disabled={submittingPrefix}
                      className="bg-primary-600 hover:bg-primary-500 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-md shadow-primary-600/20 shrink-0 flex items-center gap-2 disabled:opacity-50"
                    >
                      {submittingPrefix ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Plus className="w-4 h-4" /> Add
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Default 365 din (1 saal)</p>
                </div>
              </div>
            </form>

            {/* List of Configured Prefixes */}
            {loadingPrefixes ? (
              <div className="py-8 text-center text-gray-500 flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                <span>Loading prefixes...</span>
              </div>
            ) : prefixes.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-3">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-gray-800">Abhi tak koi College Prefix add nahi hai</h4>
                <p className="text-gray-500 text-xs mt-1 max-w-md mx-auto">
                  Upar diye gaye form me college ka email domain ya prefix daalein (jaise <span className="font-semibold text-gray-700">@clg.ac.in</span>). Uske baad un students ko register karte hi 1-year free subscription mil jayega!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-black uppercase tracking-wider text-gray-400">
                      <th className="pb-3 px-3">Allowed Prefix / Domain</th>
                      <th className="pb-3 px-3">College Name</th>
                      <th className="pb-3 px-3">Duration</th>
                      <th className="pb-3 px-3">Students Registered</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    {prefixes.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-4 px-3 font-mono font-bold text-primary-700">
                          <span className="bg-primary-50 border border-primary-100 px-3 py-1 rounded-lg">
                            {item.prefix}
                          </span>
                        </td>
                        <td className="py-4 px-3 font-semibold text-gray-900">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span>{item.collegeName || 'Partner College'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-3 text-gray-600 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{item.durationDays || 365} Days</span>
                          </div>
                        </td>
                        <td className="py-4 px-3">
                          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full text-xs">
                            <Users className="w-3.5 h-3.5" />
                            {item.registeredCount || 0} Students
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <button
                            onClick={() => handleTogglePrefix(item._id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                              item.isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                            }`}
                            title="Click to Toggle Active/Inactive"
                          >
                            <span className={`w-2 h-2 rounded-full ${item.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                            {item.isActive ? 'Active' : 'Disabled'}
                          </button>
                        </td>
                        <td className="py-4 px-3 text-right">
                          <button
                            onClick={() => handleDeletePrefix(item._id, item.prefix)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Delete Prefix"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Recent Resumes */}
          <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Resumes Activity</h2>
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
