// utils/atsAnalyzer.js

const STOPWORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with',
  'is','are','was','were','be','been','have','has','had','do','does','did',
  'will','would','could','should','i','me','my','we','you','your','he',
  'she','it','they','this','that','from','by','as','into','about','also',
  'each','more','other','than','then','so','if','not','no','per','via'
]);

// ── All Domain Keyword Banks ──────────────────────────────────────────────

const DOMAIN_BANKS = {

  software: {
    label: 'Software / Tech',
    keywords: [
      'react','vue','angular','javascript','typescript','html','css','sass',
      'tailwind','bootstrap','redux','nextjs','webpack','vite','node','express',
      'django','flask','spring','fastapi','rest','graphql','api','microservices',
      'jwt','mongodb','postgresql','mysql','redis','firebase','docker','kubernetes',
      'aws','azure','gcp','ci/cd','jenkins','github actions','terraform','linux',
      'nginx','git','github','jest','testing','debugging','agile','scrum'
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
      'banking','credit','loan','insurance','mutual funds','derivatives'
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
      'culture','diversity','inclusion','attrition','headcount','ats'
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
      'forecasting','deal closure','saas sales','enterprise sales','inside sales'
    ]
  },

  data: {
    label: 'Data Science / Analytics',
    keywords: [
      'python','r','sql','machine learning','deep learning','nlp','computer vision',
      'pandas','numpy','scikit-learn','tensorflow','pytorch','keras','tableau',
      'power bi','excel','statistics','regression','classification','clustering',
      'data visualization','data cleaning','feature engineering','model training',
      'neural network','random forest','xgboost','a/b testing','hypothesis testing',
      'bigquery','spark','hadoop','airflow','mlops','data pipeline','etl',
      'mongodb','postgresql','data warehouse','looker','matplotlib','seaborn'
    ]
  },

  operations: {
    label: 'Operations / Supply Chain',
    keywords: [
      'supply chain','logistics','inventory','procurement','vendor management',
      'warehouse','erp','sap','oracle','lean','six sigma','process improvement',
      'quality assurance','iso','compliance','operations management','forecasting',
      'demand planning','cost reduction','sop','kpi','dashboard','reporting',
      'fleet management','last mile','3pl','import','export','customs',
      'manufacturing','production planning','capacity planning','kaizen'
    ]
  },

  healthcare: {
    label: 'Healthcare / Medical',
    keywords: [
      'patient care','clinical','diagnosis','treatment','nursing','pharmacy',
      'medical records','emr','ehr','hipaa','icd','cpt','billing','coding',
      'radiology','pathology','surgery','telemedicine','health informatics',
      'clinical trials','fda','regulatory','pharmacovigilance','hospital',
      'healthcare management','public health','epidemiology','mbbs','md','bds',
      'physiotherapy','nutrition','mental health','counseling','first aid'
    ]
  },

  education: {
    label: 'Education / Teaching',
    keywords: [
      'curriculum','lesson plan','teaching','instruction','assessment','evaluation',
      'classroom management','e-learning','lms','moodle','zoom','google classroom',
      'student engagement','differentiated instruction','special education',
      'tutoring','mentoring','training','facilitation','pedagogy','bloom taxonomy',
      'edtech','academic research','thesis','publication','syllabus','grading',
      'parent communication','school management','higher education','k-12'
    ]
  },

  legal: {
    label: 'Legal',
    keywords: [
      'litigation','contract','legal research','drafting','compliance','regulatory',
      'intellectual property','corporate law','criminal law','civil law','arbitration',
      'mediation','due diligence','mergers','acquisitions','patents','trademarks',
      'copyright','gdpr','data protection','employment law','tax law','banking law',
      'court','judgment','brief','pleading','discovery','deposition','legal writing'
    ]
  }

};

// ── Step 1: Auto-detect Domain from Resume ────────────────────────────────

function detectDomain(text) {
  const lower = text.toLowerCase();
  const scores = {};

  Object.entries(DOMAIN_BANKS).forEach(([domain, { keywords }]) => {
    const matched = keywords.filter(kw => lower.includes(kw)).length;
    scores[domain] = matched;
  });

  // Top domain wins
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topDomain = sorted[0][0];
  const topScore  = sorted[0][1];

  // Agar koi bhi domain match nahi (very generic resume) — software as fallback
  return {
    detectedDomain: topScore > 0 ? topDomain : 'software',
    domainLabel: DOMAIN_BANKS[topDomain]?.label || 'Software / Tech',
    allDomainScores: scores
  };
}

// ── Step 2: Keyword Analysis (domain-specific) ────────────────────────────

