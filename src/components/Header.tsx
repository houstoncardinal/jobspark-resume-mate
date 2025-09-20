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
  Clock
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

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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

  const MobileMenu = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Gigm8 Logo" 
              className="w-8 h-8 object-contain"
            />
            Gigm8
          </SheetTitle>
          <SheetDescription>
            Your AI-powered career platform
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Main Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Main Pages</h3>
            <div className="space-y-2">
              {mainNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive(item.href) 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.name}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Tools Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Tools</h3>
            <div className="space-y-2">
              {toolsNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  <div className="flex-1">
                    <span className="font-medium">{item.name}</span>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Enterprise Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Enterprise</h3>
            <div className="space-y-2">
              {enterpriseNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive(item.href) 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.name}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pt-4 border-t">
            <div className="space-y-2">
              <Button asChild className="w-full" variant="outline">
                <Link to="/builder" onClick={() => setIsMobileMenuOpen(false)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Build Resume
                </Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/fortune500" onClick={() => setIsMobileMenuOpen(false)}>
                  <Crown className="h-4 w-4 mr-2" />
                  View Strategy
                </Link>
              </Button>
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
              <Button asChild variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Link to="/builder">
                  <FileText className="h-4 w-4 mr-2" />
                  Build Resume
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
                <Link to="/fortune500">
                  <Crown className="h-4 w-4 mr-2" />
                  View Strategy
                </Link>
              </Button>
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
    </>
  );
};
