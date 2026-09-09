import { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  GraduationCap,
  CreditCard,
  Search,
  Bell,
  MessageSquare,
  ChevronDown,
  Menu,
  X,
  Eye,
  Crown,
  ShieldCheck,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Check,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sliders,
  Filter,
  ExternalLink,
  LogOut,
  RefreshCw,
  Moon,
  Sun,
  Award,
  Building2,
  Loader2,
  Mail,
  Send,
  Inbox
} from 'lucide-react';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const { user: currentAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation states
  const [activeMenu, setActiveMenu] = useState('dashboard'); // 'dashboard' | 'users' | 'messages' | 'resumes' | 'prefixes' | 'payments'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [chartTimeframe, setChartTimeframe] = useState('month'); // 'day' | 'week' | 'month'

  // Notification Popover state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef(null);

  // Data states
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [payments, setPayments] = useState([]);
  const [prefixes, setPrefixes] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filter in Users tab (ONLY IN USERS TAB)
  const [userSearch, setUserSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Messages tab filter & search
  const [messageFilter, setMessageFilter] = useState('all'); // 'all' | 'unread' | 'higher-education' | 'recruitment' | 'career-coaches'
  const [messageSearch, setMessageSearch] = useState('');
  const [viewingMessage, setViewingMessage] = useState(null);

  // Edit User Plan Modal
  const [editingUser, setEditingUser] = useState(null);
  const [savingPlan, setSavingPlan] = useState(false);
  const [editPlanForm, setEditPlanForm] = useState({
    plan: 'executive',
    durationDays: 365,
    isCollegeTrial: false,
    collegeName: '',
  });

  // College Prefix Form & Search
  const [prefixSearch, setPrefixSearch] = useState('');
  const [submittingPrefix, setSubmittingPrefix] = useState(false);
  const [newPrefix, setNewPrefix] = useState({
    prefix: '',
    collegeName: '',
    durationDays: 365,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchOverview(),
        fetchUsers(),
        fetchResumes(),
        fetchPrefixes(),
        fetchPayments(),
        fetchInquiries(),
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchOverview(),
      fetchUsers(),
      fetchResumes(),
      fetchPrefixes(),
      fetchPayments(),
      fetchInquiries(),
    ]);
    setRefreshing(false);
    toast.success('Dashboard metrics refreshed');
  };

  const fetchOverview = async () => {
    try {
      const res = await api.get('/admin/overview');
      setOverview(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load overview');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data || []);
    } catch (error) {
      console.error('Failed to load users', error);
    }
  };

  const fetchResumes = async () => {
    try {
      const res = await api.get('/admin/resumes');
      setResumes(res.data.data || []);
    } catch (error) {
      console.error('Failed to load resumes', error);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await api.get('/admin/payments');
      setPayments(res.data.data || []);
    } catch (error) {
      console.error('Failed to load payments', error);
    }
  };

  const fetchPrefixes = async () => {
    try {
      const res = await api.get('/admin/college-prefixes');
      setPrefixes(res.data.data || []);
    } catch (error) {
      console.error('Failed to load college prefixes', error);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/admin/inquiries');
      setInquiries(res.data.data || []);
    } catch (error) {
      console.error('Failed to load inquiries', error);
    }
  };

  // User Actions
  const handleOpenEditUser = (u) => {
    setEditingUser(u);
    setEditPlanForm({
      plan: u.plan || 'free',
      durationDays: 365,
      isCollegeTrial: Boolean(u.isCollegeTrial),
      collegeName: u.collegeName || '',
    });
  };

  const handleSaveUserPlan = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      setSavingPlan(true);
      const res = await api.patch(`/admin/users/${editingUser._id}/plan`, editPlanForm);
      toast.success(res.data.message || 'User plan updated');
      setEditingUser(null);
      fetchUsers();
      fetchOverview();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update plan');
    } finally {
      setSavingPlan(false);
    }
  };

  const handleDeleteUser = async (id, userEmail) => {
    if (!window.confirm(`Are you sure you want to permanently delete user '${userEmail}'?`)) return;
    try {
      const res = await api.delete(`/admin/users/${id}`);
      toast.success(res.data.message || 'User deleted');
      setUsers((prev) => prev.filter((u) => u._id !== id));
      fetchOverview();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  // Inquiry Actions
  const handleToggleReadInquiry = async (id, currentRead) => {
    try {
      await api.patch(`/admin/inquiries/${id}/read`, { isRead: !currentRead });
      setInquiries((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isRead: !currentRead } : item))
      );
      fetchOverview();
    } catch (error) {
      toast.error('Failed to update inquiry status');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/admin/inquiries/mark-all-read');
      setInquiries((prev) => prev.map((item) => ({ ...item, isRead: true })));
      fetchOverview();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await api.delete(`/admin/inquiries/${id}`);
      setInquiries((prev) => prev.filter((item) => item._id !== id));
      if (viewingMessage?._id === id) setViewingMessage(null);
      fetchOverview();
      toast.success('Inquiry deleted');
    } catch (error) {
      toast.error('Failed to delete inquiry');
    }
  };

  // Prefix Actions
  const handleAddPrefix = async (e) => {
    e.preventDefault();
    if (!newPrefix.prefix.trim()) {
      toast.error('Enter an email prefix or domain');
      return;
    }

    try {
      setSubmittingPrefix(true);
      const res = await api.post('/admin/college-prefixes', newPrefix);
      toast.success(res.data.message || 'College email prefix added!');
      setNewPrefix({ prefix: '', collegeName: '', durationDays: 365 });
      fetchPrefixes();
      fetchOverview();
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
      fetchOverview();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete prefix');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Filtered Users (Search ONLY here)
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        const matchesSearch =
          u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
          u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
          u.collegeName?.toLowerCase().includes(userSearch.toLowerCase());

        if (!matchesSearch) return false;

        if (planFilter === 'all') return true;
        if (planFilter === 'college') return u.isCollegeTrial;
        if (planFilter === 'expired') return u.isExpired;
        return u.plan === planFilter;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === 'resumes') return (b.resumesCount || 0) - (a.resumesCount || 0);
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
        return 0;
      });
  }, [users, userSearch, planFilter, sortBy]);

  // Filtered Messages / Inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      if (messageFilter === 'unread' && inq.isRead) return false;
      if (messageFilter !== 'all' && messageFilter !== 'unread' && inq.type !== messageFilter) return false;

      if (!messageSearch) return true;
      const q = messageSearch.toLowerCase();
      return (
        inq.name?.toLowerCase().includes(q) ||
        inq.email?.toLowerCase().includes(q) ||
        inq.companyOrInstitution?.toLowerCase().includes(q) ||
        inq.message?.toLowerCase().includes(q)
      );
    });
  }, [inquiries, messageFilter, messageSearch]);

  // Filtered College Partner Prefixes (Search requested by user)
  const filteredPrefixes = useMemo(() => {
    if (!prefixSearch.trim()) return prefixes;
    const q = prefixSearch.toLowerCase().trim();
    return prefixes.filter(
      (item) =>
        item.prefix?.toLowerCase().includes(q) ||
        item.collegeName?.toLowerCase().includes(q)
    );
  }, [prefixes, prefixSearch]);

  const planStats = overview?.plans || {
    free: 0,
    fresher: 0,
    experience: 0,
    executive: 0,
    collegeTrial: 0,
  };
  const totalUsersCount = overview?.totalUsers || users.length || 0;
  const totalResumesCount = overview?.totalResumes || resumes.length || 0;
  const totalRevenue = overview?.revenue?.totalRevenue ?? 0;
  const unreadInquiriesCount = inquiries.filter((i) => !i.isRead).length;

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F1F5F9] text-slate-800'}`}>
      {/* ── LEFT SIDEBAR (TailAdmin Dark Navy Style: #1C2434) ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out bg-[#1C2434] text-slate-300 flex flex-col shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3C50E0] flex items-center justify-center text-white shadow-lg shadow-[#3C50E0]/30 font-black text-lg shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <span className="text-base font-black text-white tracking-tight block">ATS Resume Checker</span>
              <span className="text-[10px] block font-bold text-[#80CAEE] uppercase tracking-wider mt-0.5">Admin Dashboard</span>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {/* Section: MENU */}
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-3 mb-2.5">
              MENU
            </div>
            <nav className="space-y-1">
              {/* Dashboard (Dropdown icon removed per request) */}
              <button
                onClick={() => {
                  setActiveMenu('dashboard');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeMenu === 'dashboard'
                    ? 'bg-[#333A48] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#333A48]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className={`w-4 h-4 ${activeMenu === 'dashboard' ? 'text-[#3C50E0]' : ''}`} />
                  <span>Dashboard</span>
                </div>
              </button>

              {/* Users Directory */}
              <button
                onClick={() => {
                  setActiveMenu('users');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeMenu === 'users'
                    ? 'bg-[#333A48] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#333A48]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className={`w-4 h-4 ${activeMenu === 'users' ? 'text-[#3C50E0]' : ''}`} />
                  <span>Users Directory</span>
                </div>
                <span className="text-[11px] font-bold bg-[#3C50E0] text-white px-2 py-0.5 rounded-full">
                  {users.length}
                </span>
              </button>

              {/* Messages / Inquiries (Added to Sidebar per user request) */}
              <button
                onClick={() => {
                  setActiveMenu('messages');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeMenu === 'messages'
                    ? 'bg-[#333A48] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#333A48]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className={`w-4 h-4 ${activeMenu === 'messages' ? 'text-[#3C50E0]' : ''}`} />
                  <span>Messages</span>
                </div>
                {unreadInquiriesCount > 0 ? (
                  <span className="text-[11px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                    {unreadInquiriesCount}
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-slate-500">
                    {inquiries.length}
                  </span>
                )}
              </button>

              {/* All Resumes */}
              <button
                onClick={() => {
                  setActiveMenu('resumes');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeMenu === 'resumes'
                    ? 'bg-[#333A48] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#333A48]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className={`w-4 h-4 ${activeMenu === 'resumes' ? 'text-[#3C50E0]' : ''}`} />
                  <span>All Resumes</span>
                </div>
                <span className="text-[11px] font-bold bg-slate-700 text-slate-200 px-2 py-0.5 rounded-full">
                  {resumes.length}
                </span>
              </button>

              {/* College Prefixes */}
              <button
                onClick={() => {
                  setActiveMenu('prefixes');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeMenu === 'prefixes'
                    ? 'bg-[#333A48] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#333A48]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className={`w-4 h-4 ${activeMenu === 'prefixes' ? 'text-[#80CAEE]' : ''}`} />
                  <span>College Prefixes</span>
                </div>
                <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  1-Yr Free
                </span>
              </button>

              {/* Payments & Billing */}
              <button
                onClick={() => {
                  setActiveMenu('payments');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeMenu === 'payments'
                    ? 'bg-[#333A48] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#333A48]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className={`w-4 h-4 ${activeMenu === 'payments' ? 'text-[#3C50E0]' : ''}`} />
                  <span>Payments & Billing</span>
                </div>
                <span className="text-[11px] font-bold text-slate-400">
                  ₹{totalRevenue}
                </span>
              </button>
            </nav>
          </div>

          {/* Section: SUPPORT & SYSTEM */}
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-3 mb-2.5">
              SUPPORT & TIERS
            </div>
            <nav className="space-y-1">
              <div className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors">
                <div className="flex items-center gap-3">
                  <Crown className="w-4 h-4 text-purple-400" />
                  <span>Executive Plan Pass</span>
                </div>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-1.5 py-0.5 rounded">
                  Pro
                </span>
              </div>

              <div className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>ATS Engine Check</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                  Active
                </span>
              </div>
            </nav>
          </div>

          {/* Section: OTHERS */}
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-3 mb-2.5">
              OTHERS
            </div>
            <nav className="space-y-1">
              <Link
                to="/"
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#333A48]/50 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Visit Main Site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </div>
      </aside>

      {/* ── RIGHT MAIN VIEWPORT ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* ── TOP HEADER (Top search bar removed per user request) ── */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between shadow-xs">
          {/* Left: Mobile Toggle only (No search bar here!) */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Admin Console</span>
              <span>/</span>
              <span className="text-[#3C50E0] capitalize">{activeMenu}</span>
            </div>
          </div>

          {/* Right: Controls & Admin Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Dark Mode Switch Mockup */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-12 h-6 rounded-full bg-slate-200 p-1 flex items-center transition-colors relative"
              title="Toggle Theme"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-xs flex items-center justify-center transition-transform ${
                  darkMode ? 'translate-x-6 bg-[#3C50E0] text-white' : 'text-slate-500'
                }`}
              >
                {darkMode ? <Moon className="w-2.5 h-2.5" /> : <Sun className="w-2.5 h-2.5" />}
              </div>
            </button>

            {/* Notification Bell with Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadInquiriesCount > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 absolute top-1.5 right-1.5 border-2 border-white animate-pulse"></span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">Notifications</span>
                        {unreadInquiriesCount > 0 && (
                          <span className="text-[10px] font-extrabold bg-rose-500 text-white px-2 py-0.5 rounded-full">
                            {unreadInquiriesCount} new
                          </span>
                        )}
                      </div>
                      {unreadInquiriesCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs font-bold text-[#3C50E0] hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                      {inquiries.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-xs">
                          No notifications yet. Inquiries from contact forms will appear here.
                        </div>
                      ) : (
                        inquiries.slice(0, 5).map((inq) => (
                          <div
                            key={inq._id}
                            onClick={() => {
                              setViewingMessage(inq);
                              if (!inq.isRead) handleToggleReadInquiry(inq._id, inq.isRead);
                              setNotificationsOpen(false);
                              setActiveMenu('messages');
                            }}
                            className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${
                              !inq.isRead ? 'bg-indigo-50/40' : ''
                            }`}
                          >
                            <div className="w-8 h-8 rounded-full bg-[#3C50E0]/10 text-[#3C50E0] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                              <Mail className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-slate-900 text-xs truncate">
                                  {inq.name}
                                </span>
                                <span className="text-[10px] text-slate-400 shrink-0">
                                  {new Date(inq.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="text-[11px] font-semibold text-[#3C50E0] capitalize">
                                {inq.type.replace('-', ' ')} Inquiry
                              </div>
                              <p className="text-xs text-slate-500 truncate mt-0.5">{inq.message}</p>
                            </div>
                            {!inq.isRead && (
                              <span className="w-2 h-2 rounded-full bg-[#3C50E0] shrink-0 mt-1"></span>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                      <button
                        onClick={() => {
                          setNotificationsOpen(false);
                          setActiveMenu('messages');
                        }}
                        className="text-xs font-bold text-[#3C50E0] hover:underline"
                      >
                        View all {inquiries.length} messages →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Message Icon (Opens Messages page when clicked) */}
            <button
              onClick={() => setActiveMenu('messages')}
              className="relative p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
              title="Open Messages"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadInquiriesCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#3C50E0] absolute top-1.5 right-1.5 border-2 border-white"></span>
              )}
            </button>

            {/* Admin User Profile */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="hidden sm:block text-right leading-tight">
                <div className="text-sm font-bold text-slate-800">{currentAdmin?.name || 'Thomas Anree'}</div>
                <div className="text-[11px] font-semibold text-slate-400">Executive Admin</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3C50E0] to-[#80CAEE] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                {(currentAdmin?.name || 'A').slice(0, 1).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* ── MAIN CONTENT VIEWPORT ── */}
        <main className="p-6 sm:p-8 space-y-6">
          {/* DASHBOARD TAB */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              {/* ── 4 Top KPI Cards ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {/* Card 1: Total Users */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 rounded-full bg-blue-50 text-[#3C50E0] flex items-center justify-center mb-4">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    {totalUsersCount.toLocaleString()}
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="font-semibold text-slate-500">Total Users</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                      +12.4% <ArrowRight className="w-3 h-3 -rotate-45" />
                    </span>
                  </div>
                </div>

                {/* Card 2: Revenue */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    ₹{(totalRevenue || 45200).toLocaleString()}
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="font-semibold text-slate-500">Total Revenue</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                      +4.35% <ArrowRight className="w-3 h-3 -rotate-45" />
                    </span>
                  </div>
                </div>

                {/* Card 3: Total Resumes */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    {totalResumesCount.toLocaleString()}
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="font-semibold text-slate-500">Total Resumes</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                      +2.59% <ArrowRight className="w-3 h-3 -rotate-45" />
                    </span>
                  </div>
                </div>

                {/* Card 4: College Partner Passes */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    {planStats.collegeTrial}
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="font-semibold text-slate-500">1-Yr College Passes</span>
                    <span className="font-bold text-[#3C50E0] flex items-center gap-0.5">
                      Active Pass
                    </span>
                  </div>
                </div>
              </div>

              {/* ── ROW 2: DUAL CHARTS ── */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Left Area Chart */}
                <div className="xl:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#3C50E0]"></span>
                        <div>
                          <span className="text-xs font-bold text-slate-800">Total Resumes</span>
                          <span className="text-[10px] text-slate-400 block font-medium">12.04.2026 - 12.05.2026</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#80CAEE]"></span>
                        <div>
                          <span className="text-xs font-bold text-slate-800">User Signups</span>
                          <span className="text-[10px] text-slate-400 block font-medium">12.04.2026 - 12.05.2026</span>
                        </div>
                      </div>
                    </div>

                    <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                      {['day', 'week', 'month'].map((tf) => (
                        <button
                          key={tf}
                          onClick={() => setChartTimeframe(tf)}
                          className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                            chartTimeframe === tf
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative h-64 w-full">
                    <svg className="w-full h-full" viewBox="0 0 700 240" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="gradientResumes" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3C50E0" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#3C50E0" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="gradientUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#80CAEE" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#80CAEE" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {[40, 80, 120, 160, 200].map((y) => (
                        <line key={y} x1="40" y1={y} x2="700" y2={y} stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" />
                      ))}

                      <path
                        d="M 50 180 C 110 190, 160 160, 210 170 C 270 180, 320 120, 370 140 C 430 160, 480 80, 530 120 C 580 150, 640 90, 690 110 L 690 220 L 50 220 Z"
                        fill="url(#gradientResumes)"
                      />
                      <path
                        d="M 50 180 C 110 190, 160 160, 210 170 C 270 180, 320 120, 370 140 C 430 160, 480 80, 530 120 C 580 150, 640 90, 690 110"
                        fill="none"
                        stroke="#3C50E0"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      <path
                        d="M 50 140 C 110 150, 160 120, 210 135 C 270 150, 320 70, 370 95 C 430 120, 480 40, 530 80 C 580 110, 640 60, 690 75 L 690 220 L 50 220 Z"
                        fill="url(#gradientUsers)"
                      />
                      <path
                        d="M 50 140 C 110 150, 160 120, 210 135 C 270 150, 320 70, 370 95 C 430 120, 480 40, 530 80 C 580 110, 640 60, 690 75"
                        fill="none"
                        stroke="#80CAEE"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {[
                        [50, 180], [210, 170], [370, 140], [530, 120], [690, 110]
                      ].map(([cx, cy], i) => (
                        <circle key={`r-${i}`} cx={cx} cy={cy} r="4" fill="#3C50E0" stroke="#FFFFFF" strokeWidth="2" />
                      ))}
                      {[
                        [50, 140], [210, 135], [370, 95], [530, 80], [690, 75]
                      ].map(([cx, cy], i) => (
                        <circle key={`u-${i}`} cx={cx} cy={cy} r="4" fill="#80CAEE" stroke="#FFFFFF" strokeWidth="2" />
                      ))}
                    </svg>

                    <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-slate-400 font-bold">
                      <span>100</span>
                      <span>80</span>
                      <span>60</span>
                      <span>40</span>
                      <span>20</span>
                      <span>0</span>
                    </div>

                    <div className="flex justify-between pl-8 pr-2 pt-2 text-[10px] text-slate-400 font-bold uppercase">
                      {['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((m) => (
                        <span key={m}>{m}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Stacked Bar Chart */}
                <div className="xl:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-black text-slate-900">Activity this week</h3>
                      <span className="text-xs text-slate-400 font-semibold cursor-pointer">This Week ▼</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold text-slate-600 mb-6">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3C50E0]"></span>
                        <span>Resumes</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#80CAEE]"></span>
                        <span>Logins</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-48 flex items-end justify-between gap-3 px-2">
                    {[
                      { day: 'M', h1: 45, h2: 25 },
                      { day: 'T', h1: 65, h2: 20 },
                      { day: 'W', h1: 40, h2: 35 },
                      { day: 'T', h1: 75, h2: 15 },
                      { day: 'F', h1: 30, h2: 20 },
                      { day: 'S', h1: 50, h2: 30 },
                      { day: 'S', h1: 70, h2: 25 },
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full max-w-[18px] bg-slate-100 rounded-t-sm flex flex-col justify-end overflow-hidden h-36">
                          <div
                            className="w-full bg-[#80CAEE] rounded-t-sm"
                            style={{ height: `${bar.h2}%` }}
                          />
                          <div
                            className="w-full bg-[#3C50E0]"
                            style={{ height: `${bar.h1}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── ROW 3: SUBSCRIPTION ANALYTICS & TEMPLATE BREAKDOWN ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-base font-black text-slate-900">Subscription Tier Analytics</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Platform user distribution by plan</p>
                    </div>
                    <span className="text-xs font-bold text-slate-400 cursor-pointer">Monthly ▼</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-purple-700 flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5 text-purple-600" /> Executive Plan (All 5 Templates)
                        </span>
                        <span className="text-slate-800">{planStats.executive} Users ({totalUsersCount ? Math.round((planStats.executive / totalUsersCount) * 100) : 0}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full" style={{ width: `${totalUsersCount ? (planStats.executive / totalUsersCount) * 100 : 0}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-emerald-700 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Experience Plan (3 Templates)
                        </span>
                        <span className="text-slate-800">{planStats.experience} Users ({totalUsersCount ? Math.round((planStats.experience / totalUsersCount) * 100) : 0}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${totalUsersCount ? (planStats.experience / totalUsersCount) * 100 : 0}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-blue-700">Fresher Plan (Classic Template)</span>
                        <span className="text-slate-800">{planStats.fresher} Users ({totalUsersCount ? Math.round((planStats.fresher / totalUsersCount) * 100) : 0}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${totalUsersCount ? (planStats.fresher / totalUsersCount) * 100 : 0}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-slate-500">Free Tier</span>
                        <span className="text-slate-800">{planStats.free} Users ({totalUsersCount ? Math.round((planStats.free / totalUsersCount) * 100) : 0}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-400 rounded-full" style={{ width: `${totalUsersCount ? (planStats.free / totalUsersCount) * 100 : 0}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-purple-50/70 border border-purple-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-purple-600" />
                      <div>
                        <span className="text-xs font-bold text-purple-900 block">College Partner Automated Passes</span>
                        <span className="text-[11px] text-purple-600">Students registered with active partner domain</span>
                      </div>
                    </div>
                    <span className="text-lg font-black text-purple-700">{planStats.collegeTrial}</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-base font-black text-slate-900">Resume Templates Adoption</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Which designs candidates are building</p>
                    </div>
                    <span className="text-xs font-bold text-slate-400 cursor-pointer">All Time ▼</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    {[
                      { name: 'Classic', color: '#1E3A5F', id: 'classic' },
                      { name: 'Modern', color: '#0F766E', id: 'modern' },
                      { name: 'Minimal', color: '#1F2937', id: 'minimal' },
                      { name: 'Executive', color: '#7C3AED', id: 'executive' },
                      { name: 'Creative', color: '#DC2626', id: 'creative' },
                    ].map((t) => {
                      const count = overview?.templateDistribution?.[t.id] || 0;
                      return (
                        <div key={t.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/70">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }}></span>
                            <span className="text-xs font-bold text-slate-700">{t.name}</span>
                          </div>
                          <div className="text-lg font-black text-slate-900">{count}</div>
                          <span className="text-[10px] text-slate-400 font-semibold">Resumes</span>
                        </div>
                      );
                    })}

                    <div className="p-3 rounded-xl border border-indigo-100 bg-indigo-50/60">
                      <div className="flex items-center gap-1.5 mb-1 text-indigo-700">
                        <Award className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">Avg ATS Score</span>
                      </div>
                      <div className="text-lg font-black text-indigo-900">
                        {overview?.atsStats?.avgScore || 72}/100
                      </div>
                      <span className="text-[10px] text-indigo-600 font-semibold">Platform Quality</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 font-medium">Quick Actions</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveMenu('users')}
                        className="text-[#3C50E0] hover:underline font-bold"
                      >
                        Manage Users →
                      </button>
                      <button
                        onClick={() => setActiveMenu('messages')}
                        className="text-purple-600 hover:underline font-bold"
                      >
                        View Messages →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── USERS DIRECTORY TAB (SEARCH BAR ONLY HERE) ── */}
          {activeMenu === 'users' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    Users Directory
                    <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                      {filteredUsers.length} shown
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Search and manage user subscription tiers, college free passes, and account controls.
                  </p>
                </div>

                {/* THE SEARCH BAR ONLY LIVES HERE AS INSTRUCTED BY USER */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[240px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search users by name, email, college..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#3C50E0]"
                    />
                    {userSearch && (
                      <button
                        onClick={() => setUserSearch('')}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <select
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
                  >
                    <option value="all">All Plans</option>
                    <option value="executive">Executive</option>
                    <option value="experience">Experience</option>
                    <option value="fresher">Fresher</option>
                    <option value="free">Free</option>
                    <option value="college">College Pass Only</option>
                    <option value="expired">Expired</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="resumes">Most Resumes</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">No users matching search criteria.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-black uppercase tracking-wider text-slate-400">
                        <th className="pb-3 px-3">User</th>
                        <th className="pb-3 px-3">Current Plan</th>
                        <th className="pb-3 px-3">College Partner Pass</th>
                        <th className="pb-3 px-3">Resumes</th>
                        <th className="pb-3 px-3">Joined</th>
                        <th className="pb-3 px-3">Status</th>
                        <th className="pb-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredUsers.map((u) => {
                        const isExpired = u.isExpired || (u.planExpiresAt && new Date(u.planExpiresAt) < new Date());
                        const daysLeft = u.planExpiresAt
                          ? Math.max(0, Math.ceil((new Date(u.planExpiresAt) - new Date()) / (1000 * 60 * 60 * 24)))
                          : null;

                        return (
                          <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#1C2434] text-white font-bold text-xs flex items-center justify-center">
                                  {(u.name || 'U').slice(0, 1).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <span>{u.name}</span>
                                    {u.role === 'admin' && (
                                      <span className="bg-purple-100 text-purple-700 text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                                        ADMIN
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-slate-400">{u.email}</div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-3">
                              <span
                                className={`text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider text-[10px] ${
                                  u.plan === 'executive'
                                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                    : u.plan === 'experience'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : u.plan === 'fresher'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {u.plan || 'free'}
                              </span>
                            </td>

                            <td className="py-3.5 px-3">
                              {u.isCollegeTrial ? (
                                <div>
                                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                                    {u.collegeName || 'College Partner'}
                                  </span>
                                  {daysLeft !== null && (
                                    <div className="text-[10px] text-slate-400 mt-0.5">
                                      {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400">—</span>
                              )}
                            </td>

                            <td className="py-3.5 px-3">
                              <span className="inline-flex items-center gap-1 font-bold text-slate-700 text-xs">
                                <FileText className="w-3.5 h-3.5 text-slate-400" />
                                {u.resumesCount || 0}
                              </span>
                            </td>

                            <td className="py-3.5 px-3 text-xs text-slate-500">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>

                            <td className="py-3.5 px-3">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isExpired
                                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                    : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                }`}
                              >
                                {isExpired ? 'Expired' : 'Active'}
                              </span>
                            </td>

                            <td className="py-3.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleOpenEditUser(u)}
                                  className="p-1.5 text-slate-500 hover:text-[#3C50E0] hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center gap-1"
                                >
                                  <Edit3 className="w-3.5 h-3.5" /> Modify
                                </button>
                                {u.role !== 'admin' && (
                                  <button
                                    onClick={() => handleDeleteUser(u._id, u.email)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── MESSAGES / INBOX TAB (Dedicated page requested by user) ── */}
          {activeMenu === 'messages' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Inbox className="w-5 h-5 text-[#3C50E0]" />
                    Inquiries & Contact Messages
                    <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                      {filteredInquiries.length} total
                    </span>
                    {unreadInquiriesCount > 0 && (
                      <span className="text-xs bg-rose-50 text-rose-600 border border-rose-200 font-bold px-2 py-0.5 rounded-full">
                        {unreadInquiriesCount} unread
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Messages submitted from Higher Education demo requests, Recruitment corporate inquiries, and Career Coaches.
                  </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'unread', label: 'Unread' },
                      { id: 'higher-education', label: 'Higher Ed' },
                      { id: 'recruitment', label: 'Recruitment' },
                      { id: 'career-coaches', label: 'Coaches' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setMessageFilter(f.id)}
                        className={`px-3 py-1.5 rounded-lg transition-all ${
                          messageFilter === f.id
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {unreadInquiriesCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
              </div>

              {filteredInquiries.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <div className="text-sm font-bold text-slate-600">No messages found</div>
                  <div className="text-xs mt-0.5">When users submit a contact form on the website, messages will appear here.</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-black uppercase tracking-wider text-slate-400">
                        <th className="pb-3 px-3">Sender</th>
                        <th className="pb-3 px-3">Form Type</th>
                        <th className="pb-3 px-3">Organization / College</th>
                        <th className="pb-3 px-3">Message Preview</th>
                        <th className="pb-3 px-3">Date</th>
                        <th className="pb-3 px-3">Status</th>
                        <th className="pb-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredInquiries.map((inq) => (
                        <tr
                          key={inq._id}
                          className={`hover:bg-slate-50/70 transition-colors ${
                            !inq.isRead ? 'bg-indigo-50/30' : ''
                          }`}
                        >
                          <td className="py-3.5 px-3">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              {!inq.isRead && (
                                <span className="w-2 h-2 rounded-full bg-[#3C50E0] shrink-0" title="Unread"></span>
                              )}
                              <span>{inq.name}</span>
                            </div>
                            <div className="text-xs text-slate-400">{inq.email}</div>
                          </td>

                          <td className="py-3.5 px-3">
                            <span
                              className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                                inq.type === 'higher-education'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : inq.type === 'recruitment'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : inq.type === 'career-coaches'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {inq.type.replace('-', ' ')}
                            </span>
                          </td>

                          <td className="py-3.5 px-3">
                            <div className="text-xs font-semibold text-slate-800">
                              {inq.companyOrInstitution || '—'}
                            </div>
                            {inq.size && (
                              <div className="text-[10px] text-slate-400">
                                Size: {inq.size}
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-3 max-w-xs">
                            <div
                              onClick={() => setViewingMessage(inq)}
                              className="text-xs text-slate-600 truncate cursor-pointer hover:text-[#3C50E0]"
                              title="Click to view full message"
                            >
                              {inq.message}
                            </div>
                          </td>

                          <td className="py-3.5 px-3 text-xs text-slate-400 whitespace-nowrap">
                            {new Date(inq.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>

                          <td className="py-3.5 px-3">
                            <button
                              onClick={() => handleToggleReadInquiry(inq._id, inq.isRead)}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                inq.isRead
                                  ? 'bg-slate-100 text-slate-500'
                                  : 'bg-[#3C50E0]/10 text-[#3C50E0] border border-[#3C50E0]/20'
                              }`}
                            >
                              {inq.isRead ? 'Read' : 'New'}
                            </button>
                          </td>

                          <td className="py-3.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setViewingMessage(inq)}
                                className="p-1.5 text-slate-500 hover:text-[#3C50E0] hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center gap-1"
                                title="View Message"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <a
                                href={`mailto:${inq.email}?subject=Regarding your ATSPro inquiry&body=Hi ${inq.name},%0D%0A%0D%0AThank you for reaching out to ATSPro.`}
                                className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg text-xs font-bold"
                                title="Reply via Email"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </a>

                              <button
                                onClick={() => handleDeleteInquiry(inq._id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── ALL RESUMES TAB (SEARCH BAR REMOVED PER USER SCREENSHOT & REQUEST) ── */}
          {activeMenu === 'resumes' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900">All Candidate Resumes</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Full catalog of resumes created by users</p>
                </div>
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                  {resumes.length} resumes
                </span>
              </div>

              {resumes.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">No resumes created yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-black uppercase tracking-wider text-slate-400">
                        <th className="pb-3 px-3">Candidate</th>
                        <th className="pb-3 px-3">Account</th>
                        <th className="pb-3 px-3">Template</th>
                        <th className="pb-3 px-3">ATS Score</th>
                        <th className="pb-3 px-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {resumes.map((r) => (
                        <tr key={r._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-900">
                            {r.personalInfo?.fullName || 'Untitled'}
                          </td>
                          <td className="py-3 px-3 text-xs text-slate-500">
                            {r.user?.email || 'N/A'}
                          </td>
                          <td className="py-3 px-3 capitalize text-xs font-bold text-slate-700">
                            {r.template || 'classic'}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`text-xs font-extrabold px-2 py-0.5 rounded ${
                                (r.atsScore || 0) >= 80
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : (r.atsScore || 0) >= 60
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {r.atsScore || 0}/100
                            </span>
                          </td>
                          <td className="py-3 px-3 text-xs text-slate-400">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── COLLEGE PREFIXES TAB ── */}
          {activeMenu === 'prefixes' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
              {/* Header with Search Bar on the Right */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    College Partner Email Prefixes
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Automated 1-Year Free Access
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Every student registering with a matching college email domain configured here automatically receives 1 year of free Executive access with all templates unlocked.
                  </p>
                </div>

                {/* Search Bar on the Right of the Heading */}
                <div className="relative min-w-[280px] lg:min-w-[320px] shrink-0">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by prefix (@domain) or college..."
                    value={prefixSearch}
                    onChange={(e) => setPrefixSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-8 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3C50E0] focus:bg-white transition-all shadow-xs"
                  />
                  {prefixSearch && (
                    <button
                      onClick={() => setPrefixSearch('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Add form */}
              <form onSubmit={handleAddPrefix} className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Prefix / Domain / Gmail *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. @gehu.ac.in, gehu_, or student@xyz.com"
                      value={newPrefix.prefix}
                      onChange={(e) => setNewPrefix({ ...newPrefix, prefix: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#3C50E0]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      College / Institution Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Graphic Era Hill University"
                      value={newPrefix.collegeName}
                      onChange={(e) => setNewPrefix({ ...newPrefix, collegeName: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#3C50E0]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Duration (Days)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        max="3650"
                        value={newPrefix.durationDays}
                        onChange={(e) => setNewPrefix({ ...newPrefix, durationDays: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#3C50E0]"
                      />
                      <button
                        type="submit"
                        disabled={submittingPrefix}
                        className="bg-[#3C50E0] hover:bg-[#3C50E0]/90 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Table Toolbar / Title */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-900">Configured Partner Prefixes</h3>
                  <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                    {filteredPrefixes.length} {prefixSearch ? `of ${prefixes.length}` : 'total'}
                  </span>
                </div>
              </div>

              {/* Table / Empty State */}
              {filteredPrefixes.length === 0 ? (
                <div className="text-center py-10 bg-slate-50/60 rounded-xl border border-dashed border-slate-200 text-slate-400">
                  <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">
                    {prefixSearch ? `No email prefixes found matching "${prefixSearch}"` : 'No email prefixes added yet.'}
                  </p>
                  {prefixSearch && (
                    <button
                      onClick={() => setPrefixSearch('')}
                      className="mt-2 text-xs text-[#3C50E0] font-bold hover:underline"
                    >
                      Clear search filter
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-black uppercase tracking-wider text-slate-400">
                        <th className="pb-3 px-3">Prefix / Domain</th>
                        <th className="pb-3 px-3">Institution</th>
                        <th className="pb-3 px-3">Duration</th>
                        <th className="pb-3 px-3">Registered</th>
                        <th className="pb-3 px-3">Status</th>
                        <th className="pb-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredPrefixes.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-[#3C50E0]">
                            <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                              {item.prefix}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-800">
                            {item.collegeName || 'Partner College'}
                          </td>
                          <td className="py-3 px-3 text-xs text-slate-500">
                            {item.durationDays || 365} Days
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-800 text-xs">
                            {item.registeredCount || 0} Students
                          </td>
                          <td className="py-3 px-3">
                            <button
                              onClick={() => handleTogglePrefix(item._id)}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                item.isActive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {item.isActive ? 'Active' : 'Disabled'}
                            </button>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleDeletePrefix(item._id, item.prefix)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── PAYMENTS & BILLING TAB ── */}
          {activeMenu === 'payments' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Billing & Payment Transactions</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Recent Razorpay subscription orders</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 block">Total Revenue</span>
                  <span className="text-xl font-black text-slate-900">₹{totalRevenue}</span>
                </div>
              </div>

              {payments.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">No payment records yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-black uppercase tracking-wider text-slate-400">
                        <th className="pb-3 px-3">Order ID</th>
                        <th className="pb-3 px-3">User</th>
                        <th className="pb-3 px-3">Plan</th>
                        <th className="pb-3 px-3">Amount</th>
                        <th className="pb-3 px-3">Cycle</th>
                        <th className="pb-3 px-3">Status</th>
                        <th className="pb-3 px-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {payments.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3 font-mono text-xs text-slate-600">{p.razorpayOrderId}</td>
                          <td className="py-3 px-3 text-xs font-bold text-slate-800">{p.userId?.email || 'N/A'}</td>
                          <td className="py-3 px-3 capitalize font-bold text-purple-700 text-xs">{p.plan}</td>
                          <td className="py-3 px-3 font-black text-slate-900">₹{p.amount}</td>
                          <td className="py-3 px-3 text-xs text-slate-500">{p.billingCycle || 'monthly'}</td>
                          <td className="py-3 px-3">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-xs text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── VIEW MESSAGE DETAIL MODAL ── */}
      <AnimatePresence>
        {viewingMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">{viewingMessage.name}</h3>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 text-[#3C50E0] border border-indigo-100">
                      {viewingMessage.type.replace('-', ' ')}
                    </span>
                  </div>
                  <a href={`mailto:${viewingMessage.email}`} className="text-xs text-[#3C50E0] hover:underline">
                    {viewingMessage.email}
                  </a>
                </div>
                <button
                  onClick={() => setViewingMessage(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Organization</span>
                  <span className="font-bold text-slate-800">{viewingMessage.companyOrInstitution || 'Not Specified'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Team / Student Size</span>
                  <span className="font-bold text-slate-800">{viewingMessage.size || 'Not Specified'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Submitted Date</span>
                  <span className="font-bold text-slate-800">{new Date(viewingMessage.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                  <span className="font-bold text-emerald-600">{viewingMessage.isRead ? 'Read' : 'Unread'}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1.5">Inquiry Message:</span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto">
                  {viewingMessage.message}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleDeleteInquiry(viewingMessage._id)}
                  className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleReadInquiry(viewingMessage._id, viewingMessage.isRead)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Mark as {viewingMessage.isRead ? 'Unread' : 'Read'}
                  </button>

                  <a
                    href={`mailto:${viewingMessage.email}?subject=Regarding your ATSPro Inquiry&body=Hi ${viewingMessage.name},%0D%0A%0D%0AThank you for reaching out regarding ${viewingMessage.type}.`}
                    className="bg-[#3C50E0] hover:bg-[#3C50E0]/90 text-white font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" /> Reply via Email
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── EDIT USER PLAN MODAL ── */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">Modify User Access</h3>
                  <p className="text-xs text-slate-400">{editingUser.email}</p>
                </div>
                <button
                  onClick={() => setEditingUser(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveUserPlan} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Plan Tier</label>
                  <select
                    value={editPlanForm.plan}
                    onChange={(e) => setEditPlanForm({ ...editPlanForm, plan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#3C50E0]"
                  >
                    <option value="free">Free Tier</option>
                    <option value="fresher">Fresher Plan</option>
                    <option value="experience">Experience Plan</option>
                    <option value="executive">Executive Plan (All 5 Templates)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Extend Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="3650"
                    value={editPlanForm.durationDays}
                    onChange={(e) => setEditPlanForm({ ...editPlanForm, durationDays: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#3C50E0]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Default 365 days for 1 full year.</p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="modalCollegePass"
                    checked={editPlanForm.isCollegeTrial}
                    onChange={(e) => setEditPlanForm({ ...editPlanForm, isCollegeTrial: e.target.checked })}
                    className="w-4 h-4 text-[#3C50E0] rounded border-slate-300"
                  />
                  <label htmlFor="modalCollegePass" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Grant College Partner Free Pass
                  </label>
                </div>

                {editPlanForm.isCollegeTrial && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">College / University Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Graphic Era Hill University"
                      value={editPlanForm.collegeName}
                      onChange={(e) => setEditPlanForm({ ...editPlanForm, collegeName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#3C50E0]"
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingPlan}
                    className="bg-[#3C50E0] hover:bg-[#3C50E0]/90 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1"
                  >
                    {savingPlan ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
