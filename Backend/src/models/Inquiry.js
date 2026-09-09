import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    type: {
      type: String,
      enum: ['recruitment', 'higher-education', 'career-coaches', 'general'],
      default: 'general',
    },
    companyOrInstitution: {
      type: String,
      default: '',
      trim: true,
    },
    size: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
