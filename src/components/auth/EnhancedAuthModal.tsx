import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Crown,
  Target,
  TrendingUp
} from 'lucide-react';

interface EnhancedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleSelect: (role: string) => void;
}

const roleOptions = [
  {
    id: 'job_seeker',
    title: 'Job Seeker',
    icon: Briefcase,
    color: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    description: 'Find your dream job',
    features: ['Job Search', 'Resume Builder', 'Job Alerts', 'Career Insights'],
    stats: '10,000+ Jobs'
  },
  {
    id: 'recruiter',
    title: 'Recruiter',
    icon: Users,
    color: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    description: 'Source top talent',
    features: ['Post Jobs', 'Search Candidates', 'Analytics', 'ATS Integration'],
    stats: '50,000+ Candidates'
  },
  {
    id: 'employer',
    title: 'Employer',
    icon: Building2,
    color: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    description: 'Build your team',
    features: ['Company Profile', 'Job Posting', 'Team Management', 'Branding'],
    stats: '1,000+ Companies'
  },
  {
    id: 'student',
    title: 'Student',
    icon: GraduationCap,
    color: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    description: 'Start your career',
    features: ['Internships', 'Mentorship', 'Learning Paths', 'Career Guidance'],
    stats: '5,000+ Students'
  }
];

export const EnhancedAuthModal: React.FC<EnhancedAuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onRoleSelect 
}) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    company: ''
  });

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      onRoleSelect(selectedRole);
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedRoleData = roleOptions.find(role => role.id === selectedRole);

  if (selectedRole && selectedRoleData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className={`w-16 h-16 ${selectedRoleData.bgColor} rounded-2xl flex items-center justify-center`}>
                <selectedRoleData.icon className={`h-8 w-8 ${selectedRoleData.iconColor}`} />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {isSignIn ? 'Welcome Back' : 'Join as'} {selectedRoleData.title}
            </DialogTitle>
            <p className="text-gray-600">
              {isSignIn 
                ? 'Sign in to your account to continue' 
                : `Create your ${selectedRoleData.title.toLowerCase()} account`
              }
            </p>
          </DialogHeader>

          <Tabs value={isSignIn ? 'signin' : 'signup'} onValueChange={(value) => setIsSignIn(value === 'signin')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="remember" className="rounded" />
                    <Label htmlFor="remember" className="text-sm">Remember me</Label>
                  </div>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Forgot password?
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className={`w-full ${selectedRoleData.color} ${selectedRoleData.hoverColor} text-white font-semibold py-3`}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {(selectedRole === 'employer' || selectedRole === 'recruiter') && (
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Enter your company name"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {!isSignIn && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        className="pl-10"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="terms" className="rounded" required />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the <Button variant="link" className="p-0 h-auto text-sm">Terms of Service</Button> and <Button variant="link" className="p-0 h-auto text-sm">Privacy Policy</Button>
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className={`w-full ${selectedRoleData.color} ${selectedRoleData.hoverColor} text-white font-semibold py-3`}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button 
              variant="ghost" 
              onClick={handleBackToRoles}
              className="w-full text-gray-600 hover:text-gray-800"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Back to Role Selection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl mx-auto">
        <DialogHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/logo.png" 
              alt="GigM8 Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <DialogTitle className="text-3xl font-bold text-gray-900">
            Choose Your Role
          </DialogTitle>
          <p className="text-gray-600 text-lg">
            Select how you'd like to use GigM8 to get started
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roleOptions.map((role, index) => {
            const IconComponent = role.icon;
            return (
              <Card 
                key={role.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:${role.borderColor} group`}
                onClick={() => handleRoleSelect(role.id)}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <CardHeader className={`${role.bgColor} rounded-t-lg`}>
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 ${role.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className={`h-6 w-6 ${role.iconColor}`} />
                    </div>
                    <Badge variant="secondary" className="bg-white/80 text-gray-700">
                      {role.stats}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-800">
                    {role.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 group-hover:text-gray-700">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {role.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Shield className="h-4 w-4" />
                      <span>Secure & Free</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>Trusted by 10,000+ Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
