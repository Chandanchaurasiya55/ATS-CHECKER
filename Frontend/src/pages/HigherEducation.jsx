import { useState } from 'react';
import { GraduationCap, Award, BarChart3, Clock, ArrowRight, Building, Mail, User, ShieldAlert, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const HigherEducation = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    studentCount: 'under-1000',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success('Thank you! A Higher Education partnership advisor will reach out to schedule your demo.');
      setFormData({ name: '', email: '', institution: '', studentCount: 'under-1000', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  const collegeFeatures = [
    {
      title: "Boost Campus Placement Rates",
      desc: "Ensure graduates aren't rejected by early automated scanners. Give students tools that guide them to build ATS-friendly files.",
      icon: GraduationCap,
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      title: "Scale Counselor Capacity",
      desc: "Allow AI checks to correct spelling, formats, and keyword gaps, letting advisors focus on strategic interviewing.",
      icon: Clock,
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: "Counselor Progress Dashboard",
      desc: "Monitor resume scores, target industries, and general readiness indicators across colleges, branches, or classes.",
      icon: BarChart3,
      color: "text-amber-600 bg-amber-50"
    },
    {
      title: "Co-Branded Student Portal",
      desc: "Offer students a customized portal branded with your institution's name and approved guidelines.",
      icon: Award,
      color: "text-violet-600 bg-violet-50"
    }
  ];

  return (
    <div className="relative bg-gradient-to-b from-slate-50 to-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            For Higher Education & Placement Cells
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mt-4 mb-6 leading-tight">
            Empower Students to <span className="text-emerald-600">Beat the ATS</span> & Land Placements
          </h1>
          <p className="text-lg text-gray-600 font-normal leading-relaxed">
            Bridge the gap between graduation and corporate recruitment. Equip your career development offices and students with professional ATS diagnostics.
          </p>
        </div>

        {/* placements dashboard mockup */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 sm:p-8 relative">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg">Placement Office Analytics</h3>
                <p className="text-xs text-gray-500">Academic Cohort: 2026</p>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">
                Active Portal
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6 text-center">
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                <div className="text-2xl font-black text-emerald-600">84.5%</div>
                <div className="text-[10px] font-bold text-gray-700 uppercase tracking-wider mt-1">Placement Ready</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                <div className="text-2xl font-black text-primary-600">79</div>
                <div className="text-[10px] font-bold text-gray-700 uppercase tracking-wider mt-1">Average Score</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                <div className="text-2xl font-black text-indigo-600">1,420</div>
                <div className="text-[10px] font-bold text-gray-700 uppercase tracking-wider mt-1">Resumes Filed</div>
              </div>
            </div>

            {/* Department stats */}
            <div className="space-y-3 text-xs">
              <span className="font-bold text-gray-700 block uppercase tracking-wider">Cohort Readiness by branch</span>
              
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-gray-600 mb-1">
                    <span>Computer Science Engineering</span>
                    <span className="font-bold">92%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-gray-600 mb-1">
                    <span>Electronics & Communication</span>
                    <span className="font-bold">81%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '81%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-gray-600 mb-1">
                    <span>Business Administration (MBA)</span>
                    <span className="font-bold">88%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight mb-6">
              A scalable solution to optimize resumes across thousands of students.
            </h2>
            <div className="space-y-6">
              {collegeFeatures.map((f, idx) => {
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
        </div>

        {/* Contact/Demo Request */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-12 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Request a Campus Demo</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Let us demonstrate how ATSPro integrates into university placement campaigns. We offer institutional pricing, bulk student uploading, SSO support, and dedicated training for university counselors.
            </p>
            <div className="space-y-3.5 text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <span>Custom Campus Portal Integration</span>
              </div>
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <span>Detailed Class-wise reports</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>Student privacy (HIPAA & FERPA Compliant guidelines)</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Advisor / Contact Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Arthur Pendelton"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none text-sm transition-all"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">University Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="arthur@university.edu"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none text-sm transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Institution Name</label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="Boston College"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Student Enrollment Size</label>
              <select
                value={formData.studentCount}
                onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none text-sm transition-all"
              >
                <option value="under-1000">Under 1,000 students</option>
                <option value="1000-5000">1,000 - 5,000 students</option>
                <option value="5000-15000">5,000 - 15,000 students</option>
                <option value="15000+">More than 15,000 students</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Inquiry Details</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Let us know what cohort or campus placement drive timeline you're looking at..."
                rows="3"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none text-sm transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {submitting ? 'Scheduling Demo...' : 'Book University Demo'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HigherEducation;
