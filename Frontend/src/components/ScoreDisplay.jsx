import { motion } from 'framer-motion';
import { Target, CheckCircle2, AlertTriangle } from 'lucide-react';

const ScoreDisplay = ({ score, sectionScores, issues }) => {
  const getScoreColor = (s) => {
    if (s >= 90) return 'text-green-600 border-green-200 bg-green-50';
    if (s >= 70) return 'text-yellow-600 border-yellow-200 bg-yellow-50';
    return 'text-red-600 border-red-200 bg-red-50';
  };

  const getCircleColor = (s) => {
    if (s >= 90) return '#16a34a';
    if (s >= 70) return '#ca8a04';
    return '#dc2626';
  };

  return (
    <div className="space-y-6">
      <div className="card flex flex-col items-center">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Overall ATS Score</h3>
        <div className="relative w-48 h-48">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-100"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <motion.circle
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (251.2 * score) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="transition-all duration-1000"
              strokeWidth="8"
              strokeDasharray="251.2"
              strokeLinecap="round"
              stroke={getCircleColor(score)}
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-extrabold ${getScoreColor(score).split(' ')[0]}`}>
              {score}
            </span>
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Score</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(sectionScores || {}).map(([key, val]) => (
          <div key={key} className="card p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{key}</p>
            <div className="flex items-center justify-between">
              <span className={`text-lg font-bold ${getScoreColor(val).split(' ')[0]}`}>{val}%</span>
              <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-600 transition-all duration-1000" 
                  style={{ width: `${val}%`, backgroundColor: getCircleColor(val) }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {issues?.length > 0 && (
        <div className="card border-red-100 bg-red-50/30">
          <h3 className="flex items-center gap-2 text-red-800 font-bold mb-3">
            <AlertTriangle className="w-5 h-5" />
            Critical Issues Found
          </h3>
          <ul className="space-y-2">
            {issues.map((issue, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-red-700">
                <span className="mt-1 flex-shrink-0">•</span>
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScoreDisplay;
