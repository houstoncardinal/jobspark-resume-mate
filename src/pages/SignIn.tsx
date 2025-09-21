import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { SEO } from '@/components/SEO';
import { PAGE_SEO } from '@/lib/seo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Briefcase, 
  Building2, 
  GraduationCap, 
  Loader2,
  CheckCircle,
  ArrowRight,
  Shield,
  Star,
  Users,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { JobSeekerSignUpForm } from '@/components/auth/forms/JobSeekerSignUpForm';
import { RecruiterSignUpForm } from '@/components/auth/forms/RecruiterSignUpForm';
import { EmployerSignUpForm } from '@/components/auth/forms/EmployerSignUpForm';
import { StudentSignUpForm } from '@/components/auth/forms/StudentSignUpForm';

const SignIn = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role") || "job_seeker";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const rolesConfig: { [key: string]: any } = {
    job_seeker: {
      title: "Sign In as a Job Seeker",
      description: "Find your dream job and optimize your resume with AI.",
      icon: User,
      color: "text-blue-600",
      bg: "bg-blue-50",
      signUpForm: JobSeekerSignUpForm,
      path: "/signin?role=job_seeker"
    },
    recruiter: {
      title: "Sign In as a Recruiter",
      description: "Discover top talent and streamline your hiring process.",
      icon: Briefcase,
      color: "text-purple-600",
      bg: "bg-purple-50",
      signUpForm: RecruiterSignUpForm,
      path: "/signin?role=recruiter"
    },
    employer: {
      title: "Sign In as an Employer",
      description: "Post jobs, manage applications, and build your team.",
      icon: Building2,
      color: "text-green-600",
      bg: "bg-green-50",
      signUpForm: EmployerSignUpForm,
      path: "/signin?role=employer"
    },
    student: {
      title: "Sign In as a Student",
      description: "Kickstart your career with internships and entry-level jobs.",
      icon: GraduationCap,
      color: "text-orange-600",
      bg: "bg-orange-50",
      signUpForm: StudentSignUpForm,
      path: "/signin?role=student"
    },
  };

  const currentRoleConfig = rolesConfig[roleParam] || rolesConfig.job_seeker;

  const handleAuth = async (type: 'signin' | 'signup') => {
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (type === 'signin') {
        await signIn(email, password);
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
        navigate('/dashboard');
      } else {
        await signUp(email, password, roleParam);
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account.",
        });
        navigate('/email-verified');
      }
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO seoData={PAGE_SEO['/signin']} url="/signin" />
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
          <Card className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 shadow-xl rounded-xl overflow-hidden">
            {/* Left Column: Role Info */}
            <div className={cn("p-8 text-white flex flex-col justify-between", currentRoleConfig.color.replace('from-', 'bg-gradient-to-br from-').replace('to-', 'to-'))}>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <currentRoleConfig.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Gigm8</h1>
                    <p className="text-white/80">Career Platform</p>
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold mb-4">
                  {currentRoleConfig.title}
                </h2>
                <p className="text-lg text-white/90 mb-8">
                  {currentRoleConfig.description}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-white/80" />
                    <span className="text-white/90">Access to thousands of job opportunities</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-white/80" />
                    <span className="text-white/90">AI-powered resume builder</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-white/80" />
                    <span className="text-white/90">Advanced career tools and insights</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <p className="text-sm text-white/70 mb-4">Join thousands of professionals</p>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 bg-white/20 rounded-full border-2 border-white/30 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-white/80">+10,000 active users</span>
                </div>
              </div>
            </div>

            {/* Right Column: Auth Form */}
            <div className="p-8 bg-white flex flex-col justify-center">
              <CardHeader className="text-center">
                <currentRoleConfig.icon className={cn("h-12 w-12 mx-auto mb-4", currentRoleConfig.color)} />
                <CardTitle className="text-3xl font-bold text-gray-900">
                  {isSignUp ? "Create Your Account" : "Sign In to Gigm8"}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  {isSignUp ? `Join as a ${currentRoleConfig.title.replace('Sign In as a ', '').replace('Sign In as an ', '')}` : "Enter your credentials below."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={isSignUp ? "signup" : "signin"} onValueChange={(value) => setIsSignUp(value === "signup")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleAuth('signin')}
                      className={cn(
                        "w-full text-lg py-3",
                        roleParam === "job_seeker" && "bg-blue-600 hover:bg-blue-700",
                        roleParam === "recruiter" && "bg-purple-600 hover:bg-purple-700",
                        roleParam === "employer" && "bg-green-600 hover:bg-green-700",
                        roleParam === "student" && "bg-orange-600 hover:bg-orange-700",
                        "transition-all duration-300"
                      )}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4">
                    {/* Render the specific sign-up form based on roleParam */}
                    {currentRoleConfig.signUpForm && (
                      <currentRoleConfig.signUpForm
                        onSignUpSuccess={() => {
                          toast({
                            title: "Sign Up Successful!",
                            description: "Please check your email to verify your account.",
                          });
                          navigate('/email-verified');
                        }}
                        onSignUpError={(error: string) => {
                          toast({
                            title: "Sign Up Failed",
                            description: error,
                            variant: "destructive",
                          });
                        }}
                      />
                    )}
                  </TabsContent>
                </Tabs>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    By continuing, you agree to our{' '}
                    <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </p>
                </div>
              </CardContent>
            </div>
          </Card>
        </main>
  
      </div>
    </>
  );
};

export default SignIn;
