import { useState } from 'react';
import { Shield, Sparkles, Zap, Users, Check, ArrowRight, Building, Mail, Phone, User, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const Recruitment = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    teamSize: '1-10',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success('Thank you for your interest! A sales representative will contact you within 24 hours.');
      setFormData({ name: '', email: '', company: '', teamSize: '1-10', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  const benefits = [
    {
      title: "Eliminate Manual Re-formatting",
      desc: "Stop wasting hours adjusting candidate resume designs. Standardize incoming applications into a clean layout automatically.",
      icon: Zap,
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: "Recruiting Software Compatibility",
      desc: "Ensure every candidate profile passes cleanly through major applicant tracking systems like Workday, Greenhouse, and Taleo.",
      icon: Shield,
      color: "text-indigo-600 bg-indigo-50"
    },
    {
      title: "Keyword & Skill Optimization",
      desc: "Verify that candidates' resumes match your target job descriptions with our real-time matching engine before submittals.",
      icon: Sparkles,
      color: "text-violet-600 bg-violet-50"
    },
    {
      title: "Client-Ready Presentations",
      desc: "Instantly brand resumes with your agency header or format, presenting a polished and uniform candidate deck to clients.",
      icon: Users,
      color: "text-purple-600 bg-purple-50"
    }
  ];

  return (
    <div className="relative bg-gradient-to-b from-slate-50 to-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-indigo-100/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            For Recruitment Agencies & HR
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mt-4 mb-6 leading-tight">
            Deliver <span className="text-primary-600">Client-Ready</span> Resumes That Win More Interviews
          </h1>
          <p className="text-lg text-gray-600 font-normal leading-relaxed">
            Stop losing qualified candidates to rigid ATS filters. ATSPro empowers your recruiters to instantly audit, optimize, and standardize client submittals at scale.
          </p>
        </div>

        {/* Interactive Stats Widget */}
        <div className="grid md:grid-cols-3 gap-6 mb-20 text-center">
          {[
            { metric: "60%", label: "Faster Candidate Prep", sub: "Standardized formatting in one click" },
            { metric: "3.5x", label: "Higher Submittal-to-Interview", sub: "Optimized for major enterprise ATS algorithms" },
            { metric: "99.8%", label: "Parser Accuracy", sub: "Ensures no candidate details get lost in the portal" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all duration-300">
              <div className="text-4xl sm:text-5xl font-black text-primary-600 mb-2">{stat.metric}</div>
              <div className="text-gray-900 font-bold text-base">{stat.label}</div>
              <div className="text-gray-500 text-xs mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-20">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight mb-6">
              Empower recruiters to submit candidate profiles with complete confidence.
            </h2>
            <div className="space-y-6">
              {benefits.map((b, idx) => {
                const Icon = b.icon;
                return (
                  <div key={idx} className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${b.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{b.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive B2B Preview Widget */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative">
            <div className="absolute top-4 right-4 flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            
            <div className="mb-6">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Recruiter Audit Panel
              </span>
              <h4 className="text-lg font-bold mt-2">Candidate: Dev_Lead_Resume.pdf</h4>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-gray-300">JD Matching Level</span>
                  <span className="text-xs font-bold text-emerald-400">89% (Optimal)</span>
                </div>
                <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '89%' }}></div>
                </div>
              </div>

              <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/50">
                <span className="text-xs font-semibold text-gray-300 block mb-2">Parser Health Checks</span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</div>
                    <span>No unreadable icons or columns detected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</div>
                    <span>All contact details successfully indexed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">!</div>
                    <span className="text-gray-300">Missing keyword: <strong className="text-amber-300">"CI/CD Pipelines"</strong> (Added to suggestions)</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 hover:bg-blue-700 transition-colors text-center text-xs font-bold py-3 rounded-xl cursor-pointer">
                Auto-Export Clean PDF (Agency Brand)
              </div>
            </div>
          </div>
        </div>

        {/* Contact/Enterprise Form */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-12 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Request a Customized Trial</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Want to deploy ATSPro across your recruiting teams? Contact us to set up a corporate demo, customize your agency's template guidelines, and check out our team dashboard features.
            </p>
            <div className="space-y-3.5 text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-primary-600" />
                <span>Dedicated Enterprise Account Manager</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary-600" />
                <span>Full GDPR & Candidate Data Protection</span>
              </div>
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary-600" />
                <span>Custom PDF design configurations</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rachel Green"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 focus:bg-white outline-none text-sm transition-all"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rachel@agency.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 focus:bg-white outline-none text-sm transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Company Name</label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Apex Partners"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 focus:bg-white outline-none text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Team Size</label>
              <select
                value={formData.teamSize}
                onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 focus:bg-white outline-none text-sm transition-all"
              >
                <option value="1-10">1-10 Recruiters</option>
                <option value="11-50">11-50 Recruiters</option>
                <option value="51-200">51-200 Recruiters</option>
                <option value="200+">200+ Recruiters</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">How can we help?</label>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your recruitment volume or specific requirements..."
                  rows="3"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 focus:bg-white outline-none text-sm transition-all resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-100 flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {submitting ? 'Sending Request...' : 'Send Inquiry'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Recruitment;
