import User from '../models/User.js';
import Resume from '../models/Resume.js';
import CollegePrefix from '../models/CollegePrefix.js';
import { generateToken } from '../middleware/auth.js';

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
    const recentResumes = await Resume.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email');

    res.json({
      success: true,
      data: {
        totalUsers,
        totalAdmins,
        totalResumes,
        recentResumes,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminResumes = async (req, res) => {
  try {
    const resumes = await Resume.find().populate('user', 'name email');
    res.json({ success: true, data: resumes });
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
