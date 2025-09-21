/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { JobDetailModal } from '@/components/JobDetailModal';
import { useToast } from '@/hooks/use-toast';
import { searchAllJobs, JobListing, JobSearchParams } from '@/lib/job-aggregator';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Building2, 
  Star,
  Filter,
  SortAsc,
  Grid,
  List,
  Heart,
  Share2,
  ExternalLink,
  Globe,
  Users,
  TrendingUp,
  Award,
  Calendar,
  Bookmark,
  Eye,
  ChevronDown,
  ChevronUp,
  X,
  RefreshCw,
  Zap,
  Target,
  Shield,
  Sparkles,
  Crown,
  Flame,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Sliders,
  RotateCcw,
  Diamond,
  Tag,
  Bell,
  Plus,
  Minus,
  Loader2
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  benefits: string[];
  postedAt: string;
  expiresAt: string;
  applications: number;
  views: number;
  rating: number;
  featured: boolean;
  urgent: boolean;
  remote: boolean;
  visaSponsorship: boolean;
  equity: boolean;
  tags: string[];
  industry: string;
  url?: string;
  source?: string;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'full-time',
    experienceLevel: 'senior',
    salary: { min: 120000, max: 180000, currency: 'USD' },
    description: 'We are looking for a Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining our web applications using React, TypeScript, and modern frontend technologies.',
    requirements: ['5+ years React experience', 'TypeScript proficiency', 'CSS/SCSS expertise', 'REST API integration', 'Git version control'],
    benefits: ['Health insurance', '401k matching', 'Flexible PTO', 'Remote work options', 'Professional development budget'],
    postedAt: '2024-12-01',
    expiresAt: '2024-12-31',
    applications: 45,
    views: 234,
    rating: 4.8,
    featured: true,
    urgent: false,
    remote: true,
    visaSponsorship: true,
    equity: true,
    tags: ['React', 'TypeScript', 'Frontend', 'JavaScript', 'CSS'],
    industry: 'Technology',
    url: 'https://techcorp.com/careers/senior-frontend-dev',
    source: 'Company Website'
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'InnovateLabs',
    location: 'New York, NY',
    type: 'full-time',
    experienceLevel: 'mid',
    salary: { min: 95000, max: 140000, currency: 'USD' },
    description: 'Join our product team as a Product Manager and help shape the future of our platform. You will work with cross-functional teams to define product strategy, prioritize features, and drive product development.',
    requirements: ['3+ years product management', 'Agile/Scrum experience', 'Data analysis skills', 'Stakeholder management', 'Technical background preferred'],
    benefits: ['Competitive salary', 'Stock options', 'Health benefits', 'Learning budget', 'Team events'],
    postedAt: '2024-12-02',
    expiresAt: '2024-12-30',
    applications: 32,
    views: 156,
    rating: 4.6,
    featured: false,
    urgent: true,
    remote: false,
    visaSponsorship: false,
    equity: true,
    tags: ['Product Management', 'Agile', 'Strategy', 'Analytics', 'Leadership'],
    industry: 'Technology',
    url: 'https://innovatelabs.com/careers/product-manager',
    source: 'Company Website'
  },
  {
    id: '3',
    title: 'UX Designer',
    company: 'DesignStudio',
    location: 'Toronto, Canada',
    type: 'full-time',
    experienceLevel: 'mid',
    salary: { min: 70000, max: 95000, currency: 'CAD' },
    description: 'Create beautiful and intuitive user experiences. You will work on user research, wireframing, prototyping, and collaborating with development teams.',
    requirements: ['3+ years UX design experience', 'Figma proficiency', 'User research skills', 'Prototyping experience', 'Portfolio required'],
    benefits: ['Health insurance', 'RRSP matching', 'Design budget', 'Flexible hours', 'Remote work options'],
    postedAt: '2024-12-02',
    expiresAt: '2024-12-31',
    applications: 18,
    views: 98,
    rating: 4.4,
    featured: false,
    urgent: false,
    remote: true,
    visaSponsorship: false,
    equity: false,
    tags: ['UX Design', 'Figma', 'User Research', 'Prototyping', 'UI Design'],
    industry: 'Design',
    url: 'https://designstudio.com/careers/ux-designer',
    source: 'Company Website'
  }
];

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 
  'Data Science', 'Design', 'Sales', 'Operations', 'Consulting', 'Government'
];

const popularTags = [
  'React', 'Python', 'JavaScript', 'Machine Learning', 'Marketing',
  'Sales', 'Design', 'Data Analysis', 'Project Management', 'Leadership'
];

interface JobSearchProps {
  onJobSelect: (job: any) => void;
  selectedJob?: any;
}

