import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, BarChart3, Wand2, Shield, Zap, ArrowRight, CheckCircle, Search, Target, Award, Star, MessageSquare } from 'lucide-react';
import ATSChecker from '../components/ATSChecker.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import heroResumeMockup from '../assets/hero_resume_mockup.png';
import ctaResumePerson from '../assets/cta_resume_person.png';

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
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50/20 pt-24 pb-20 px-4 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 -right-20 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
        <div className="absolute bottom-0 -left-20 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto relative px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left space-y-6"
            >
              <div className="inline-block px-4 py-1.5 text-sm font-semibold tracking-wide text-primary-600 uppercase bg-primary-50 rounded-full">
                AI-Powered Career Toolkit
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 tracking-tight leading-[1.15]">
                Land more interviews with ATSPro's <span className="text-primary-600">Resume Builder</span>
              </h1>
              <p className="text-lg text-gray-500 font-normal max-w-xl leading-relaxed">
                ATS Check, AI Suggestions, and Smart Formatting make your resume stand out to recruiters instantly.
              </p>
              
              <div className="flex flex-row items-center gap-2.5 sm:gap-4 pt-2">
                <Link
                  to={isAuthenticated ? "/builder" : "/register"}
                  className="inline-flex items-center justify-center bg-primary-600 text-white font-semibold px-4 py-3 sm:px-6 sm:py-3.5 rounded-xl hover:bg-primary-700 hover:scale-105 transition-all shadow-lg shadow-primary-200 text-xs sm:text-sm md:text-base whitespace-nowrap"
                >
                  Build Your Resume
                </Link>
                <a
                  href="#checker"
                  className="inline-flex items-center justify-center border-2 border-gray-900 bg-white text-gray-900 font-semibold px-4 py-3 sm:px-6 sm:py-3.5 rounded-xl hover:bg-gray-900 hover:text-white hover:scale-105 transition-all duration-200 text-xs sm:text-sm md:text-base whitespace-nowrap"
                >
                  Get Your Resume Score
                </a>
              </div>

              {/* Reviews & Stats Row */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-100 text-sm text-gray-500 font-normal">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-700">5,273 Reviews</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                  <span><strong className="font-semibold text-gray-700">28,452 users</strong> landed interviews last month</span>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative flex justify-center lg:justify-end"
            >
              <img
                src={heroResumeMockup}
                alt="ATSPro Resume Builder mockup showing resume with 85% ATS score check overlay"
                className="rounded-2xl shadow-2xl max-w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-300 border border-gray-100"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ATS Checker Section */}
      <section id="checker" className="py-24 px-4 bg-white relative scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">Analyze Your Resume</h2>
            <div className="h-1 w-16 bg-primary-600 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-500 font-normal text-base max-w-2xl mx-auto">
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
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600">Land your next role in 4 simple steps</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative group">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full transition-all group-hover:-translate-y-2 group-hover:shadow-md">
                  <div className="text-4xl font-semibold text-primary-100 mb-4">{step.number}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
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
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">Powerful Features</h2>
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
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-4 overflow-visible">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-[2rem] bg-[#4a4754] p-8 md:p-12 shadow-2xl">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              {/* Left Column: Image Overflowing */}
              <div className="md:col-span-4 relative -mt-20 md:-mt-24 mb-4 md:mb-0 flex justify-center">
                <img
                  src={ctaResumePerson}
                  alt="Person holding tailored resume in workspace"
                  className="rounded-2xl shadow-2xl h-56 md:h-72 lg:h-80 w-48 md:w-full object-cover border border-slate-700/50"
                />
              </div>

              {/* Right Column: Content */}
              <div className="md:col-span-8 text-left space-y-6 md:pl-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-tight">
                  Optimize your resume for any job with a single click
                </h2>
                <p className="text-slate-300 font-normal text-sm sm:text-base leading-relaxed max-w-2xl">
                  With our resume tailoring feature, you can ensure your resume is relevant to the job you're applying for. Simply paste the job description in our builder, and we'll show you exactly what keywords and sections you need to add to pass the ATS screening.
                </p>
                <div>
                  <Link
                    to={isAuthenticated ? "/builder" : "/register"}
                    className="inline-flex items-center justify-center bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 hover:scale-105 transition-all text-sm sm:text-base shadow-lg shadow-primary-500/20"
                  >
                    Build a Tailored Resume
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
