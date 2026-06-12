import { Link } from 'react-router-dom';
import { FileText, Mail, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="bg-primary-600 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                ATS<span className="text-primary-500">Pro</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              AI-powered career tools designed to optimize your resume, beat the recruitment algorithms, and land your dream job offer.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/builder" className="hover:text-white transition-colors">Resume Builder</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">ATS Analyzer</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">Pricing Plans</Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <span className="cursor-not-allowed text-gray-600">Privacy Policy</span>
              </li>
              <li>
                <span className="cursor-not-allowed text-gray-600">Terms of Service</span>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Connect</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-500" />
                <a href="mailto:support@atspro.com" className="hover:text-white transition-colors">support@atspro.com</a>
              </li>
            </ul>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="hover:text-white transition-colors text-gray-500">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors text-gray-500">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors text-gray-500">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} Buimb Research LLP. All rights reserved.</p>
          <p className="text-gray-500">Developed by Buimb Research LLP</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
