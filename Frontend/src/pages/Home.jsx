import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, BarChart3, Wand2, Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import ATSChecker from '../components/ATSChecker.jsx';

const Home = () => {
  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'ATS Analysis',
      desc: 'Upload your resume and get instant ATS compatibility score with detailed feedback.',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Deep Insights',
      desc: 'Identify missing keywords, formatting issues, and section problems affecting your score.',
    },
    {
      icon: <Wand2 className="w-6 h-6" />,
      title: 'Smart Suggestions',
      desc: 'Get AI-powered recommendations to improve your resume and boost your ATS score.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '91+ Score Guarantee',
      desc: 'Our resume builder ensures your resume scores at least 91+ on ATS systems.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Builder',
      desc: 'Fill in your details and generate a professionally formatted, ATS-optimized resume.',
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Export Ready',
      desc: 'Download your resume as a clean HTML file that parses perfectly in any ATS system.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Beat the ATS. <span className="text-primary-600">Get Hired.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Analyze your resume against ATS systems, fix issues, and build an optimized resume 
              with a guaranteed 91+ score.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#checker" className="btn-secondary text-lg px-8 py-4">
                Try Analyzer
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { value: '91+', label: 'Min ATS Score' },
              { value: '50+', label: 'Keywords Checked' },
              { value: '7', label: 'Sections Analyzed' },
              { value: '100%', label: 'Free to Use' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-primary-600">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ATS Checker Section */}
      <section id="checker" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-heading">Analyze Your Resume</h2>
            <p className="text-gray-600">Upload your resume and get instant feedback on ATS compatibility</p>
          </div>
          <ATSChecker />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading">Everything You Need</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From analysis to optimization to building — we've got you covered
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
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Create an ATS-optimized resume that gets past the filters and into the hands of recruiters.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-primary-600 font-bold py-4 px-10 rounded-xl hover:bg-primary-50 transition-colors shadow-lg"
          >
            Start Building Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
