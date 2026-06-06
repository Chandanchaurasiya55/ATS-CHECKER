// utils/atsAnalyzer.js
// ─── Dynamic ATS Analyzer — No hardcoded scores ───────────────────────────

const DOMAIN_BANKS = {
  software: {
    label: 'Software / Tech',
    keywords: [
      'react','vue','angular','javascript','typescript','html','css','sass',
      'tailwind','bootstrap','redux','nextjs','webpack','vite','node','express',
      'django','flask','spring','fastapi','rest','graphql','api','microservices',
      'jwt','mongodb','postgresql','mysql','redis','firebase','docker','kubernetes',
      'aws','azure','gcp','ci/cd','jenkins','github actions','terraform','linux',
      'nginx','git','github','jest','testing','debugging','agile','scrum',
      'python','java','c++','golang','ruby','php','swift','kotlin','rust'
    ]
  },
  marketing: {
    label: 'Marketing / Growth',
    keywords: [
      'seo','sem','ppc','google ads','facebook ads','meta ads','instagram',
      'content marketing','email marketing','social media','brand strategy',
      'market research','campaign','analytics','google analytics','hubspot',
      'mailchimp','crm','lead generation','conversion rate','roi','kpi',
      'copywriting','content creation','influencer','affiliate marketing',
      'digital marketing','growth hacking','a/b testing','funnel','paid media',
      'organic','backlinks','keyword research','youtube','tiktok','linkedin ads',
      'product marketing','go to market','positioning','competitive analysis'
    ]
  },
  finance: {
    label: 'Finance / Accounting',
    keywords: [
      'financial analysis','budgeting','forecasting','accounting','auditing',
      'taxation','gst','tds','balance sheet','p&l','income statement',
      'cash flow','excel','financial modeling','valuation','dcf','equity',
      'investment','portfolio','risk management','compliance','ifrs','gaap',
      'quickbooks','tally','sap','erp','reconciliation','accounts payable',
      'accounts receivable','payroll','cost analysis','variance analysis',
      'banking','credit','insurance','mutual funds','derivatives','cfa','ca'
    ]
  },
  hr: {
    label: 'Human Resources',
    keywords: [
      'recruitment','talent acquisition','sourcing','onboarding','offboarding',
      'employee relations','performance management','appraisal','kra','kpi',
      'compensation','benefits','payroll','hris','workday','bamboohr',
      'learning development','training','succession planning','hr policies',
      'compliance','labor law','grievance','engagement','retention',
      'workforce planning','job description','interview','background verification',
      'culture','diversity','inclusion','attrition','headcount'
    ]
  },
  design: {
    label: 'Design / UX',
    keywords: [
      'figma','sketch','adobe xd','photoshop','illustrator','indesign',
      'after effects','premiere pro','ui design','ux design','user research',
      'wireframe','prototype','mockup','usability testing','design system',
      'typography','color theory','branding','logo','visual design',
      'interaction design','user flow','information architecture','accessibility',
      'responsive design','motion design','zeplin','invision','canva',
      'design thinking','persona','user journey','heuristic evaluation'
    ]
  },
  sales: {
    label: 'Sales / Business Development',
    keywords: [
      'sales','business development','b2b','b2c','crm','salesforce','hubspot',
      'lead generation','cold calling','pipeline','revenue','target','quota',
      'negotiation','client acquisition','account management','upselling',
      'cross selling','proposal','rfp','demos','presentations','closing',
      'territory','market expansion','partnerships','stakeholder','networking',
      'forecasting','deal closure','saas sales','enterprise sales'
    ]
  },
  data: {
    label: 'Data Science / Analytics',
    keywords: [
      'python','r','sql','machine learning','deep learning','nlp','computer vision',
      'pandas','numpy','scikit-learn','tensorflow','pytorch','keras','tableau',
      'power bi','statistics','regression','classification','clustering',
      'data visualization','data cleaning','feature engineering','model training',
      'neural network','random forest','xgboost','a/b testing','hypothesis testing',
      'bigquery','spark','hadoop','airflow','mlops','data pipeline','etl'
    ]
  },
  operations: {
    label: 'Operations / Supply Chain',
    keywords: [
      'supply chain','logistics','inventory','procurement','vendor management',
      'warehouse','erp','sap','oracle','lean','six sigma','process improvement',
      'quality assurance','iso','compliance','operations management','forecasting',
      'demand planning','cost reduction','sop','kpi','fleet management',
      'manufacturing','production planning','capacity planning','kaizen'
    ]
  },
  healthcare: {
    label: 'Healthcare / Medical',
    keywords: [
      'patient care','clinical','diagnosis','treatment','nursing','pharmacy',
      'medical records','emr','ehr','hipaa','icd','billing','coding',
      'radiology','pathology','surgery','telemedicine','health informatics',
      'clinical trials','pharmacovigilance','hospital','healthcare management',
      'public health','epidemiology','mbbs','md','bds','physiotherapy'
    ]
  },
  legal: {
    label: 'Legal',
    keywords: [
      'litigation','contract','legal research','drafting','compliance','regulatory',
      'intellectual property','corporate law','criminal law','civil law','arbitration',
      'mediation','due diligence','mergers','acquisitions','patents','trademarks',
      'copyright','gdpr','data protection','employment law','tax law',
      'court','judgment','brief','pleading','legal writing'
    ]
  }
};

