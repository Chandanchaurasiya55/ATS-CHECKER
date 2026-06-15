import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Crown, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';
import toast from 'react-hot-toast';
import mockupImage from '../assets/resume_builder_mockup.png';
import templatesPileImage from '../assets/resume_templates_pile.png';

const MastercardLogo = () => (
  <svg className="h-6 w-auto" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="24" rx="4" fill="#F8FAFC"/>
    <circle cx="14" cy="12" r="7" fill="#EB001B"/>
    <circle cx="22" cy="12" r="7" fill="#F79E1B" fillOpacity="0.8"/>
  </svg>
);

const VisaLogo = () => (
  <svg className="h-6 w-auto" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="24" rx="4" fill="#F8FAFC"/>
    <path d="M13.4 8.2h-1.6l-2.5 6.4h1.6l.5-1.4h3l.3 1.4h1.4l-2.7-6.4zm-1.6 3.8l.9-2.5.5 2.5h-1.4zm9.3-3.8h-1.4c-.4 0-.8.2-1 .6l-2.6 5.8h1.6l.3-.9h2c0 .1.1.2.1.3l.9.6h1.5l-1.4-6.4zm-2.8 3.8l.8-1.9.4 1.9h-1.2zm7.6-3.8h-1.5l-1.2 4.2-.5-3.5c-.1-.5-.5-.7-.9-.7H20v.3c.4 0 .8.2.9.5l1.7 5.6h1.6l2.4-6.4z" fill="#1A1F71"/>
  </svg>
);

const AmexLogo = () => (
  <svg className="h-6 w-auto" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="24" rx="4" fill="#0070CD"/>
    <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="600" fontFamily="sans-serif">AMEX</text>
  </svg>
);

const DiscoverLogo = () => (
  <svg className="h-6 w-auto" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="24" rx="4" fill="#F8FAFC"/>
    <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fill="#FF6B00" fontSize="7" fontWeight="600" fontFamily="sans-serif">DISCOVER</text>
  </svg>
);

