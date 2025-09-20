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
  LifeBuoy
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
      <SheetContent side="right" className="w-full sm:w-[400px] md:w-[500px] lg:w-[600px] p-0">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.png" 
                  alt="Gigm8 Logo" 
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h2 className="text-xl font-bold">Gigm8</h2>
                  <p className="text-blue-100 text-sm">Your AI-powered career platform</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* User Section */}
            {user ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {user.full_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{user.full_name}</p>
                    <p className="text-blue-100 text-sm capitalize">{user.role.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    asChild
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
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
                    className="bg-transparent border-white/30 text-white hover:bg-white/20"
                    onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button 
                  className="bg-white text-blue-600 hover:bg-blue-50 flex-1" 
                  onClick={() => {
                    handleSignInClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
                <Button 
                  variant="outline"
                  className="bg-transparent border-white/30 text-white hover:bg-white/20 flex-1"
                  onClick={() => {
                    handleSignInClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Navigation Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Main Pages */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" />
                Main Pages
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {mainNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md group ${
                      isActive(item.href) 
                        ? "bg-blue-50 border-2 border-blue-200 shadow-md" 
                        : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isActive(item.href) ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <item.icon className={`h-6 w-6 ${
                        isActive(item.href) ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        {item.badge && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Tools Section */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-600" />
                Tools & Features
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {toolsNavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-200 hover:scale-105 hover:shadow-md group"
                  >
                    <div className="w-12 h-12 bg-gray-100 group-hover:bg-gray-200 rounded-xl flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                  </a>
                ))}
              </div>
            </div>

            {/* Enterprise Section */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Enterprise Solutions
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {enterpriseNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md group ${
                      isActive(item.href) 
                        ? "bg-yellow-50 border-2 border-yellow-200 shadow-md" 
                        : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isActive(item.href) ? 'bg-yellow-100' : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <item.icon className={`h-6 w-6 ${
                        isActive(item.href) ? 'text-yellow-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        {item.badge && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  asChild
                  className="h-auto p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link to="/builder">
                    <FileText className="h-5 w-5 mr-2" />
                    <div className="text-left">
                      <div className="font-semibold">Build Resume</div>
                      <div className="text-xs opacity-90">AI-Powered</div>
                    </div>
                  </Link>
                </Button>
                <Button
                  asChild
                  className="h-auto p-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link to="/#job-search">
                    <Search className="h-5 w-5 mr-2" />
                    <div className="text-left">
                      <div className="font-semibold">Find Jobs</div>
                      <div className="text-xs opacity-90">10,000+ Jobs</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <LifeBuoy className="h-5 w-5 text-blue-600" />
                Get Support
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span>support@gigm8.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>24/7 Support Available</span>
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
