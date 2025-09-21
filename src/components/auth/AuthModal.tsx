import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/types/auth";
import { 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Users, 
  Briefcase, 
  GraduationCap,
  CheckCircle,
  ArrowRight,
  Shield,
  Star,
  Zap,
  Target,
  TrendingUp,
  Globe,
  Database,
  BarChart3,
  Calendar,
  Bell,
  Lightbulb,
  Bookmark,
  Search,
  FileText,
  Upload,
  UserSearch,
  ClipboardList,
  CheckCircle2,
  Plus,
  Settings,
  HelpCircle,
  BookOpen,
  CreditCard,
  LogIn,
  UserPlus
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRole?: string;
  selectedFeatures?: any[];
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedRole = 'job_seeker',
  selectedFeatures = []
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: selectedRole as UserRole
  });
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.role);
        toast({
          title: "Account Created Successfully!",
          description: "Please check your email to verify your account and get started.",
        });
      } else {
        await signIn(formData.email, formData.password);
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in to your account.",
        });
        onClose();
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'job_seeker':
        return {
          title: 'Job Seeker',
          icon: Briefcase,
          color: 'from-blue-500 to-blue-600',
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-600',
          description: 'Find your dream job and advance your career',
          features: [
            'Find Jobs / Browse Openings',
            'Build My Resume / CV',
            'Upload Resume / Profile',
            'Job Alerts & Notifications',
            'Interview Preparation / Tips',
            'Saved Jobs & Applications'
          ]
        };
      case 'recruiter':
        return {
          title: 'Recruiter',
          icon: Users,
          color: 'from-purple-500 to-purple-600',
          bgColor: 'bg-purple-50',
          iconColor: 'text-purple-600',
          description: 'Source and manage top talent efficiently',
          features: [
            'Post a Job',
            'Search Candidates',
            'Manage Applications',
            'Shortlist Candidates',
            'Schedule Interviews',
            'Recruiter Dashboard / Analytics'
          ]
        };
      case 'employer':
        return {
          title: 'Employer',
          icon: Building2,
          color: 'from-green-500 to-green-600',
          bgColor: 'bg-green-50',
          iconColor: 'text-green-600',
          description: 'Build your team and grow your business',
          features: [
            'Company Dashboard',
            'Post Multiple Jobs',
            'Brand Page (showcase company)',
            'Access Resume Database',
            'Team Management (HR/recruiter roles)',
            'Analytics (views, applications, hires)'
          ]
        };
      case 'student':
        return {
          title: 'Student / Intern',
          icon: GraduationCap,
          color: 'from-orange-500 to-orange-600',
          bgColor: 'bg-orange-50',
          iconColor: 'text-orange-600',
          description: 'Start your career journey with confidence',
          features: [
            'Internships & Entry-Level Jobs',
            'Student Resume Builder',
            'Career Resources',
            'Mentorship / Networking'
          ]
        };
      default:
        return {
          title: 'Job Seeker',
          icon: Briefcase,
          color: 'from-blue-500 to-blue-600',
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-600',
          description: 'Find your dream job and advance your career',
          features: []
        };
    }
  };

  const roleInfo = getRoleInfo(formData.role);
  const IconComponent = roleInfo.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Role Info */}
          <div className="hidden lg:block">
            <div className="sticky top-0">
              <div className="text-center mb-8">
                <div className={`w-20 h-20 ${roleInfo.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className={`h-10 w-10 ${roleInfo.iconColor}`} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {roleInfo.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {roleInfo.description}
                </p>
              </div>

              <Card className="border-2 border-gray-100">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    What you'll get:
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {roleInfo.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">Enterprise Security</span>
                </div>
                <p className="text-sm text-gray-600">
                  Your data is protected with bank-level encryption and enterprise-grade security.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isSignUp ? 'Create Your Account' : 'Welcome Back'}
              </h1>
              <p className="text-gray-600">
                {isSignUp 
                  ? 'Join thousands of professionals who trust Gigm8 for their career growth'
                  : 'Sign in to access your personalized dashboard and tools'
                }
              </p>
            </div>

            {/* Role Badge */}
            <div className="flex justify-center lg:justify-start">
              <Badge className={`${roleInfo.bgColor} ${roleInfo.iconColor} border-0 px-4 py-2 text-sm font-medium`}>
                <IconComponent className="h-4 w-4 mr-2" />
                {roleInfo.title}
              </Badge>
            </div>

            <Tabs value={isSignUp ? 'signup' : 'signin'} onValueChange={(value) => setIsSignUp(value === 'signup')}>
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger value="signin" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="signin-password"
                          type="password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                      Forgot password?
                    </a>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg shadow-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Signing In...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <LogIn className="h-5 w-5" />
                        Sign In to Your Account
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-sm font-medium text-gray-700">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Must be at least 8 characters with letters and numbers
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      required
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg shadow-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Account...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Create Your Account
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                By continuing, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
