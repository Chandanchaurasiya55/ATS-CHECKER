import { useState } from 'react';
import { Users, FileText, CheckCircle, Award, ArrowRight, Mail, User, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const CareerCoaches = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    clientCount: '1-10',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success('Thank you! A coach relationship manager will connect with you shortly.');
      setFormData({ name: '', email: '', website: '', clientCount: '1-10', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  const coachFeatures = [
    {
      title: "Coaching Dashboard",
      desc: "Track drafts, progress checkpoints, and average resume health metrics across all your active coaching groups.",
      icon: Users,
      color: "text-violet-600 bg-violet-50"
    },
    {
      title: "Automate Formatting Review",
      desc: "Delegate basic parsing audits, spell checks, and keyword listings to ATSPro so you can concentrate on high-level strategy.",
      icon: FileText,
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: "Export White-Label ATS Audits",
      desc: "Generate professional reports containing formatting feedback, missing skills list, and suggested changes branded with your name.",
      icon: Award,
      color: "text-indigo-600 bg-indigo-50"
    },
    {
      title: "Collaborative Workspaces",
      desc: "Read client draft resumes directly, leave inline advice, and sign off when their resume is optimized for submission.",
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-50"
    }
  ];

  return (
    <div className="relative bg-gradient-to-b from-slate-50 to-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-100/30 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-indigo-100/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-violet-600 bg-violet-50 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            For Career Advisors & Executive Coaches
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mt-4 mb-6 leading-tight">
            Scale Your Consulting Business With <span className="text-violet-600">AI Diagnostics</span>
          </h1>
          <p className="text-lg text-gray-600 font-normal leading-relaxed">
            Outsource basic formatting checks, syntax correction, and keyword alignments. Deliver evidence-backed resume reviews under your own brand.
          </p>
        </div>

        {/* Dynamic Coach Widget Dashboard */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight mb-6">
              Give clients the technical edge to pass hiring manager screeners.
            </h2>
            <div className="space-y-6">
              {coachFeatures.map((f, idx) => {
                const Icon = f.icon;
                return (
                  <div key={idx} className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${f.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{f.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive clients dashboard table mockup */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 sm:p-8 relative">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg">My Client Dashboard</h3>
                <p className="text-xs text-gray-500">Active coaching clients: 12</p>
              </div>
              <span className="text-[10px] bg-violet-100 text-violet-800 font-bold px-2 py-0.5 rounded uppercase">
                Coach Panel
              </span>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              {[
                { name: "John Doe", role: "Software Architect", score: 87, status: "Ready", badge: "bg-emerald-100 text-emerald-800" },
                { name: "Sarah Connor", role: "Product Manager", score: 62, status: "Reviewing", badge: "bg-amber-100 text-amber-800" },
                { name: "Tony Stark", role: "R&D Director", score: 94, status: "Ready", badge: "bg-emerald-100 text-emerald-800" },
                { name: "Natasha Romanoff", role: "Operations Lead", score: 55, status: "Needs Work", badge: "bg-red-100 text-red-800" }
              ].map((client, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center hover:bg-slate-50/50 rounded-lg px-2 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{client.name}</span>
                    <span className="text-gray-500 text-[10px]">{client.role}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className={`font-bold ${client.score >= 80 ? 'text-emerald-600' : client.score >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                        ATS: {client.score}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${client.badge}`}>
                      {client.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-gray-100 pt-4 flex justify-between items-center">
              <span className="text-xs text-gray-500">All resumes formatted under: <strong>"Minimal" template</strong></span>
              <button className="text-xs text-violet-600 font-bold flex items-center gap-1 hover:text-violet-700">
                Bulk Audits <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Contact/Demo Request */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-12 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Partner with ATSPro</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Deploy ATSPro as an value-added consulting utility. We provide custom billing cycles for coaches, client tracking options, white-labeled client exports, and priority premium template accessibility.
            </p>
            <div className="space-y-3.5 text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-violet-600" />
                <span>Custom Brand Logo placement on PDF reports</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-violet-600" />
                <span>Access history & feedback comments logs</span>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-violet-600" />
                <span>Unlimited standard templates for clients</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Coach Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Marcus Aurelius"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-violet-500 focus:bg-white outline-none text-sm transition-all"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Contact Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="marcus@coaching.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-violet-500 focus:bg-white outline-none text-sm transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Website URL (Optional)</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://coaching.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-violet-500 focus:bg-white outline-none text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Monthly Client Volume</label>
              <select
                value={formData.clientCount}
                onChange={(e) => setFormData({ ...formData, clientCount: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-violet-500 focus:bg-white outline-none text-sm transition-all"
              >
                <option value="1-10">1 - 10 Clients / mo</option>
                <option value="11-30">11 - 30 Clients / mo</option>
                <option value="31-100">31 - 100 Clients / mo</option>
                <option value="100+">100+ Clients / mo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Partnership Interest Details</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Briefly share about your career coaching scope or dashboard reporting needs..."
                rows="3"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-violet-500 focus:bg-white outline-none text-sm transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-violet-100 flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {submitting ? 'Submitting Partnership...' : 'Apply for Partnerships'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CareerCoaches;
