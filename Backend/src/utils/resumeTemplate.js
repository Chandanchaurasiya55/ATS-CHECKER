// utils/resumeTemplates.js
// 5 Professional Resume Templates

export const TEMPLATES = {
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Clean, traditional layout — universally accepted',
    accent: '#1e3a5f',
    preview: 'bg-blue-900',
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Bold sidebar with accent colors — stands out',
    accent: '#0f766e',
    preview: 'bg-teal-700',
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean whitespace — for senior professionals',
    accent: '#1f2937',
    preview: 'bg-gray-800',
  },
  executive: {
    id: 'executive',
    name: 'Executive',
    description: 'Premium two-column — for leadership roles',
    accent: '#7c3aed',
    preview: 'bg-violet-700',
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    description: 'Vibrant header — for design & marketing roles',
    accent: '#dc2626',
    preview: 'bg-red-600',
  },
};

// ── Template 1: Classic ───────────────────────────────────────────────────
function classicTemplate(resume) {
  const p = resume.personalInfo || {};
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${p.fullName || 'Resume'}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Times New Roman',Georgia,serif;font-size:11pt;color:#222;background:#fff;max-width:820px;margin:0 auto;padding:32px 40px;}
  h1{font-size:24pt;color:#1e3a5f;text-align:center;letter-spacing:1px;margin-bottom:4px;}
  .contact{text-align:center;font-size:9.5pt;color:#555;margin-bottom:16px;}
  .contact a{color:#1e3a5f;text-decoration:none;}
  .divider{border:none;border-top:2px solid #1e3a5f;margin:12px 0;}
  .thin{border-top-width:1px;border-color:#ccc;margin:6px 0;}
  h2{font-size:12pt;color:#1e3a5f;text-transform:uppercase;letter-spacing:1.5px;margin:14px 0 6px;}
  .summary{font-size:10.5pt;color:#333;line-height:1.6;text-align:justify;}
  .skills-wrap{display:flex;flex-wrap:wrap;gap:4px 12px;}
  .skill{font-size:10pt;color:#333;}
  .skill::before{content:"▪ ";}
  .exp-header{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:1px;}
  .exp-title{font-weight:bold;font-size:11pt;color:#111;}
  .exp-date{font-size:9.5pt;color:#666;white-space:nowrap;}
  .exp-sub{font-style:italic;color:#444;font-size:10pt;margin-bottom:4px;}
  .exp-desc{font-size:10pt;color:#333;line-height:1.5;margin-bottom:3px;}
  ul{margin-left:16px;}
  ul li{font-size:10pt;color:#333;line-height:1.5;margin-bottom:1px;}
  .edu-header{display:flex;justify-content:space-between;}
  .edu-deg{font-weight:bold;font-size:11pt;}
  .edu-inst{font-style:italic;color:#444;font-size:10pt;}
  .cert-row,.proj-row{margin-bottom:6px;}
  .proj-tech{font-size:9.5pt;color:#555;font-style:italic;}
</style>
</head>
<body>
<h1>${p.fullName || ''}</h1>
<div class="contact">
  ${[p.email,p.phone,p.location,p.linkedin?`<a href="${p.linkedin}">${p.linkedin}</a>`:'',p.portfolio?`<a href="${p.portfolio}">${p.portfolio}</a>`:''].filter(Boolean).join(' &nbsp;|&nbsp; ')}
</div>
<hr class="divider"/>

${resume.summary ? `<h2>Professional Summary</h2><p class="summary">${resume.summary}</p>` : ''}

${resume.skills?.length ? `<h2>Skills</h2><div class="skills-wrap">${resume.skills.map(s=>`<span class="skill">${s}</span>`).join('')}</div>` : ''}

${resume.experience?.length ? `<h2>Professional Experience</h2>${resume.experience.map(e=>`
<div style="margin-bottom:12px;">
  <div class="exp-header"><span class="exp-title">${e.title||''}</span><span class="exp-date">${e.startDate||''} – ${e.endDate||'Present'}</span></div>
  <div class="exp-sub">${e.company||''}${e.location?`, ${e.location}`:''}</div>
  ${e.description?`<p class="exp-desc">${e.description}</p>`:''}
  ${e.achievements?.filter(a=>a.trim()).length?`<ul>${e.achievements.filter(a=>a.trim()).map(a=>`<li>${a}</li>`).join('')}</ul>`:''}
</div>`).join('<hr class="thin"/>')}` : ''}

${resume.education?.length ? `<h2>Education</h2>${resume.education.map(e=>`
<div style="margin-bottom:10px;">
  <div class="edu-header"><span class="edu-deg">${e.degree||''}</span><span style="font-size:10pt;color:#666;">${e.graduationYear||''}</span></div>
  <div class="edu-inst">${e.institution||''}${e.location?`, ${e.location}`:''}</div>
  ${e.gpa?`<div style="font-size:10pt;color:#555;">GPA: ${e.gpa}</div>`:''}
</div>`).join('')}` : ''}

${resume.projects?.length ? `<h2>Projects</h2>${resume.projects.map(p=>`
<div class="proj-row">
  <strong>${p.name||''}</strong>${p.link?` — <a href="${p.link}" style="color:#1e3a5f;font-size:10pt;">${p.link}</a>`:''}
  ${p.description?`<p style="font-size:10pt;color:#333;margin-top:2px;">${p.description}</p>`:''}
  ${p.technologies?.length?`<p class="proj-tech">Tech: ${p.technologies.join(', ')}</p>`:''}
</div>`).join('')}` : ''}

${resume.certifications?.length ? `<h2>Certifications</h2>${resume.certifications.map(c=>`
<div class="cert-row"><strong>${c.name||''}</strong> — ${c.issuer||''} ${c.date?`(${c.date})`:''}</div>`).join('')}` : ''}
</body></html>`;
}

// ── Template 2: Modern (sidebar) ─────────────────────────────────────────
function modernTemplate(resume) {
  const p = resume.personalInfo || {};
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${p.fullName || 'Resume'}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:10.5pt;color:#222;background:#fff;display:flex;min-height:100vh;max-width:850px;margin:0 auto;}
  .sidebar{width:230px;min-width:230px;background:#0f766e;color:#fff;padding:30px 20px;display:flex;flex-direction:column;gap:20px;}
  .sidebar h1{font-size:18pt;font-weight:700;line-height:1.2;color:#fff;}
  .sidebar .role{font-size:10pt;color:#99f6e4;margin-top:4px;}
  .sidebar h3{font-size:9pt;text-transform:uppercase;letter-spacing:1.5px;color:#99f6e4;margin-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.2);padding-bottom:4px;}
  .sidebar p,.sidebar a{font-size:9.5pt;color:#e6fffa;line-height:1.6;word-break:break-word;}
  .sidebar a{text-decoration:none;}
  .tag{display:inline-block;background:rgba(255,255,255,0.15);border-radius:3px;padding:2px 7px;font-size:9pt;color:#fff;margin:2px 2px 2px 0;}
  .main{flex:1;padding:30px 28px;display:flex;flex-direction:column;gap:18px;}
  h2{font-size:11pt;color:#0f766e;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #0f766e;padding-bottom:3px;margin-bottom:8px;}
  .summary{font-size:10.5pt;color:#333;line-height:1.6;}
  .exp-title{font-weight:700;font-size:11pt;}
  .exp-meta{display:flex;justify-content:space-between;font-size:9.5pt;color:#555;margin-bottom:4px;}
  .exp-desc{font-size:10pt;color:#333;line-height:1.5;margin-bottom:3px;}
  ul{margin-left:14px;}
  ul li{font-size:10pt;color:#333;line-height:1.5;}
  .edu-deg{font-weight:600;font-size:10.5pt;}
  .edu-meta{font-size:9.5pt;color:#555;}
  .proj-name{font-weight:600;}
  .proj-tech{font-size:9pt;color:#0f766e;font-style:italic;}
</style>
</head>
<body>
<div class="sidebar">
  <div>
    <h1>${p.fullName||''}</h1>
    ${resume.experience?.[0]?.title?`<div class="role">${resume.experience[0].title}</div>`:''}
  </div>
  <div>
    <h3>Contact</h3>
    ${p.email?`<p>✉ ${p.email}</p>`:''}
    ${p.phone?`<p>📞 ${p.phone}</p>`:''}
    ${p.location?`<p>📍 ${p.location}</p>`:''}
    ${p.linkedin?`<p>🔗 <a href="${p.linkedin}">LinkedIn</a></p>`:''}
    ${p.portfolio?`<p>🌐 <a href="${p.portfolio}">Portfolio</a></p>`:''}
  </div>
  ${resume.skills?.length?`<div><h3>Skills</h3><div>${resume.skills.map(s=>`<span class="tag">${s}</span>`).join('')}</div></div>`:''}
  ${resume.certifications?.length?`<div><h3>Certifications</h3>${resume.certifications.map(c=>`<p style="margin-bottom:4px;"><strong style="color:#fff;">${c.name||''}</strong><br/><span style="font-size:9pt;color:#99f6e4;">${c.issuer||''} ${c.date||''}</span></p>`).join('')}</div>`:''}
</div>
<div class="main">
  ${resume.summary?`<div><h2>About Me</h2><p class="summary">${resume.summary}</p></div>`:''}
  ${resume.experience?.length?`<div><h2>Experience</h2>${resume.experience.map(e=>`
  <div style="margin-bottom:14px;">
    <div class="exp-title">${e.title||''}</div>
    <div class="exp-meta"><span>${e.company||''}${e.location?`, ${e.location}`:''}</span><span>${e.startDate||''} – ${e.endDate||'Present'}</span></div>
    ${e.description?`<p class="exp-desc">${e.description}</p>`:''}
    ${e.achievements?.filter(a=>a.trim()).length?`<ul>${e.achievements.filter(a=>a.trim()).map(a=>`<li>${a}</li>`).join('')}</ul>`:''}
  </div>`).join('')}</div>`:''}
  ${resume.education?.length?`<div><h2>Education</h2>${resume.education.map(e=>`
  <div style="margin-bottom:10px;">
    <div class="edu-deg">${e.degree||''}</div>
    <div class="edu-meta">${e.institution||''} ${e.location?`· ${e.location}`:''} ${e.graduationYear?`· ${e.graduationYear}`:''} ${e.gpa?`· GPA: ${e.gpa}`:''}</div>
  </div>`).join('')}</div>`:''}
  ${resume.projects?.length?`<div><h2>Projects</h2>${resume.projects.map(pr=>`
  <div style="margin-bottom:10px;">
    <span class="proj-name">${pr.name||''}</span>${pr.link?` — <a href="${pr.link}" style="font-size:9.5pt;color:#0f766e;">${pr.link}</a>`:''}
    ${pr.description?`<p style="font-size:10pt;color:#333;margin-top:2px;">${pr.description}</p>`:''}
    ${pr.technologies?.length?`<p class="proj-tech">Stack: ${pr.technologies.join(', ')}</p>`:''}
  </div>`).join('')}</div>`:''}
</div>
</body></html>`;
}

// ── Template 3: Minimal ───────────────────────────────────────────────────
function minimalTemplate(resume) {
  const p = resume.personalInfo || {};
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${p.fullName||'Resume'}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10.5pt;color:#1a1a1a;background:#fff;max-width:780px;margin:0 auto;padding:48px 52px;}
  h1{font-size:26pt;font-weight:300;letter-spacing:2px;color:#000;margin-bottom:8px;}
  .contact{font-size:9.5pt;color:#666;display:flex;flex-wrap:wrap;gap:6px 16px;margin-bottom:32px;}
  .contact a{color:#444;text-decoration:none;}
  h2{font-size:8.5pt;color:#888;text-transform:uppercase;letter-spacing:3px;margin:24px 0 10px;}
  .rule{border:none;border-top:1px solid #e0e0e0;margin:0 0 12px;}
  .summary{font-size:10.5pt;color:#333;line-height:1.7;}
  .skills-list{display:flex;flex-wrap:wrap;gap:4px 18px;font-size:10pt;color:#333;}
  .exp-row{margin-bottom:16px;}
  .exp-top{display:flex;justify-content:space-between;align-items:baseline;}
  .exp-title{font-size:11pt;font-weight:600;color:#111;}
  .exp-date{font-size:9.5pt;color:#888;}
  .exp-company{font-size:10pt;color:#555;margin-bottom:4px;}
  .exp-desc{font-size:10pt;color:#333;line-height:1.6;}
  ul{margin-left:14px;margin-top:3px;}
  ul li{font-size:10pt;color:#444;line-height:1.5;}
  .edu-row{display:flex;justify-content:space-between;margin-bottom:8px;}
  .edu-left{} .edu-deg{font-weight:600;font-size:10.5pt;} .edu-inst{font-size:10pt;color:#555;}
  .proj-name{font-weight:600;font-size:10.5pt;}
  .proj-desc{font-size:10pt;color:#333;line-height:1.5;}
  .proj-tech{font-size:9.5pt;color:#888;}
</style>
</head>
<body>
<h1>${p.fullName||''}</h1>
<div class="contact">
  ${p.email?`<span>${p.email}</span>`:''}
  ${p.phone?`<span>${p.phone}</span>`:''}
  ${p.location?`<span>${p.location}</span>`:''}
  ${p.linkedin?`<a href="${p.linkedin}">LinkedIn</a>`:''}
  ${p.portfolio?`<a href="${p.portfolio}">Portfolio</a>`:''}
</div>

${resume.summary?`<h2>Summary</h2><hr class="rule"/><p class="summary">${resume.summary}</p>`:''}

${resume.skills?.length?`<h2>Skills</h2><hr class="rule"/><div class="skills-list">${resume.skills.map(s=>`<span>${s}</span>`).join('')}</div>`:''}

${resume.experience?.length?`<h2>Experience</h2><hr class="rule"/>${resume.experience.map(e=>`
<div class="exp-row">
  <div class="exp-top"><span class="exp-title">${e.title||''}</span><span class="exp-date">${e.startDate||''} – ${e.endDate||'Present'}</span></div>
  <div class="exp-company">${e.company||''}${e.location?` · ${e.location}`:''}</div>
  ${e.description?`<p class="exp-desc">${e.description}</p>`:''}
  ${e.achievements?.filter(a=>a.trim()).length?`<ul>${e.achievements.filter(a=>a.trim()).map(a=>`<li>${a}</li>`).join('')}</ul>`:''}
</div>`).join('')}`:''}

${resume.education?.length?`<h2>Education</h2><hr class="rule"/>${resume.education.map(e=>`
<div class="edu-row">
  <div class="edu-left"><div class="edu-deg">${e.degree||''}</div><div class="edu-inst">${e.institution||''}${e.location?`, ${e.location}`:''}</div></div>
  <div style="text-align:right;font-size:10pt;color:#888;">${e.graduationYear||''}<br/>${e.gpa?`GPA: ${e.gpa}`:''}</div>
</div>`).join('')}`:''}

${resume.projects?.length?`<h2>Projects</h2><hr class="rule"/>${resume.projects.map(pr=>`
<div style="margin-bottom:10px;">
  <span class="proj-name">${pr.name||''}</span>${pr.link?` <span style="font-size:9.5pt;color:#888;">— ${pr.link}</span>`:''}
  ${pr.description?`<p class="proj-desc">${pr.description}</p>`:''}
  ${pr.technologies?.length?`<p class="proj-tech">${pr.technologies.join(' · ')}</p>`:''}
</div>`).join('')}`:''}

${resume.certifications?.length?`<h2>Certifications</h2><hr class="rule"/>${resume.certifications.map(c=>`
<div style="margin-bottom:6px;font-size:10pt;"><strong>${c.name||''}</strong> · ${c.issuer||''} ${c.date?`· ${c.date}`:''}</div>`).join('')}`:''}
</body></html>`;
}

// ── Template 4: Executive (two-column) ────────────────────────────────────
function executiveTemplate(resume) {
  const p = resume.personalInfo || {};
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${p.fullName||'Resume'}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:Georgia,'Times New Roman',serif;font-size:10.5pt;color:#1a1a1a;background:#fff;max-width:860px;margin:0 auto;}
  .header{background:#7c3aed;color:#fff;padding:28px 36px;display:flex;justify-content:space-between;align-items:center;}
  .header-left h1{font-size:22pt;font-weight:700;letter-spacing:0.5px;}
  .header-left .role{font-size:11pt;color:#ddd6fe;margin-top:4px;}
  .header-right{text-align:right;font-size:9.5pt;color:#ede9fe;line-height:1.8;}
  .header-right a{color:#c4b5fd;text-decoration:none;}
  .body{display:flex;padding:0;}
  .left-col{width:200px;min-width:200px;background:#f5f3ff;padding:24px 18px;display:flex;flex-direction:column;gap:18px;}
  .right-col{flex:1;padding:24px 28px;display:flex;flex-direction:column;gap:16px;}
  .sec-title{font-size:9pt;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7c3aed;margin-bottom:6px;}
  .tag{display:inline-block;background:#ede9fe;color:#5b21b6;border-radius:3px;padding:2px 7px;font-size:9pt;margin:2px 2px 2px 0;}
  h2{font-size:10.5pt;color:#7c3aed;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1.5px solid #7c3aed;padding-bottom:3px;margin-bottom:8px;}
  .summary{font-size:10.5pt;line-height:1.6;color:#333;}
  .exp-title{font-weight:700;font-size:11pt;}
  .exp-meta{display:flex;justify-content:space-between;font-size:9.5pt;color:#666;margin-bottom:3px;}
  .exp-desc{font-size:10pt;color:#333;line-height:1.5;}
  ul{margin-left:13px;} ul li{font-size:10pt;line-height:1.5;color:#333;}
  .edu-deg{font-weight:600;font-size:10.5pt;}
  .edu-meta{font-size:9.5pt;color:#666;}
</style>
</head>
<body>
<div class="header">
  <div class="header-left">
    <h1>${p.fullName||''}</h1>
    ${resume.experience?.[0]?.title?`<div class="role">${resume.experience[0].title}</div>`:''}
  </div>
  <div class="header-right">
    ${p.email?`<div>${p.email}</div>`:''}
    ${p.phone?`<div>${p.phone}</div>`:''}
    ${p.location?`<div>${p.location}</div>`:''}
    ${p.linkedin?`<div><a href="${p.linkedin}">LinkedIn</a></div>`:''}
    ${p.portfolio?`<div><a href="${p.portfolio}">Portfolio</a></div>`:''}
  </div>
</div>
<div class="body">
  <div class="left-col">
    ${resume.skills?.length?`<div><div class="sec-title">Skills</div><div>${resume.skills.map(s=>`<span class="tag">${s}</span>`).join('')}</div></div>`:''}
    ${resume.education?.length?`<div><div class="sec-title">Education</div>${resume.education.map(e=>`
    <div style="margin-bottom:10px;">
      <div class="edu-deg">${e.degree||''}</div>
      <div class="edu-meta">${e.institution||''}</div>
      <div class="edu-meta">${e.graduationYear||''} ${e.gpa?`· GPA ${e.gpa}`:''}</div>
    </div>`).join('')}</div>`:''}
    ${resume.certifications?.length?`<div><div class="sec-title">Certifications</div>${resume.certifications.map(c=>`
    <div style="margin-bottom:6px;font-size:9.5pt;"><strong>${c.name||''}</strong><br/>${c.issuer||''} ${c.date?`(${c.date})`:''}</div>`).join('')}</div>`:''}
  </div>
  <div class="right-col">
    ${resume.summary?`<div><h2>Executive Summary</h2><p class="summary">${resume.summary}</p></div>`:''}
    ${resume.experience?.length?`<div><h2>Experience</h2>${resume.experience.map(e=>`
    <div style="margin-bottom:14px;">
      <div class="exp-title">${e.title||''}</div>
      <div class="exp-meta"><span>${e.company||''}${e.location?`, ${e.location}`:''}</span><span>${e.startDate||''} – ${e.endDate||'Present'}</span></div>
      ${e.description?`<p class="exp-desc">${e.description}</p>`:''}
      ${e.achievements?.filter(a=>a.trim()).length?`<ul>${e.achievements.filter(a=>a.trim()).map(a=>`<li>${a}</li>`).join('')}</ul>`:''}
    </div>`).join('')}</div>`:''}
    ${resume.projects?.length?`<div><h2>Projects</h2>${resume.projects.map(pr=>`
    <div style="margin-bottom:10px;">
      <strong>${pr.name||''}</strong>${pr.link?` — <a href="${pr.link}" style="font-size:9.5pt;color:#7c3aed;">${pr.link}</a>`:''}
      ${pr.description?`<p style="font-size:10pt;color:#333;margin-top:2px;">${pr.description}</p>`:''}
      ${pr.technologies?.length?`<p style="font-size:9.5pt;color:#7c3aed;font-style:italic;">${pr.technologies.join(' · ')}</p>`:''}
    </div>`).join('')}</div>`:''}
  </div>
</div>
</body></html>`;
}

// ── Template 5: Creative ──────────────────────────────────────────────────
function creativeTemplate(resume) {
  const p = resume.personalInfo || {};
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${p.fullName||'Resume'}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Arial',Helvetica,sans-serif;font-size:10.5pt;color:#1a1a1a;background:#fff;max-width:840px;margin:0 auto;}
  .hero{background:linear-gradient(135deg,#dc2626 0%,#7c2d12 100%);color:#fff;padding:36px 40px;position:relative;overflow:hidden;}
  .hero::after{content:'';position:absolute;right:-30px;top:-30px;width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,0.08);}
  .hero h1{font-size:24pt;font-weight:800;letter-spacing:0.5px;}
  .hero .role{font-size:11.5pt;color:#fca5a5;margin-top:4px;}
  .hero .contact{display:flex;flex-wrap:wrap;gap:6px 20px;margin-top:14px;font-size:9.5pt;color:#fee2e2;}
  .hero .contact a{color:#fca5a5;text-decoration:none;}
  .content{padding:28px 40px;display:grid;grid-template-columns:1fr 220px;gap:0 28px;}
  .main-col{} .side-col{}
  h2{font-size:10pt;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#dc2626;margin:18px 0 7px;display:flex;align-items:center;gap:6px;}
  h2::after{content:'';flex:1;height:1.5px;background:#fca5a5;}
  .summary{font-size:10.5pt;color:#333;line-height:1.6;}
  .exp-title{font-weight:700;font-size:11pt;color:#111;}
  .exp-meta{font-size:9.5pt;color:#dc2626;margin-bottom:3px;}
  .exp-company{font-size:10pt;color:#555;margin-bottom:3px;}
  .exp-desc{font-size:10pt;color:#333;line-height:1.5;}
  ul{margin-left:14px;} ul li{font-size:10pt;color:#444;line-height:1.5;}
  .skill-item{background:#fff1f2;border-left:3px solid #dc2626;padding:3px 8px;margin-bottom:4px;font-size:10pt;color:#1a1a1a;}
  .edu-deg{font-weight:600;font-size:10.5pt;}
  .edu-meta{font-size:9.5pt;color:#666;}
  .cert-item{font-size:9.5pt;margin-bottom:6px;padding:4px 8px;border:1px solid #fca5a5;border-radius:4px;}
  .proj-name{font-weight:700;}
  .proj-tech{font-size:9.5pt;color:#dc2626;}
</style>
</head>
<body>
<div class="hero">
  <h1>${p.fullName||''}</h1>
  ${resume.experience?.[0]?.title?`<div class="role">${resume.experience[0].title}</div>`:''}
  <div class="contact">
    ${p.email?`<span>${p.email}</span>`:''}
    ${p.phone?`<span>${p.phone}</span>`:''}
    ${p.location?`<span>${p.location}</span>`:''}
    ${p.linkedin?`<a href="${p.linkedin}">LinkedIn</a>`:''}
    ${p.portfolio?`<a href="${p.portfolio}">Portfolio</a>`:''}
  </div>
</div>
<div class="content">
  <div class="main-col">
    ${resume.summary?`<h2>About</h2><p class="summary">${resume.summary}</p>`:''}
    ${resume.experience?.length?`<h2>Experience</h2>${resume.experience.map(e=>`
    <div style="margin-bottom:14px;">
      <div class="exp-title">${e.title||''}</div>
      <div class="exp-meta">${e.startDate||''} – ${e.endDate||'Present'}</div>
      <div class="exp-company">${e.company||''}${e.location?` · ${e.location}`:''}</div>
      ${e.description?`<p class="exp-desc">${e.description}</p>`:''}
      ${e.achievements?.filter(a=>a.trim()).length?`<ul>${e.achievements.filter(a=>a.trim()).map(a=>`<li>${a}</li>`).join('')}</ul>`:''}
    </div>`).join('')}`:''}
    ${resume.projects?.length?`<h2>Projects</h2>${resume.projects.map(pr=>`
    <div style="margin-bottom:10px;">
      <span class="proj-name">${pr.name||''}</span>${pr.link?` — <a href="${pr.link}" style="color:#dc2626;font-size:9.5pt;">${pr.link}</a>`:''}
      ${pr.description?`<p style="font-size:10pt;color:#333;margin-top:2px;">${pr.description}</p>`:''}
      ${pr.technologies?.length?`<p class="proj-tech">${pr.technologies.join(' · ')}</p>`:''}
    </div>`).join('')}`:''}
  </div>
  <div class="side-col">
    ${resume.skills?.length?`<h2>Skills</h2>${resume.skills.map(s=>`<div class="skill-item">${s}</div>`).join('')}`:''}
    ${resume.education?.length?`<h2>Education</h2>${resume.education.map(e=>`
    <div style="margin-bottom:10px;">
      <div class="edu-deg">${e.degree||''}</div>
      <div class="edu-meta">${e.institution||''}</div>
      <div class="edu-meta">${e.graduationYear||''} ${e.gpa?`· GPA ${e.gpa}`:''}</div>
    </div>`).join('')}`:''}
    ${resume.certifications?.length?`<h2>Certs</h2>${resume.certifications.map(c=>`
    <div class="cert-item"><strong>${c.name||''}</strong><br/>${c.issuer||''} ${c.date?`(${c.date})`:''}</div>`).join('')}`:''}
  </div>
</div>
</body></html>`;
}

// ── Main export ───────────────────────────────────────────────────────────
export const generateHTMLResume = (resume, template = 'classic') => {
  switch(template) {
    case 'modern':    return modernTemplate(resume);
    case 'minimal':   return minimalTemplate(resume);
    case 'executive': return executiveTemplate(resume);
    case 'creative':  return creativeTemplate(resume);
    default:          return classicTemplate(resume);
  }
};