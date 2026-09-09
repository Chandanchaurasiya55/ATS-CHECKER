import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Minus, Save, Eye, Download, ChevronDown, ChevronUp,
  Loader2, Sparkles, CheckCircle, AlertCircle, Info,
  User as UserIcon, FileText as FileTextIcon, Zap as ZapIcon,
  Briefcase as BriefcaseIcon, GraduationCap as GraduationCapIcon,
  Award as AwardIcon, Code as CodeIcon, Palette, Lock
} from 'lucide-react';
import api from '../utils/api.js';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

// ── 5 Template definitions (for UI display) ───────────────────────────────
const TEMPLATES = [
  { id: 'classic',   name: 'Classic',   desc: 'Traditional, universally accepted',   color: '#1e3a5f', bg: '#dbeafe' },
  { id: 'modern',    name: 'Modern',    desc: 'Bold sidebar, stands out',             color: '#0f766e', bg: '#ccfbf1' },
  { id: 'minimal',   name: 'Minimal',   desc: 'Ultra-clean, senior professionals',    color: '#1f2937', bg: '#f1f5f9' },
  { id: 'executive', name: 'Executive', desc: 'Two-column, leadership roles',         color: '#7c3aed', bg: '#ede9fe' },
  { id: 'creative',  name: 'Creative',  desc: 'Vibrant, design & marketing roles',    color: '#dc2626', bg: '#fee2e2' },
];


const ALLOWED_TEMPLATES = {
  free: ['classic'],
  fresher: ['classic'],
  experience: ['classic', 'modern', 'minimal'],
  executive: ['classic', 'modern', 'minimal', 'executive', 'creative']
};

