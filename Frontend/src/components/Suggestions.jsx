import { motion } from 'framer-motion';
import { Lightbulb, Wand2, Copy, Check, Lock, Crown, Tag, Sparkles, FileCode } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const KeywordsCard = ({
  keywordsFound = [],
  keywordsMissing = [],
  improvedText = '',
  isPremium = false,
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!improvedText) return;
    navigator.clipboard.writeText(improvedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
      className="relative overflow-hidden rounded-3xl bg-white border border-gray-200/90 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] h-full flex flex-col justify-between"
    >
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gray-100 text-gray-700">
                <Tag className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                Keywords Match & Audit
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {keywordsFound?.length || 0} Found
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                {keywordsMissing?.length || 0} Missing
              </span>
            </div>
          </div>

          {/* Keywords Lists Container */}
          <div className="relative">
            {isPremium ? (
              <div className="grid sm:grid-cols-2 gap-5">
                {/* Found */}
                <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100">
                  <h3 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Keywords Found ({keywordsFound?.length || 0})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {keywordsFound && keywordsFound.length > 0 ? (
                      keywordsFound.map((kw, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white border border-emerald-200/90 text-emerald-700 text-xs rounded-lg font-medium shadow-2xs hover:bg-emerald-50 transition-colors"
                        >
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 italic">No domain keywords matched yet</span>
                    )}
                  </div>
                </div>

                {/* Missing */}
                <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100">
                  <h3 className="text-xs font-extrabold text-rose-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Missing Keywords ({keywordsMissing?.length || 0})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {keywordsMissing && keywordsMissing.length > 0 ? (
                      keywordsMissing.map((kw, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white border border-rose-200/90 text-rose-700 text-xs rounded-lg font-medium shadow-2xs hover:bg-rose-50 transition-colors"
                        >
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-600 font-medium">All domain keywords present!</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Free Plan Locked Overlay */
              <div className="relative min-h-[160px] flex flex-col justify-center">
                <div className="filter blur-[4px] select-none opacity-40 grid sm:grid-cols-2 gap-5 pointer-events-none">
                  <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100">
                    <h3 className="text-xs font-bold text-emerald-800 mb-2">Keywords Found (13)</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-white text-xs rounded">react</span>
                      <span className="px-2 py-1 bg-white text-xs rounded">javascript</span>
                      <span className="px-2 py-1 bg-white text-xs rounded">html</span>
                      <span className="px-2 py-1 bg-white text-xs rounded">css</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100">
                    <h3 className="text-xs font-bold text-rose-800 mb-2">Missing Keywords (12)</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-white text-xs rounded">vue</span>
                      <span className="px-2 py-1 bg-white text-xs rounded">angular</span>
                      <span className="px-2 py-1 bg-white text-xs rounded">typescript</span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px] rounded-2xl p-4 text-center z-10">
                  <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-2 shadow-2xs">
                    <Lock className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    Keywords Breakdown Locked
                  </p>
                  <p className="text-xs text-gray-500 max-w-xs mt-1 mb-3">
                    Upgrade to Pro to view all {keywordsMissing?.length || 'missing'} keywords and optimized template.
                  </p>
                  <Link
                    to="/pricing"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-xl shadow-md transition-all hover:scale-105"
                  >
                    <Crown className="w-3.5 h-3.5" /> Unlock Keywords →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ATS-Optimized Summary Integrated Panel */}
      {improvedText && (
        <div className="border-t border-gray-200 bg-slate-50/90 p-5 sm:p-6 rounded-b-3xl">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-md bg-gray-100 text-gray-700">
                <FileCode className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                ATS-Optimized Summary
              </span>
            </div>
            {isPremium && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 text-gray-700 hover:text-primary-600 hover:border-primary-300 rounded-lg text-xs font-bold shadow-2xs transition-all active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
          <pre className="bg-white p-3.5 rounded-2xl border border-gray-200 text-xs text-gray-700 whitespace-pre-wrap break-words font-mono leading-relaxed shadow-2xs">
            {isPremium ? improvedText : 'Upgrade to Pro to reveal the full ATS-optimized summary template tailored for your domain.'}
          </pre>
        </div>
      )}
    </motion.div>
  );
};

export const SuggestionsCard = ({ suggestions = [], isPremium = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="relative overflow-hidden rounded-3xl bg-white border border-amber-200/90 shadow-[0_8px_30px_-12px_rgba(245,158,11,0.08)] h-full flex flex-col justify-between"
    >
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-amber-600" />

      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-100">
                <Lightbulb className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Improvement Suggestions</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {suggestions?.length || 0} recommendations to boost your score
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/70 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> AI Insights
            </span>
          </div>

          {/* Suggestions List */}
          <div className="relative">
            {isPremium ? (
              suggestions && suggestions.length > 0 ? (
                <ul className="space-y-3">
                  {suggestions.map((suggestion, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 hover:bg-amber-50/80 transition-colors flex items-start gap-3 text-left"
                    >
                      <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <Wand2 className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs text-gray-800 leading-relaxed font-medium">
                        {suggestion}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">Great Job!</h4>
                  <p className="text-xs text-gray-500 mt-0.5">No critical improvement suggestions needed</p>
                </div>
              )
            ) : (
              /* Free Plan Locked Overlay */
              <div className="relative min-h-[160px] flex flex-col justify-center">
                <div className="filter blur-[4px] select-none opacity-40 space-y-3 pointer-events-none">
                  <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Wand2 className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs text-gray-800 font-medium">Add GitHub profile or portfolio link to showcase repositories.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Wand2 className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs text-gray-800 font-medium">Quantify achievements with measurable metrics and action verbs.</p>
                  </div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px] rounded-2xl p-4 text-center z-10">
                  <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-2 shadow-2xs">
                    <Lock className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    AI Recommendations Locked
                  </p>
                  <p className="text-xs text-gray-500 max-w-xs mt-1 mb-3">
                    Upgrade to view personalized suggestions to optimize your ATS score.
                  </p>
                  <Link
                    to="/pricing"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-xl shadow-md transition-all hover:scale-105"
                  >
                    <Crown className="w-3.5 h-3.5" /> Unlock Suggestions →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Suggestions = ({
  suggestions = [],
  keywordsFound = [],
  keywordsMissing = [],
  improvedText = '',
  isPremium = false,
}) => {
  return (
    <div className="w-full space-y-8">
      <KeywordsCard
        keywordsFound={keywordsFound}
        keywordsMissing={keywordsMissing}
        improvedText={improvedText}
        isPremium={isPremium}
      />
      <SuggestionsCard
        suggestions={suggestions}
        isPremium={isPremium}
      />
    </div>
  );
};

export default Suggestions;
