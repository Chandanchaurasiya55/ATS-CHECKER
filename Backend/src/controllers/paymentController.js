import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import { plans, getPlanById } from '../config/plans.js';

// Get available pricing plans
export const getPlans = async (req, res) => {
  try {
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const { plan: planId, billingCycle = 'quarterly' } = req.body;

    if (!planId) {
      return res.status(400).json({ success: false, message: 'Plan ID is required' });
    }

    if (!['monthly', 'quarterly'].includes(billingCycle)) {
      return res.status(400).json({ success: false, message: 'Invalid billing cycle. Must be monthly or quarterly' });
    }

    const plan = getPlanById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    const pricing = plan.pricing[billingCycle];
    if (!pricing) {
      return res.status(400).json({ success: false, message: `Pricing details not found for cycle: ${billingCycle}` });
    }

    const keyId = process.env.RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

    if (!keyId || !keySecret) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay keys are not configured in .env. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
      });
    }

    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: pricing.amountInPaise,
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}_${req.user.id.substring(0, 8)}`,
    };

    const order = await instance.orders.create(options);

    // Create a pending payment log in the database
    await Payment.create({
      userId: req.user.id,
      razorpayOrderId: order.id,
      amount: pricing.billingAmount,
      currency: 'INR',
      plan: planId,
      billingCycle: billingCycle,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: keyId,
      plan: {
        id: planId,
        name: plan.name,
        pricePerMonth: pricing.pricePerMonth,
        billingAmount: pricing.billingAmount,
        billingCycleName: pricing.billingCycleName,
      },
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error creating Razorpay order' });
  }
};

// Verify payment signature
export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required validation arguments: razorpayOrderId, razorpayPaymentId, razorpaySignature'
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!keySecret) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay secret key is not configured'
      });
    }

    // Verify signature
    const shasum = crypto.createHmac('sha256', keySecret);
    shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpaySignature) {
      // Find and update payment to failed
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpayOrderId },
        { status: 'failed', razorpayPaymentId, razorpaySignature }
      );
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Find the pending payment log
    const payment = await Payment.findOne({ razorpayOrderId: razorpayOrderId });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    if (payment.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Payment already verified' });
    }

    // Update payment record to completed
    payment.status = 'completed';
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    await payment.save();

    // Upgrade User Plan
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Set expiry date dynamically based on plan configuration
    const planDetails = getPlanById(payment.plan);
    const pricing = planDetails?.pricing[payment.billingCycle || 'quarterly'];
    const durationDays = pricing?.durationDays || 90;

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + durationDays);

    user.plan = payment.plan;
    user.planStartDate = new Date();
    user.planExpiresAt = expiryDate;
    await user.save();

    res.json({
      success: true,
      message: 'Payment verified successfully. Account upgraded.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === 'admin',
        plan: user.plan,
        planStartDate: user.planStartDate,
        planExpiresAt: user.planExpiresAt,
      }
    });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error verifying payment' });
  }
};