// ── Main component ────────────────────────────────────────────────────────
const ResumeBuilder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const [activeResumeId, setActiveResumeId] = useState(
    paramId || searchParams.get('id') || location.state?.resumeId || null
  );
  const id = activeResumeId;
  const { user, isSubscriptionExpired, openExpiredModal } = useAuth();

  const userPlan = isSubscriptionExpired ? 'free' : (user?.plan || 'free');
  const isTemplateAllowed = (templateId) => {
    if (user?.role === 'admin') return true;
    const allowed = ALLOWED_TEMPLATES[userPlan] || ['classic'];
    return allowed.includes(templateId);
  };

  const handleTemplateSelect = (templateId) => {
    if (!isTemplateAllowed(templateId)) {
      if (isSubscriptionExpired) {
        openExpiredModal();
        return;
      }
      toast.error(
        <div>
          <span className="font-semibold block">Template Locked</span>
          <span>Please upgrade your plan to unlock this template.</span>
        </div>,
        { id: 'template-locked-toast' }
      );
      return;
    }
    setTemplate(templateId);
  };

  const [loading, setLoading]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [activeSection, setSection] = useState('personal');
  const [selectedTemplate, setTemplate] = useState('classic');
  const [showTemplates, setShowTemplates] = useState(true);
  const [skillInput, setSkillInput] = useState('');

  const [formData, setFormData] = useState({
    personalInfo: { fullName:'', email:'', phone:'', location:'', linkedin:'', portfolio:'' },
    summary: '',
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    projects: [],
    template: 'classic',
  });

  useEffect(() => { if (id) fetchResume(); }, [id]);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/resumes/${id}`);
      const data = res.data.data;
      if (data.projects) {
        data.projects = data.projects.map(p => ({
          ...p,
          technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : (p.technologies || '')
        }));
      }
      setFormData(data);
      if (data.template) {
        setTemplate(isTemplateAllowed(data.template) ? data.template : 'classic');
      }
    } catch { toast.error('Failed to load resume'); }
    finally { setLoading(false); }
  };

  const handlePersonalChange = (field, value) =>
    setFormData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !formData.skills.includes(s)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, s] }));
      setSkillInput('');
    }
  };

  const addExperience = () => setFormData(prev => ({
    ...prev, experience: [...prev.experience,
      { title:'', company:'', location:'', startDate:'', endDate:'', description:'', achievements:[''] }]
  }));

  const updateExperience = (i, f, v) => {
    const u = [...formData.experience]; u[i] = {...u[i],[f]:v};
    setFormData(prev => ({...prev, experience: u}));
  };

  const addAchievement = (i) => {
    const u = [...formData.experience]; u[i].achievements.push('');
    setFormData(prev => ({...prev, experience: u}));
  };

  const updateAchievement = (ei, ai, v) => {
    const u = [...formData.experience]; u[ei].achievements[ai] = v;
    setFormData(prev => ({...prev, experience: u}));
  };

  const addEducation = () => setFormData(prev => ({
    ...prev, education: [...prev.education,
      { degree:'', institution:'', location:'', graduationYear:'', gpa:'' }]
  }));

  const updateEducation = (i, f, v) => {
    const u = [...formData.education]; u[i] = {...u[i],[f]:v};
    setFormData(prev => ({...prev, education: u}));
  };

  const addCertification = () => setFormData(prev => ({
    ...prev, certifications: [...prev.certifications, { name:'', issuer:'', date:'' }]
  }));

  const updateCertification = (i, f, v) => {
    const u = [...formData.certifications]; u[i] = {...u[i],[f]:v};
    setFormData(prev => ({...prev, certifications: u}));
  };

  const addProject = () => setFormData(prev => ({
    ...prev, projects: [...prev.projects,
      { name:'', description:'', technologies:'', link:'' }]
  }));

  const updateProject = (i, f, v) => {
    const u = [...formData.projects]; u[i] = {...u[i],[f]:v};
    setFormData(prev => ({...prev, projects: u}));
  };

  const saveResume = async () => {
    if (!formData.personalInfo.fullName || !formData.personalInfo.email) {
      toast.error('Name and email are required'); return;
    }
    setSaving(true);
    try {
      const payload = {
        ...formData,
        template: selectedTemplate,
        projects: (formData.projects || []).map(p => ({
          ...p,
          technologies: typeof p.technologies === 'string'
            ? p.technologies.split(',').map(t => t.trim()).filter(Boolean)
            : (Array.isArray(p.technologies) ? p.technologies : [])
        }))
      };
      const res = id
        ? await api.put(`/resumes/${id}`, payload)
        : await api.post('/resumes', payload);
      toast.success('Resume saved successfully!');
      const savedId = res.data.data.resume?._id;
      if (!activeResumeId && savedId) {
        setActiveResumeId(savedId);
      }
    } catch (e) { toast.error(e.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const downloadResume = async () => {
    try {
      const res = await api.get(`/resumes/${id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', `${formData.personalInfo.fullName.replace(/\s+/g,'_')}_Resume.pdf`);
      document.body.appendChild(a); a.click(); a.remove();
      toast.success('Downloaded!');
    } catch { toast.error('Download failed'); }
  };

  const previewResume = async () => {
    try {
      const res = await api.get(`/resumes/${id}/preview?template=${selectedTemplate}`);
      const blob = new Blob([res.data], { type: 'text/html' });
      window.open(URL.createObjectURL(blob), '_blank');
    } catch { toast.error('Preview failed'); }
  };

  const SectionHeader = ({ title, icon: Icon, section }) => (
    <button
      onClick={() => setSection(activeSection === section ? '' : section)}
      className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary-600" />
        </div>
        <span className="font-semibold text-gray-800">{title}</span>
      </div>
      {activeSection === section
        ? <ChevronUp className="w-5 h-5 text-gray-400"/>
        : <ChevronDown className="w-5 h-5 text-gray-400"/>}
    </button>
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600"/>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
          <p className="text-gray-500">Fill your details, pick a template, download your resume</p>
        </div>
      </div>


      {/* ── Template Selector ── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-violet-600"/>
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-800">Choose Template</div>
              <div className="text-sm text-gray-500">
                Selected: <span className="text-violet-600 font-medium">
                  {TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                </span>
              </div>
            </div>
          </div>
          {showTemplates ? <ChevronUp className="w-5 h-5 text-gray-400"/> : <ChevronDown className="w-5 h-5 text-gray-400"/>}
        </button>

        <AnimatePresence>
          {showTemplates && (
            <motion.div
              initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}}
              exit={{height:0,opacity:0}} className="overflow-hidden"
            >
              <div className="p-4 pt-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {TEMPLATES.map(t => {
                  const allowed = isTemplateAllowed(t.id);
                  const isSelected = selectedTemplate === t.id;
                  
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleTemplateSelect(t.id)}
                      className={`relative p-3 rounded-xl border-2 text-left transition-all ${
                        !allowed
                          ? 'border-gray-100 bg-gray-50/50 opacity-60 cursor-not-allowed'
                          : isSelected
                            ? 'border-violet-500 bg-white shadow-md'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      {/* Mini template preview */}
                      <div className={`w-full h-20 rounded-lg mb-2 overflow-hidden ${!allowed ? 'filter grayscale opacity-75' : ''}`}
                        style={{background: t.bg}}>
                        <div className="h-6 w-full flex items-center justify-center"
                          style={{background: t.color}}>
                          <div className="h-1.5 w-3/4 bg-white/40 rounded"/>
                        </div>
                        <div className="p-1.5 space-y-1">
                          {[70,90,55,80].map((w,i) => (
                            <div key={i} className="h-1 rounded" style={{width:`${w}%`, background: t.color, opacity: 0.25 + i*0.1}}/>
                          ))}
                        </div>
                      </div>
                      <div className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
                        {t.name}
                        {!allowed && <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                      </div>
                      <div className="text-xs text-gray-500 leading-snug mt-0.5">{t.desc}</div>
                      
                      {!allowed && (
                        <div className="absolute top-2 right-2 bg-gray-200/80 backdrop-blur-sm text-[8px] font-bold text-gray-700 px-1.5 py-0.5 rounded uppercase">
                          {t.id === 'modern' || t.id === 'minimal' ? 'Experience' : 'Executive'}
                        </div>
                      )}
                      
                      {allowed && isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white"/>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Form Sections ── */}
      <div className="space-y-4">

        {/* Personal Info */}
        <SectionHeader title="Personal Information" icon={UserIcon} section="personal"/>
        <AnimatePresence>
          {activeSection === 'personal' && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
              <div className="card grid md:grid-cols-2 gap-4">
                {[
                  {label:'Full Name *', field:'fullName', type:'text',    ph:'John Doe'},
                  {label:'Email *',     field:'email',    type:'email',   ph:'john@example.com'},
                  {label:'Phone',       field:'phone',    type:'tel',     ph:'+91 98765 43210'},
                  {label:'Location',    field:'location', type:'text',    ph:'New Delhi, India'},
                  {label:'LinkedIn',    field:'linkedin', type:'url',     ph:'https://linkedin.com/in/johndoe'},
                  {label:'Portfolio / GitHub', field:'portfolio', type:'url', ph:'https://github.com/johndoe'},
                ].map(({label,field,type,ph}) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input type={type} className="input-field" placeholder={ph}
                      value={formData.personalInfo[field]}
                      onChange={e => handlePersonalChange(field, e.target.value)}/>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary */}
        <SectionHeader title="Professional Summary" icon={FileTextIcon} section="summary"/>
        <AnimatePresence>
          {activeSection === 'summary' && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
              <div className="card">
                <textarea className="input-field min-h-[120px]"
                  value={formData.summary}
                  onChange={e => setFormData(prev => ({...prev, summary: e.target.value}))}
                  placeholder="Experienced software engineer with 3+ years building scalable web applications using React and Node.js. Passionate about clean code and delivering high-quality products..."/>
                <div className="flex justify-between mt-2">
                  <p className="text-xs text-gray-500">{formData.summary.length} chars (aim 150–300)</p>
                  {formData.summary.length >= 150 && <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Good length</span>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skills */}
        <SectionHeader title={`Skills (${formData.skills.length})`} icon={ZapIcon} section="skills"/>
        <AnimatePresence>
          {activeSection === 'skills' && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
              <div className="card">
                <div className="flex gap-2 mb-4">
                  <input type="text" className="input-field" value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Type a skill and press Enter (e.g. React, Python, SEO)"/>
                  <button onClick={addSkill} className="btn-primary px-4"><Plus className="w-5 h-5"/></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((s,i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                      {s}
                      <button onClick={() => setFormData(prev => ({...prev, skills: prev.skills.filter((_,j)=>j!==i)}))} className="hover:text-red-500">
                        <Minus className="w-3 h-3"/>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className={`h-1.5 flex-1 rounded-full bg-gray-200 overflow-hidden`}>
                    <div className={`h-full rounded-full transition-all ${
                      formData.skills.length >= 10 ? 'bg-green-500' : formData.skills.length >= 5 ? 'bg-yellow-400' : 'bg-red-400'
                    }`} style={{width: `${Math.min((formData.skills.length/15)*100,100)}%`}}/>
                  </div>
                  <span className="text-xs text-gray-500">{formData.skills.length}/15</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Aim for 8–15 skills. Include tools, languages, and soft skills.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Experience */}
        <SectionHeader title={`Experience (${formData.experience.length})`} icon={BriefcaseIcon} section="experience"/>
        <AnimatePresence>
          {activeSection === 'experience' && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
              <div className="space-y-4">
                {formData.experience.map((exp,i) => (
                  <div key={i} className="card">
                    <div className="flex justify-between mb-4">
                      <h4 className="font-semibold text-gray-800">Experience #{i+1}</h4>
                      <button onClick={() => setFormData(prev=>({...prev,experience:prev.experience.filter((_,j)=>j!==i)}))} className="text-red-500 hover:text-red-700">
                        <Minus className="w-5 h-5"/>
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input className="input-field" placeholder="Job Title" value={exp.title} onChange={e=>updateExperience(i,'title',e.target.value)}/>
                      <input className="input-field" placeholder="Company Name" value={exp.company} onChange={e=>updateExperience(i,'company',e.target.value)}/>
                      <input className="input-field" placeholder="Location (e.g. Bangalore, India)" value={exp.location} onChange={e=>updateExperience(i,'location',e.target.value)}/>
                      <div className="grid grid-cols-2 gap-2">
                        <input className="input-field" type="month" value={exp.startDate} onChange={e=>updateExperience(i,'startDate',e.target.value)}/>
                        <input className="input-field" type="month" value={exp.endDate} onChange={e=>updateExperience(i,'endDate',e.target.value)} placeholder="End Date"/>
                      </div>
                    </div>
                    <textarea className="input-field mt-4 min-h-[90px]"
                      placeholder="Describe your role and responsibilities. Use action verbs: Built, Led, Improved, Reduced..."
                      value={exp.description} onChange={e=>updateExperience(i,'description',e.target.value)}/>
                    <div className="mt-4 space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-gray-400"/> Key Achievements (quantify where possible)
                      </label>
                      {exp.achievements.map((ach,ai) => (
                        <input key={ai} className="input-field"
                          placeholder={`e.g. Increased sales by 25%, reduced load time by 40%`}
                          value={ach} onChange={e=>updateAchievement(i,ai,e.target.value)}/>
                      ))}
                      <button onClick={()=>addAchievement(i)} className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                        <Plus className="w-4 h-4"/> Add Achievement
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5"/> Add Experience
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Education */}
        <SectionHeader title="Education" icon={GraduationCapIcon} section="education"/>
        <AnimatePresence>
          {activeSection === 'education' && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
              <div className="space-y-4">
                {formData.education.map((edu,i) => (
                  <div key={i} className="card">
                    <div className="flex justify-between mb-4">
                      <h4 className="font-semibold text-gray-800">Education #{i+1}</h4>
                      <button onClick={()=>setFormData(prev=>({...prev,education:prev.education.filter((_,j)=>j!==i)}))} className="text-red-500"><Minus className="w-5 h-5"/></button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input className="input-field" placeholder="Degree (e.g. B.Tech Computer Science)" value={edu.degree} onChange={e=>updateEducation(i,'degree',e.target.value)}/>
                      <input className="input-field" placeholder="Institution Name" value={edu.institution} onChange={e=>updateEducation(i,'institution',e.target.value)}/>
                      <input className="input-field" placeholder="Location" value={edu.location} onChange={e=>updateEducation(i,'location',e.target.value)}/>
                      <input className="input-field" placeholder="Graduation Year (e.g. 2024)" value={edu.graduationYear} onChange={e=>updateEducation(i,'graduationYear',e.target.value)}/>
                      <input className="input-field" placeholder="CGPA / GPA (optional)" value={edu.gpa} onChange={e=>updateEducation(i,'gpa',e.target.value)}/>
                    </div>
                  </div>
                ))}
                <button onClick={addEducation} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5"/> Add Education
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Certifications */}
        <SectionHeader title="Certifications" icon={AwardIcon} section="certifications"/>
        <AnimatePresence>
          {activeSection === 'certifications' && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
              <div className="space-y-4">
                {formData.certifications.map((cert,i) => (
                  <div key={i} className="card">
                    <div className="flex justify-between mb-4">
                      <h4 className="font-semibold">Certification #{i+1}</h4>
                      <button onClick={()=>setFormData(prev=>({...prev,certifications:prev.certifications.filter((_,j)=>j!==i)}))} className="text-red-500"><Minus className="w-5 h-5"/></button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <input className="input-field" placeholder="Certification Name" value={cert.name} onChange={e=>updateCertification(i,'name',e.target.value)}/>
                      <input className="input-field" placeholder="Issuing Organization" value={cert.issuer} onChange={e=>updateCertification(i,'issuer',e.target.value)}/>
                      <input className="input-field" type="month" value={cert.date} onChange={e=>updateCertification(i,'date',e.target.value)}/>
                    </div>
                  </div>
                ))}
                <button onClick={addCertification} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5"/> Add Certification
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Projects */}
        <SectionHeader title="Projects" icon={CodeIcon} section="projects"/>
        <AnimatePresence>
          {activeSection === 'projects' && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
              <div className="space-y-4">
                {formData.projects.map((proj,i) => (
                  <div key={i} className="card">
                    <div className="flex justify-between mb-4">
                      <h4 className="font-semibold">Project #{i+1}</h4>
                      <button onClick={()=>setFormData(prev=>({...prev,projects:prev.projects.filter((_,j)=>j!==i)}))} className="text-red-500"><Minus className="w-5 h-5"/></button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input className="input-field" placeholder="Project Name" value={proj.name} onChange={e=>updateProject(i,'name',e.target.value)}/>
                      <input className="input-field" placeholder="Live URL / GitHub Link" value={proj.link} onChange={e=>updateProject(i,'link',e.target.value)}/>
                    </div>
                    <textarea className="input-field mt-4 min-h-[80px]"
                      placeholder="Describe what the project does and your contribution..."
                      value={proj.description} onChange={e=>updateProject(i,'description',e.target.value)}/>
                    <input className="input-field mt-4"
                      placeholder="Technologies used (comma separated): React, Node.js, MongoDB"
                      value={typeof proj.technologies === 'string' ? proj.technologies : (proj.technologies?.join(', ') || '')}
                      onChange={e => updateProject(i, 'technologies', e.target.value)}/>
                  </div>
                ))}
                <button onClick={addProject} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5"/> Add Project
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom Action Bar (Moved to the bottom per user request) ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">
            {id ? 'Resume Saved & Ready' : 'Done filling in your details?'}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {id
              ? 'Click Update Resume anytime you make edits, or preview and download the PDF.'
              : 'Click Save Resume to generate your ATS-compliant resume.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          {id && (
            <>
              <button
                type="button"
                onClick={previewResume}
                className="btn-secondary flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold w-full sm:w-auto"
              >
                <Eye className="w-4 h-4 text-gray-600" /> Preview
              </button>
              <button
                type="button"
                onClick={downloadResume}
                className="btn-secondary flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold w-full sm:w-auto"
              >
                <Download className="w-4 h-4 text-gray-600" /> Download PDF
              </button>
            </>
          )}

          <button
            type="button"
            onClick={saveResume}
            disabled={saving}
            className="btn-primary flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary-600/20 disabled:opacity-50 w-full sm:w-auto hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : id ? 'Update Resume' : 'Save Resume'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;