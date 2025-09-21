import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
  LogIn,
  UserPlus,
  MessageSquare,
  Plus,
  UserCheck,
  GraduationCap,
  LogOut,
  Bell,
  Bookmark
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { EnhancedAuthModal } from '@/components/auth/EnhancedAuthModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Jobs', href: '/jobs', icon: Search },
  { name: 'Resume Builder', href: '/builder', icon: FileText },
  { name: 'Community', href: '/community', icon: MessageSquare },
  { name: 'For Employers', href: '/for-employers', icon: Building2 },
];

// Role-based navigation items
const getRoleBasedNavigation = (role: string) => {
  switch (role) {
    case 'job_seeker':
      return [
        { name: 'My Profile', href: '/profile/job-seeker', icon: User },
        { name: 'My Applications', href: '/applied-jobs', icon: Bookmark },
        { name: 'Resume Builder', href: '/builder', icon: FileText },
        { name: 'Job Matcher', href: '/job-matcher', icon: Target },
      ];
    case 'employer':
      return [
        { name: 'Company Profile', href: '/profile/employer', icon: Building2 },
        { name: 'Job Postings', href: '/employer/jobs', icon: Briefcase },
        { name: 'Candidates', href: '/candidates', icon: Users },
        { name: 'Analytics', href: '/employer/analytics', icon: BarChart3 },
      ];
    case 'recruiter':
      return [
        { name: 'Recruiter Profile', href: '/profile/recruiter', icon: UserCheck },
        { name: 'Job Postings', href: '/recruiter/jobs', icon: Briefcase },
        { name: 'Candidates', href: '/candidates', icon: Users },
        { name: 'Client Companies', href: '/recruiter/companies', icon: Building2 },
      ];
    case 'student':
      return [
        { name: 'Student Profile', href: '/profile/student', icon: GraduationCap },
        { name: 'Internships', href: '/internships', icon: Briefcase },
        { name: 'Resume Builder', href: '/builder', icon: FileText },
        { name: 'Career Guidance', href: '/career-guidance', icon: Target },
      ];
    default:
      return [];
  }
};

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleRoleSelect = (role: string) => {
    console.log('Selected role:', role);
    // Handle role selection logic here
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'job_seeker': return 'Job Seeker';
      case 'employer': return 'Employer';
      case 'recruiter': return 'Recruiter';
      case 'student': return 'Student';
      default: return 'User';
    }
  };

  const getRoleBasedActionButton = (role: string) => {
    switch (role) {
      case 'employer':
        return (
          <Button
            asChild
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Link to="/employer/post-job">
              <Plus className="h-4 w-4 mr-2" />
              Post a Job
            </Link>
          </Button>
        );
      case 'recruiter':
        return (
          <Button
            asChild
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Link to="/recruiter/post-job">
              <Plus className="h-4 w-4 mr-2" />
              Post a Job
            </Link>
          </Button>
        );
      default:
        return null;
    }
  };

  const roleBasedNav = user ? getRoleBasedNavigation(user.role) : [];

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto pl-2 pr-4 sm:pr-6 lg:pr-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 -ml-2">
              <Link to="/" className="flex items-center py-2">
                <img 
                  src="/logo.png" 
                  alt="GigM8 Logo" 
                  className="h-16 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right side - Auth & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {/* Role-based action button */}
                  {getRoleBasedActionButton(user.role)}
                  
                  {/* Notifications */}
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      3
                    </span>
                  </Button>

                  {/* User Profile Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar_url} alt={user.full_name} />
                          <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.full_name}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {getRoleDisplayName(user.role)}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      {/* Role-based navigation items */}
                      {roleBasedNav.map((item) => {
                        const Icon = item.icon;
                        return (
                          <DropdownMenuItem key={item.name} asChild>
                            <Link to={item.href} className="flex items-center">
                              <Icon className="mr-2 h-4 w-4" />
                              <span>{item.name}</span>
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/settings" className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={signOut} className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base font-semibold transition-all duration-300"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In/Sign Up
                </Button>
              )}

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                
                {/* Role-based mobile navigation */}
                {user && roleBasedNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Enhanced Auth Modal */}
      <EnhancedAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onRoleSelect={handleRoleSelect}
      />
    </>
  );
};
