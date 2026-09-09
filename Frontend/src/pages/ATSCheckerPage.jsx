import ATSChecker from '../components/ATSChecker.jsx';
import { Sparkles } from 'lucide-react';

const ATSCheckerPage = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 text-primary-700 text-xs font-bold mb-4 border border-primary-100">
          <Sparkles className="w-3.5 h-3.5 text-primary-600" />
          <span>AI-Powered ATS Scanner</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
          Check Your ATS Resume Score
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-600">
          Upload your existing resume to get an instant ATS compatibility score, keyword density audit, and targeted recommendations to pass recruiter filters.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-200/80 shadow-xs p-6 sm:p-10">
        <ATSChecker />
      </div>
    </div>
  );
};

export default ATSCheckerPage;