function buildTextFromData(data) {
  const parts = [];
  if (data.personalInfo) {
    const p = data.personalInfo;
    if (p.fullName)  parts.push(p.fullName);
    if (p.linkedin)  parts.push('linkedin');
    if (p.portfolio) parts.push('github portfolio');
    if (p.email)     parts.push(p.email);
    if (p.phone)     parts.push(p.phone);
    if (p.location)  parts.push(p.location);
  }
  if (data.summary)       parts.push(data.summary);
  if (data.skills?.length) parts.push(data.skills.join(' '));
  data.experience?.forEach(exp => {
    if (exp.title)       parts.push(exp.title);
    if (exp.company)     parts.push(exp.company);
    if (exp.description) parts.push(exp.description);
    exp.achievements?.forEach(a => parts.push(a));
  });
  data.education?.forEach(edu => {
    if (edu.degree)      parts.push(edu.degree);
    if (edu.institution) parts.push(edu.institution);
    if (edu.gpa)         parts.push(`gpa ${edu.gpa}`);
  });
  data.certifications?.forEach(cert => {
    if (cert.name)   parts.push(cert.name);
    if (cert.issuer) parts.push(cert.issuer);
  });
  data.projects?.forEach(proj => {
    if (proj.name)        parts.push(proj.name);
    if (proj.description) parts.push(proj.description);
    proj.technologies?.forEach(t => parts.push(t));
  });
  return parts.join(' ');
}

function detectDomain(data) {
  const text = buildTextFromData(data).toLowerCase();
  const scores = {};
  Object.entries(DOMAIN_BANKS).forEach(([domain, { keywords }]) => {
    scores[domain] = keywords.filter(kw => text.includes(kw)).length;
  });
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top = sorted[0];
  return {
    detectedDomain: top[1] > 0 ? top[0] : 'software',
    domainLabel: DOMAIN_BANKS[top[0]]?.label || 'Software / Tech'
  };
}

function scoreKeywords(data, domain) {
  const text = buildTextFromData(data).toLowerCase();
  const { keywords } = DOMAIN_BANKS[domain];
  const found   = keywords.filter(kw => text.includes(kw));
  const missing = keywords.filter(kw => !text.includes(kw)).slice(0, 10);
  const skillText = (data.skills || []).join(' ').toLowerCase();
  const skillBonus = keywords.filter(kw => skillText.includes(kw)).length;
  const rawPct = ((found.length + Math.min(skillBonus, 5)) / keywords.length) * 100;
  let keywordScore;
  if (rawPct >= 50)      keywordScore = Math.round(82 + (rawPct - 50) * 0.36);
  else if (rawPct >= 30) keywordScore = Math.round(62 + (rawPct - 30) * 1.0);
  else if (rawPct >= 15) keywordScore = Math.round(40 + (rawPct - 15) * 1.47);
  else                   keywordScore = Math.round(rawPct * 2.67);
  return { keywordScore: Math.min(keywordScore, 100), keywordsFound: found, keywordsMissing: missing };
}

function scoreSections(data) {
  let score = 0;
  const sectionsFound = [], sectionsMissing = [], criticalMissing = [];
  const checks = [
    { key: 'contact',         weight: 20, label: 'Contact Info',           pass: () => !!(data.personalInfo?.email && data.personalInfo?.phone) },
    { key: 'education',       weight: 20, label: 'Education',              pass: () => data.education?.length > 0 },
    { key: 'experience',      weight: 20, label: 'Experience',             pass: () => data.experience?.length > 0 },
    { key: 'skills',          weight: 20, label: 'Skills',                 pass: () => data.skills?.length >= 3 },
    { key: 'summary',         weight: 10, label: 'Professional Summary',   pass: () => data.summary?.trim().length >= 50 },
    { key: 'projects',        weight: 5,  label: 'Projects',               pass: () => data.projects?.length > 0 },
    { key: 'certifications',  weight: 5,  label: 'Certifications',         pass: () => data.certifications?.length > 0 },
  ];
  const critical = ['contact','education','experience','skills'];
  checks.forEach(({ key, weight, label, pass }) => {
    if (pass()) { score += weight; sectionsFound.push(label); }
    else { sectionsMissing.push(label); if (critical.includes(key)) criticalMissing.push(label); }
  });
  return { sectionScore: Math.min(score, 100), sectionsFound, sectionsMissing, criticalMissing };
}

