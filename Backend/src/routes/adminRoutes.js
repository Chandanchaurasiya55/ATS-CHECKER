import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  getAdminOverview,
  getAdminUsers,
  getAdminResumes,
  getCollegePrefixes,
  addCollegePrefix,
  deleteCollegePrefix,
  toggleCollegePrefix,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/overview', protect, admin, getAdminOverview);
router.get('/users', protect, admin, getAdminUsers);
router.get('/resumes', protect, admin, getAdminResumes);

// College Email Prefix Management
router.get('/college-prefixes', protect, admin, getCollegePrefixes);
router.post('/college-prefixes', protect, admin, addCollegePrefix);
router.delete('/college-prefixes/:id', protect, admin, deleteCollegePrefix);
router.patch('/college-prefixes/:id/toggle', protect, admin, toggleCollegePrefix);

export default router;

