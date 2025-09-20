export type UserRole = 'job_seeker' | 'recruiter' | 'employer';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  user_id: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  experience_level?: 'entry' | 'mid' | 'senior' | 'executive';
  job_title?: string;
  company?: string;
  website?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}
