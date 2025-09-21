/** @jsxImportSource react */import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  MapPin, 
  User, 
  Clock, 
  DollarSign, 
  Building2, 
  Star,
  Filter,
  SortAsc,
  Grid,
  List,
  Heart,
  MessageCircle,
  Eye,
  Download,
  ChevronDown,
  ChevronUp,
  X,
  RefreshCw,
  Users,
  GraduationCap,
  Award,
  Briefcase,
  Globe,
  Phone,
  Mail,
  Linkedin,
  Github,
  ExternalLink,
  Calendar,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  experience: number;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];
  education: string;
  availability: 'immediately' | '2weeks' | '1month' | 'flexible';
  remote: boolean;
  rating: number;
  profileViews: number;
  applications: number;
  lastActive: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  summary: string;
  workExperience: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
  certifications: string[];
  languages: string[];
  profilePicture?: string;
  verified: boolean;
  premium: boolean;
  tags: string[];
}

const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior Software Engineer',
    location: 'San Francisco, CA',
    experience: 5,
    salary: { min: 120000, max: 160000, currency: 'USD' },
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
    availability: '2weeks',
    remote: true,
    rating: 4.8,
    profileViews: 156,
    applications: 12,
    lastActive: '2024-01-15',
    linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
    githubUrl: 'https://github.com/sarahjohnson',
    summary: 'Experienced full-stack developer with 5+ years building scalable web applications...',
    workExperience: [
      {
        company: 'TechCorp Inc.',
        position: 'Senior Software Engineer',
        duration: '2021 - Present',
        description: 'Led development of microservices architecture...'
      }
    ],
    education: [
      {
        institution: 'Stanford University',
        degree: 'BS Computer Science',
        year: '2019'
      }
    ],
    certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
    languages: ['English', 'Spanish'],
    verified: true,
    premium: true,
    tags: ['Senior', 'Full-stack', 'Remote', 'AWS', 'React']
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Product Manager',
    location: 'New York, NY',
    experience: 4,
    salary: { min: 100000, max: 140000, currency: 'USD' },
    skills: ['Product Strategy', 'Agile', 'Data Analysis', 'Figma', 'SQL'],
    availability: 'immediately',
    remote: false,
    rating: 4.6,
    profileViews: 89,
    applications: 8,
    lastActive: '2024-01-14',
    linkedinUrl: 'https://linkedin.com/in/michaelchen',
    summary: 'Strategic product manager with experience in B2B SaaS platforms...',
    workExperience: [
      {
        company: 'StartupXYZ',
        position: 'Product Manager',
        duration: '2022 - Present',
        description: 'Managed product roadmap and feature development...'
      }
    ],
    education: [
      {
        institution: 'NYU Stern',
        degree: 'MBA',
        year: '2021'
      }
    ],
    certifications: ['Certified Scrum Product Owner'],
    languages: ['English', 'Mandarin'],
    verified: true,
    premium: false,
    tags: ['Product Management', 'Strategy', 'B2B', 'SaaS']
  }
];

const Candidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>(mockCandidates);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    experience: '',
    availability: '',
    salaryRange: '',
    remote: false,
    verified: false,
    premium: false,
    skills: [] as string[]
  });
  const { user, profile } = useAuth();
  const { toast } = useToast();

  // Check if user has access to candidates
  const hasAccess = profile?.role === 'employer' || profile?.role === 'recruiter' || profile?.role === 'super_admin';

  useEffect(() => {
    if (!hasAccess) {
      toast({
        title: "Access Denied",
        description: "This page is only available to employers and recruiters.",
        variant: "destructive",
      });
    }
  }, [hasAccess, toast]);

  // Filter candidates based on search and filters
  useEffect(() => {
    let filtered = candidates;

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(candidate => 
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(candidate => 
        candidate.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Experience filter
    if (filters.experience) {
      const [min, max] = filters.experience.split('-').map(Number);
      filtered = filtered.filter(candidate => 
        candidate.experience >= min && candidate.experience <= max
      );
    }

    // Availability filter
    if (filters.availability) {
      filtered = filtered.filter(candidate => candidate.availability === filters.availability);
    }

    // Remote filter
    if (filters.remote) {
      filtered = filtered.filter(candidate => candidate.remote);
    }

    // Verified filter
    if (filters.verified) {
      filtered = filtered.filter(candidate => candidate.verified);
    }

    // Premium filter
    if (filters.premium) {
      filtered = filtered.filter(candidate => candidate.premium);
    }

    // Skills filter
    if (filters.skills.length > 0) {
      filtered = filtered.filter(candidate => 
        filters.skills.some(skill => candidate.skills.includes(skill))
      );
    }

    // Sort candidates
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'experience':
        filtered.sort((a, b) => b.experience - a.experience);
        break;
      case 'salary':
        filtered.sort((a, b) => b.salary.max - a.salary.max);
        break;
      case 'relevance':
        // Premium and verified candidates first
        filtered.sort((a, b) => {
          if (a.premium && !b.premium) return -1;
          if (!a.premium && b.premium) return 1;
          if (a.verified && !b.verified) return -1;
          if (!a.verified && b.verified) return 1;
          return b.rating - a.rating;
        });
        break;
    }

    setFilteredCandidates(filtered);
  }, [candidates, searchQuery, filters, sortBy]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSkillToggle = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      experience: '',
      availability: '',
      salaryRange: '',
      remote: false,
      verified: false,
      premium: false,
      skills: []
    });
    setSearchQuery('');
  };

  const formatSalary = (salary: Candidate['salary']) => {
    return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  const getAvailabilityColor = (availability: Candidate['availability']) => {
    switch (availability) {
      case 'immediately': return 'bg-green-100 text-green-800';
      case '2weeks': return 'bg-yellow-100 text-yellow-800';
      case '1month': return 'bg-orange-100 text-orange-800';
      case 'flexible': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const allSkills = Array.from(new Set(candidates.flatMap(candidate => candidate.skills)));

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">
                This page is only available to employers and recruiters.
              </p>
              <Button asChild>
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Find Candidates
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover and connect with top talent for your open positions
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search candidates, skills, or keywords..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 pr-4 py-3 text-lg"
                  />
                </div>
              </div>
              
              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {Object.values(filters).some(v => v !== '' && v !== false && (Array.isArray(v) ? v.length > 0 : true)) && (
                  <Badge variant="destructive" className="ml-1">!</Badge>
                )}
              </Button>
              
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                  <SelectItem value="salary">Highest Salary</SelectItem>
                </SelectContent>
              </Select>
              
              {/* View Mode */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Input
                      placeholder="City, State, Country"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Experience</label>
                    <Select value={filters.experience} onValueChange={(value) => handleFilterChange('experience', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Levels</SelectItem>
                        <SelectItem value="0-2">0-2 years</SelectItem>
                        <SelectItem value="2-5">2-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Availability</label>
                    <Select value={filters.availability} onValueChange={(value) => handleFilterChange('availability', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any Time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any Time</SelectItem>
                        <SelectItem value="immediately">Immediately</SelectItem>
                        <SelectItem value="2weeks">2 weeks notice</SelectItem>
                        <SelectItem value="1month">1 month notice</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Salary Range</label>
                    <Select value={filters.salaryRange} onValueChange={(value) => handleFilterChange('salaryRange', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any Salary" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any Salary</SelectItem>
                        <SelectItem value="0-50000">$0 - $50k</SelectItem>
                        <SelectItem value="50000-100000">$50k - $100k</SelectItem>
                        <SelectItem value="100000-150000">$100k - $150k</SelectItem>
                        <SelectItem value="150000+">$150k+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Quick Filters */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant={filters.remote ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleFilterChange('remote', !filters.remote)}
                  >
                    <Globe className="h-4 w-4 mr-1" />
                    Remote
                  </Button>
                  <Button
                    variant={filters.verified ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleFilterChange('verified', !filters.verified)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Verified
                  </Button>
                  <Button
                    variant={filters.premium ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleFilterChange('premium', !filters.premium)}
                  >
                    <Star className="h-4 w-4 mr-1" />
                    Premium
                  </Button>
                </div>
                
                {/* Skills */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Skills & Technologies</label>
                  <div className="flex flex-wrap gap-2">
                    {allSkills.slice(0, 20).map(skill => (
                      <Button
                        key={skill}
                        variant={filters.skills.includes(skill) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleSkillToggle(skill)}
                      >
                        {skill}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Clear Filters */}
                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {filteredCandidates.length} Candidates Found
            </h2>
            <p className="text-gray-600">
              {searchQuery && `Search results for "${searchQuery}"`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">Updated just now</span>
          </div>
        </div>

        {/* Candidate Listings */}
        {filteredCandidates.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No candidates found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button onClick={clearFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            {filteredCandidates.map((candidate) => (
              <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-semibold">{candidate.name}</h3>
                          {candidate.verified && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {candidate.premium && (
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{candidate.title}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="h-4 w-4" />
                          {candidate.location}
                          {candidate.remote && (
                            <Badge variant="outline" className="ml-2">
                              <Globe className="h-3 w-3 mr-1" />
                              Remote
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getAvailabilityColor(candidate.availability)}>
                        {candidate.availability.replace(/([A-Z])/g, ' $1').trim()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Briefcase className="h-4 w-4" />
                      {candidate.experience} years exp
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      {formatSalary(candidate.salary)}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {candidate.rating}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {candidate.summary}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {candidate.skills.slice(0, 6).map(skill => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {candidate.profileViews} views
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(candidate.lastActive).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm">
                        View Profile
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Candidates;
