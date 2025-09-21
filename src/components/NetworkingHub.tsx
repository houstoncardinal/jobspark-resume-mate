import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  UserPlus, 
  MessageCircle, 
  Star, 
  MapPin, 
  Building2, 
  GraduationCap,
  Award,
  TrendingUp,
  Target,
  Sparkles,
  Filter,
  Search,
  Globe,
  Calendar,
  Clock,
  Heart,
  Share2,
  ExternalLink,
  ChevronRight,
  Zap,
  Crown,
  Shield,
  Brain,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
  Minus,
  X,
  RefreshCw,
  Settings,
  Bell,
  Mail,
  Phone,
  Video,
  Coffee,
  Handshake,
  Rocket,
  Diamond,
  Flame,
  BookOpen,
  Briefcase,
  UserCheck,
  UserX,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  avatar?: string;
  industry: string;
  experience: number;
  skills: string[];
  interests: string[];
  bio: string;
  mutualConnections: number;
  connectionStrength: number; // 0-100
  aiScore: number; // 0-100
  isOnline: boolean;
  lastActive: string;
  verified: boolean;
  premium: boolean;
  mentor: boolean;
  mentee: boolean;
  lookingFor: string[];
  offering: string[];
  achievements: string[];
  education: string;
  languages: string[];
  timezone: string;
  availability: 'available' | 'busy' | 'away';
  connectionType: 'peer' | 'mentor' | 'mentee' | 'industry_expert' | 'potential_collaborator';
  tags: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    portfolio?: string;
  };
}

interface NetworkingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'virtual' | 'in-person' | 'hybrid';
  attendees: number;
  maxAttendees: number;
  industry: string;
  organizer: string;
  price: 'free' | 'paid';
  tags: string[];
  image?: string;
}

interface ConnectionRequest {
  id: string;
  from: User;
  to: User;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  connectionType: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'Senior Product Manager',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    industry: 'Technology',
    experience: 8,
    skills: ['Product Management', 'Agile', 'User Research', 'Data Analysis', 'Leadership'],
    interests: ['AI/ML', 'Sustainability', 'Mentoring', 'Startups'],
    bio: 'Passionate product leader with 8+ years building user-centric products. Love mentoring emerging PMs and exploring AI applications.',
    mutualConnections: 12,
    connectionStrength: 85,
    aiScore: 92,
    isOnline: true,
    lastActive: '2 minutes ago',
    verified: true,
    premium: true,
    mentor: true,
    mentee: false,
    lookingFor: ['Mentoring opportunities', 'AI product insights', 'Sustainability initiatives'],
    offering: ['Product strategy guidance', 'Career coaching', 'Industry connections'],
    achievements: ['Product of the Year 2023', 'Top 40 Under 40', '500+ mentees helped'],
    education: 'Stanford MBA',
    languages: ['English', 'Mandarin', 'Spanish'],
    timezone: 'PST',
    availability: 'available',
    connectionType: 'mentor',
    tags: ['product', 'ai', 'mentoring', 'leadership'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarahchen',
      twitter: '@sarahchenpm'
    }
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Austin, TX',
    industry: 'Technology',
    experience: 5,
    skills: ['React', 'Node.js', 'Python', 'AWS', 'GraphQL'],
    interests: ['Open Source', 'Web3', 'Machine Learning', 'Remote Work'],
    bio: 'Full-stack developer passionate about building scalable applications. Active in open source and always learning new technologies.',
    mutualConnections: 8,
    connectionStrength: 72,
    aiScore: 88,
    isOnline: false,
    lastActive: '1 hour ago',
    verified: true,
    premium: false,
    mentor: false,
    mentee: true,
    lookingFor: ['Senior developer mentorship', 'Open source collaboration', 'Career growth'],
    offering: ['Code reviews', 'Technical guidance', 'Project collaboration'],
    achievements: ['GitHub 1000+ stars', 'Open Source Contributor', 'Tech Conference Speaker'],
    education: 'UT Austin CS',
    languages: ['English', 'Portuguese'],
    timezone: 'CST',
    availability: 'busy',
    connectionType: 'peer',
    tags: ['frontend', 'backend', 'opensource', 'web3'],
    socialLinks: {
      github: 'https://github.com/marcusj',
      linkedin: 'https://linkedin.com/in/marcusjohnson'
    }
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    title: 'VP of Engineering',
    company: 'DataFlow Inc.',
    location: 'Seattle, WA',
    industry: 'Data Science',
    experience: 15,
    skills: ['Engineering Leadership', 'Machine Learning', 'Data Architecture', 'Team Building', 'Strategic Planning'],
    interests: ['Women in Tech', 'Diversity & Inclusion', 'AI Ethics', 'Mentoring'],
    bio: 'Engineering leader with 15+ years building data platforms. Passionate about diversity in tech and ethical AI development.',
    mutualConnections: 25,
    connectionStrength: 95,
    aiScore: 96,
    isOnline: true,
    lastActive: '5 minutes ago',
    verified: true,
    premium: true,
    mentor: true,
    mentee: false,
    lookingFor: ['Diversity initiatives', 'AI ethics discussions', 'Leadership development'],
    offering: ['Engineering mentorship', 'Career advancement guidance', 'Industry insights'],
    achievements: ['Forbes 50 Women in Tech', 'IEEE Fellow', '1000+ engineers mentored'],
    education: 'MIT PhD Computer Science',
    languages: ['English', 'Spanish', 'French'],
    timezone: 'PST',
    availability: 'available',
    connectionType: 'industry_expert',
    tags: ['engineering', 'leadership', 'diversity', 'ai-ethics'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/emilyrodriguez',
      twitter: '@emilyrodriguez'
    }
  }
];

