import Resume from '../models/Resume.js';
import { analyzeATS } from '../utils/atsAnalyzer.js';
import { generateHTMLResume } from '../utils/resumeTemplate.js';
import PDFDocument from 'pdfkit';

export const createResume = async (req, res) => {
  try {
    const analysis = analyzeATS(req.body);
    const resume = await Resume.create({
      ...req.body,
      user: req.user.id,
      atsScore: analysis.atsScore,
    });

    res.status(201).json({
      success: true,
      data: {
        resume,
        analysis,
      },
    });
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
    if (!resume || resume.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    let resume = await Resume.findById(req.params.id);
    if (!resume || resume.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const analysis = analyzeATS(req.body);
    resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { ...req.body, atsScore: analysis.atsScore },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: {
        resume,
        analysis,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume || resume.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    await resume.deleteOne();
    res.json({ success: true, message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume || resume.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const doc = new PDFDocument({ margin: 50 });
    const fileName = `${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    doc.pipe(res);

    // Header
    doc.fillColor('#1e40af').fontSize(24).text(resume.personalInfo.fullName.toUpperCase(), { align: 'center' });
    doc.moveDown(0.5);

    // Contact Info
    doc.fillColor('#555555').fontSize(10);
    const contactLinks = [
      resume.personalInfo.location,
      resume.personalInfo.email,
      resume.personalInfo.phone,
      resume.personalInfo.linkedin,
      resume.personalInfo.portfolio
    ].filter(Boolean).join('  |  ');
    
    doc.text(contactLinks, { align: 'center' });
    doc.moveDown(1);
    
    doc.strokeColor('#2563eb').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1.5);

    // Sections
    const drawSectionTitle = (title) => {
      doc.fillColor('#1e40af').fontSize(14).text(title.toUpperCase(), { underline: true });
      doc.moveDown(0.5);
    };

    // Summary
    if (resume.summary) {
      drawSectionTitle('Professional Summary');
      doc.fillColor('#333333').fontSize(10).text(resume.summary, { align: 'justify' });
      doc.moveDown(1.5);
    }

    // Skills
    if (resume.skills && resume.skills.length > 0) {
      drawSectionTitle('Skills');
      doc.fillColor('#333333').fontSize(10).text(resume.skills.join(', '));
      doc.moveDown(1.5);
    }

    // Experience
    if (resume.experience && resume.experience.length > 0) {
      drawSectionTitle('Professional Experience');
      resume.experience.forEach(exp => {
        doc.fillColor('#000000').fontSize(11).text(exp.title, { continued: true })
           .fillColor('#666666').fontSize(10).text(`  |  ${exp.startDate} - ${exp.endDate || 'Present'}`, { align: 'right' });
        doc.fillColor('#444444').fontSize(10).italic().text(`${exp.company}${exp.location ? `, ${exp.location}` : ''}`);
        doc.moveDown(0.3);
        doc.fillColor('#333333').fontSize(10).text(exp.description);
        if (exp.achievements && exp.achievements.length > 0) {
          exp.achievements.forEach(ach => {
            doc.text(`• ${ach}`, { indent: 15 });
          });
        }
        doc.moveDown(1);
      });
    }

    // Education
    if (resume.education && resume.education.length > 0) {
      drawSectionTitle('Education');
      resume.education.forEach(edu => {
        doc.fillColor('#000000').fontSize(11).text(edu.degree, { continued: true })
           .fillColor('#666666').fontSize(10).text(`  |  ${edu.graduationYear}`, { align: 'right' });
        doc.fillColor('#444444').fontSize(10).italic().text(`${edu.institution}${edu.location ? `, ${edu.location}` : ''}`);
        if (edu.gpa) doc.text(`GPA: ${edu.gpa}`);
        doc.moveDown(1);
      });
    }

    doc.end();
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ success: false, message: 'Could not generate PDF' });
  }
};

export const previewResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume || resume.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    const html = generateHTMLResume(resume);
    res.send(html);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
