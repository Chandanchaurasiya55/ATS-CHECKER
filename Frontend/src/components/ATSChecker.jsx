import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api.js';
import toast from 'react-hot-toast';
import ScoreDisplay from './ScoreDisplay.jsx';
import Suggestions from './Suggestions.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const ATSChecker = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const PENDING_RESUME_KEY = 'pendingResumeToAnalyze';

  const fileToDataUrl = (selectedFile) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(selectedFile);
  });

  const dataUrlToFile = (dataUrl, name, type) => {
    const [header, base64] = dataUrl.split(',');
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i += 1) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new File([bytes], name, { type: type || header.match(/:(.*?);/)[1] });
  };

  const savePendingResume = async (selectedFile) => {
    const dataUrl = await fileToDataUrl(selectedFile);
    sessionStorage.setItem(
      PENDING_RESUME_KEY,
      JSON.stringify({ name: selectedFile.name, type: selectedFile.type, dataUrl })
    );
  };

  const loadPendingResume = () => {
    const raw = sessionStorage.getItem(PENDING_RESUME_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return dataUrlToFile(parsed.dataUrl, parsed.name, parsed.type);
    } catch {
      return null;
    }
  };

  const clearPendingResume = () => {
    sessionStorage.removeItem(PENDING_RESUME_KEY);
  };

  const uploadResume = async (selectedFile) => {
    const uploadFile = selectedFile || file;
    if (!uploadFile) {
      toast.error('Please select a file first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', uploadFile);

    try {
      const res = await api.post('/analysis/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data.data);
      toast.success('Analysis complete!');
      clearPendingResume();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !result && !loading) {
      const pendingFile = loadPendingResume();
      if (pendingFile) {
        setFile(pendingFile);
        uploadResume(pendingFile);
      }
    }
  }, [isAuthenticated]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Only PDF, DOC, DOCX, and TXT files are allowed');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    setFile(selectedFile);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    if (!isAuthenticated) {
      await savePendingResume(file);
      const redirectPath = `${location.pathname}${location.search}#checker`;
      navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      toast('Login required to continue resume analysis');
      return;
    }

    await uploadResume(file);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 md:p-10 text-center transition-all duration-200 cursor-pointer ${
          dragActive
            ? 'border-primary-500 bg-primary-50/30'
            : 'border-primary-300 bg-white hover:border-primary-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="resume-upload"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        
        <label htmlFor="resume-upload" className="cursor-pointer block">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-1">
              <Upload className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-700">
                {file ? file.name : 'Drop your resume here or click to browse'}
              </p>
              <p className="text-xs text-gray-400 mt-1 font-normal">
                Supports PDF, DOC, DOCX, TXT (Max 5MB)
              </p>
            </div>
          </div>
        </label>

        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center justify-center gap-2 text-xs text-primary-600 bg-primary-50 py-1.5 px-4 rounded-full inline-flex font-semibold"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{(file.size / 1024).toFixed(1)} KB</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setFile(null);
              }}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </motion.div>
        )}
      </div>

      {/* Submit Button */}
      {file && !result && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleSubmit}
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing your resume...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              Analyze Resume
            </>
          )}
        </motion.button>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="section-heading">Analysis Results</h2>
              <button
                onClick={() => { setFile(null); setResult(null); }}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Analyze Another
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <ScoreDisplay
                score={result.atsScore}
                sectionScores={result.sectionScores}
                issues={result.issues}
              />
              <Suggestions
                suggestions={result.suggestions}
                keywordsFound={result.keywordsFound}
                keywordsMissing={result.keywordsMissing}
                improvedText={result.improvedText}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ATSChecker;