const PaypalLogo = () => (
  <svg className="h-6 w-auto" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="24" rx="4" fill="#003087"/>
    <path d="M12.5 6.5h4.2c1.7 0 3 .4 3.7 1.1c.6.6.9 1.5.9 2.5c0 1.2-.4 2.2-1.1 2.9c-.8.8-2 1.2-3.6 1.2h-1.6l-.8 4.3H11l1.5-12zm3.3 5.4c.8 0 1.4-.2 1.7-.6c.3-.4.5-.9.5-1.5c0-.5-.1-.9-.4-1.1c-.3-.3-.8-.4-1.5-.4h-1.6l-.7 3.6h2z" fill="#0079C1"/>
    <path d="M14.5 8.5h4.2c1.7 0 3 .4 3.7 1.1c.6.6.9 1.5.9 2.5c0 1.2-.4 2.2-1.1 2.9c-.8.8-2 1.2-3.6 1.2h-1.6l-.8 4.3H13l1.5-12zm3.3 5.4c.8 0 1.4-.2 1.7-.6c.3-.4.5-.9.5-1.5c0-.5-.1-.9-.4-1.1c-.3-.3-.8-.4-1.5-.4h-1.6l-.7 3.6h2z" fill="#00457C"/>
  </svg>
);

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Pricing = () => {
  const { isAuthenticated, user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingPlan, setPayingPlan] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/payments/plans');
        setPlans(res.data.data);
      } catch (err) {
        console.error("Failed to fetch plans, using fallback details", err);
        setPlans([
          {
            id: 'fresher',
            name: 'Fresher Plan',
            pricePerMonth: 49,
            billingCycle: '3 months',
            billingAmount: 147,
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
            billingAmount: 477,
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
            billingAmount: 897,
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
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handlePayment = async (planId) => {
    if (!isAuthenticated) {
      toast.error("Please login or register to buy a plan.");
      navigate('/login?redirect=/pricing');
      return;
    }

    setPayingPlan(planId);

    try {
      const res = await api.post('/payments/create-order', { plan: planId });
      const { orderId, amount, currency, keyId, plan } = res.data;

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
        setPayingPlan(null);
        return;
      }

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "ATS Resume Pro",
        description: `${plan.name} - Billing: ₹${plan.billingAmount} / ${plan.billingCycle}`,
        image: "https://cdn-icons-png.flaticon.com/512/2912/2912761.png",
        order_id: orderId,
        handler: async function (response) {
          const verifyToast = toast.loading("Verifying payment transaction...");
          try {
            const verifyRes = await api.post('/payments/verify-payment', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              toast.success("Payment verified! Your account is upgraded.", { id: verifyToast });
              await refreshUser();
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error(err.response?.data?.message || "Payment verification failed. Please contact support.", { id: verifyToast });
          } finally {
            setPayingPlan(null);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#4f46e5",
        },
        modal: {
          ondismiss: function () {
            setPayingPlan(null);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error("Payment initiation error:", err);
      toast.error(err.response?.data?.message || "Failed to initiate payment. Please try again.");
      setPayingPlan(null);
    }
  };

  return (
    <div className="relative bg-[#fafafa] overflow-hidden min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      {/* Background blobs for premium layout */}
      <div className="absolute top-0 -left-20 w-[600px] h-[600px] bg-primary-100/30 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute top-[800px] -right-20 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-40 -left-40 w-[600px] h-[600px] bg-primary-100/20 rounded-full blur-3xl -z-10"></div>

      {/* Top Header */}
      <div className="text-center mb-12 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-gray-900 tracking-tight leading-[1.15] mb-8">
          Build a strikingly powerful<br />resume approved by recruiters
        </h1>
        <Link
          to={isAuthenticated ? "/builder" : "/register"}
          className="inline-flex items-center justify-center bg-primary-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-primary-700 hover:scale-105 transition-all shadow-lg shadow-primary-200"
        >
          Build My Resume Now
        </Link>
      </div>

      {/* Pricing Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto items-stretch px-2 relative">
          {plans.map((plan) => {
            const isHighlighted = plan.id === 'experience';
            const isUserCurrentPlan = user?.plan === plan.id;
            
            let btnText = "Buy Plan";
            let isDisabled = false;

            if (isUserCurrentPlan) {
              btnText = "Active Plan";
              isDisabled = true;
            } else if (isAuthenticated) {
              if (plan.id === 'fresher' && (user?.plan === 'experience' || user?.plan === 'executive')) {
                btnText = "Downgrade Contact Support";
                isDisabled = true;
              } else if (plan.id === 'experience' && user?.plan === 'executive') {
                btnText = "Downgrade Contact Support";
                isDisabled = true;
              } else {
                btnText = "Upgrade Plan";
              }
            }

            return (
              <div 
                key={plan.id}
                className={
                  isHighlighted
                    ? "relative rounded-3xl border border-primary-100 bg-white p-5 md:p-6 shadow-2xl shadow-primary-100/60 flex flex-col justify-between transform transition-all duration-300 hover:scale-[1.01]"
                    : "rounded-3xl border border-gray-200/80 bg-white p-5 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                }
              >
                {isHighlighted && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-t-3xl"></div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                    {isHighlighted ? (
                      <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 p-0.5 text-white">
                          <Crown className="w-3 h-3 fill-white text-white" />
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-700">{plan.name}</span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center bg-gray-100 text-gray-700 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-lg">
                        {plan.name}
                      </span>
                    )}

                    {plan.savings && (
                      <span className="bg-primary-100 text-primary-800 text-[10px] font-normal px-2 py-1 rounded-lg">
                        {plan.totalValue ? `₹${plan.totalValue} - ` : ''}{plan.savings}
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 mt-3">
                    <span className="text-4xl font-semibold text-gray-900">₹{plan.pricePerMonth}</span>
                    <span className="text-lg font-semibold text-gray-900">/mo</span>
                  </div>
                  <p className="text-gray-500 font-normal mt-1 text-sm">₹{plan.billingAmount} billed every {plan.billingCycle}</p>

                  <div className="border-b border-gray-100 mt-4 mb-4"></div>

                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-gray-600 text-sm font-normal">
                        <Check className={`w-4 h-4 shrink-0 ${isHighlighted ? 'text-primary-600' : 'text-gray-500'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => !isDisabled && handlePayment(plan.id)}
                  disabled={isDisabled || payingPlan === plan.id}
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-xl py-2.5 px-6 font-semibold transition-all duration-200 text-sm border-2 ${
                    isDisabled 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                      : isHighlighted
                        ? "bg-primary-600 text-white border-primary-600 hover:bg-primary-700 hover:border-primary-700 shadow-lg shadow-primary-200 hover:scale-[1.02]"
                        : "border-gray-900 bg-white text-gray-900 hover:bg-gray-900 hover:text-white"
                  }`}
                >
                  {payingPlan === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    btnText
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Payment Badges Section */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 text-sm text-gray-500 font-semibold">
        <span>We accept:</span>
        <div className="flex items-center gap-3">
          <MastercardLogo />
          <VisaLogo />
          <AmexLogo />
          <DiscoverLogo />
          <PaypalLogo />
        </div>
      </div>

      {/* Connection Curve 1 (PayPal to Feature 1) */}
      <div className="hidden md:block max-w-4xl mx-auto relative h-28 -mt-6">
        <svg className="absolute left-[380px] top-0 w-64 h-32 text-gray-300 stroke-current stroke-2 fill-none" viewBox="0 0 256 128" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="currentColor" />
            </marker>
          </defs>
          <path d="M 50 10 C 130 50, 150 -10, 195 105" strokeDasharray="6 6" markerEnd="url(#arrow)" />
        </svg>
      </div>

      {/* Feature Section 1: Resume Builder control panel */}
      <div className="max-w-5xl mx-auto mt-20 md:mt-24 grid md:grid-cols-2 gap-12 items-center px-4">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight leading-tight">
            A feature-packed resume<br />builder that makes resume<br />creation a breeze
          </h2>
          <p className="text-gray-600 text-base font-normal leading-relaxed">
            Create a visually stunning resume with ease. Our resume builder will guide you through the process. We help with content suggestions and choosing the right design and layout, while you focus on presenting yourself.
          </p>
          <Link
            to={isAuthenticated ? "/builder" : "/register"}
            className="inline-flex items-center justify-center border-2 border-gray-900 bg-white text-gray-900 font-semibold px-8 py-4 rounded-xl hover:bg-gray-900 hover:text-white hover:scale-105 transition-all duration-200"
          >
            Build My Resume Now
          </Link>
        </div>
        <div className="relative flex justify-center">
          <img
            src={mockupImage}
            alt="Resume Builder Editor interface mockup showing customization options"
            className="rounded-2xl shadow-2xl max-w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-300 border border-gray-100"
          />
        </div>
      </div>

      {/* Connection Curve 2 (Feature 1 to Feature 2) */}
      <div className="hidden md:block max-w-4xl mx-auto relative h-28 -mt-6">
        <svg className="absolute left-[80px] top-0 w-64 h-32 text-gray-300 stroke-current stroke-2 fill-none" viewBox="0 0 256 128" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker id="arrow2" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="currentColor" />
            </marker>
          </defs>
          <path d="M 190 10 C 100 50, 120 -10, 35 105" strokeDasharray="6 6" markerEnd="url(#arrow2)" />
        </svg>
      </div>

      {/* Feature Section 2: Hundreds of templates */}
      <div className="max-w-5xl mx-auto mt-20 md:mt-24 grid md:grid-cols-2 gap-12 items-center px-4">
        <div className="order-2 md:order-1 relative flex justify-center">
          <img
            src={templatesPileImage}
            alt="Fanned-out deck of professional clean resume templates"
            className="rounded-2xl shadow-2xl max-w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-300 border border-gray-100"
          />
        </div>
        <div className="order-1 md:order-2 space-y-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight leading-tight">
            One resume builder, hundreds of<br />templates
          </h2>
          <p className="text-gray-600 text-base font-normal leading-relaxed">
            Choose from hundreds of professionally designed and ATS-friendly resume templates, tens of resume sections, and thousands of combinations made to make you stand out.
          </p>
          <Link
            to={isAuthenticated ? "/builder" : "/register"}
            className="inline-flex items-center justify-center border-2 border-gray-900 bg-white text-gray-900 font-semibold px-8 py-4 rounded-xl hover:bg-gray-900 hover:text-white hover:scale-105 transition-all duration-200"
          >
            View All Templates
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
