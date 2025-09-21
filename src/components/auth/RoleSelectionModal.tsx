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
  LogIn,
  UserPlus,
  ArrowRight,
  CheckCircle,
  Shield,
  Star,
  Zap,
  X
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
    description: 'Find your dream job',
    features: ['Job Search', 'Resume Builder', 'Job Alerts'],
    stats: '10,000+ Jobs'
  },
  {
    id: 'recruiter',
    title: 'Recruiter',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-600',
    description: 'Source top talent',
    features: ['Post Jobs', 'Search Candidates', 'Analytics'],
    stats: '50,000+ Candidates'
  },
  {
    id: 'employer',
    title: 'Employer',
    icon: Building2,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    description: 'Build your team',
    features: ['Company Dashboard', 'Post Jobs', 'Team Management'],
    stats: '500+ Companies'
  },
  {
    id: 'student',
    title: 'Student',
    icon: GraduationCap,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    iconColor: 'text-orange-600',
    description: 'Start your career',
    features: ['Internships', 'Resume Builder', 'Career Resources'],
    stats: '2,000+ Internships'
  }
];

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ 
  isOpen, 
  onClose, 
  onRoleSelect 
}) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleClick = (roleId: string, features: any[]) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (selectedRole) {
      const roleData = roleOptions.find(r => r.id === selectedRole);
      onRoleSelect(selectedRole, roleData?.features || []);
    }
  };

  const selectedRoleData = selectedRole ? roleOptions.find(r => r.id === selectedRole) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/logo.png" 
                alt="Gigm8 Logo" 
                className="w-12 h-12 object-contain bg-white rounded-lg p-2"
              />
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  Join Gigm8
                </DialogTitle>
                <p className="text-blue-100 mt-1">
                  Choose your role to get started
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Role Selection - Compact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {roleOptions.map((role) => {
              const IconComponent = role.icon;
              const isSelected = selectedRole === role.id;
              
              return (
                <Card 
                  key={role.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 ${
                    isSelected 
                      ? `${role.borderColor} shadow-lg ring-2 ring-blue-500 ring-opacity-50` 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleRoleClick(role.id, role.features)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 ${role.bgColor} rounded-lg flex items-center justify-center`}>
                        <IconComponent className={`h-5 w-5 ${role.iconColor}`} />
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 text-sm">
                      {role.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">
                      {role.description}
                    </p>
                    <Badge className={`${role.bgColor} ${role.iconColor} border-0 text-xs`}>
                      {role.stats}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Selected Role Info */}
          {selectedRoleData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 ${selectedRoleData.bgColor} rounded-lg flex items-center justify-center`}>
                  <selectedRoleData.icon className={`h-4 w-4 ${selectedRoleData.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedRoleData.title} Account
                  </h3>
                  <p className="text-sm text-gray-600">
                    Access to {selectedRoleData.features.join(', ')} and more
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Trust Indicators - Compact */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium">Secure</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Star className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium">Trusted</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Zap className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium">AI-Powered</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              variant="outline"
              className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In Instead
            </Button>
            {selectedRole && (
              <Button 
                onClick={handleContinue}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg font-semibold"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Continue as {selectedRoleData?.title}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Sign In Option */}
          {!selectedRole && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in here
                </button>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
