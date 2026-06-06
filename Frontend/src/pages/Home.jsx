import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, BarChart3, Wand2, Shield, Zap, ArrowRight, CheckCircle, Search, Target, Award } from 'lucide-react';
import ATSChecker from '../components/ATSChecker.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'ATS Analysis',
      desc: 'Upload your resume and get instant ATS compatibility score with detailed feedback.',
      color: 'blue'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Keyword Targeting',
      desc: 'Identify missing keywords, formatting issues, and section problems affecting your score.',
      color: 'purple'
    },
    {
      icon: <Wand2 className="w-6 h-6" />,
      title: 'Smart Suggestions',
      desc: 'Get AI-powered recommendations to improve your resume and boost your ATS score.',
      color: 'amber'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '91+ Score Guarantee',
      desc: 'Our resume builder ensures your resume scores at least 91+ on ATS systems.',
      color: 'emerald'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Builder',
      desc: 'Fill in your details and generate a professionally formatted, ATS-optimized resume.',
      color: 'rose'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Export Ready',
      desc: 'Download your resume as a clean HTML file that parses perfectly in any ATS system.',
      color: 'indigo'
    },
  ];

  const steps = [
    { number: '01', title: 'Upload Resume', desc: 'Drag and drop your existing resume or start from scratch.' },
    { number: '02', title: 'Get ATS Score', desc: 'Our AI analyzes it against modern hiring systems.' },
    { number: '03', title: 'Fix & Optimize', desc: 'Follow suggestions to improve keywords and formatting.' },
    { number: '04', title: 'Download & Apply', desc: 'Get your 91+ score resume and land that interview!' },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-[#fafafa] pt-24 pb-20 px-4 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 -right-20 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 -left-20 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-primary-600 uppercase bg-primary-50 rounded-full"
          >
            AI-Powered Career Toolkit
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              Beat the ATS. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-500">
                Land Your Dream Job.
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Don't let algorithms block your path. Analyze your resume, get smart suggestions, 
              and build a perfect resume with a guaranteed 91+ ATS score.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={isAuthenticated ? "/builder" : "/register"}
                className="group relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-white rounded-xl group bg-gradient-to-br from-primary-600 to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-primary-200"
              >
                <span className="relative px-8 py-4 transition-all ease-in duration-75 text-lg font-bold flex items-center gap-2">
                  {isAuthenticated ? 'Go to Builder' : 'Get Started Free'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <a 
                href="#checker" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-900 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all hover:border-gray-300"
              >
                Try Free Analyzer
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: '91+', label: 'Min ATS Score', icon: <Target className="w-5 h-5" /> },
              { value: '250+', label: 'Templates Base', icon: <FileText className="w-5 h-5" /> },
              { value: '10K+', label: 'Users Helped', icon: <Zap className="w-5 h-5" /> },
              { value: '100%', label: 'Success Rate', icon: <CheckCircle className="w-5 h-5" /> },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="flex flex-col items-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="text-primary-600 mb-2">{stat.icon}</div>
                <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ATS Checker Section */}
      <section id="checker" className="py-24 px-4 bg-white relative scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Analyze Your Resume</h2>
            <div className="h-1.5 w-24 bg-primary-600 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our AI engine simulates major ATS software to give you real-world results.
            </p>
          </div>
          <div className="bg-gray-50 rounded-3xl p-4 md:p-8 shadow-inner border border-gray-100">
            <ATSChecker />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600">Land your next role in 4 simple steps</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative group">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full transition-all group-hover:-translate-y-2 group-hover:shadow-md">
                  <div className="text-4xl font-black text-primary-100 mb-4">{step.number}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 text-gray-200">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to beat the hiring algorithms and get noticed.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-primary-600/5 hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white shadow-sm text-primary-600 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[3rem] bg-gray-900 overflow-hidden px-8 py-20 text-center shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 rounded-full blur-[120px] -mr-32 -mt-32 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full blur-[120px] -ml-32 -mb-32 opacity-20"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Ready to transform your career?
              </h2>
              <p className="text-gray-400 text-lg mb-10">
                Join 10,000+ job seekers who used ATS Pro to beat the algorithms and get their dream offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to={isAuthenticated ? "/builder" : "/register"}
                  className="bg-primary-600 text-white font-bold py-4 px-10 rounded-2xl hover:bg-primary-500 transition-all hover:scale-105 shadow-lg shadow-primary-600/30"
                >
                  {isAuthenticated ? 'Create New Resume' : 'Start for Free'}
                </Link>
                <Link
                  to={isAuthenticated ? "/dashboard" : "/login"}
                  className="bg-white/10 text-white backdrop-blur-md font-bold py-4 px-10 rounded-2xl hover:bg-white/20 transition-all"
                >
                  {isAuthenticated ? 'View Dashboard' : 'Login Here'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
