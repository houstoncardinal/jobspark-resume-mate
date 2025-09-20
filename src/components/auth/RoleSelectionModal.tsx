import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Users, 
  Building2, 
  GraduationCap,
  Search,
  FileText,
  Upload,
  Bell,
  Lightbulb,
  Bookmark,
  Plus,
  UserSearch,
  ClipboardList,
  CheckCircle,
  Calendar,
  BarChart3,
  Globe,
  Database,
  Settings,
  HelpCircle,
  BookOpen,
  CreditCard,
  LogIn,
  UserPlus,
  ArrowRight,
  Shield,
  Star,
  Zap
} from 'lucide-react';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleSelect: (role: string, features: string[]) => void;
}

const roleOptions = [
  {
    id: 'job_seeker',
    title: 'Job Seeker',
    icon: Briefcase,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    description: 'Find your dream job and advance your career',
    features: [
      'Find Jobs / Browse Openings',
      'Build My Resume / CV',
      'Upload Resume / Profile',
      'Job Alerts & Notifications',
      'Interview Preparation / Tips',
      'Saved Jobs & Applications'
    ],
    stats: '10,000+ Jobs',
    signInText: 'I\'m signing in as a Job Seeker'
  },
  {
    id: 'recruiter',
    title: 'Recruiter',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-600',
    description: 'Source and manage top talent efficiently',
    features: [
      'Post a Job',
      'Search Candidates',
      'Manage Applications',
      'Shortlist Candidates',
      'Schedule Interviews',
      'Recruiter Dashboard / Analytics'
    ],
    stats: '50,000+ Candidates',
    signInText: 'I\'m signing in as a Recruiter'
  },
  {
    id: 'employer',
    title: 'Employer',
    icon: Building2,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    description: 'Build your team and grow your business',
    features: [
      'Company Dashboard',
      'Post Multiple Jobs',
      'Brand Page (showcase company)',
      'Access Resume Database',
      'Team Management (HR/recruiter roles)',
      'Analytics (views, applications, hires)'
    ],
    stats: '500+ Companies',
    signInText: 'I\'m signing in as an Employer'
  },
  {
    id: 'student',
    title: 'Student / Intern',
    icon: GraduationCap,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    iconColor: 'text-orange-600',
    description: 'Start your career journey with confidence',
    features: [
      'Internships & Entry-Level Jobs',
      'Student Resume Builder',
      'Career Resources',
      'Mentorship / Networking'
    ],
    stats: '2,000+ Internships',
    signInText: 'I\'m signing in as a Student/Intern'
  }
];

const generalOptions = [
  { icon: LogIn, text: 'Sign In', description: 'Access your account' },
  { icon: CreditCard, text: 'Pricing', description: 'View our plans' },
  { icon: HelpCircle, text: 'Support', description: 'Get assistance' },
  { icon: BookOpen, text: 'Blog', description: 'Career insights' },
  { icon: Settings, text: 'Settings', description: 'Manage account' }
];

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ 
  isOpen, 
  onClose, 
  onRoleSelect 
}) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleClick = (roleId: string, features: any[]) => {
    setSelectedRole(roleId);
    onRoleSelect(roleId, features);
  };

  const selectedRoleData = selectedRole ? roleOptions.find(r => r.id === selectedRole) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="text-center pb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              src="/logo.png" 
              alt="Gigm8 Logo" 
              className="w-16 h-16 object-contain"
            />
            <div>
              <DialogTitle className="text-3xl font-bold text-gray-900">
                Welcome to Gigm8
              </DialogTitle>
              <p className="text-lg text-gray-600 mt-2">
                Choose your role to get started with personalized tools
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8">
          {/* Role Selection Cards - Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roleOptions.map((role) => {
              const IconComponent = role.icon;
              const isSelected = selectedRole === role.id;
              
              return (
                <Card 
                  key={role.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 ${
                    isSelected 
                      ? `${role.borderColor} shadow-xl ring-2 ring-blue-500 ring-opacity-50` 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleRoleClick(role.id, role.features)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 ${role.bgColor} rounded-xl flex items-center justify-center`}>
                        <IconComponent className={`h-6 w-6 ${role.iconColor}`} />
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900 mb-1">
                      {role.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 mb-2">
                      {role.description}
                    </CardDescription>
                    <Badge className={`${role.bgColor} ${role.iconColor} border-0 text-xs font-medium`}>
                      {role.stats}
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {role.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                      {role.features.length > 3 && (
                        <div className="text-xs text-gray-500 font-medium">
                          +{role.features.length - 3} more features
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Selected Role Description */}
          {selectedRoleData && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedRoleData.signInText}
                </h3>
                <p className="text-gray-600 mb-4">
                  You'll have access to all the tools and features designed specifically for {selectedRoleData.title.toLowerCase()}s
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Shield className="h-4 w-4" />
                  <span>Secure • Fast • Professional</span>
                </div>
              </div>
            </div>
          )}

          {/* Trust Indicators */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Enterprise Security</h3>
                <p className="text-sm text-gray-600">Bank-level encryption and compliance</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Trusted Platform</h3>
                <p className="text-sm text-gray-600">Used by 100,000+ professionals</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">AI-Powered</h3>
                <p className="text-sm text-gray-600">Advanced AI for better results</p>
              </div>
            </div>
          </div>

          {/* General Options - Compact Grid */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Additional Options
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {generalOptions.map((option, index) => (
                <Card 
                  key={index}
                  className="cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-105 border border-gray-200 hover:border-gray-300"
                >
                  <CardContent className="p-4 text-center">
                    <option.icon className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900 text-sm mb-1">
                      {option.text}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {option.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            {selectedRole && (
              <Button 
                onClick={() => onRoleSelect(selectedRole, [])}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg font-semibold"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Continue as {roleOptions.find(r => r.id === selectedRole)?.title}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
