import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="max-w-5xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-10">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary-600 font-bold mb-3">
            About ATSPro
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900">
            Build resumes that pass ATS and impress recruiters.
          </h1>
          <p className="mt-4 text-gray-600 text-lg max-w-3xl mx-auto">
            ATSPro gives you instant resume feedback, keyword optimization, and a smart builder designed
            for modern hiring systems. Save time, improve your score, and get noticed by the right employers.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-gray-100 p-8 bg-gray-50 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Why ATSPro?</h2>
            <p className="text-gray-600 leading-relaxed">
              Our platform is built for job seekers who want a resume that performs in real ATS systems.
              We analyze format, keywords, and structure so your resume can move past the first filter.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 p-8 bg-gray-50 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">What you get</h2>
            <ul className="space-y-3 text-gray-600">
              <li>• Resume scoring with ATS insights</li>
              <li>• Keyword and formatting recommendations</li>
              <li>• Quick resume builder with modern templates</li>
              <li>• Secure account, save and edit anytime</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-full bg-primary-600 px-8 py-4 text-white font-bold shadow-lg shadow-primary-600/20 hover:bg-primary-500 transition-all"
          >
            Start your first resume
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
