import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

// Helper to check and handle plan expiration
export const checkPlanExpiry = async (user) => {
  if (!user) return { isExpired: false };

  // If user has a plan expiration date set and it has passed
  if (user.planExpiresAt && new Date() > new Date(user.planExpiresAt)) {
    let modified = false;
    if (user.plan !== 'free') {
      user.plan = 'free';
      modified = true;
    }
    if (!user.isExpired) {
      user.isExpired = true;
      modified = true;
    }
    if (modified) {
      await user.save();
    }
    return { isExpired: true };
  }

  return { isExpired: false };
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // 1 Year Free Premium (Executive Tier) for College Access
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    const user = await User.create({
      name,
      email,
      password,
      plan: 'executive',
      planStartDate: new Date(),
      planExpiresAt: oneYearFromNow,
      isCollegeTrial: true,
      isExpired: false,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === 'admin',
        plan: user.plan,
        planStartDate: user.planStartDate,
        planExpiresAt: user.planExpiresAt,
        isCollegeTrial: user.isCollegeTrial,
        isExpired: false,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const { isExpired } = await checkPlanExpiry(user);

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === 'admin',
        plan: user.plan || 'free',
        planStartDate: user.planStartDate || null,
        planExpiresAt: user.planExpiresAt || null,
        isCollegeTrial: Boolean(user.isCollegeTrial),
        isExpired: Boolean(isExpired || user.isExpired),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { isExpired } = await checkPlanExpiry(user);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === 'admin',
        plan: user.plan || 'free',
        planStartDate: user.planStartDate || null,
        planExpiresAt: user.planExpiresAt || null,
        isCollegeTrial: Boolean(user.isCollegeTrial),
        isExpired: Boolean(isExpired || user.isExpired),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