const ACTION_VERBS = [
  'developed','built','designed','implemented','led','managed','created',
  'improved','optimized','deployed','launched','delivered','reduced',
  'increased','automated','collaborated','mentored','architected','maintained',
  'integrated','migrated','streamlined','coordinated','executed','negotiated',
  'analyzed','facilitated','generated','achieved','exceeded','established',
  'transformed','drove','spearheaded','oversaw','resolved','accelerated'
];

function scoreFormat(data) {
  let score = 100;
  const issues = [], suggestions = [];
  const p = data.personalInfo || {};
  if (!p.email)     { issues.push('Email address missing.');       score -= 15; }
  if (!p.phone)     { issues.push('Phone number missing.');        score -= 10; }
  if (!p.linkedin)  { suggestions.push('Add your LinkedIn URL.');  score -= 5;  }
  if (!p.portfolio) { suggestions.push('Add portfolio/GitHub.');   score -= 3;  }
  const summaryLen = (data.summary || '').trim().length;
  if (summaryLen === 0)   { issues.push('No professional summary.');                         score -= 10; }
  else if (summaryLen < 80) { suggestions.push('Expand summary to 150–300 characters.');    score -= 5;  }
  const skillCount = data.skills?.length || 0;
  if (skillCount < 3)      { issues.push('Add at least 5 skills.');              score -= 15; }
  else if (skillCount < 5) { suggestions.push('Add more skills — aim for 8–15.'); score -= 8;  }
  else if (skillCount < 8) { suggestions.push('8–15 skills is ideal.');           score -= 3;  }
  const expCount = data.experience?.length || 0;
  if (expCount === 0) { issues.push('No experience. Add internships or projects.'); score -= 15; }
  else {
    const allText = buildTextFromData(data).toLowerCase();
    const verbsFound = ACTION_VERBS.filter(v => allText.includes(v));
    if (verbsFound.length < 3) { suggestions.push('Use action verbs: built, led, optimized, deployed.'); score -= 10; }
    const hasNumbers = /\d+\s*%|\d+x\b|\$\s*\d+|\d[\d,]+\s*(users|clients|projects|members|revenue|leads|sales|customers|engineers)/i.test(buildTextFromData(data));
    if (!hasNumbers) { suggestions.push("Quantify: 'Grew revenue by 30%' or 'Led team of 5'."); score -= 8; }
    const emptyDesc = data.experience.filter(e => !e.description?.trim() && !(e.achievements?.some(a => a.trim()))).length;
    if (emptyDesc > 0) { suggestions.push(`${emptyDesc} experience entr${emptyDesc > 1 ? 'ies' : 'y'} missing description.`); score -= emptyDesc * 5; }
  }
  if (!data.education?.length) { issues.push('No education entries.'); score -= 10; }
  if (!data.projects?.length)  { suggestions.push('Add projects to showcase your work.'); score -= 5; }
  return { formatScore: Math.max(score, 0), issues, suggestions };
}

export const analyzeATS = (data) => {
  const { detectedDomain, domainLabel } = detectDomain(data);
  const kw  = scoreKeywords(data, detectedDomain);
  const sec = scoreSections(data);
  const fmt = scoreFormat(data);
  const atsScore = Math.round((kw.keywordScore * 0.40) + (sec.sectionScore * 0.30) + (fmt.formatScore * 0.30));
  const allIssues = [
    ...sec.criticalMissing.map(s => `Critical: "${s}" section is missing.`),
    ...fmt.issues
  ];
  const allSuggestions = [
    ...fmt.suggestions,
    kw.keywordsMissing.length > 0
      ? `Add ${domainLabel} keywords: ${kw.keywordsMissing.slice(0, 5).join(', ')}`
      : 'Excellent keyword coverage!',
  ].filter(Boolean);
  return {
    atsScore,
    detectedDomain,
    domainLabel,
    sectionScores: { keywords: kw.keywordScore, sections: sec.sectionScore, format: fmt.formatScore, overall: atsScore },
    keywordsFound:   kw.keywordsFound,
    keywordsMissing: kw.keywordsMissing,
    sectionsFound:   sec.sectionsFound,
    sectionsMissing: sec.sectionsMissing,
    issues:          allIssues,
    suggestions:     allSuggestions,
    improvedText: atsScore >= 80
      ? `Strong ${domainLabel} resume! Quantify achievements to push above 90.`
      : atsScore >= 60
      ? `Good base. Add more ${domainLabel} keywords and fill all sections.`
      : `Focus: complete all sections, add 8+ skills, describe experience in detail.`
  };
};

