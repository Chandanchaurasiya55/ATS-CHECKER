import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Save, Eye, Download, ChevronDown, ChevronUp, Loader2, Sparkles, User as UserIcon, FileText as FileTextIcon, Zap as ZapIcon, Briefcase as BriefcaseIcon, GraduationCap as GraduationCapIcon, Award as AwardIcon, Code as CodeIcon } from 'lucide-react';
import api from '../utils/api.js';
import toast from 'react-hot-toast';

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [activeSection, setActiveSection] = useState('personal');

  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
    },
    summary: '',
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    projects: [],
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (id) {
      fetchResume();
    }
  }, [id]);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/resumes/${id}`);
      setFormData(res.data.data);
      if (res.data.data.atsScore) {
        setAnalysis({ atsScore: res.data.data.atsScore });
      }
    } catch (error) {
      toast.error('Failed to load resume');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
        achievements: [''],
      }],
    }));
  };

  const updateExperience = (index, field, value) => {
    const updated = [...formData.experience];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, experience: updated }));
  };

  const addAchievement = (expIndex) => {
    const updated = [...formData.experience];
    updated[expIndex].achievements.push('');
    setFormData(prev => ({ ...prev, experience: updated }));
  };

  const updateAchievement = (expIndex, achIndex, value) => {
    const updated = [...formData.experience];
    updated[expIndex].achievements[achIndex] = value;
    setFormData(prev => ({ ...prev, experience: updated }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        institution: '',
        location: '',
        graduationYear: '',
        gpa: '',
      }],
    }));
  };

  const updateEducation = (index, field, value) => {
    const updated = [...formData.education];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, education: updated }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { name: '', issuer: '', date: '' }],
    }));
  };

  const updateCertification = (index, field, value) => {
    const updated = [...formData.certifications];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, certifications: updated }));
  };

  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        name: '',
        description: '',
        technologies: [],
        link: '',
      }],
    }));
  };

  const updateProject = (index, field, value) => {
    const updated = [...formData.projects];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, projects: updated }));
  };

  const removeProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const saveResume = async () => {
    if (!formData.personalInfo.fullName || !formData.personalInfo.email) {
      toast.error('Please fill in your name and email');
      return;
    }

    setSaving(true);
    try {
      let res;
      if (id) {
        res = await api.put(`/resumes/${id}`, formData);
      } else {
        res = await api.post('/resumes', formData);
      }
      
      setAnalysis(res.data.data.analysis);
      toast.success(`Resume saved! ATS Score: ${res.data.data.analysis.atsScore}`);
      
      if (!id && res.data.data.resume?._id) {
        navigate(`/builder/${res.data.data.resume._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const downloadResume = async () => {
    try {
      const res = await api.get(`/resumes/${id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${formData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Resume downloaded!');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  const previewResume = async () => {
    try {
      // Create a blob from the preview HTML and open it in a new window
      const res = await api.get(`/resumes/${id}/preview`);
      const blob = new Blob([res.data], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      toast.error('Preview failed');
    }
  };

  const SectionHeader = ({ title, icon: Icon, section }) => (
    <button
      onClick={() => setActiveSection(activeSection === section ? '' : section)}
      className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary-600" />
        </div>
        <span className="font-semibold text-gray-800">{title}</span>
      </div>
      {activeSection === section ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Score */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
          <p className="text-gray-500">Create an ATS-optimized resume with minimum 91+ score</p>
        </div>
        
        {analysis && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl ${
              analysis.atsScore >= 91 ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'
            }`}
          >
            <Sparkles className={`w-6 h-6 ${analysis.atsScore >= 91 ? 'text-green-600' : 'text-yellow-600'}`} />
            <div>
              <div className={`text-2xl font-bold ${analysis.atsScore >= 91 ? 'text-green-700' : 'text-yellow-700'}`}>
                {analysis.atsScore}
              </div>
              <div className="text-xs font-medium text-gray-600">ATS Score</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button onClick={saveResume} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : id ? 'Update Resume' : 'Save Resume'}
        </button>
        
        {id && (
          <>
            <button onClick={previewResume} className="btn-secondary flex items-center gap-2">
              <Eye className="w-4 h-4" /> Preview
            </button>
            <button onClick={downloadResume} className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" /> Download
            </button>
          </>
        )}
      </div>

      {/* Form Sections */}
      <div className="space-y-4">
        {/* Personal Info */}
        <SectionHeader title="Personal Information" icon={UserIcon} section="personal" />
        <AnimatePresence>
          {activeSection === 'personal' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="card grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.personalInfo.fullName}
                    onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    className="input-field"
                    value={formData.personalInfo.email}
                    onChange={(e) => handlePersonalChange('email', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    className="input-field"
                    value={formData.personalInfo.phone}
                    onChange={(e) => handlePersonalChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.personalInfo.location}
                    onChange={(e) => handlePersonalChange('location', e.target.value)}
                    placeholder="New York, NY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <input
                    type="url"
                    className="input-field"
                    value={formData.personalInfo.linkedin}
                    onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
                  <input
                    type="url"
                    className="input-field"
                    value={formData.personalInfo.portfolio}
                    onChange={(e) => handlePersonalChange('portfolio', e.target.value)}
                    placeholder="https://johndoe.com"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary */}
        <SectionHeader title="Professional Summary" icon={FileTextIcon} section="summary" />
        <AnimatePresence>
          {activeSection === 'summary' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="card">
                <textarea
                  className="input-field min-h-[120px]"
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Write a compelling 2-3 sentence summary highlighting your key strengths and career goals..."
                />
                <p className="text-xs text-gray-500 mt-2">{formData.summary.length} characters (aim for 150-300)</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skills */}
        <SectionHeader title="Skills" icon={ZapIcon} section="skills" />
        <AnimatePresence>
          {activeSection === 'skills' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="card">
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    className="input-field"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill (e.g., React, Python, Project Management)"
                  />
                  <button onClick={addSkill} className="btn-primary px-4">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="hover:text-primary-900">
                        <Minus className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">{formData.skills.length} skills added (aim for 8-15)</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Experience */}
        <SectionHeader title="Experience" icon={BriefcaseIcon} section="experience" />
        <AnimatePresence>
          {activeSection === 'experience' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="space-y-4">
                {formData.experience.map((exp, idx) => (
                  <div key={idx} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold text-gray-800">Experience #{idx + 1}</h4>
                      <button onClick={() => removeExperience(idx)} className="text-red-500 hover:text-red-700">
                        <Minus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input className="input-field" placeholder="Job Title" value={exp.title} onChange={(e) => updateExperience(idx, 'title', e.target.value)} />
                      <input className="input-field" placeholder="Company" value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} />
                      <input className="input-field" placeholder="Location" value={exp.location} onChange={(e) => updateExperience(idx, 'location', e.target.value)} />
                      <div className="grid grid-cols-2 gap-2">
                        <input className="input-field" type="month" value={exp.startDate} onChange={(e) => updateExperience(idx, 'startDate', e.target.value)} />
                        <input className="input-field" type="month" value={exp.endDate} onChange={(e) => updateExperience(idx, 'endDate', e.target.value)} placeholder="End Date" />
                      </div>
                    </div>
                    <textarea
                      className="input-field mt-4 min-h-[100px]"
                      placeholder="Job description with quantifiable achievements..."
                      value={exp.description}
                      onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                    />
                    <div className="mt-4 space-y-2">
                      <label className="text-sm font-medium text-gray-700">Key Achievements</label>
                      {exp.achievements.map((ach, achIdx) => (
                        <input
                          key={achIdx}
                          className="input-field"
                          placeholder={`Achievement ${achIdx + 1} (e.g., Increased sales by 25%)`}
                          value={ach}
                          onChange={(e) => updateAchievement(idx, achIdx, e.target.value)}
                        />
                      ))}
                      <button onClick={() => addAchievement(idx)} className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Add Achievement
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" /> Add Experience
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Education */}
        <SectionHeader title="Education" icon={GraduationCapIcon} section="education" />
        <AnimatePresence>
          {activeSection === 'education' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="space-y-4">
                {formData.education.map((edu, idx) => (
                  <div key={idx} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold text-gray-800">Education #{idx + 1}</h4>
                      <button onClick={() => removeEducation(idx)} className="text-red-500 hover:text-red-700">
                        <Minus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input className="input-field" placeholder="Degree (e.g., B.S. Computer Science)" value={edu.degree} onChange={(e) => updateEducation(idx, 'degree', e.target.value)} />
                      <input className="input-field" placeholder="Institution" value={edu.institution} onChange={(e) => updateEducation(idx, 'institution', e.target.value)} />
                      <input className="input-field" placeholder="Location" value={edu.location} onChange={(e) => updateEducation(idx, 'location', e.target.value)} />
                      <input className="input-field" placeholder="Graduation Year" value={edu.graduationYear} onChange={(e) => updateEducation(idx, 'graduationYear', e.target.value)} />
                      <input className="input-field" placeholder="GPA (optional)" value={edu.gpa} onChange={(e) => updateEducation(idx, 'gpa', e.target.value)} />
                    </div>
                  </div>
                ))}
                <button onClick={addEducation} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" /> Add Education
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Certifications */}
        <SectionHeader title="Certifications" icon={AwardIcon} section="certifications" />
        <AnimatePresence>
          {activeSection === 'certifications' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="space-y-4">
                {formData.certifications.map((cert, idx) => (
                  <div key={idx} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold text-gray-800">Certification #{idx + 1}</h4>
                      <button onClick={() => removeCertification(idx)} className="text-red-500 hover:text-red-700">
                        <Minus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <input className="input-field" placeholder="Certification Name" value={cert.name} onChange={(e) => updateCertification(idx, 'name', e.target.value)} />
                      <input className="input-field" placeholder="Issuing Organization" value={cert.issuer} onChange={(e) => updateCertification(idx, 'issuer', e.target.value)} />
                      <input className="input-field" type="month" value={cert.date} onChange={(e) => updateCertification(idx, 'date', e.target.value)} />
                    </div>
                  </div>
                ))}
                <button onClick={addCertification} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" /> Add Certification
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Projects */}
        <SectionHeader title="Projects" icon={CodeIcon} section="projects" />
        <AnimatePresence>
          {activeSection === 'projects' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="space-y-4">
                {formData.projects.map((proj, idx) => (
                  <div key={idx} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold text-gray-800">Project #{idx + 1}</h4>
                      <button onClick={() => removeProject(idx)} className="text-red-500 hover:text-red-700">
                        <Minus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input className="input-field" placeholder="Project Name" value={proj.name} onChange={(e) => updateProject(idx, 'name', e.target.value)} />
                      <input className="input-field" placeholder="Project Link" value={proj.link} onChange={(e) => updateProject(idx, 'link', e.target.value)} />
                    </div>
                    <textarea
                      className="input-field mt-4 min-h-[80px]"
                      placeholder="Project description..."
                      value={proj.description}
                      onChange={(e) => updateProject(idx, 'description', e.target.value)}
                    />
                    <input
                      className="input-field mt-4"
                      placeholder="Technologies used (comma separated)"
                      value={proj.technologies?.join(', ')}
                      onChange={(e) => updateProject(idx, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                    />
                  </div>
                ))}
                <button onClick={addProject} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" /> Add Project
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-green-50 border-green-200"
        >
          <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            ATS Analysis Complete
          </h3>
          <p className="text-green-700 mb-4">
            Your resume has an ATS score of <strong>{analysis.atsScore}</strong>. 
            {analysis.atsScore >= 91 
              ? ' This is excellent and should pass most ATS filters!' 
              : ' We recommend adding more details to improve your score.'}
          </p>
          {analysis.suggestions?.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-green-800">Suggestions:</p>
              {analysis.suggestions.map((s, i) => (
                <p key={i} className="text-sm text-green-700 flex items-start gap-2">
                  <span>•</span> {s}
                </p>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ResumeBuilder;