const mockEvents: NetworkingEvent[] = [
  {
    id: '1',
    title: 'AI & Product Management Meetup',
    description: 'Join product leaders discussing AI integration in product development.',
    date: '2024-12-15',
    time: '6:00 PM',
    location: 'San Francisco, CA',
    type: 'in-person',
    attendees: 45,
    maxAttendees: 60,
    industry: 'Technology',
    organizer: 'Product Leaders SF',
    price: 'free',
    tags: ['AI', 'Product Management', 'Networking'],
    image: '/events/ai-product-meetup.jpg'
  },
  {
    id: '2',
    title: 'Women in Tech Virtual Coffee',
    description: 'Monthly virtual networking session for women in technology.',
    date: '2024-12-20',
    time: '12:00 PM',
    location: 'Virtual',
    type: 'virtual',
    attendees: 120,
    maxAttendees: 200,
    industry: 'Technology',
    organizer: 'Women in Tech Network',
    price: 'free',
    tags: ['Women in Tech', 'Virtual', 'Networking'],
    image: '/events/women-tech-coffee.jpg'
  }
];

export const NetworkingHub: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    connectionType: 'all',
    industry: 'all',
    experience: 'all',
    availability: 'all',
    verified: false,
    premium: false,
    mentor: false,
    mentee: false
  });
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [events, setEvents] = useState<NetworkingEvent[]>(mockEvents);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [myConnections, setMyConnections] = useState<Set<string>>(new Set());
  const [savedUsers, setSavedUsers] = useState<Set<string>>(new Set());

  // AI-Powered Matching Algorithm
  const calculateAIScore = (user: User, currentUser?: User): number => {
    let score = 0;
    
    // Base score from user's profile completeness
    score += user.skills.length * 2;
    score += user.interests.length * 1.5;
    score += user.bio.length > 100 ? 10 : 5;
    
    // Industry alignment (if current user provided)
    if (currentUser && user.industry === currentUser.industry) {
      score += 15;
    }
    
    // Experience level compatibility
    if (currentUser) {
      const expDiff = Math.abs(user.experience - currentUser.experience);
      if (expDiff <= 2) score += 20;
      else if (expDiff <= 5) score += 10;
    }
    
    // Skills overlap
    if (currentUser) {
      const commonSkills = user.skills.filter(skill => 
        currentUser.skills.some(cs => cs.toLowerCase().includes(skill.toLowerCase()))
      );
      score += commonSkills.length * 5;
    }
    
    // Interests alignment
    if (currentUser) {
      const commonInterests = user.interests.filter(interest => 
        currentUser.interests.some(ci => ci.toLowerCase().includes(interest.toLowerCase()))
      );
      score += commonInterests.length * 3;
    }
    
    // Connection strength
    score += user.connectionStrength * 0.3;
    
    // Mutual connections
    score += Math.min(user.mutualConnections * 2, 20);
    
    // Verification and premium status
    if (user.verified) score += 10;
    if (user.premium) score += 5;
    
    // Mentor/mentee compatibility
    if (currentUser) {
      if (user.mentor && currentUser.mentee) score += 25;
      if (user.mentee && currentUser.mentor) score += 20;
    }
    
    // Availability
    if (user.availability === 'available') score += 10;
    
    return Math.min(Math.round(score), 100);
  };

  // Filter and sort users
  useEffect(() => {
    let filtered = [...users];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        user.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Connection type filter
    if (selectedFilters.connectionType !== 'all') {
      filtered = filtered.filter(user => user.connectionType === selectedFilters.connectionType);
    }

    // Industry filter
    if (selectedFilters.industry !== 'all') {
      filtered = filtered.filter(user => user.industry === selectedFilters.industry);
    }

    // Experience filter
    if (selectedFilters.experience !== 'all') {
      const expRanges = {
        'entry': [0, 2],
        'mid': [3, 7],
        'senior': [8, 15],
        'executive': [16, 50]
      };
      const [min, max] = expRanges[selectedFilters.experience as keyof typeof expRanges];
      filtered = filtered.filter(user => user.experience >= min && user.experience <= max);
    }

    // Availability filter
    if (selectedFilters.availability !== 'all') {
      filtered = filtered.filter(user => user.availability === selectedFilters.availability);
    }

    // Verified filter
    if (selectedFilters.verified) {
      filtered = filtered.filter(user => user.verified);
    }

    // Premium filter
    if (selectedFilters.premium) {
      filtered = filtered.filter(user => user.premium);
    }

    // Mentor filter
    if (selectedFilters.mentor) {
      filtered = filtered.filter(user => user.mentor);
    }

    // Mentee filter
    if (selectedFilters.mentee) {
      filtered = filtered.filter(user => user.mentee);
    }

    // Sort by AI score
    filtered.sort((a, b) => b.aiScore - a.aiScore);

    setFilteredUsers(filtered);
  }, [searchQuery, selectedFilters, users]);

  const handleConnect = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const request: ConnectionRequest = {
        id: Date.now().toString(),
        from: {
          id: 'current-user',
          name: 'You',
          title: 'Your Title',
          company: 'Your Company',
          location: 'Your Location',
          industry: 'Your Industry',
          experience: 5,
          skills: [],
          interests: [],
          bio: '',
          mutualConnections: 0,
          connectionStrength: 0,
          aiScore: 0,
          isOnline: true,
          lastActive: 'now',
          verified: true,
          premium: false,
          mentor: false,
          mentee: false,
          lookingFor: [],
          offering: [],
          achievements: [],
          education: '',
          languages: [],
          timezone: '',
          availability: 'available',
          connectionType: 'peer',
          tags: [],
          socialLinks: {}
        },
        to: user,
        message: `Hi ${user.name}, I'd love to connect and learn more about your work in ${user.industry}!`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        connectionType: 'professional'
      };
      
      setConnectionRequests(prev => [...prev, request]);
      toast({
        title: "Connection Request Sent!",
        description: `Request sent to ${user.name}`,
      });
    }
  };

  const handleSave = (userId: string) => {
    const newSaved = new Set(savedUsers);
    if (newSaved.has(userId)) {
      newSaved.delete(userId);
      toast({
        title: "Removed from Saved",
        description: "User removed from your saved list",
      });
    } else {
      newSaved.add(userId);
      toast({
        title: "Saved User",
        description: "User added to your saved list",
      });
    }
    setSavedUsers(newSaved);
  };

  const getConnectionTypeColor = (type: string) => {
    const colors = {
      'peer': 'bg-blue-100 text-blue-800 border-blue-200',
      'mentor': 'bg-purple-100 text-purple-800 border-purple-200',
      'mentee': 'bg-green-100 text-green-800 border-green-200',
      'industry_expert': 'bg-orange-100 text-orange-800 border-orange-200',
      'potential_collaborator': 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getAvailabilityColor = (availability: string) => {
    const colors = {
      'available': 'bg-green-100 text-green-800',
      'busy': 'bg-red-100 text-red-800',
      'away': 'bg-yellow-100 text-yellow-800'
    };
    return colors[availability as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Networking Hub
              </h1>
              <p className="text-xl text-gray-600">
                AI-powered professional connections and growth opportunities
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-2">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="connections" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              My Network
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Requests
            </TabsTrigger>
          </TabsList>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-6">
            {/* Search and Filters */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search by name, title, company, skills, or interests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                    />
                  </div>

                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Connection Type</label>
                      <select
                        value={selectedFilters.connectionType}
                        onChange={(e) => setSelectedFilters(prev => ({ ...prev, connectionType: e.target.value }))}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                      >
                        <option value="all">All Types</option>
                        <option value="peer">Peers</option>
                        <option value="mentor">Mentors</option>
                        <option value="mentee">Mentees</option>
                        <option value="industry_expert">Industry Experts</option>
                        <option value="potential_collaborator">Collaborators</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Industry</label>
                      <select
                        value={selectedFilters.industry}
                        onChange={(e) => setSelectedFilters(prev => ({ ...prev, industry: e.target.value }))}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                      >
                        <option value="all">All Industries</option>
                        <option value="Technology">Technology</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Marketing">Marketing</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Experience</label>
                      <select
                        value={selectedFilters.experience}
                        onChange={(e) => setSelectedFilters(prev => ({ ...prev, experience: e.target.value }))}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                      >
                        <option value="all">All Levels</option>
                        <option value="entry">Entry (0-2 years)</option>
                        <option value="mid">Mid (3-7 years)</option>
                        <option value="senior">Senior (8-15 years)</option>
                        <option value="executive">Executive (16+ years)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Availability</label>
                      <select
                        value={selectedFilters.availability}
                        onChange={(e) => setSelectedFilters(prev => ({ ...prev, availability: e.target.value }))}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                      >
                        <option value="all">All</option>
                        <option value="available">Available</option>
                        <option value="busy">Busy</option>
                        <option value="away">Away</option>
                      </select>
                    </div>
                  </div>

                  {/* Quick Filters */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant={selectedFilters.verified ? 'default' : 'outline'}
                      onClick={() => setSelectedFilters(prev => ({ ...prev, verified: !prev.verified }))}
                      className="border-2"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Verified Only
                    </Button>
                    <Button
                      variant={selectedFilters.premium ? 'default' : 'outline'}
                      onClick={() => setSelectedFilters(prev => ({ ...prev, premium: !prev.premium }))}
                      className="border-2"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Premium
                    </Button>
                    <Button
                      variant={selectedFilters.mentor ? 'default' : 'outline'}
                      onClick={() => setSelectedFilters(prev => ({ ...prev, mentor: !prev.mentor }))}
                      className="border-2"
                    >
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Mentors
                    </Button>
                    <Button
                      variant={selectedFilters.mentee ? 'default' : 'outline'}
                      onClick={() => setSelectedFilters(prev => ({ ...prev, mentee: !prev.mentee }))}
                      className="border-2"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Mentees
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-600" />
                AI-Powered Recommendations
              </h2>
              <p className="text-gray-600 mb-6">
                Our AI algorithm analyzes your profile, goals, and preferences to suggest the most relevant connections for your professional growth.
              </p>
            </div>

            {/* User Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:scale-[1.02]">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xl font-bold">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {user.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                            {user.verified && <Shield className="h-4 w-4 text-blue-600" />}
                            {user.premium && <Crown className="h-4 w-4 text-yellow-600" />}
                          </div>
                          <p className="text-gray-600 font-medium">{user.title}</p>
                          <p className="text-gray-500 text-sm">{user.company}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-500">{user.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={`${getConnectionTypeColor(user.connectionType)} border-2`}>
                          {user.connectionType.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge className={`${getAvailabilityColor(user.availability)} border-0`}>
                          {user.availability.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* AI Score */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">AI Match Score</span>
                        <span className="text-sm font-bold text-blue-600">{user.aiScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${user.aiScore}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {user.bio}
                    </p>

                    {/* Skills */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {user.skills.slice(0, 3).map(skill => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {user.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{user.mutualConnections} mutual</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{user.experience} years exp</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{user.lastActive}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={() => handleConnect(user.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleSave(user.id)}
                        size="sm"
                        className="border-2"
                      >
                        <Heart className={`h-4 w-4 ${savedUsers.has(user.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="border-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Network Tab */}
          <TabsContent value="connections" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  My Professional Network
                </CardTitle>
                <CardDescription>
                  Manage your connections and build meaningful professional relationships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Connections Yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start building your professional network by connecting with people in the Discover tab.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('discover')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Start Connecting
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:scale-[1.02]">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                      
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{event.date} at {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{event.attendees}/{event.maxAttendees} attendees</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge className={`${event.price === 'free' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} border-0`}>
                        {event.price.toUpperCase()}
                      </Badge>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Join Event
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  Connection Requests
                </CardTitle>
                <CardDescription>
                  Manage your incoming and outgoing connection requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pending Requests</h3>
                  <p className="text-gray-600">
                    Connection requests will appear here when people want to connect with you.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
