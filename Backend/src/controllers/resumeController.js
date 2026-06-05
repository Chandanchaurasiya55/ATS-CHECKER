import Resume from '../models/Resume.js';
import { analyzeATS } from '../utils/atsAnalyzer.js';
import { generateHTMLResume } from '../utils/resumeTemplate.js';

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
    const html = generateHTMLResume(resume);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
