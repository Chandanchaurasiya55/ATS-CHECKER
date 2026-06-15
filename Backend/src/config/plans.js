export const plans = [
  {
    id: 'fresher',
    name: 'Fresher Plan',
    pricePerMonth: 49,
    billingCycle: '3 months',
    billingAmount: 147, // ₹147 in rupees
    amountInPaise: 14700, // ₹147 in paise
    savings: null,
    features: [
      "All resume templates",
      "Basic resume sections",
      "ATSPro branding",
      "Maximum 12 section items",
      "Access to all design tools"
    ]
  },
  {
    id: 'experience',
    name: 'Experience Plan',
    pricePerMonth: 159,
    billingCycle: '3 months',
    billingAmount: 477, // ₹477 in rupees
    amountInPaise: 47700, // ₹477 in paise
    savings: 'SAVE 25%',
    totalValue: 636,
    features: [
      "300 resumes and cover letters",
      "All resume templates",
      "Real-time content suggestions",
      "ATS check (Applicant Tracking System)",
      "Pro resume sections",
      "No branding",
      "Unlimited section items",
      "Thousands of design options"
    ]
  },
  {
    id: 'executive',
    name: 'Executive Plan',
    pricePerMonth: 299,
    billingCycle: '3 months',
    billingAmount: 897, // ₹897 in rupees
    amountInPaise: 89700, // ₹897 in paise
    savings: 'SAVE 25%',
    totalValue: 1197,
    features: [
      "Unlimited resumes and cover letters",
      "All resume templates",
      "Priority real-time AI suggestions",
      "Multi-target ATS check",
      "Premium resume sections",
      "No branding + Custom footer",
      "Unlimited section items",
      "Access to all design tools + updates"
    ]
  }
];

export const getPlanById = (id) => plans.find(p => p.id === id);
