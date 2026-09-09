import { motion } from 'framer-motion';
import { Target, CheckCircle2, AlertTriangle, TrendingUp, Shield, FileText, Zap, Lock, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const sectionIcons = {
  keywords: <Target className="w-4 h-4" />,
  format: <FileText className="w-4 h-4" />,
  sections: <CheckCircle2 className="w-4 h-4" />,
  content: <CheckCircle2 className="w-4 h-4" />,
  readability: <TrendingUp className="w-4 h-4" />,
};

export const ScoreCard = ({ score, sectionScores }) => {
  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (circumference * score) / 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl bg-white border border-gray-200/90 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] h-full flex flex-col justify-between"
    >
      <div className="p-6 sm:p-8 flex flex-col items-center flex-1 justify-center">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-xl bg-gray-100 text-gray-700">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            ATS Compatibility Score
          </h2>
        </div>

        {/* SVG Progress Circle */}
        <div className="relative flex items-center justify-center">
          <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="52"
              className="stroke-gray-100"
              strokeWidth="10"
              fill="transparent"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="52"
              stroke={getCircleColor(score)}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              strokeLinecap="round"
            />
          </svg>

          {/* Score in the center */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <motion.span 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`text-5xl font-black tracking-tight ${getScoreColor(score)}`}
            >
              {score}
            </motion.span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
              out of 100
            </span>
          </div>
        </div>

        {/* Badge under circle */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`mt-5 px-4 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 shadow-2xs ${getScoreBg(score)} ${getScoreColor(score)}`}
        >
          {getScoreIcon(score)}
          <span>{getScoreLabel(score)}</span>
        </motion.div>
      </div>

      {/* Section Scores Integrated Panel */}
      {sectionScores && Object.keys(sectionScores).length > 0 && (
        <div className="border-t border-gray-200 bg-slate-50/90 p-5 sm:p-6 rounded-b-3xl">
          <div className="flex items-center gap-2 mb-3.5">
            <div className="w-1.5 h-3.5 rounded-full bg-primary-600" />
            <span className="text-xs font-black text-gray-900 uppercase tracking-wider">
              Section Performance Breakdown
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3.5">
            {Object.entries(sectionScores)
              .filter(([k]) => k.toLowerCase() !== 'overall')
              .map(([key, val], index) => (
                <div
                  key={key}
                  className="p-3.5 rounded-2xl bg-white border border-gray-200/90 shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-gray-100 text-gray-800">
                        {sectionIcons[key.toLowerCase()] || <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <span className={`text-sm font-black ${getScoreColor(val)}`}>
                      {val}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${val}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: getCircleColor(val) }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export const IssuesCard = ({ issues = [], isPremium = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="relative overflow-hidden rounded-3xl bg-white border border-rose-200/80 shadow-[0_8px_30px_-12px_rgba(225,29,72,0.08)] h-full flex flex-col justify-between"
    >
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-400 to-rose-600" />
      
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-100">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Critical Issues Found</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {issues?.length || 0} {issues?.length === 1 ? 'issue needs' : 'issues need'} attention
                </p>
              </div>
            </div>
            {!isPremium && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/70 px-3 py-1 rounded-full">
                <Lock className="w-3.5 h-3.5 text-amber-600" /> Pro Details
              </span>
            )}
          </div>

          {issues && issues.length > 0 ? (
            isPremium ? (
              /* Premium View: Full Issues & Explanations */
              <ul className="space-y-3.5">
                {issues.map((issue, idx) => {
                  const isObj = typeof issue === 'object' && issue !== null;
                  const title = isObj ? issue.title : issue;
                  const desc = isObj ? issue.description : null;
                  const fix = isObj ? issue.fix : null;

                  return (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 hover:bg-rose-50 transition-colors text-left"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-900 leading-snug">{title}</h4>
                          {desc && (
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">{desc}</p>
                          )}
                          {fix && (
                            <div className="mt-2.5 text-xs text-rose-950 bg-white/95 border border-rose-200/70 rounded-xl p-3 flex items-start gap-2.5 shadow-2xs">
                              <span className="font-extrabold text-rose-600 shrink-0 uppercase tracking-wider text-[10px] bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">
                                Fix
                              </span>
                              <span className="leading-relaxed font-medium">{fix}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            ) : (
              /* Free Plan Teaser / Lock */
              <div className="relative mt-2 min-h-[160px] flex flex-col justify-center">
                <div className="filter blur-[4px] select-none opacity-40 space-y-3 pointer-events-none">
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-left">
                    <h4 className="text-sm font-bold text-gray-900">Resume Content Length Is Sub-optimal</h4>
                    <p className="text-xs text-gray-600 mt-1">ATS algorithms require comprehensive content to index skills.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-left">
                    <h4 className="text-sm font-bold text-gray-900">Missing Quantifiable Metrics & Action Verbs</h4>
                    <p className="text-xs text-gray-600 mt-1">Recruiter ATS scans prioritize metric-driven achievements.</p>
                  </div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px] rounded-2xl p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-2 shadow-2xs">
                    <Lock className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {issues.length} Critical {issues.length === 1 ? 'Issue' : 'Issues'} Detected
                  </p>
                  <p className="text-xs text-gray-500 max-w-xs mt-1 mb-3">
                    Upgrade to view detailed causes and step-by-step fixes to boost your ATS score.
                  </p>
                  <Link
                    to="/pricing"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-xl shadow-md transition-all hover:scale-105"
                  >
                    <Crown className="w-3.5 h-3.5" /> Unlock Detailed Fixes →
                  </Link>
                </div>
              </div>
            )
          ) : (
            /* All Clear State */
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-900">All Clear!</h4>
              <p className="text-xs text-gray-500 mt-0.5">No critical issues detected in your resume</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ScoreDisplay = ({ score, sectionScores, issues = [], isPremium = false }) => {
  return (
    <div className="w-full space-y-8">
      <ScoreCard score={score} sectionScores={sectionScores} />
      <IssuesCard issues={issues} isPremium={isPremium} />
    </div>
  );
};

export default ScoreDisplay;