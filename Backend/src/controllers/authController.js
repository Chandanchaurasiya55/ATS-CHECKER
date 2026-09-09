import User from '../models/User.js';
import CollegePrefix from '../models/CollegePrefix.js';
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

// Helper to match email against active college prefixes
export const findMatchingPrefix = async (cleanEmail) => {
  const activePrefixes = await CollegePrefix.find({ isActive: true });
  for (const item of activePrefixes) {
    const p = (item.prefix || '').toLowerCase().trim();
    if (!p) continue;

    // Smart matching logic:
    // 1. Exact match (e.g. "student@xyz.com")
    // 2. Domain ending (e.g. "@gehu.ac.in" or "gehu.ac.in")
    // 3. Email prefix (e.g. "student_" or "cu_")
    // 4. Substring / domain match
    if (
      cleanEmail === p ||
      cleanEmail.endsWith(p) ||
      cleanEmail.endsWith('@' + p) ||
      cleanEmail.endsWith('.' + p) ||
      cleanEmail.startsWith(p) ||
      (p.includes('@') && cleanEmail.includes(p))
    ) {
      return item;
    }
  }
  return null;
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const cleanEmail = (email || '').toLowerCase().trim();
    if (!cleanEmail) {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }

    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Check if user email matches any active college prefix / domain configured in admin panel
    const matchedPrefix = await findMatchingPrefix(cleanEmail);

    let user;
    if (matchedPrefix) {
      // 1 Year Free Premium (Executive Tier) for College Access
      const durationDays = matchedPrefix.durationDays || 365;
      const planExpiresAt = new Date();
      planExpiresAt.setDate(planExpiresAt.getDate() + durationDays);

      user = await User.create({
        name,
        email: cleanEmail,
        password,
        plan: 'executive',
        planStartDate: new Date(),
        planExpiresAt,
        isCollegeTrial: true,
        collegeName: matchedPrefix.collegeName || 'Partner College',
        isExpired: false,
      });

      // Increment registered count for this prefix
      matchedPrefix.registeredCount = (matchedPrefix.registeredCount || 0) + 1;
      await matchedPrefix.save();
    } else {
      // Regular public user registration - Free Plan
      user = await User.create({
        name,
        email: cleanEmail,
        password,
        plan: 'free',
        isCollegeTrial: false,
        isExpired: false,
      });
    }

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
        planStartDate: user.planStartDate || null,
        planExpiresAt: user.planExpiresAt || null,
        isCollegeTrial: Boolean(user.isCollegeTrial),
        collegeName: user.collegeName || '',
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

    const cleanEmail = (email || '').toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // If user is on free plan, check if an admin has configured their email prefix/domain for free access
    if (user.plan === 'free' && !user.isCollegeTrial) {
      const matchedPrefix = await findMatchingPrefix(cleanEmail);
      if (matchedPrefix) {
        const durationDays = matchedPrefix.durationDays || 365;
        const planExpiresAt = new Date();
        planExpiresAt.setDate(planExpiresAt.getDate() + durationDays);

        user.plan = 'executive';
        user.planStartDate = new Date();
        user.planExpiresAt = planExpiresAt;
        user.isCollegeTrial = true;
        user.collegeName = matchedPrefix.collegeName || 'Partner College';
        user.isExpired = false;
        await user.save();

        matchedPrefix.registeredCount = (matchedPrefix.registeredCount || 0) + 1;
        await matchedPrefix.save();
      }
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
        collegeName: user.collegeName || '',
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
        collegeName: user.collegeName || '',
        isExpired: Boolean(isExpired || user.isExpired),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
