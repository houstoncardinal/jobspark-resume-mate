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
  UserPlus
} from 'lucide-react';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleSelect: (role: string, features: string[]) => void;
}

const roleOptions = [
  {
    id: 'job_seeker',
    title: 'For Job Seekers',
    icon: Briefcase,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    description: 'Find your dream job and advance your career',
    features: [
      { icon: Search, text: 'Find Jobs / Browse Openings' },
      { icon: FileText, text: 'Build My Resume / CV' },
      { icon: Upload, text: 'Upload Resume / Profile' },
      { icon: Bell, text: 'Job Alerts & Notifications' },
      { icon: Lightbulb, text: 'Interview Preparation / Tips' },
      { icon: Bookmark, text: 'Saved Jobs & Applications' }
    ]
  },
  {
    id: 'recruiter',
    title: 'For Recruiters',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    description: 'Source and manage top talent efficiently',
    features: [
      { icon: Plus, text: 'Post a Job' },
      { icon: UserSearch, text: 'Search Candidates' },
      { icon: ClipboardList, text: 'Manage Applications' },
      { icon: CheckCircle, text: 'Shortlist Candidates' },
      { icon: Calendar, text: 'Schedule Interviews' },
      { icon: BarChart3, text: 'Recruiter Dashboard / Analytics' }
    ]
  },
  {
    id: 'employer',
    title: 'For Companies / Employers',
    icon: Building2,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    description: 'Build your team and grow your business',
    features: [
      { icon: BarChart3, text: 'Company Dashboard' },
      { icon: Plus, text: 'Post Multiple Jobs' },
      { icon: Globe, text: 'Brand Page (showcase company)' },
      { icon: Database, text: 'Access Resume Database' },
      { icon: Users, text: 'Team Management (HR/recruiter roles)' },
      { icon: BarChart3, text: 'Analytics (views, applications, hires)' }
    ]
  },
  {
    id: 'student',
    title: 'For Students / Interns',
    icon: GraduationCap,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
    description: 'Start your career journey with confidence',
    features: [
      { icon: Briefcase, text: 'Internships & Entry-Level Jobs' },
      { icon: FileText, text: 'Student Resume Builder' },
      { icon: BookOpen, text: 'Career Resources' },
      { icon: Users, text: 'Mentorship / Networking' }
    ]
  }
];

const generalOptions = [
  { icon: LogIn, text: 'Sign Up / Sign In', description: 'Access your account' },
  { icon: CreditCard, text: 'Pricing / Plans', description: 'View our plans' },
  { icon: HelpCircle, text: 'Help Center / Support', description: 'Get assistance' },
  { icon: BookOpen, text: 'Blog / Career Advice', description: 'Read our insights' },
  { icon: Settings, text: 'Settings / Profile', description: 'Manage your account' }
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Gigm8
          </DialogTitle>
          <p className="text-lg text-gray-600">
            Choose your role to get started with the right tools for your needs
          </p>
        </DialogHeader>

        <div className="space-y-8">
          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roleOptions.map((role) => {
              const IconComponent = role.icon;
              return (
                <Card 
                  key={role.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 ${
                    selectedRole === role.id 
                      ? 'border-blue-500 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleRoleClick(role.id, role.features)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 ${role.bgColor} rounded-xl flex items-center justify-center`}>
                        <IconComponent className={`h-8 w-8 ${role.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-gray-900">
                          {role.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 mt-1">
                          {role.description}
                        </CardDescription>
                      </div>
                      {selectedRole === role.id && (
                        <Badge className="bg-blue-600 text-white">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      {role.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                          <feature.icon className="h-5 w-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* General Options */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              General Options
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {generalOptions.map((option, index) => (
                <Card 
                  key={index}
                  className="cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-105 border border-gray-200 hover:border-gray-300"
                >
                  <CardContent className="p-4 text-center">
                    <option.icon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
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
              className="px-8 py-3"
            >
              Cancel
            </Button>
            {selectedRole && (
              <Button 
                onClick={() => onRoleSelect(selectedRole, [])}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Continue with {roleOptions.find(r => r.id === selectedRole)?.title}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