function analyzeKeywords(text, domain) {
  const lower = text.toLowerCase();
  const { keywords, label } = DOMAIN_BANKS[domain];

  const found   = keywords.filter(kw => lower.includes(kw));
  const missing = keywords.filter(kw => !lower.includes(kw)).slice(0, 12);

  // Score = % of domain keywords found, scaled
  const rawPercent = (found.length / keywords.length) * 100;

  // Normalize: 20%+ match = decent, 50%+ = strong
  let keywordScore;
  if (rawPercent >= 50)      keywordScore = Math.round(85 + (rawPercent - 50) * 0.3);
  else if (rawPercent >= 30) keywordScore = Math.round(65 + (rawPercent - 30) * 1.0);
  else if (rawPercent >= 15) keywordScore = Math.round(45 + (rawPercent - 15) * 1.33);
  else                       keywordScore = Math.round(rawPercent * 3);

  return {
    keywordScore: Math.min(keywordScore, 100),
    keywordsFound: found,
    keywordsMissing: missing,
    domainLabel: label,
    matchPercent: Math.round(rawPercent)
  };
}

// ── Step 3: Section Detection (universal) ────────────────────────────────

const SECTION_PATTERNS = {
  contact:      { pattern: /\b(phone|email|linkedin|github|mobile|\+\d{7,}|@[\w]+\.[\w]+)\b/i,  weight: 20 },
  education:    { pattern: /\b(education|degree|b\.?tech|m\.?tech|bachelor|master|mba|university|college|school|cgpa|gpa|12th|10th|hsc|ssc|diploma)\b/i, weight: 20 },
  experience:   { pattern: /\b(experience|employment|work history|internship|intern|worked at|job title|professional experience)\b/i, weight: 20 },
  skills:       { pattern: /\b(skills|technical skills|competencies|expertise|technologies|tools|proficiencies)\b/i, weight: 20 },
  summary:      { pattern: /\b(summary|objective|profile|about me|professional summary|career objective|overview)\b/i, weight: 10 },
  projects:     { pattern: /\b(projects|personal projects|academic projects|portfolio|case studies|work samples)\b/i, weight: 5  },
  achievements: { pattern: /\b(achievements|awards|certifications|certificates|accomplishments|honors|recognition)\b/i, weight: 5  },
};

function detectSections(text) {
  const found   = [];
  const missing = [];

  Object.entries(SECTION_PATTERNS).forEach(([section, { pattern }]) => {
    if (pattern.test(text)) found.push(section);
    else missing.push(section);
  });

  const sectionScore = found.reduce((s, sec) => s + (SECTION_PATTERNS[sec]?.weight || 0), 0);
  const criticalMissing = ['contact','education','experience','skills'].filter(s => missing.includes(s));

  return {
    sectionScore: Math.min(sectionScore, 100),
    sectionsFound: found,
    sectionsMissing: missing,
    criticalMissing
  };
}

// ── Step 4: Format Check (universal) ─────────────────────────────────────

const ACTION_VERBS = [
  'developed','built','designed','implemented','led','managed','created',
  'improved','optimized','deployed','launched','delivered','reduced',
  'increased','automated','collaborated','mentored','architected','maintained',
  'integrated','migrated','refactored','streamlined','coordinated','executed',
  'negotiated','analyzed','researched','facilitated','generated','achieved',
  'exceeded','established','transformed','drove','spearheaded','oversaw'
];

