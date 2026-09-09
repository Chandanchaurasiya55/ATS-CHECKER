import Inquiry from '../models/Inquiry.js';

export const submitContact = async (req, res) => {
  try {
    const { name, email, type = 'general', companyOrInstitution = '', size = '', message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      });
    }

    const inquiry = await Inquiry.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      type,
      companyOrInstitution: (companyOrInstitution || '').trim(),
      size: (size || '').trim(),
      message: message.trim(),
      isRead: false,
    });

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully. Our team will contact you soon!',
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
