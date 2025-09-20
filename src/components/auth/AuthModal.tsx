import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/auth';
import { Mail, Lock, User, Building2, Users, Briefcase } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.fullName, formData.role);
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account.",
        });
      } else {
        await signIn(formData.email, formData.password);
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
        onClose();
      }
    } catch (error: any) {
      toast({
        title: "Error",
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

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'job_seeker':
        return <Briefcase className="h-4 w-4" />;
      case 'recruiter':
        return <Users className="h-4 w-4" />;
      case 'employer':
        return <Building2 className="h-4 w-4" />;
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'job_seeker':
        return 'Find jobs and manage your career';
      case 'recruiter':
        return 'Source and manage candidates';
      case 'employer':
        return 'Post jobs and manage your company';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={isSignUp ? 'signup' : 'signin'} onValueChange={(value) => setIsSignUp(value === 'signup')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-role">Account Type</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="job_seeker">
                      <div className="flex items-center gap-2">
                        {getRoleIcon('job_seeker')}
                        <div>
                          <div className="font-medium">Job Seeker</div>
                          <div className="text-sm text-gray-500">{getRoleDescription('job_seeker')}</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="recruiter">
                      <div className="flex items-center gap-2">
                        {getRoleIcon('recruiter')}
                        <div>
                          <div className="font-medium">Recruiter</div>
                          <div className="text-sm text-gray-500">{getRoleDescription('recruiter')}</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="employer">
                      <div className="flex items-center gap-2">
                        {getRoleIcon('employer')}
                        <div>
                          <div className="font-medium">Employer</div>
                          <div className="text-sm text-gray-500">{getRoleDescription('employer')}</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
