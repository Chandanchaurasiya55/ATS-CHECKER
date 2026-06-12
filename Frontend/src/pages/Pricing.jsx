import { Link } from 'react-router-dom';

const Pricing = () => {
  return (
    <div className="max-w-6xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <p className="text-sm uppercase tracking-[0.3em] text-primary-600 font-bold mb-3">Pricing</p>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900">Simple pricing for every job seeker</h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Choose the plan that fits your hiring goals. All plans include ATS analysis, resume optimization, and downloadable resume templates.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl transition-shadow">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500 mb-4">Free</div>
          <div className="text-5xl font-black text-gray-900">$49</div>
          <div className="mt-2 text-sm text-gray-500">forever</div>
          <ul className="mt-8 space-y-4 text-gray-600">
            <li>• 1 resume upload per month</li>
            <li>• Basic ATS score report</li>
            <li>• Keyword highlights</li>
          </ul>
          <Link
            to="/register"
            className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-white font-bold hover:bg-primary-500 transition-all"
          >
            Start Free
          </Link>
        </div>

        <div className="rounded-[2rem] border border-primary-200 bg-primary-50 p-8 shadow-xl">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-700 mb-4">Pro</div>
          <div className="text-5xl font-black text-gray-900">$99<span className="text-2xl font-medium">/mo</span></div>
          <div className="mt-2 text-sm text-gray-500">Most popular</div>
          <ul className="mt-8 space-y-4 text-gray-600">
            <li>• Unlimited resume uploads</li>
            <li>• Full ATS compatibility report</li>
            <li>• Resume builder + download</li>
            <li>• Keyword optimization tips</li>
          </ul>
          <Link
            to="/register"
            className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gray-900 px-6 py-3 text-white font-bold hover:bg-gray-800 transition-all"
          >
            Start Pro
          </Link>
        </div>

        <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl transition-shadow">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500 mb-4">Premium</div>
          <div className="text-5xl font-black text-gray-900">$199<span className="text-2xl font-medium">/mo</span></div>
          <div className="mt-2 text-sm text-gray-500">Best for job seekers</div>
          <ul className="mt-8 space-y-4 text-gray-600">
            <li>• Everything in Pro</li>
            <li>• Personalized resume review</li>
            <li>• ATS-ready cover letter</li>
            <li>• Priority support</li>
          </ul>
          <Link
            to="/register"
            className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-white font-bold hover:bg-primary-500 transition-all"
          >
            Go Premium
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
