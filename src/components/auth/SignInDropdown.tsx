import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  LogIn, 
  UserPlus, 
  Briefcase, 
  Users, 
  Building2, 
  GraduationCap,
  ChevronDown,
  ArrowRight
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

  const handleOptionClick = (roleId: string) => {
    onRoleSelect(roleId);
    setIsOpen(false);
  };

  return (
    <div className="relative group">
      {/* Main Sign In Button */}
      <Button 
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg px-6 py-3 text-base font-semibold transition-all duration-300"
      >
        <LogIn className="h-5 w-5 mr-2" />
        Sign In
        <ChevronDown className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:rotate-180" />
      </Button>

      {/* Animated Dropdown */}
      <div 
        className={`absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 transform origin-top ${
          isOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
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
  );
};
