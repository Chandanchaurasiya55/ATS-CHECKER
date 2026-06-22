// controllers/resumeController.js
import Resume from '../models/Resume.js';
import { analyzeATS } from '../utils/atsAnalyzer.js';
import { generateHTMLResume } from '../utils/resumeTemplate.js';
import PDFDocument from 'pdfkit';

const ALLOWED_TEMPLATES = {
  free: ['classic'],
  fresher: ['classic'],
  experience: ['classic', 'modern', 'minimal'],
  executive: ['classic', 'modern', 'minimal', 'executive', 'creative']
};

const isTemplateAllowed = (plan, role, template) => {
  if (role === 'admin') return true;
  const allowed = ALLOWED_TEMPLATES[plan || 'free'] || ['classic'];
  return allowed.includes(template || 'classic');
};

export const createResume = async (req, res) => {
  try {
    const template = req.body.template || 'classic';
    if (!isTemplateAllowed(req.user.plan, req.user.role, template)) {
      return res.status(403).json({
        success: false,
        message: `Template '${template}' is not available on the ${req.user.plan || 'free'} plan. Please upgrade.`
      });
    }

    const analysis = analyzeATS(req.body);
    const resume = await Resume.create({
      ...req.body,
      user: req.user.id,
      atsScore: analysis.atsScore,
    });
    res.status(201).json({ success: true, data: { resume, analysis } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort('-createdAt');
    res.json({ success: true, count: resumes.length, data: resumes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume || resume.user.toString() !== req.user.id)
      return res.status(404).json({ success: false, message: 'Resume not found' });
    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    let resume = await Resume.findById(req.params.id);
    if (!resume || resume.user.toString() !== req.user.id)
      return res.status(404).json({ success: false, message: 'Resume not found' });

    const template = req.body.template || 'classic';
    if (!isTemplateAllowed(req.user.plan, req.user.role, template)) {
      return res.status(403).json({
        success: false,
        message: `Template '${template}' is not available on the ${req.user.plan || 'free'} plan. Please upgrade.`
      });
    }

    const analysis = analyzeATS(req.body);
    resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { ...req.body, atsScore: analysis.atsScore },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: { resume, analysis } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume || resume.user.toString() !== req.user.id)
      return res.status(404).json({ success: false, message: 'Resume not found' });
    await resume.deleteOne();
    res.json({ success: true, message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const previewResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume || resume.user.toString() !== req.user.id)
      return res.status(404).json({ success: false, message: 'Resume not found' });

    // Template from query param or saved value
    const template = req.query.template || resume.template || 'classic';
    if (!isTemplateAllowed(req.user.plan, req.user.role, template)) {
      return res.status(403).json({
        success: false,
        message: `Template '${template}' is not available on the ${req.user.plan || 'free'} plan. Please upgrade.`
      });
    }

    const html = generateHTMLResume(resume, template);
    res.send(html);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume || resume.user.toString() !== req.user.id)
      return res.status(404).json({ success: false, message: 'Resume not found' });

    const doc = new PDFDocument({ margin: 50 });
    const fileName = `${(resume.personalInfo.fullName || 'Resume').replace(/\s+/g,'_')}_Resume.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    doc.pipe(res);

    // Header
    doc.fillColor('#1e40af').fontSize(22).text(resume.personalInfo.fullName?.toUpperCase() || '', { align: 'center' });
    doc.moveDown(0.4);
    const contact = [
      resume.personalInfo.location,
      resume.personalInfo.email,
      resume.personalInfo.phone,
      resume.personalInfo.linkedin,
      resume.personalInfo.portfolio
    ].filter(Boolean).join('  |  ');
    doc.fillColor('#555').fontSize(9.5).text(contact, { align: 'center' });
    doc.moveDown(0.8);
    doc.strokeColor('#2563eb').lineWidth(1.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    const section = (title) => {
      doc.fillColor('#1e40af').fontSize(12).text(title.toUpperCase(), { underline: true });
      doc.moveDown(0.4);
    };

    if (resume.summary) {
      section('Professional Summary');
      doc.fillColor('#333').fontSize(10).text(resume.summary, { align: 'justify' });
      doc.moveDown(1);
    }

    if (resume.skills?.length) {
      section('Skills');
      doc.fillColor('#333').fontSize(10).text(resume.skills.join('  ·  '));
      doc.moveDown(1);
    }

    if (resume.experience?.length) {
      section('Experience');
      resume.experience.forEach(exp => {
        doc.fillColor('#000').fontSize(11).font('Helvetica-Bold').text(exp.title || '');
        doc.font('Helvetica');
        doc.fillColor('#444').fontSize(10).font('Helvetica-Oblique')
          .text(`${exp.company || ''}${exp.location ? ', ' + exp.location : ''}  |  ${exp.startDate || ''} – ${exp.endDate || 'Present'}`);
        doc.font('Helvetica');
        if (exp.description) { doc.fillColor('#333').fontSize(10).text(exp.description); doc.moveDown(0.2); }
        exp.achievements?.filter(a=>a.trim()).forEach(a => doc.fillColor('#333').fontSize(10).text(`• ${a}`, { indent: 10 }));
        doc.moveDown(0.8);
      });
    }

    if (resume.education?.length) {
      section('Education');
      resume.education.forEach(edu => {
        doc.fillColor('#000').fontSize(11).font('Helvetica-Bold').text(edu.degree || '');
        doc.font('Helvetica');
        doc.fillColor('#444').fontSize(10).font('Helvetica-Oblique')
          .text(`${edu.institution || ''}${edu.location ? ', ' + edu.location : ''}  |  ${edu.graduationYear || ''}${edu.gpa ? '  ·  GPA: ' + edu.gpa : ''}`);
        doc.font('Helvetica');
        doc.moveDown(0.8);
      });
    }

    if (resume.projects?.length) {
      section('Projects');
      resume.projects.forEach(pr => {
        doc.fillColor('#000').fontSize(11).font('Helvetica-Bold').text(pr.name || '');
        doc.font('Helvetica');
        if (pr.link) doc.fillColor('#2563eb').fontSize(9.5).text(pr.link);
        if (pr.description) doc.fillColor('#333').fontSize(10).text(pr.description);
        if (pr.technologies?.length) doc.fillColor('#555').fontSize(9.5).text(`Stack: ${pr.technologies.join(', ')}`);
        doc.moveDown(0.8);
      });
    }

    if (resume.certifications?.length) {
      section('Certifications');
      resume.certifications.forEach(c => {
        doc.fillColor('#333').fontSize(10)
          .text(`${c.name || ''}  —  ${c.issuer || ''}${c.date ? '  (' + c.date + ')' : ''}`);
      });
    }

    doc.end();
  } catch (error) {
    console.error('PDF error:', error);
    res.status(500).json({ success: false, message: 'Could not generate PDF' });
  }
};