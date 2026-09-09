import mongoose from 'mongoose';

const collegePrefixSchema = new mongoose.Schema(
  {
    prefix: {
      type: String,
      required: [true, 'Prefix or domain is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    collegeName: {
      type: String,
      default: 'Partner College',
      trim: true,
    },
    durationDays: {
      type: Number,
      default: 365,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const CollegePrefix = mongoose.model('CollegePrefix', collegePrefixSchema);
export default CollegePrefix;