function checkFormat(text) {
  const issues      = [];
  const suggestions = [];
  let formatScore   = 100;
  const lower       = text.toLowerCase();

  // Word count
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount < 200)       { issues.push(`Too short (${wordCount} words). Aim for 400–900 words.`); formatScore -= 25; }
  else if (wordCount < 400)  { suggestions.push(`Brief resume (${wordCount} words). Expand descriptions.`); formatScore -= 12; }
  else if (wordCount > 1200) { suggestions.push(`Long resume (${wordCount} words). Keep it concise.`); formatScore -= 5; }

  // Contact info
  const hasEmail    = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone    = /(\+?\d[\d\s\-(]{7,}\d)/.test(text);
  const hasLinkedIn = /linkedin/i.test(text);
  const hasGitHub   = /github/i.test(text);

  if (!hasEmail)    { issues.push("No email address found.");        formatScore -= 15; }
  if (!hasPhone)    { issues.push("No phone number found.");         formatScore -= 10; }
  if (!hasLinkedIn) { suggestions.push("Add your LinkedIn URL.");    formatScore -= 5;  }
  if (!hasGitHub)   { suggestions.push("Add your GitHub/portfolio."); formatScore -= 3; }

  // Bullets
  const bulletCount = (text.match(/^[\s]*[-•*▪▸◆]\s/gm) || []).length;
  if (bulletCount < 4) { suggestions.push(`Only ${bulletCount} bullet points. Use bullets for clarity.`); formatScore -= 10; }

  // Action verbs
  const verbsFound = ACTION_VERBS.filter(v => lower.includes(v));
  if (verbsFound.length < 3) {
    suggestions.push("Use strong action verbs: led, built, optimized, delivered, achieved.");
    formatScore -= 10;
  }

  // Quantified achievements
  const hasNumbers = /\d+\s*%|\d+x\b|\$\s*\d+|\d[\d,]+\s*(users|clients|projects|members|revenue|leads|sales|customers)/i.test(text);
  if (!hasNumbers) { suggestions.push("Add metrics: 'Grew sales by 30%' or 'Managed team of 8'."); formatScore -= 10; }

  return {
    formatScore: Math.max(formatScore, 0),
    wordCount, bulletCount, verbsFound,
    hasEmail, hasPhone, hasLinkedIn, hasGitHub,
    hasQuantifiedAchievements: hasNumbers,
    issues, suggestions
  };
}

// ── Main Export ───────────────────────────────────────────────────────────

export const analyzeText = (resumeText) => {

  // 1. Domain detect karo
  const { detectedDomain, domainLabel, allDomainScores } = detectDomain(resumeText);

  // 2. Us domain ke keywords se score karo
  const kw  = analyzeKeywords(resumeText, detectedDomain);
  const sec = detectSections(resumeText);
  const fmt = checkFormat(resumeText);

  // 3. Weighted final score: Keywords 40% + Sections 30% + Format 30%
  const atsScore = Math.round(
    (kw.keywordScore  * 0.40) +
    (sec.sectionScore * 0.30) +
    (fmt.formatScore  * 0.30)
  );

  const allIssues = [
    ...sec.criticalMissing.map(s => `Critical section missing: "${s}"`),
    ...fmt.issues
  ];

  const allSuggestions = [
    ...fmt.suggestions,
    kw.keywordsMissing.length > 0
      ? `Add ${domainLabel} keywords: ${kw.keywordsMissing.slice(0, 5).join(', ')}`
      : 'Excellent keyword coverage!',
    sec.sectionsMissing.filter(s => !sec.criticalMissing.includes(s)).length > 0
      ? `Consider adding: ${sec.sectionsMissing.filter(s => !sec.criticalMissing.includes(s)).join(', ')}`
      : null
  ].filter(Boolean);

  return {
    atsScore,
    detectedDomain,
    domainLabel,
    sectionScores: {
      keywords: kw.keywordScore,
      sections: sec.sectionScore,
      format:   fmt.formatScore,
      overall:  atsScore,
    },
    keywordsFound:   kw.keywordsFound,
    keywordsMissing: kw.keywordsMissing,
    matchPercent:    kw.matchPercent,
    sectionsFound:   sec.sectionsFound,
    sectionsMissing: sec.sectionsMissing,
    wordCount:       fmt.wordCount,
    issues:          allIssues,
    suggestions:     allSuggestions,
    formatDetails: {
      bulletCount:               fmt.bulletCount,
      verbsFound:                fmt.verbsFound,
      hasEmail:                  fmt.hasEmail,
      hasPhone:                  fmt.hasPhone,
      hasLinkedIn:               fmt.hasLinkedIn,
      hasGitHub:                 fmt.hasGitHub,
      hasQuantifiedAchievements: fmt.hasQuantifiedAchievements,
    },
    improvedText: kw.keywordsFound.length > 10
      ? `Strong ${domainLabel} profile! Quantify your impact with numbers and metrics.`
      : `Add more ${domainLabel} keywords and use strong action verbs throughout.`
  };
};

// ── Builder export (unchanged) ────────────────────────────────────────────
export const analyzeATS = (data) => {
  let score = 91;
  const suggestions = [];
  if (!data.skills || data.skills.length < 10) suggestions.push("Add more relevant skills.");
  else score += 4;
  if (!data.experience || data.experience.length < 2) suggestions.push("Add more experience.");
  else score += 3;
  return {
    atsScore: Math.min(score, 100),
    sectionScores: { format: 95, content: 90, keywords: 92, optimization: 88 },
    issues: [], suggestions,
    keywordsFound: data.skills || [],
    keywordsMissing: [],
    improvedText: "Use impact verbs like 'Spearheaded', 'Automated', 'Reduced'."
  };
};