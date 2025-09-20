import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  Users, 
  Briefcase, 
  Building2, 
  GraduationCap,
  Target,
  Zap,
  Shield,
  Award,
  Clock,
  Globe,
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";

const EmailVerificationSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>('job_seeker');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user role from URL params or localStorage
    const role = searchParams.get('role') || localStorage.getItem('userRole') || 'job_seeker';
    setUserRole(role);
    setIsLoading(false);

    // Clear any stored role data
    localStorage.removeItem('userRole');
  }, [searchParams]);

  const roleConfig = {
    job_seeker: {
      title: "Welcome, Job Seeker!",
      subtitle: "Your account is verified and ready to go",
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      features: [
        "AI-Powered Job Matching",
        "Resume Optimization Tools",
        "Application Tracking",
        "Salary Insights",
        "Interview Preparation"
      ],
      nextSteps: [
        "Complete your profile",
        "Upload your resume",
        "Start job searching",
        "Set up job alerts"
      ],
      dashboardUrl: "/dashboard",
      ctaText: "Go to Dashboard",
      ctaIcon: Target
    },
    recruiter: {
      title: "Welcome, Recruiter!",
      subtitle: "Your account is verified and ready to go",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      features: [
        "Access Candidate Database",
        "AI-Powered Matching",
        "Job Posting Tools",
        "Analytics Dashboard",
        "Team Collaboration"
      ],
      nextSteps: [
        "Complete your profile",
        "Set up your company",
        "Start sourcing candidates",
        "Create job postings"
      ],
      dashboardUrl: "/dashboard",
      ctaText: "Go to Dashboard",
      ctaIcon: Target
    },
    employer: {
      title: "Welcome, Employer!",
      subtitle: "Your account is verified and ready to go",
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      features: [
        "Access Talent Pool",
        "Company Branding",
        "Job Posting Tools",
        "Hiring Analytics",
        "Team Management"
      ],
      nextSteps: [
        "Complete company profile",
        "Set up job postings",
        "Start hiring",
        "Track performance"
      ],
      dashboardUrl: "/dashboard",
      ctaText: "Go to Dashboard",
      ctaIcon: Target
    },
    student: {
      title: "Welcome, Student!",
      subtitle: "Your account is verified and ready to go",
      icon: GraduationCap,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      features: [
        "Internship Opportunities",
        "Career Resources",
        "Mentorship Network",
        "Project Showcase",
        "Skill Development"
      ],
      nextSteps: [
        "Complete your profile",
        "Upload your resume",
        "Find internships",
        "Connect with mentors"
      ],
      dashboardUrl: "/dashboard",
      ctaText: "Go to Dashboard",
      ctaIcon: Target
    }
  };

  const currentConfig = roleConfig[userRole as keyof typeof roleConfig] || roleConfig.job_seeker;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {currentConfig.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {currentConfig.subtitle}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Mail className="h-4 w-4" />
              <span>Email verified successfully</span>
              <Badge variant="secondary" className="ml-2">
                <Shield className="h-3 w-3 mr-1" />
                Secure
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Features Card */}
            <Card className={`${currentConfig.bgColor} ${currentConfig.borderColor} border-2`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-3 ${currentConfig.color}`}>
                  <currentConfig.icon className="h-6 w-6" />
                  What You'll Get
                </CardTitle>
                <CardDescription>
                  Your verified account unlocks these powerful features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentConfig.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${currentConfig.color.replace('text-', 'bg-')}`} />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-gray-900">
                  <Target className="h-6 w-6 text-blue-600" />
                  Next Steps
                </CardTitle>
                <CardDescription>
                  Get started with your new account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentConfig.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Your account is fully verified and ready to use. Access your personalized dashboard 
                and start exploring all the features available to you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white shadow-lg"
                >
                  <Link to={currentConfig.dashboardUrl}>
                    <currentConfig.ctaIcon className="h-5 w-5 mr-2" />
                    {currentConfig.ctaText}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <Link to="/">
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Explore Homepage
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Secure & Private</h4>
              <p className="text-sm text-gray-600">
                Your data is protected with enterprise-grade security
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Trusted Platform</h4>
              <p className="text-sm text-gray-600">
                Used by thousands of professionals worldwide
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">24/7 Support</h4>
              <p className="text-sm text-gray-600">
                Get help whenever you need it
              </p>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-4">
              Questions? We're here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="ghost" asChild>
                <Link to="/support">
                  <Heart className="h-4 w-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/blog">
                  <Globe className="h-4 w-4 mr-2" />
                  Read Our Blog
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmailVerificationSuccess;
