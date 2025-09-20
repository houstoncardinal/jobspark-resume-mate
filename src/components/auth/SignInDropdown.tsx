import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  LogIn, 
  UserPlus, 
  Briefcase, 
  Users, 
  Building2, 
  GraduationCap,
  ChevronDown,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

interface SignInDropdownProps {
  onRoleSelect: (role: string) => void;
}

const signInOptions = [
  {
    id: 'general',
    title: 'Sign In',
    subtitle: 'Access your account',
    icon: LogIn,
    color: 'from-gray-500 to-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    iconColor: 'text-gray-600'
  },
  {
    id: 'job_seeker',
    title: 'Sign In as Job Seeker',
    subtitle: 'Find jobs & build career',
    icon: Briefcase,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600'
  },
  {
    id: 'recruiter',
    title: 'Sign In as Recruiter',
    subtitle: 'Source & manage talent',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-600'
  },
  {
    id: 'employer',
    title: 'Sign In as Employer',
    subtitle: 'Build your team',
    icon: Building2,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600'
  },
  {
    id: 'student',
    title: 'Sign In as Student',
    subtitle: 'Start your career journey',
    icon: GraduationCap,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    iconColor: 'text-orange-600'
  }
];

export const SignInDropdown: React.FC<SignInDropdownProps> = ({ onRoleSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && 
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (roleId: string) => {
    onRoleSelect(roleId);
    setIsOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // Add a small delay to allow moving to dropdown
    setTimeout(() => {
      if (!dropdownRef.current?.matches(':hover')) {
        setIsOpen(false);
      }
    }, 100);
  };

  const handleDropdownMouseEnter = () => {
    setIsOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative group">
      {/* Desktop: Hover Dropdown */}
      <div className="hidden lg:block">
        <Button 
          ref={buttonRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg px-6 py-3 text-base font-semibold transition-all duration-300"
        >
          <LogIn className="h-5 w-5 mr-2" />
          Sign In
          <ChevronDown className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:rotate-180" />
        </Button>

        {/* Desktop Dropdown */}
        <div 
          ref={dropdownRef}
          className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 transform origin-top ${
            isOpen 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Gigm8 Logo" 
                className="w-8 h-8 object-contain"
              />
              <div>
                <h3 className="font-bold text-gray-900">Choose Your Role</h3>
                <p className="text-sm text-gray-600">Select how you'd like to sign in</p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="p-2">
            {signInOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md group ${
                    option.bgColor
                  } hover:${option.bgColor.replace('50', '100')} border border-transparent hover:${option.borderColor}`}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <div className={`w-10 h-10 ${option.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent className={`h-5 w-5 ${option.iconColor}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-semibold text-gray-900 group-hover:text-gray-800">
                      {option.title}
                    </h4>
                    <p className="text-sm text-gray-600 group-hover:text-gray-700">
                      {option.subtitle}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Secure authentication • Enterprise-grade security
            </p>
          </div>
        </div>
      </div>

      {/* Tablet: Centered Dropdown */}
      <div className="hidden md:block lg:hidden">
        <Button 
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg px-6 py-3 text-base font-semibold transition-all duration-300"
        >
          <LogIn className="h-5 w-5 mr-2" />
          Sign In
          <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>

        {/* Tablet Dropdown - Centered */}
        <div 
          ref={dropdownRef}
          className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 transform origin-top ${
            isOpen 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="Gigm8 Logo" 
                className="w-6 h-6 object-contain"
              />
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Choose Your Role</h3>
                <p className="text-xs text-gray-600">Select how you'd like to sign in</p>
              </div>
            </div>
          </div>

          {/* Options - Compact for Tablet */}
          <div className="p-2">
            {signInOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md group ${
                    option.bgColor
                  } hover:${option.bgColor.replace('50', '100')} border border-transparent hover:${option.borderColor}`}
                >
                  <div className={`w-8 h-8 ${option.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent className={`h-4 w-4 ${option.iconColor}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-semibold text-gray-900 text-sm group-hover:text-gray-800">
                      {option.title}
                    </h4>
                    <p className="text-xs text-gray-600 group-hover:text-gray-700">
                      {option.subtitle}
                    </p>
                  </div>
                  <ArrowRight className="h-3 w-3 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Secure authentication
            </p>
          </div>
        </div>
      </div>

      {/* Mobile: Slide-up Sheet */}
      <div className="block md:hidden">
        <Button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg px-4 py-2 text-sm font-semibold"
        >
          <Menu className="h-4 w-4 mr-2" />
          Sign In
        </Button>

        {/* Mobile Sheet */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end">
            <div className="bg-white w-full max-h-[80vh] rounded-t-2xl shadow-2xl transform transition-all duration-300 ease-out">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-200 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/logo.png" 
                      alt="Gigm8 Logo" 
                      className="w-8 h-8 object-contain"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">Choose Your Role</h3>
                      <p className="text-sm text-gray-600">Select how you'd like to sign in</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Options - Mobile Optimized */}
              <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                {signInOptions.map((option, index) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleOptionClick(option.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 active:scale-95 ${
                        option.bgColor
                      } hover:${option.bgColor.replace('50', '100')} border border-transparent hover:${option.borderColor}`}
                    >
                      <div className={`w-12 h-12 ${option.bgColor} rounded-xl flex items-center justify-center`}>
                        <IconComponent className={`h-6 w-6 ${option.iconColor}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-semibold text-gray-900 text-base">
                          {option.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {option.subtitle}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 p-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Secure authentication • Enterprise-grade security
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
