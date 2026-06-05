import { motion } from 'framer-motion';
import { Lightbulb, Wand2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const Suggestions = ({ suggestions, keywordsFound, keywordsMissing, improvedText }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(improvedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Suggestions */}
      <div className="card">
        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Improvement Suggestions
        </h3>
        <div className="space-y-3">
          {suggestions?.map((suggestion, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg border border-primary-100"
            >
              <Wand2 className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">{suggestion}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Keywords */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Keywords Found ({keywordsFound?.length || 0})
          </h3>
          <div className="flex flex-wrap gap-2">
            {keywordsFound?.slice(0, 15).map((kw, idx) => (
              <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Missing Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {keywordsMissing?.slice(0, 10).map((kw, idx) => (
              <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Improved Template */}
      {improvedText && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">ATS-Optimized Template</h3>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-200 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
            {improvedText}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Suggestions;
