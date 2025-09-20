import { useState } from "react";
import { 
  Search, 
  FileText, 
  BarChart3, 
  Zap, 
  Sparkles, 
  HelpCircle, 
  Crown, 
  Menu, 
  X, 
  Home,
  BookOpen,
  Briefcase,
  Settings,
  User,
  ChevronDown,
  ExternalLink,
  Star,
  TrendingUp,
  Building2,
  Target,
  Brain,
  Users,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Globe,
  Shield,
  Award,
  Clock,
  LogIn,
  LogOut,
  UserPlus,
  ArrowRight,
  LayoutDashboard,
  UserSearch,
  ClipboardList,
  Calendar,
  LineChart,
  Rocket,
  LifeBuoy,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { RoleSelectionModal } from "@/components/auth/RoleSelectionModal";
import { SignInDropdown } from "@/components/auth/SignInDropdown";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleSelectionOpen, setIsRoleSelectionOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('job_seeker');
  const [selectedFeatures, setSelectedFeatures] = useState<any[]>([]);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const mainNavigation = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      description: "Job search and main dashboard"
    },
    {
      name: "Resume Builder",
      href: "/builder",
      icon: FileText,
      description: "AI-powered resume creation and optimization",
      badge: "AI"
    },
    {
      name: "Blog",
      href: "/blog",
      icon: BookOpen,
      description: "Career insights and job market trends"
    }
  ];

  const toolsNavigation = [
    {
      name: "Job Search",
      href: "/#job-search",
      icon: Search,
      description: "Find jobs from multiple sources"
    },
    {
      name: "Resume Upload",
      href: "/#upload",
      icon: FileText,
      description: "Upload and analyze your resume"
    },
    {
      name: "Match Analysis",
      href: "/#match",
      icon: BarChart3,
      description: "See how well you match job requirements"
    },
    {
      name: "AI Optimizer",
      href: "/#optimize",
      icon: Sparkles,
      description: "AI-powered resume optimization"
    },
    {
      name: "Applied Jobs",
      href: "/applied",
      icon: Briefcase,
      description: "Track your job applications"
    }
  ];

  const enterpriseNavigation = [
    {
      name: "Fortune 500 Strategy",
      href: "/fortune500",
      icon: Crown,
      description: "Enterprise dashboard and growth strategy",
      badge: "Enterprise"
    },
    {
      name: "Revenue Analytics",
      href: "/fortune500#revenue",
      icon: DollarSign,
      description: "Track revenue streams and growth"
    },
    {
      name: "Viral Growth Hub",
      href: "/fortune500#viral",
      icon: TrendingUp,
      description: "Manage viral growth initiatives"
    },
    {
      name: "AI Power Suite",
      href: "/fortune500#ai",
      icon: Brain,
      description: "Advanced AI features and tools"
    }
  ];

  const signInOptions = [
    {
      name: "Sign In as Job Seeker",
      href: "/signin?role=job_seeker",
      icon: Briefcase,
      description: "Find jobs & build career"
    },
    {
      name: "Sign In as Recruiter",
      href: "/signin?role=recruiter",
      icon: Users,
      description: "Source & manage talent"
    },
    {
      name: "Sign In as Employer",
      href: "/signin?role=employer",
      icon: Building2,
      description: "Build your team"
    },
    {
      name: "Sign In as Student",
      href: "/signin?role=student",
      icon: GraduationCap,
      description: "Start your career journey"
    }
  ];

  const handleSignInClick = () => {
    setIsRoleSelectionOpen(true);
  };

  const handleRoleSelect = (role: string, features: any[]) => {
    setSelectedRole(role);
    setSelectedFeatures(features);
    setIsRoleSelectionOpen(false);
    setIsAuthModalOpen(true);
  };

  const handleQuickSignIn = (role: string) => {
    // This will now be handled by the SignInDropdown component
    // which navigates directly to the appropriate sign-in page
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const MobileMenu = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0">
        <div className="h-full flex flex-col">
          {/* Simple Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Gigm8 Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold text-gray-900">Gigm8</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
            
          {/* User Section */}
          {user ? (
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {user.full_name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.full_name}</p>
                  <p className="text-sm text-gray-600 capitalize">{user.role.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  asChild
                  size="sm"
                  className="flex-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link to="/dashboard">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">SIGN IN</h3>
              <div className="space-y-2">
                {signInOptions.map((option) => (
                  <Link
                    key={option.name}
                    to={option.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <option.icon className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">{option.name}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Main Pages */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-3">MAIN PAGES</h3>
              <div className="space-y-1">
                {mainNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive(item.href) 
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500" 
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Tools Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-3">TOOLS & FEATURES</h3>
              <div className="space-y-1">
                {toolsNavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <item.icon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">{item.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Enterprise Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-3">ENTERPRISE</h3>
              <div className="space-y-1">
                {enterpriseNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive(item.href) 
                        ? "bg-yellow-50 text-yellow-700 border-l-4 border-yellow-500" 
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-3">QUICK ACTIONS</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  asChild
                  size="sm"
                  className="h-auto p-3 flex flex-col items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link to="/builder">
                    <FileText className="h-5 w-5" />
                    <span className="text-xs">Build Resume</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-auto p-3 flex flex-col items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link to="/#job-search">
                    <Search className="h-5 w-5" />
                    <span className="text-xs">Find Jobs</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">SUPPORT</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>support@gigm8.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-3 w-3" />
                <span className="hidden sm:inline">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-3 w-3" />
                <span className="hidden sm:inline">support@gigm8.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-3 w-3" />
                <span className="hidden sm:inline">San Francisco, CA</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Shield className="h-3 w-3" />
                <span className="hidden sm:inline">Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Award className="h-3 w-3" />
                <span className="hidden sm:inline">Trusted by 10,000+ Companies</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <Clock className="h-3 w-3" />
                <span className="hidden sm:inline">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="hover:opacity-90 transition-opacity">
                <img 
                  src="/logo.png" 
                  alt="Gigm8 Logo" 
                  className="h-14 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Main Pages */}
              {mainNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-300 group ${
                    isActive(item.href)
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  {/* Animated Underline */}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ${
                    isActive(item.href) 
                      ? "w-full opacity-100" 
                      : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                  }`} />
                </Link>
              ))}

              {/* Tools Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                    <Settings className="h-4 w-4" />
                    Tools
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 bg-white border border-gray-200 shadow-lg">
                  {toolsNavigation.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <a href={item.href} className="flex items-center gap-3 p-3 hover:bg-gray-50">
                        <item.icon className="h-4 w-4 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Enterprise Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                    <Crown className="h-4 w-4" />
                    Enterprise
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 bg-white border border-gray-200 shadow-lg">
                  {enterpriseNavigation.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link to={item.href} className="flex items-center gap-3 p-3 hover:bg-gray-50">
                        <item.icon className="h-4 w-4 text-gray-600" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{item.name}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {user.full_name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="hidden sm:inline">{user.full_name}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <SignInDropdown onRoleSelect={handleQuickSignIn} />
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                    onClick={handleSignInClick}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="flex lg:hidden items-center gap-2">
              <Button asChild variant="outline" size="sm" className="border-gray-300">
                <Link to="/builder">
                  <FileText className="h-4 w-4" />
                  <span className="sr-only">Build Resume</span>
                </Link>
              </Button>
              <MobileMenu />
            </div>
          </div>

          {/* Tablet Navigation Bar */}
          <div className="hidden md:flex lg:hidden items-center justify-center py-4 border-t border-gray-200">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {mainNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-300 group ${
                    isActive(item.href)
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  {/* Animated Underline */}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ${
                    isActive(item.href) 
                      ? "w-full opacity-100" 
                      : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                  }`} />
                </Link>
              ))}
              <Link
                to="/fortune500"
                className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap text-gray-700 hover:text-blue-600 transition-all duration-300 group"
              >
                <Crown className="h-4 w-4" />
                Enterprise
                <Badge variant="secondary" className="text-xs">
                  Enterprise
                </Badge>
                {/* Animated Underline */}
                <span className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 w-0 opacity-0 group-hover:w-full group-hover:opacity-100 transition-all duration-500" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Role Selection Modal */}
      <RoleSelectionModal 
        isOpen={isRoleSelectionOpen} 
        onClose={() => setIsRoleSelectionOpen(false)}
        onRoleSelect={handleRoleSelect}
      />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        selectedRole={selectedRole}
        selectedFeatures={selectedFeatures}
      />
    </>
  );
};
