import Analysis from '../models/Analysis.js';
import { analyzeText } from '../utils/atsAnalyzer.js';
import fs from 'fs';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

export const uploadAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    let text = "";
    
    // Extract text based on file type
    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(req.file.path);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else {
      // For txt or others, read as utf8
      text = fs.readFileSync(req.file.path, 'utf8');
    }

    if (!text || text.trim().length < 50) {
      throw new Error("Could not extract enough text from the resume. Please ensure the file is not empty or corrupted.");
    }

    const analysisResult = analyzeText(text);

    const analysis = await Analysis.create({
      user: req.user.id,
      fileName: req.file.originalname,
      ...analysisResult,
    });

    // Clean up uploaded file - check if exists before unlinking
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(201).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    // Safely attempt to clean up file on error
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Failed to delete file:', unlinkError);
      }
    }
    
    console.error('Analysis error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal Server Error' 
    });
  }
};

export const getAnalysisHistory = async (req, res) => {
  try {
    const history = await Analysis.find({ user: req.user.id }).sort('-createdAt');
    res.json({ success: true, count: history.length, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis || analysis.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }
    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
