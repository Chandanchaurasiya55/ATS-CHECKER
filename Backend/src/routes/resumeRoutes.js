import express from 'express';
import {
  createResume,
  getMyResumes,
  getResumeById,
  updateResume,
  deleteResume,
  downloadResume,
  previewResume,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createResume);
router.get('/', protect, getMyResumes);
router.get('/:id', protect, getResumeById);
router.put('/:id', protect, updateResume);
router.delete('/:id', protect, deleteResume);
router.get('/:id/download', protect, downloadResume);
router.get('/:id/preview', protect, previewResume);

export default router;
