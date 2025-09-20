import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/auth';
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
  ArrowLeft,
  LogIn,
  UserPlus
} from 'lucide-react';

const roleConfig = {
  job_seeker: {
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
    ],
    stats: '10,000+ Jobs Available'
  },
  recruiter: {
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
    ],
    stats: '50,000+ Candidates'
  },
  employer: {
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
    ],
    stats: '500+ Companies'
  },
  student: {
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
    ],
    stats: '2,000+ Internships'
  }
};

export default function SignIn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'job_seeker' as UserRole
  });
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();

  const role = searchParams.get('role') as keyof typeof roleConfig || 'job_seeker';
  const config = roleConfig[role] || roleConfig.job_seeker;
  const IconComponent = config.icon;

  useEffect(() => {
    setFormData(prev => ({ ...prev, role: role as UserRole }));
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.fullName, formData.role);
        toast({
          title: "Account Created Successfully!",
          description: `Welcome to Gigm8 as a ${config.title}! Please check your email to verify your account.`,
        });
        navigate('/dashboard');
      } else {
        await signIn(formData.email, formData.password);
        toast({
          title: "Welcome back!",
          description: `You've successfully signed in as a ${config.title}.`,
        });
        navigate('/dashboard');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Gigm8 Logo" 
                className="h-10 w-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Gigm8</h1>
                <p className="text-sm text-gray-600">AI-Powered Career Platform</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Role Info */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                  <div className={`w-16 h-16 ${config.bgColor} rounded-2xl flex items-center justify-center`}>
                    <IconComponent className={`h-8 w-8 ${config.iconColor}`} />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900">
                      {isSignUp ? `Join as ${config.title}` : `Welcome Back, ${config.title}`}
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">
                      {config.description}
                    </p>
                  </div>
                </div>

                <Badge className={`${config.bgColor} ${config.iconColor} border-0 text-sm px-4 py-2`}>
                  {config.stats}
                </Badge>
              </div>

              <Card className="border-2 border-gray-100">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    What you'll get:
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {config.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <span className="font-semibold text-gray-900">Trusted Platform</span>
                </div>
                <p className="text-sm text-gray-600">
                  Join over 100,000 professionals who trust Gigm8 for their career growth and talent acquisition needs.
                </p>
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="space-y-6">
              <Card className="shadow-xl border-0">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {isSignUp ? 'Create Your Account' : 'Sign In to Your Account'}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {isSignUp 
                      ? `Join thousands of ${config.title.toLowerCase()}s who trust Gigm8`
                      : `Access your personalized ${config.title.toLowerCase()} dashboard`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Role Badge */}
                  <div className="flex justify-center">
                    <Badge className={`${config.bgColor} ${config.iconColor} border-0 px-4 py-2 text-sm font-medium`}>
                      <IconComponent className="h-4 w-4 mr-2" />
                      {config.title}
                    </Badge>
                  </div>

                  {/* Auth Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {isSignUp && (
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                          Full Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="fullName"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
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
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="password"
                          type="password"
                          placeholder={isSignUp ? "Create a strong password" : "Enter your password"}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      {isSignUp && (
                        <p className="text-xs text-gray-500">
                          Must be at least 8 characters with letters and numbers
                        </p>
                      )}
                    </div>

                    {!isSignUp && (
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
                    )}

                    {isSignUp && (
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
                    )}

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg shadow-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {isSignUp ? 'Creating Account...' : 'Signing In...'}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {isSignUp ? <UserPlus className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
                          {isSignUp ? `Create ${config.title} Account` : `Sign In as ${config.title}`}
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      )}
                    </Button>
                  </form>

                  {/* Toggle Sign In/Sign Up */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                      <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-blue-600 hover:text-blue-500 font-medium"
                      >
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                      </button>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
