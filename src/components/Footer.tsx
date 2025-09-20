import { Link } from "react-router-dom";
import { Building2, Crown } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-10">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="Gigm8 Logo" 
                className="h-8 w-auto object-contain"
              />
              <span className="text-lg font-bold text-gray-900">Gigm8</span>
            </div>
            <p className="text-sm text-gray-600">
              AI-powered career platform helping job seekers find their dream roles and optimize their resumes.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="h-4 w-4" />
              <span>Trusted by 10,000+ Companies</span>
            </div>
          </div>

          {/* Job Seeker Tools */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">For Job Seekers</h3>
            <nav className="space-y-2">
              <Link to="/" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Job Search
              </Link>
              <Link to="/builder" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Resume Builder
              </Link>
              <a href="/#upload" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Resume Upload
              </a>
              <a href="/#match" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Match Analysis
              </a>
              <a href="/#optimize" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                AI Optimizer
              </a>
              <Link to="/applied" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Applied Jobs
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Resources</h3>
            <nav className="space-y-2">
              <Link to="/blog" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Blog
              </Link>
              <Link to="/faq" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                FAQ
              </Link>
              <a href="#help" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Help Center
              </a>
              <a href="#filters" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Job Filters
              </a>
            </nav>
          </div>

          {/* Business & Enterprise */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Business</h3>
            <nav className="space-y-2">
              <Link 
                to="/fortune500" 
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
              >
                <Crown className="h-4 w-4" />
                GigM8 For Businesses
              </Link>
              <a href="/fortune500#revenue" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Revenue Analytics
              </a>
              <a href="/fortune500#viral" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Growth Strategy
              </a>
              <a href="/fortune500#ai" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                AI Power Suite
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} Gigm8. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
