export const generateHTMLResume = (data) => {
  const { personalInfo, summary, experience, education, skills, certifications, projects } = data;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${personalInfo.fullName} - Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Arial', sans-serif; }
    body { line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 25px; }
    .name { font-size: 28px; font-weight: bold; color: #1e40af; text-transform: uppercase; letter-spacing: 1px; }
    .contact { margin-top: 10px; font-size: 14px; color: #555; }
    .contact span { margin: 0 10px; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 16px; font-weight: bold; color: #1e40af; text-transform: uppercase; 
      border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 12px; letter-spacing: 1px; }
    .summary { text-align: justify; color: #444; }
    .item { margin-bottom: 15px; }
    .item-header { display: flex; justify-content: space-between; align-items: baseline; }
    .item-title { font-weight: bold; font-size: 15px; color: #222; }
    .item-subtitle { font-style: italic; color: #555; }
    .item-date { font-size: 13px; color: #666; }
    .item-desc { margin-top: 5px; font-size: 14px; color: #444; }
    .skills-container { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill { background: #eff6ff; color: #1e40af; padding: 4px 12px; border-radius: 15px; font-size: 13px; 
      border: 1px solid #bfdbfe; }
    .bullet { margin-left: 20px; margin-top: 3px; }
    .bullet li { margin-bottom: 3px; font-size: 14px; }
    @media print {
      body { padding: 20px; }
      .skill { background: #f0f0f0 !important; -webkit-print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${personalInfo.fullName}</div>
    <div class="contact">
      ${personalInfo.location ? `<span>${personalInfo.location}</span>` : ''}
      ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ''}
      ${personalInfo.phone ? `<span>${personalInfo.phone}</span>` : ''}
      ${personalInfo.linkedin ? `<span>${personalInfo.linkedin}</span>` : ''}
      ${personalInfo.portfolio ? `<span>${personalInfo.portfolio}</span>` : ''}
    </div>
  </div>

  ${summary ? `
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <div class="summary">${summary}</div>
  </div>` : ''}

  ${skills?.length ? `
  <div class="section">
    <div class="section-title">Skills</div>
    <div class="skills-container">
      ${skills.map(s => `<span class="skill">${s}</span>`).join('')}
    </div>
  </div>` : ''}

  ${experience?.length ? `
  <div class="section">
    <div class="section-title">Professional Experience</div>
    ${experience.map(exp => `
      <div class="item">
        <div class="item-header">
          <div>
            <div class="item-title">${exp.title}</div>
            <div class="item-subtitle">${exp.company}${exp.location ? `, ${exp.location}` : ''}</div>
          </div>
          <div class="item-date">${exp.startDate} - ${exp.endDate || 'Present'}</div>
        </div>
        <div class="item-desc">${exp.description}</div>
        ${exp.achievements?.length ? `<ul class="bullet">${exp.achievements.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${education?.length ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${education.map(edu => `
      <div class="item">
        <div class="item-header">
          <div>
            <div class="item-title">${edu.degree}</div>
            <div class="item-subtitle">${edu.institution}${edu.location ? `, ${edu.location}` : ''}</div>
          </div>
          <div class="item-date">${edu.graduationYear}</div>
        </div>
        ${edu.gpa ? `<div class="item-desc">GPA: ${edu.gpa}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${certifications?.length ? `
  <div class="section">
    <div class="section-title">Certifications</div>
    ${certifications.map(cert => `
      <div class="item">
        <div class="item-header">
          <div class="item-title">${cert.name}</div>
          <div class="item-date">${cert.date}</div>
        </div>
        <div class="item-subtitle">${cert.issuer}</div>
      </div>
    `).join('')}
  </div>` : ''}

  ${projects?.length ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${projects.map(proj => `
      <div class="item">
        <div class="item-header">
          <div class="item-title">${proj.name}</div>
          ${proj.link ? `<div class="item-date"><a href="${proj.link}">${proj.link}</a></div>` : ''}
        </div>
        <div class="item-desc">${proj.description}</div>
        ${proj.technologies?.length ? `<div class="skills-container" style="margin-top:5px;">
          ${proj.technologies.map(t => `<span class="skill">${t}</span>`).join('')}
        </div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}
</body>
</html>`;
};
