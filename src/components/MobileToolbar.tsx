import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Briefcase, 
  FileText, 
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MobileToolbarProps {
  className?: string;
}

export const MobileToolbar: React.FC<MobileToolbarProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('home');
  const { user } = useAuth();
  const location = useLocation();

  // 4 Core Powerful Options for Gigm8
  const navigation = [
    { 
      id: 'home', 
      name: 'Home', 
      href: '/', 
      icon: Home
    },
    { 
      id: 'jobs', 
      name: 'Jobs', 
      href: '/jobs', 
      icon: Briefcase
    },
    { 
      id: 'builder', 
      name: 'Resume', 
      href: '/builder', 
      icon: FileText
    },
    { 
      id: 'profile', 
      name: 'Profile', 
      href: user ? '/dashboard' : '/signin', 
      icon: User
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Set active tab based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const activeNav = navigation.find(nav => nav.href === currentPath);
    if (activeNav) {
      setActiveTab(activeNav.id);
    } else if (currentPath.startsWith('/dashboard') || currentPath.startsWith('/profile')) {
      setActiveTab('profile');
    }
  }, [location.pathname]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <>
      {/* Mobile Toolbar - Compact & Clean */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg ${className}`}>
        <div className="flex items-center justify-around px-2 py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActiveTab = activeTab === item.id;
            
            return (
              <Link
                key={item.id}
                to={item.href}
                onClick={() => handleTabClick(item.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-0 flex-1 group ${
                  isActiveTab
                    ? 'bg-blue-50'
                    : 'hover:bg-gray-50 active:scale-95'
                }`}
              >
                <div className="relative">
                  <Icon 
                    className={`h-5 w-5 transition-colors duration-200 ${
                      isActiveTab ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'
                    }`} 
                  />
                  {isActiveTab && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <span className={`text-xs font-medium mt-1 transition-colors duration-200 ${
                  isActiveTab ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind fixed toolbar */}
      <div className="h-16"></div>
    </>
  );
};
