import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  getAdminOverview,
  getAdminUsers,
  getAdminResumes,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/overview', protect, admin, getAdminOverview);
router.get('/users', protect, admin, getAdminUsers);
router.get('/resumes', protect, admin, getAdminResumes);

export default router;
