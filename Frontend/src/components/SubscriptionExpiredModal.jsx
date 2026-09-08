import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';

const SubscriptionExpiredModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToPricing = () => {
    onClose();
    navigate('/pricing');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
        >
          {/* Top banner styling */}
          <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-primary-600 h-3 w-full" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8 sm:p-10 text-center">
            {/* Warning Icon with badge */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-3xl bg-amber-50 border-2 border-amber-100 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/10">
                <AlertTriangle className="w-10 h-10 stroke-[2.2]" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white text-xs font-bold">
                !
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-3">
              Your subscription has been expired
            </h2>

            {/* Subtext */}
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
              Aapka <span className="font-semibold text-gray-800">1-saal ka free college premium access</span> complete ho chuka hai. 
              Pro templates aur advanced ATS features continue rakhne ke liye kripya naya subscription plan chunein.
            </p>

            {/* Feature list preview */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left border border-gray-100/80">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                What's included in Premium:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>All 5 Resume Templates</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>AI Real-time Feedback</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Full ATS Score Checks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>No ATSPro Watermark</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleGoToPricing}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-primary-600/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group"
              >
                <span>View Subscription Plans</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto py-3.5 px-6 rounded-2xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-semibold text-sm transition-all"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SubscriptionExpiredModal;