const JobSearch = ({ onJobSelect, selectedJob: propSelectedJob }: JobSearchProps) => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  
  const [filters, setFilters] = useState({
    location: '',
    jobType: 'all',
    experienceLevel: 'all',
    industry: 'all',
    salaryRange: [0, 200000],
    remote: false,
    featured: false,
    urgent: false,
    visaSponsorship: false,
    equity: false,
    selectedTags: [] as string[],
    government: false
  });

  useEffect(() => {
    filterJobs();
  }, [searchQuery, filters, sortBy, jobs]);

  const filterJobs = () => {
    let filtered = [...jobs];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Job type filter
    if (filters.jobType !== 'all') {
      filtered = filtered.filter(job => job.type === filters.jobType);
    }

    // Experience level filter
    if (filters.experienceLevel !== 'all') {
      filtered = filtered.filter(job => job.experienceLevel === filters.experienceLevel);
    }

    // Industry filter
    if (filters.industry !== 'all') {
      filtered = filtered.filter(job => job.industry === filters.industry);
    }

    // Salary range filter
    filtered = filtered.filter(job => 
      job.salary.min >= filters.salaryRange[0] && job.salary.max <= filters.salaryRange[1]
    );

    // Remote filter
    if (filters.remote) {
      filtered = filtered.filter(job => job.remote);
    }

    // Featured filter
    if (filters.featured) {
      filtered = filtered.filter(job => job.featured);
    }

    // Urgent filter
    if (filters.urgent) {
      filtered = filtered.filter(job => job.urgent);
    }

    // Visa sponsorship filter
    if (filters.visaSponsorship) {
      filtered = filtered.filter(job => job.visaSponsorship);
    }

    // Equity filter
    if (filters.equity) {
      filtered = filtered.filter(job => job.equity);
    }

    // Tags filter
    if (filters.selectedTags.length > 0) {
      filtered = filtered.filter(job => 
        filters.selectedTags.some(tag => job.tags.includes(tag))
      );
    }

    // Sort jobs
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
        break;
      case 'salary':
        filtered.sort((a, b) => b.salary.max - a.salary.max);
        break;
      case 'relevance':
      default:
        // Enhanced relevance algorithm
        filtered.sort((a, b) => {
          let scoreA = 0;
          let scoreB = 0;
          
          // Featured jobs get higher score
          if (a.featured) scoreA += 10;
          if (b.featured) scoreB += 10;
          
          // Urgent jobs get higher score
          if (a.urgent) scoreA += 5;
          if (b.urgent) scoreB += 5;
          
          // Higher salary gets higher score
          scoreA += a.salary.max / 10000;
          scoreB += b.salary.max / 10000;
          
          // More applications indicates popularity
          scoreA += a.applications / 10;
          scoreB += b.applications / 10;
          
          // Higher rating gets higher score
          scoreA += a.rating * 2;
          scoreB += b.rating * 2;
          
          return scoreB - scoreA;
        });
        break;
    }

    setFilteredJobs(filtered);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag]
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      jobType: 'all',
      experienceLevel: 'all',
      industry: 'all',
      salaryRange: [0, 200000],
      remote: false,
      featured: false,
      urgent: false,
      visaSponsorship: false,
      equity: false,
      selectedTags: []
    });
    setSearchQuery('');
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsDetailModalOpen(true);
    onJobSelect(job);
  };

  const handleApply = (job: Job) => {
    toast({
      title: "Application Started!",
      description: `Redirecting to apply for ${job.title} at ${job.company}...`,
    });
    // In a real app, this would redirect to the application page
    if (job.url) {
      window.open(job.url, '_blank');
    }
  };

  const handleSave = (job: Job) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(job.id)) {
      newSavedJobs.delete(job.id);
      toast({
        title: "Job Removed",
        description: `Removed ${job.title} from saved jobs`,
      });
    } else {
      newSavedJobs.add(job.id);
      toast({
        title: "Job Saved!",
        description: `Added ${job.title} to your saved jobs`,
      });
    }
    setSavedJobs(newSavedJobs);
  };

  const handleShare = (job: Job) => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${job.title} at ${job.company} - ${window.location.href}`);
      toast({
        title: "Link Copied!",
        description: "Job link copied to clipboard",
      });
    }
  };

  const getJobTypeColor = (type: string) => {
    const colors = {
      'full-time': 'bg-blue-100 text-blue-800 border-blue-200',
      'part-time': 'bg-green-100 text-green-800 border-green-200',
      'contract': 'bg-purple-100 text-purple-800 border-purple-200',
      'internship': 'bg-orange-100 text-orange-800 border-orange-200',
      'remote': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getExperienceColor = (level: string) => {
    const colors = {
      'entry': 'bg-green-100 text-green-800 border-green-200',
      'mid': 'bg-blue-100 text-blue-800 border-blue-200',
      'senior': 'bg-purple-100 text-purple-800 border-purple-200',
      'executive': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.location) count++;
    if (filters.jobType !== 'all') count++;
    if (filters.experienceLevel !== 'all') count++;
    if (filters.industry !== 'all') count++;
    if (filters.remote) count++;
    if (filters.featured) count++;
    if (filters.urgent) count++;
    if (filters.visaSponsorship) count++;
    if (filters.equity) count++;
    if (filters.selectedTags.length > 0) count++;
    return count;
  };

  return (
    <div className="space-y-8">
      {/* Search and Filters - Exact same as Jobs page */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search jobs, companies, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
            />
            <Button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* All Filters in Toolbar */}
          <div className="space-y-6">
            {/* Main Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </label>
                <Input
                  placeholder="City, State, Country"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="border-2"
                />
              </div>

              {/* Job Type */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Job Type
                </label>
                <Select value={filters.jobType} onValueChange={(value) => handleFilterChange('jobType', value)}>
                  <SelectTrigger className="border-2">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Experience
                </label>
                <Select value={filters.experienceLevel} onValueChange={(value) => handleFilterChange('experienceLevel', value)}>
                  <SelectTrigger className="border-2">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Industry
                </label>
                <Select value={filters.industry} onValueChange={(value) => handleFilterChange('industry', value)}>
                  <SelectTrigger className="border-2">
                    <SelectValue placeholder="All Industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {industries.map(industry => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Salary Range */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Salary Range: ${filters.salaryRange[0].toLocaleString()} - ${filters.salaryRange[1].toLocaleString()}
              </label>
              <Slider
                value={filters.salaryRange}
                onValueChange={(value) => handleFilterChange('salaryRange', value)}
                max={200000}
                min={0}
                step={5000}
                className="w-full"
              />
            </div>

            {/* Quick Filter Buttons */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button
                  variant={filters.remote ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('remote', !filters.remote)}
                  className="border-2"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Remote
                </Button>
                <Button
                  variant={filters.featured ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('featured', !filters.featured)}
                  className="border-2"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Featured
                </Button>
                <Button
                  variant={filters.urgent ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('urgent', !filters.urgent)}
                  className="border-2"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Urgent
                </Button>
                <Button
                  variant={filters.visaSponsorship ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('visaSponsorship', !filters.visaSponsorship)}
                  className="border-2"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Visa Sponsorship
                </Button>
                <Button
                  variant={filters.equity ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('equity', !filters.equity)}
                  className="border-2"
                >
                  <Diamond className="h-4 w-4 mr-2" />
                  Equity
                </Button>
              </div>

              {/* Skills & Tags */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Skills & Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(tag => (
                    <Button
                      key={tag}
                      variant={filters.selectedTags.includes(tag) ? 'default' : 'outline'}
                      onClick={() => handleTagToggle(tag)}
                      size="sm"
                      className="border-2"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 border-2">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                    <SelectItem value="date">Newest First</SelectItem>
                    <SelectItem value="salary">Highest Salary</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex border-2 border-gray-200 rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="destructive" className="mr-2">
                    {getActiveFiltersCount()} filters active
                  </Badge>
                )}
                <Button variant="outline" onClick={clearFilters} className="border-2">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {filteredJobs.length} Jobs Found
          </h2>
          <p className="text-gray-600 mt-1">
            {searchQuery ? `Results for "${searchQuery}"` : 'All available positions'}
            {filters.location && ` in ${filters.location}`}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <RefreshCw className="h-4 w-4" />
            <span>Updated just now</span>
          </div>
          
          <Button variant="outline" className="border-2">
            <Bell className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
        </div>
      </div>

      {/* No Results */}
      {filteredJobs.length === 0 && (
        <Card className="text-center py-16 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent>
            <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No jobs found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Try adjusting your search criteria or filters to find more opportunities.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={clearFilters} className="bg-blue-600">
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                <Search className="h-4 w-4 mr-2" />
                Clear Search
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Cards Grid */}
      {filteredJobs.length > 0 && (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredJobs.map((job) => (
            <Card 
              key={job.id} 
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm cursor-pointer"
              onClick={() => handleJobClick(job)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      {job.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {job.urgent && (
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          <Clock className="h-3 w-3 mr-1" />
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg font-semibold text-gray-700 mb-1">{job.company}</p>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                      {job.remote && (
                        <>
                          <span>•</span>
                          <Globe className="h-4 w-4" />
                          <span>Remote</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(job);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className={`h-4 w-4 ${savedJobs.has(job.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(job);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Share2 className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={getJobTypeColor(job.type)}>
                    {job.type.replace('-', ' ').toUpperCase()}
                  </Badge>
                  <Badge className={getExperienceColor(job.experienceLevel)}>
                    {job.experienceLevel.toUpperCase()}
                  </Badge>
                  {job.visaSponsorship && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <Shield className="h-3 w-3 mr-1" />
                      Visa Sponsorship
                    </Badge>
                  )}
                  {job.equity && (
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                      <Diamond className="h-3 w-3 mr-1" />
                      Equity
                    </Badge>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {job.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{job.applications} applicants</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{job.views} views</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{job.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {job.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {job.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{job.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJobClick(job);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(job);
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Apply Now
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedJob(null);
          }}
          onApply={handleApply}
          onSave={handleSave}
          onShare={handleShare}
          isSaved={savedJobs.has(selectedJob.id)}
        />
      )}
    </div>
  );
};

export default JobSearch;
