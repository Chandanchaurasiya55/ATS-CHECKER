import User from '../models/User.js';
import Resume from '../models/Resume.js';
import CollegePrefix from '../models/CollegePrefix.js';
import Payment from '../models/Payment.js';
import Inquiry from '../models/Inquiry.js';
import { generateToken } from '../middleware/auth.js';

export const checkAdminExists = async (req, res) => {
  try {
    const adminExists = await User.exists({ role: 'admin' });
    res.json({
      success: true,
      adminExists: !!adminExists,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const adminExists = await User.exists({ role: 'admin' });
    if (adminExists) {
      return res.status(400).json({ success: false, message: 'Admin account already exists' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const admin = await User.create({ name, email, password, role: 'admin' });
    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isAdmin: true,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'admin' }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: true,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalResumes = await Resume.countDocuments();

    // Plan distributions
    const [freeUsers, fresherUsers, experienceUsers, executiveUsers, collegeTrialUsers] = await Promise.all([
      User.countDocuments({ role: 'user', plan: 'free' }),
      User.countDocuments({ role: 'user', plan: 'fresher' }),
      User.countDocuments({ role: 'user', plan: 'experience' }),
      User.countDocuments({ role: 'user', plan: 'executive' }),
      User.countDocuments({ role: 'user', isCollegeTrial: true }),
    ]);

    // Active College Prefixes
    const activePrefixesCount = await CollegePrefix.countDocuments({ isActive: true });

    // ATS score stats
    const atsScoreAgg = await Resume.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$atsScore' },
          maxScore: { $max: '$atsScore' },
        },
      },
    ]);
    const avgScore = atsScoreAgg.length > 0 ? Math.round(atsScoreAgg[0].avgScore || 0) : 0;
    const maxScore = atsScoreAgg.length > 0 ? Math.round(atsScoreAgg[0].maxScore || 0) : 0;

    // Template usage distribution
    const templateCounts = await Resume.aggregate([
      {
        $group: {
          _id: '$template',
          count: { $sum: 1 },
        },
      },
    ]);
    const templateDistribution = {
      classic: 0,
      modern: 0,
      minimal: 0,
      executive: 0,
      creative: 0,
    };
    templateCounts.forEach((item) => {
      const key = item._id || 'classic';
      templateDistribution[key] = item.count;
    });

    // Revenue / Payments stats
    const paymentAgg = await Payment.aggregate([
      {
        $group: {
          _id: '$status',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);
    let totalRevenue = 0;
    let completedPayments = 0;
    let pendingPayments = 0;
    paymentAgg.forEach((p) => {
      if (p._id === 'completed') {
        totalRevenue = p.totalAmount;
        completedPayments = p.count;
      } else if (p._id === 'pending') {
        pendingPayments = p.count;
      }
    });

    // Recent activity
    const recentResumes = await Resume.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('user', 'name email');

    const recentUsers = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(6)
      .select('-password');

    // Inquiries & Notifications
    const unreadInquiriesCount = await Inquiry.countDocuments({ isRead: false });
    const totalInquiriesCount = await Inquiry.countDocuments();
    const recentInquiries = await Inquiry.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalAdmins,
        totalResumes,
        plans: {
          free: freeUsers,
          fresher: fresherUsers,
          experience: experienceUsers,
          executive: executiveUsers,
          collegeTrial: collegeTrialUsers,
        },
        activePrefixesCount,
        atsStats: {
          avgScore,
          maxScore,
        },
        templateDistribution,
        revenue: {
          totalRevenue,
          completedPayments,
          pendingPayments,
        },
        unreadInquiriesCount,
        totalInquiriesCount,
        recentInquiries,
        recentResumes,
        recentUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort('-createdAt');

    // Aggregate resume counts per user
    const resumeCounts = await Resume.aggregate([
      {
        $group: {
          _id: '$user',
          count: { $sum: 1 },
          avgScore: { $avg: '$atsScore' },
        },
      },
    ]);

    const resumeCountMap = {};
    const avgScoreMap = {};
    resumeCounts.forEach((r) => {
      if (r._id) {
        resumeCountMap[r._id.toString()] = r.count;
        avgScoreMap[r._id.toString()] = Math.round(r.avgScore || 0);
      }
    });

    const enrichedUsers = users.map((u) => {
      const uObj = u.toObject();
      uObj.resumesCount = resumeCountMap[u._id.toString()] || 0;
      uObj.avgAtsScore = avgScoreMap[u._id.toString()] || null;
      return uObj;
    });

    res.json({ success: true, data: enrichedUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { plan, durationDays, isCollegeTrial, collegeName } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (plan) user.plan = plan;
    if (typeof isCollegeTrial === 'boolean') user.isCollegeTrial = isCollegeTrial;
    if (collegeName !== undefined) user.collegeName = collegeName;

    if (durationDays && Number(durationDays) > 0) {
      const exp = new Date();
      exp.setDate(exp.getDate() + Number(durationDays));
      user.planExpiresAt = exp;
      user.planStartDate = new Date();
      user.isExpired = false;
    } else if (plan === 'free') {
      user.planExpiresAt = null;
      user.isExpired = false;
    }

    await user.save();

    res.json({
      success: true,
      message: `Updated plan for ${user.name} to ${user.plan}`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete an admin account' });
    }

    // Delete user and their resumes
    await Resume.deleteMany({ user: id });
    await User.findByIdAndDelete(id);

    res.json({ success: true, message: `User ${user.email} and associated data deleted successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminResumes = async (req, res) => {
  try {
    const resumes = await Resume.find()
      .populate('user', 'name email plan isCollegeTrial')
      .sort('-createdAt');
    res.json({ success: true, data: resumes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'name email')
      .sort('-createdAt');
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// College Email Prefix Management
export const getCollegePrefixes = async (req, res) => {
  try {
    const prefixes = await CollegePrefix.find().sort('-createdAt');
    res.json({ success: true, data: prefixes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addCollegePrefix = async (req, res) => {
  try {
    let { prefix, collegeName, durationDays = 365 } = req.body;

    if (!prefix || !prefix.trim()) {
      return res.status(400).json({ success: false, message: 'Email prefix or domain is required' });
    }

    prefix = prefix.trim().toLowerCase();

    const exists = await CollegePrefix.findOne({ prefix });
    if (exists) {
      return res.status(400).json({ success: false, message: `Prefix '${prefix}' is already configured` });
    }

    const newPrefix = await CollegePrefix.create({
      prefix,
      collegeName: (collegeName && collegeName.trim()) || 'Partner College',
      durationDays: Number(durationDays) || 365,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: `Prefix '${prefix}' added successfully with ${newPrefix.durationDays} days free access`,
      data: newPrefix,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCollegePrefix = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CollegePrefix.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Prefix not found' });
    }
    res.json({ success: true, message: 'Prefix deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleCollegePrefix = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await CollegePrefix.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Prefix not found' });
    }

    item.isActive = !item.isActive;
    await item.save();

    res.json({
      success: true,
      message: `Prefix '${item.prefix}' is now ${item.isActive ? 'Active' : 'Disabled'}`,
      data: item,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Inquiries / Messages & Notifications
export const getAdminInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markInquiryRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    inquiry.isRead = typeof isRead === 'boolean' ? isRead : true;
    await inquiry.save();

    res.json({
      success: true,
      message: `Inquiry marked as ${inquiry.isRead ? 'read' : 'unread'}`,
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllInquiriesRead = async (req, res) => {
  try {
    await Inquiry.updateMany({ isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Inquiry.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

