import express from 'express';
import { getPlans, createOrder, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public route to get plan details
router.get('/plans', getPlans);

// Protected routes for payment actions
router.post('/create-order', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);

export default router;
