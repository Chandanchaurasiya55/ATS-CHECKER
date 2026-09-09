import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Crown, Loader2, AlertCircle, GraduationCap, Sparkles, Building2, Calendar, ArrowRight } from 'lucide-react';
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
  const { isAuthenticated, user, refreshUser, isSubscriptionExpired, daysRemaining } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payingPlan, setPayingPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('quarterly'); // 'monthly' or 'quarterly'

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setError(null);
        const res = await api.get('/payments/plans');
        setPlans(res.data.data);
      } catch (err) {
        console.error("Failed to fetch plans from backend:", err);
        setError("Could not load pricing plans. Please check your internet connection.");
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
      const res = await api.post('/payments/create-order', { plan: planId, billingCycle });
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
        description: `${plan.name} - Billing: ₹${plan.billingAmount} / ${plan.billingCycleName}`,
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

      {/* Expired Plan Alert Banner */}
      {isSubscriptionExpired && (
        <div className="max-w-4xl mx-auto mb-12 p-6 rounded-3xl bg-gradient-to-r from-rose-500 via-red-600 to-amber-600 text-white shadow-xl shadow-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-inner">
              <AlertCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="font-black text-lg sm:text-xl">Your subscription has been expired</p>
              <p className="text-white/90 text-xs sm:text-sm mt-1 leading-relaxed">
                Aapka 1-saal ka college free access expire ho chuka hai. All templates aur AI features bina kisi interruption use karne ke liye neeche se apna plan choose karein.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white text-rose-700 px-4 py-2 rounded-xl shadow-sm shrink-0">
            Select A Plan
          </span>
        </div>
      )}

      {/* 1-Year College Active Plan Showcase */}
      {user?.isCollegeTrial && !isSubscriptionExpired && (
        <div className="max-w-4xl mx-auto mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-primary-900 via-primary-800 to-blue-950 text-white shadow-2xl shadow-primary-900/30 border border-primary-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-primary-500/20 text-primary-200 border border-primary-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-primary-300" />
                <span>Active 1-Year College Subscription</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {user.collegeName || 'Partner College'} Pass
              </h2>

              <p className="text-primary-100 text-sm max-w-xl leading-relaxed">
                Aapko aapke college email prefix se <strong>1 Saal (365 Din)</strong> ke liye Executive tier premium access free activate kiya gaya hai.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-primary-200 pt-1">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
                  <Calendar className="w-4 h-4 text-primary-300" />
                  Valid till: {user.planExpiresAt ? new Date(user.planExpiresAt).toLocaleDateString() : '1 Year'}
                </span>
                <span className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                  <Sparkles className="w-4 h-4" />
                  {daysRemaining !== null ? `${daysRemaining} Days Remaining` : 'Active'}
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
                  100% Free · Sponsored Access
                </span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-start md:items-end gap-3">
              <span className="inline-flex items-center gap-2 bg-emerald-500 text-white font-black text-xs uppercase px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/30">
                <Check className="w-4 h-4 stroke-[3]" /> Active Plan
              </span>
              <Link
                to="/builder"
                className="inline-flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
              >
                Go to Builder <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* For Non-College Users / Partner Info */}
      {!user?.isCollegeTrial && (
        <div className="max-w-4xl mx-auto mb-10 p-4 sm:p-5 rounded-2xl bg-blue-50/80 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-blue-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span>
              <strong>Are you a College Student?</strong> Agar aapke college ne ATSPro ke sath tie-up kiya hai, to apne college email domain/prefix se register karein aur 1-Year free Executive access payein.
            </span>
          </div>
          {!isAuthenticated && (
            <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700 underline shrink-0 whitespace-nowrap">
              Register with College Email →
            </Link>
          )}
        </div>
      )}

      {/* Top Header */}
      <div className="text-center mb-8 max-w-4xl mx-auto">
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

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center items-center mb-16">
        <div className="bg-gray-100/80 backdrop-blur-md p-1.5 rounded-2xl flex items-center gap-1 border border-gray-200">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              billingCycle === 'monthly'
                ? 'bg-white text-gray-900 shadow-md shadow-gray-200/50'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('quarterly')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 ${
              billingCycle === 'quarterly'
                ? 'bg-primary-600 text-white shadow-md shadow-primary-200/50'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            3-Months Billing
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
              billingCycle === 'quarterly' ? 'bg-white text-primary-700' : 'bg-primary-100 text-primary-700'
            }`}>
              Save 25%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        </div>
      ) : error ? (
        <div className="max-w-md mx-auto text-center bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm flex flex-col items-center gap-3">
          <AlertCircle className="w-12 h-12 text-red-600" />
          <h3 className="text-lg font-bold text-gray-900">Failed to Load Pricing</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              api.get('/payments/plans').then((res) => {
                setPlans(res.data.data);
                setLoading(false);
              }).catch(() => {
                setError("Could not load pricing plans. Please check your internet connection.");
                setLoading(false);
              });
            }}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-red-200"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto items-stretch px-2 relative">
          {plans.map((plan) => {
            const pricing = plan.pricing[billingCycle];
            if (!pricing) return null;

            const isHighlighted = plan.id === 'experience';
            const isUserCurrentPlan = !isSubscriptionExpired && user?.plan === plan.id;
            
            let btnText = "Buy Plan";
            let isDisabled = false;

            if (isUserCurrentPlan) {
              btnText = "Active Plan";
              isDisabled = true;
            } else if (isSubscriptionExpired) {
              btnText = "Renew Plan";
              isDisabled = false;
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

                    {pricing.savings && (
                      <span className="bg-primary-100 text-primary-800 text-[10px] font-normal px-2 py-1 rounded-lg">
                        {pricing.totalValue ? `₹${pricing.totalValue} - ` : ''}{pricing.savings}
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 mt-3">
                    <span className="text-4xl font-semibold text-gray-900">₹{pricing.pricePerMonth}</span>
                    <span className="text-lg font-semibold text-gray-900">/mo</span>
                  </div>
                  <p className="text-gray-500 font-normal mt-1 text-sm">₹{pricing.billingAmount} billed every {pricing.billingCycleName}</p>

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
