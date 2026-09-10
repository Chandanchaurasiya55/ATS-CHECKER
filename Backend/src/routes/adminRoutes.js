import express from 'express';
import {
  checkAdminExists,
  registerAdmin,
  loginAdmin,
  getAdminOverview,
  getAdminUsers,
  updateUserPlan,
  deleteUser,
  getAdminResumes,
  getAdminPayments,
  getCollegePrefixes,
  addCollegePrefix,
  deleteCollegePrefix,
  toggleCollegePrefix,
  getAdminInquiries,
  markInquiryRead,
  markAllInquiriesRead,
  deleteInquiry,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/check-admin', checkAdminExists);
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/overview', protect, admin, getAdminOverview);

// User Management
router.get('/users', protect, admin, getAdminUsers);
router.patch('/users/:id/plan', protect, admin, updateUserPlan);
router.delete('/users/:id', protect, admin, deleteUser);

// Resumes & Payments
router.get('/resumes', protect, admin, getAdminResumes);
router.get('/payments', protect, admin, getAdminPayments);

// Contact Inquiries / Messages & Notifications
router.get('/inquiries', protect, admin, getAdminInquiries);
router.patch('/inquiries/mark-all-read', protect, admin, markAllInquiriesRead);
router.patch('/inquiries/:id/read', protect, admin, markInquiryRead);
router.delete('/inquiries/:id', protect, admin, deleteInquiry);

// College Email Prefix Management
router.get('/college-prefixes', protect, admin, getCollegePrefixes);
router.post('/college-prefixes', protect, admin, addCollegePrefix);
router.delete('/college-prefixes/:id', protect, admin, deleteCollegePrefix);
router.patch('/college-prefixes/:id/toggle', protect, admin, toggleCollegePrefix);

export default router;

