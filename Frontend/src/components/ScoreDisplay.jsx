import { motion } from 'framer-motion';
import { Target, CheckCircle2, AlertTriangle, TrendingUp, Shield, FileText, Zap } from 'lucide-react';

const ScoreDisplay = ({ score, sectionScores, issues }) => {
  const getScoreColor = (s) => {
    if (s >= 90) return 'text-emerald-600';
    if (s >= 70) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBg = (s) => {
    if (s >= 90) return 'bg-emerald-50 border-emerald-200';
    if (s >= 70) return 'bg-amber-50 border-amber-200';
    return 'bg-rose-50 border-rose-200';
  };

  const getCircleColor = (s) => {
    if (s >= 90) return '#059669';
    if (s >= 70) return '#d97706';
    return '#e11d48';
  };

  const getScoreLabel = (s) => {
    if (s >= 90) return 'Excellent';
    if (s >= 70) return 'Good';
    if (s >= 50) return 'Average';
    return 'Needs Work';
  };

  const getScoreIcon = (s) => {
    if (s >= 90) return <Shield className="w-4 h-4 text-emerald-600" />;
    if (s >= 70) return <TrendingUp className="w-4 h-4 text-amber-600" />;
    return <Zap className="w-4 h-4 text-rose-600" />;
  };

  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (circumference * score) / 100;

  const sectionIcons = {
    keywords: <Target className="w-4 h-4" />,
    format: <FileText className="w-4 h-4" />,
    content: <CheckCircle2 className="w-4 h-4" />,
    readability: <TrendingUp className="w-4 h-4" />,
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 p-2">
      {/* Main Score Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-white border border-gray-200/80 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] backdrop-blur-sm"
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-white to-gray-50/30 pointer-events-none" />
        
        <div className="relative p-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 rounded-xl bg-gray-100/80">
              <Target className="w-5 h-5 text-gray-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 tracking-tight">ATS Compatibility Score</h3>
          </div>

          <div className="relative w-56 h-56">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              {/* Outer glow ring */}
              <circle
                cx="60"
                cy="60"
                r="56"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-gray-100"
              />
              
              {/* Background track */}
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-100"
              />
              
              {/* Animated progress ring */}
              <motion.circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={getCircleColor(score)}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
                className="drop-shadow-[0_0_10px_rgba(0,0,0,0.1)]"
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className={`text-6xl font-black tracking-tighter ${getScoreColor(score)}`}
              >
                {score}
              </motion.span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-[0.2em] mt-1">out of 100</span>
            </div>
          </div>

          {/* Score badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className={`mt-6 px-4 py-1.5 rounded-full border text-sm font-semibold flex items-center gap-2 ${getScoreBg(score)} ${getScoreColor(score)}`}
          >
            {getScoreIcon(score)}
            {getScoreLabel(score)}
          </motion.div>
        </div>
      </motion.div>

      {/* Section Scores Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-2 gap-4"
      >
        {Object.entries(sectionScores || {}).map(([key, val], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200/60 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gray-100 text-gray-600">
                    {sectionIcons[key.toLowerCase()] || <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <span className={`text-xl font-bold ${getScoreColor(val)}`}>
                  {val}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${val}%` }}
                  transition={{ duration: 1.2, delay: 0.6 + index * 0.15, ease: "easeOut" }}
                  className="h-full rounded-full relative"
                  style={{ backgroundColor: getCircleColor(val) }}
                >
                  <div className="absolute inset-0 bg-white/20 rounded-full" />
                </motion.div>
              </div>
              
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-gray-400 font-medium">0%</span>
                <span className="text-[10px] text-gray-400 font-medium">100%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Issues Section */}
      {issues?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-white border border-rose-200/60 shadow-[0_4px_24px_-4px_rgba(225,29,72,0.08)]"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-rose-600" />
          
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Critical Issues Found</h3>
                <p className="text-xs text-gray-500 mt-0.5">{issues.length} issues need attention</p>
              </div>
            </div>

            <ul className="space-y-3">
              {issues.map((issue, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-rose-50/50 border border-rose-100/50 hover:bg-rose-50 transition-colors duration-200"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 leading-relaxed">{issue}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Success State (No issues) */}
      {issues?.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-white border border-emerald-200/60 shadow-[0_4px_24px_-4px_rgba(5,150,105,0.08)] p-6"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">All Clear!</h3>
              <p className="text-xs text-gray-500 mt-0.5">No critical issues detected</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ScoreDisplay;