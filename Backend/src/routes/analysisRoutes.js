import express from 'express';
import { uploadAndAnalyze, getAnalysisHistory, getAnalysisById } from '../controllers/analysisController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/upload', protect, upload.single('resume'), uploadAndAnalyze);
router.get('/history', protect, getAnalysisHistory);
router.get('/:id', protect, getAnalysisById);

export default router;