// ── analyzeText for file upload ───────────────────────────────────────────
const SECTION_PATTERNS = {
  contact:      { pattern: /\b(phone|email|linkedin|github|mobile|\+\d{7,}|@[\w]+\.[\w]+)\b/i,  weight: 20 },
  education:    { pattern: /\b(education|degree|b\.?tech|m\.?tech|bachelor|master|mba|university|college|school|cgpa|gpa|12th|10th|hsc|ssc|diploma)\b/i, weight: 20 },
  experience:   { pattern: /\b(experience|employment|work history|internship|intern|worked at|professional experience)\b/i, weight: 20 },
  skills:       { pattern: /\b(skills|technical skills|competencies|expertise|technologies|tools)\b/i, weight: 20 },
  summary:      { pattern: /\b(summary|objective|profile|about me|professional summary|career objective)\b/i, weight: 10 },
  projects:     { pattern: /\b(projects|personal projects|academic projects|portfolio|case studies)\b/i, weight: 5  },
  achievements: { pattern: /\b(achievements|awards|certifications|certificates|accomplishments|honors)\b/i, weight: 5  },
};

export const analyzeText = (resumeText) => {
  const lower = resumeText.toLowerCase();
  const domainScores = {};
  Object.entries(DOMAIN_BANKS).forEach(([domain, { keywords }]) => {
    domainScores[domain] = keywords.filter(kw => lower.includes(kw)).length;
  });
  const topDomain = Object.entries(domainScores).sort((a,b) => b[1]-a[1])[0];
  const detectedDomain = topDomain[1] > 0 ? topDomain[0] : 'software';
  const { keywords, label } = DOMAIN_BANKS[detectedDomain];
  const found   = keywords.filter(kw => lower.includes(kw));
  const missing = keywords.filter(kw => !lower.includes(kw)).slice(0, 12);
  const rawPct  = (found.length / keywords.length) * 100;
  let keywordScore;
  if (rawPct >= 50)      keywordScore = Math.round(82 + (rawPct - 50) * 0.36);
  else if (rawPct >= 30) keywordScore = Math.round(62 + (rawPct - 30) * 1.0);
  else if (rawPct >= 15) keywordScore = Math.round(40 + (rawPct - 15) * 1.47);
  else                   keywordScore = Math.round(rawPct * 2.67);
  keywordScore = Math.min(keywordScore, 100);
  let sectionScore = 0;
  const sectionsFound = [], sectionsMissing = [];
  Object.entries(SECTION_PATTERNS).forEach(([sec, { pattern, weight }]) => {
    if (pattern.test(resumeText)) { sectionScore += weight; sectionsFound.push(sec); }
    else sectionsMissing.push(sec);
  });
  let formatScore = 100;
  const issues = [], suggestions = [];
  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
  if (wordCount < 200)       { issues.push(`Too short (${wordCount} words).`); formatScore -= 25; }
  else if (wordCount < 400)  { suggestions.push(`Expand to 400+ words.`);       formatScore -= 12; }
  else if (wordCount > 1200) { suggestions.push(`Too long — keep concise.`);    formatScore -= 5;  }
  if (!/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText)) { issues.push('No email found.');  formatScore -= 15; }
  if (!/(\+?\d[\d\s\-(]{7,}\d)/.test(resumeText))                           { issues.push('No phone found.'); formatScore -= 10; }
  if (!/linkedin/i.test(resumeText)) { suggestions.push('Add LinkedIn URL.');   formatScore -= 5; }
  if (!/github/i.test(resumeText))   { suggestions.push('Add GitHub profile.'); formatScore -= 3; }
  const verbsFound = ACTION_VERBS.filter(v => lower.includes(v));
  if (verbsFound.length < 3) { suggestions.push('Use action verbs: built, led, optimized.'); formatScore -= 10; }
  const hasNumbers = /\d+\s*%|\d+x\b|\$\s*\d+|\d[\d,]+\s*(users|clients|projects|members)/i.test(resumeText);
  if (!hasNumbers) { suggestions.push("Quantify: 'Improved by 30%' or 'Led 5 engineers'."); formatScore -= 8; }
  formatScore = Math.max(formatScore, 0);
  const atsScore = Math.round((keywordScore * 0.4) + (sectionScore * 0.3) + (formatScore * 0.3));
  return {
    atsScore, detectedDomain, domainLabel: label,
    sectionScores: { keywords: keywordScore, sections: sectionScore, format: formatScore, overall: atsScore },
    keywordsFound: found, keywordsMissing: missing, sectionsFound, sectionsMissing,
    wordCount, issues, suggestions,
    improvedText: found.length > 10
      ? `Strong ${label} profile! Add metrics to boost above 90.`
      : `Add more ${label} keywords and fill all sections.`
  };
};