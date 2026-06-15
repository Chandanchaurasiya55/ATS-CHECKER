export const plans = [
  {
    id: 'fresher',
    name: 'Fresher Plan',
    features: [
      "All resume templates",
      "Basic resume sections",
      "ATSPro branding",
      "Maximum 12 section items",
      "Access to all design tools"
    ],
    pricing: {
      monthly: {
        pricePerMonth: 49,
        billingCycleName: 'monthly',
        billingAmount: 49,
        amountInPaise: 4900,
        durationDays: 30,
        savings: null,
      },
      quarterly: {
        pricePerMonth: 49,
        billingCycleName: '3 months',
        billingAmount: 147,
        amountInPaise: 14700,
        durationDays: 90,
        savings: null,
      }
    }
  },
  {
    id: 'experience',
    name: 'Experience Plan',
    features: [
      "300 resumes and cover letters",
      "All resume templates",
      "Real-time content suggestions",
      "ATS check (Applicant Tracking System)",
      "Pro resume sections",
      "No branding",
      "Unlimited section items",
      "Thousands of design options"
    ],
    pricing: {
      monthly: {
        pricePerMonth: 159,
        billingCycleName: 'monthly',
        billingAmount: 159,
        amountInPaise: 15900,
        durationDays: 30,
        savings: null,
      },
      quarterly: {
        pricePerMonth: 159,
        billingCycleName: '3 months',
        billingAmount: 477,
        amountInPaise: 47700,
        durationDays: 90,
        savings: 'SAVE 25%',
        totalValue: 636,
      }
    }
  },
  {
    id: 'executive',
    name: 'Executive Plan',
    features: [
      "Unlimited resumes and cover letters",
      "All resume templates",
      "Priority real-time AI suggestions",
      "Multi-target ATS check",
      "Premium resume sections",
      "No branding + Custom footer",
      "Unlimited section items",
      "Access to all design tools + updates"
    ],
    pricing: {
      monthly: {
        pricePerMonth: 299,
        billingCycleName: 'monthly',
        billingAmount: 299,
        amountInPaise: 29900,
        durationDays: 30,
        savings: null,
      },
      quarterly: {
        pricePerMonth: 299,
        billingCycleName: '3 months',
        billingAmount: 897,
        amountInPaise: 89700,
        durationDays: 90,
        savings: 'SAVE 25%',
        totalValue: 1197,
      }
    }
  }
];

export const getPlanById = (id) => plans.find(p => p.id === id);
