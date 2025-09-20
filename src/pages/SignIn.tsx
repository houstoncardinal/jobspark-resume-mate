import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  User, Briefcase, Building2, GraduationCap, Loader2, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { JobSeekerSignUpForm } from "@/components/auth/forms/JobSeekerSignUpForm";
import { RecruiterSignUpForm } from "@/components/auth/forms/RecruiterSignUpForm";
import { EmployerSignUpForm } from "@/components/auth/forms/EmployerSignUpForm";
import { StudentSignUpForm } from "@/components/auth/forms/StudentSignUpForm";

const SignIn = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role") || "job_seeker";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showRoleForm, setShowRoleForm] = useState(false);
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
      signUpForm: JobSeekerSignUpForm
    },
    recruiter: {
      title: "Sign In as a Recruiter",
      description: "Discover top talent and streamline your hiring process.",
      icon: Briefcase,
      color: "text-purple-600",
      bg: "bg-purple-50",
      signUpForm: RecruiterSignUpForm
    },
    employer: {
      title: "Sign In as an Employer",
      description: "Build your team and showcase your company brand.",
      icon: Building2,
      color: "text-green-600",
      bg: "bg-green-50",
      signUpForm: EmployerSignUpForm
    },
    student: {
      title: "Sign In as a Student / Intern",
      description: "Launch your career with internships and entry-level opportunities.",
      icon: GraduationCap,
      color: "text-orange-600",
      bg: "bg-orange-50",
      signUpForm: StudentSignUpForm
    },
  };

  const currentRoleConfig = rolesConfig[roleParam] || rolesConfig.job_seeker;

  const handleAuth = async (type: 'signin' | 'signup') => {
    setLoading(true);
    try {
      if (type === 'signin') {
        const { data, error } = await signIn(email, password);
        if (error) throw error;
        
        toast({
          title: "Signed In!",
          description: `Welcome back, ${currentRoleConfig.title.replace('Sign In as a ', '').replace('Sign In as an ', '')}.`,
        });
        navigate("/dashboard");
      } else {
        // For sign up, show the role-specific form
        setShowRoleForm(true);
      }
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSuccess = () => {
    toast({
      title: "Account Created!",
      description: "Please check your email to verify your account.",
    });
    navigate("/email-verified?role=" + roleParam);
  };

  const handleBackToAuth = () => {
    setShowRoleForm(false);
    setIsSignUp(false);
  };

  // If showing role-specific form, render it
  if (showRoleForm) {
    const SignUpForm = currentRoleConfig.signUpForm;
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToAuth}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Button>
          </div>
          <SignUpForm onSuccess={handleSignUpSuccess} onBack={handleBackToAuth} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 flex items-center justify-center">
        <Card className="w-full max-w-5xl shadow-xl rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column: Role Info & Branding */}
            <div className={cn("p-8 text-white flex flex-col justify-between",
              roleParam === "job_seeker" && "bg-gradient-to-br from-blue-600 to-blue-800",
              roleParam === "recruiter" && "bg-gradient-to-br from-purple-600 to-purple-800",
              roleParam === "employer" && "bg-gradient-to-br from-green-600 to-green-800",
              roleParam === "student" && "bg-gradient-to-br from-orange-600 to-orange-800"
            )}>
              <div>
                <Link to="/" className="flex items-center gap-3 mb-6 text-white hover:text-gray-200 transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                  <span className="text-sm font-medium">Back to Home</span>
                </Link>
                <div className="flex items-center gap-4 mb-6">
                  <img src="/logo.png" alt="Gigm8 Logo" className="h-12 w-12 object-contain" />
                  <h2 className="text-4xl font-extrabold tracking-tight">Gigm8</h2>
                </div>
                <h3 className="text-2xl font-semibold mb-3">{currentRoleConfig.title}</h3>
                <p className="text-lg opacity-90">{currentRoleConfig.description}</p>
              </div>

              <div className="mt-8 space-y-4">
                <p className="text-xl font-semibold">What you'll get:</p>
                <ul className="space-y-2 text-sm opacity-90">
                  <li>• AI-powered job matching and resume optimization</li>
                  <li>• Access to thousands of job opportunities</li>
                  <li>• Professional networking and career resources</li>
                  <li>• Advanced analytics and performance tracking</li>
                  <li>• 24/7 support and guidance</li>
                </ul>
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
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
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
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">
                        Create a detailed profile tailored to your role
                      </p>
                      <Button
                        onClick={() => handleAuth('signup')}
                        className={cn(
                          "w-full text-lg py-3",
                          roleParam === "job_seeker" && "bg-blue-600 hover:bg-blue-700",
                          roleParam === "recruiter" && "bg-purple-600 hover:bg-purple-700",
                          roleParam === "employer" && "bg-green-600 hover:bg-green-700",
                          roleParam === "student" && "bg-orange-600 hover:bg-orange-700",
                          "transition-all duration-300"
                        )}
                      >
                        Start Registration
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </div>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;
