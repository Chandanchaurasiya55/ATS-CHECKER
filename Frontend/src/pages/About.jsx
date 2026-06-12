import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, FileText, BarChart3, CheckCircle2, Sparkles } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "ATS Score Analysis",
      description: "Get real-time scoring based on actual Applicant Tracking System algorithms. Know exactly how your resume performs before you apply."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Smart Keyword Optimization",
      description: "AI-powered keyword suggestions tailored to your target job description. Match what recruiters are actually searching for."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Modern Resume Builder",
      description: "Clean, professional templates designed for both ATS compatibility and visual appeal. Export to PDF in one click."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your data is encrypted and stored securely. Edit, save, and access your resumes anytime from any device."
    }
  ];

  const stats = [
    { value: "50K+", label: "Resumes Optimized" },
    { value: "85%", label: "Interview Rate Boost" },
    { value: "3min", label: "Avg. Setup Time" },
    { value: "4.9", label: "User Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-8">
            <Sparkles className="w-4 h-4" />
            About ATSPro
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-slate-900 tracking-tight mb-6 leading-tight">
            Build Resumes That{' '}
            <span className="text-blue-600">Pass ATS</span>
            <br />
            and Impress Recruiters
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            ATSPro gives you instant resume feedback, keyword optimization, and a smart builder 
            designed for modern hiring systems. Save time, improve your score, and get noticed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-white font-semibold shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all duration-200 hover:-translate-y-0.5"
            >
              Start Building Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-slate-700 font-semibold border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center p-6 rounded-2xl bg-white border border-blue-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200"
            >
              <div className="text-3xl sm:text-4xl font-semibold text-blue-600 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500 font-normal">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-4">
            Everything You Need to Land Interviews
          </h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto font-normal">
            Powerful tools designed specifically for the modern job search landscape
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed font-normal">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-6 sm:p-10 md:p-16 text-white shadow-xl shadow-blue-600/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold mb-6">
                Why ATSPro?
              </h2>
              <p className="text-blue-100 text-base sm:text-lg leading-relaxed mb-8 font-normal">
                Our platform is built for job seekers who want a resume that performs in real ATS systems. 
                We analyze format, keywords, and structure so your resume can move past the first filter 
                and into the hands of real recruiters.
              </p>
              <div className="space-y-4">
                {[
                  "Real ATS algorithm simulation",
                  "Industry-specific keyword matching",
                  "Instant formatting feedback",
                  "One-click PDF export"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-300 flex-shrink-0" />
                    <span className="text-blue-50 font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-blue-100 font-semibold">ATS Compatibility</span>
                  <span className="font-semibold text-2xl">98%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white rounded-full h-2 w-[98%]"></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-blue-100 font-semibold">Keyword Match Rate</span>
                  <span className="font-semibold text-2xl">92%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white rounded-full h-2 w-[92%]"></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-blue-100 font-semibold">User Satisfaction</span>
                  <span className="font-semibold text-2xl">4.9/5</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white rounded-full h-2 w-[98%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-6">
          Ready to Get Hired?
        </h2>
        <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto font-normal">
          Join thousands of job seekers who have optimized their resumes with ATSPro and landed their dream jobs.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-10 py-4 text-white font-semibold text-lg shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all duration-200 hover:-translate-y-0.5"
        >
          Start Your First Resume
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="mt-4 text-sm text-slate-500 font-normal">No credit card required. Free plan available.</p>
      </div>
    </div>
  );
};

export default About;