import React, { useState, useEffect } from 'react';
import { SEO } from '@/components/SEO';
import { PAGE_SEO } from '@/lib/seo';
import { ResumeUpload } from '@/components/ResumeUpload';
import { ResumeBuilder } from '@/components/ResumeBuilder';
import { ResumeOptimizer } from '@/components/ResumeOptimizer';
import { useToast } from '@/hooks/use-toast';
import { searchAllJobs, getAvailableSources, testAPIConnections, JobListing, JobSearchParams } from '@/lib/job-aggregator';
import { JobCard } from "@/components/JobCard";
import { JobSkeletonGrid } from "@/components/ui/job-skeleton";
import { JobDetailModal } from '@/components/JobDetailModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Search as SearchIcon, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  Loader2,
  Filter,
  Grid,
  List,
  Heart,
  Share2,
  ExternalLink,
  Globe,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Award,
  Building2,
  Sliders,
  RotateCcw,
  Search,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  RefreshCw,
  BarChart3,
  Activity,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  Star,
  MessageCircle,
  Calendar,
  Phone,
  Mail,
  ChevronRight,
  Play,
  BookOpen,
  Lightbulb,
  Rocket,
  Crown,
  Flame,
  Settings,
  UserPlus,
  LogIn,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  UserSearch,
  ClipboardList,
  LineChart,
  LifeBuoy,
  GraduationCap,
  Network,
  Plus,
  Minus,
  Tag,
  Bell,
  Upload,
  Download,
  Eye,
  Edit3
} from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<JobSearchParams>({
    query: 'software engineer',
    location: '',
    remote: false,
    sources: ['usajobs', 'remoteok', 'rss'],
    limit: 50
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'salary'>('relevance');
  const [apiStatus, setApiStatus] = useState<Record<string, boolean>>({});
  const [sources, setSources] = useState(getAvailableSources());
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [atsAnalysis, setAtsAnalysis] = useState<any>(null);
  const [resumeBuilderMode, setResumeBuilderMode] = useState<'upload' | 'build' | 'templates'>('upload');
  const [builtResume, setBuiltResume] = useState<any>(null);
  const { toast } = useToast();

  // Test API connections on mount
  useEffect(() => {
    testConnections();
  }, []);

  const testConnections = async () => {
    const status = await testAPIConnections();
    setApiStatus(status);
  };

  // ⚡ ULTRA-FAST job loading with optimizations
  const loadJobs = React.useCallback(async () => {
    setLoading(true);
    const startTime = Date.now();
    
    try {
      console.log("⚡ Starting ultra-fast job search...");
      const results = await searchAllJobs(searchParams);
      setJobs(results);
      
      const loadTime = Date.now() - startTime;
      console.log(`⚡ Jobs loaded in ${loadTime}ms`);
      
      if (results.length === 0) {
        toast({
          title: "No jobs found",
          description: "Try adjusting your search criteria or using different sources.",
        });
      } else {
        toast({
          title: `Found ${results.length} jobs`,
          description: `Loaded in ${loadTime}ms ⚡`,
        });
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
      toast({
        title: "Error loading jobs",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  // Load jobs on component mount and when search params change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadJobs();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchParams, loadJobs]);  }, [searchParams, toast]);
  const handleSearch = (newParams: Partial<JobSearchParams>) => {
    // Convert "any" values to undefined to clear filters
    const processedParams = { ...newParams };
    if (processedParams.jobType === 'any') processedParams.jobType = undefined;
    if (processedParams.experience === 'any') processedParams.experience = undefined;
    if (processedParams.industry === 'any') processedParams.industry = undefined;
    
    setSearchParams(prev => ({ ...prev, ...processedParams }));
  };

  const handleSourceToggle = (sourceId: string) => {
    setSearchParams(prev => {
      const currentSources = prev.sources || [];
      const newSources = currentSources.includes(sourceId)
        ? currentSources.filter(s => s !== sourceId)
        : [...currentSources, sourceId];
      
      return {
        ...prev,
        sources: newSources
      };
    });
  };

  const handleJobSelect = (job: JobListing) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const handleResumeUpload = (file: File) => {
    setUploadedResume(file);
    performATSAnalysis(file);
    setActiveTab("ats");
  };

  const performATSAnalysis = (resume: File) => {
    // Simulate ATS analysis
    setTimeout(() => {
      const score = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
      setAtsScore(score);
      setAtsAnalysis({
        keywordMatch: score > 80 ? 'Excellent' : score > 60 ? 'Good' : 'Needs Improvement',
        formatting: score > 75 ? 'ATS-Friendly' : 'Some Issues',
        sections: score > 70 ? 'Complete' : 'Missing Sections',
        recommendations: [
          'Add more relevant keywords',
          'Improve section formatting',
          'Include quantifiable achievements',
          'Optimize for industry standards'
        ]
      });
    }, 2000);
  };

  const convertJobListingToJob = (jobListing: JobListing) => ({
    id: jobListing.id,
    title: jobListing.title,
    company: jobListing.company,
    location: jobListing.location,
    type: (jobListing.type?.toLowerCase() as 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote') || 'full-time',
    experienceLevel: (jobListing.experience?.toLowerCase() as 'entry' | 'mid' | 'senior' | 'executive') || 'mid',
    salary: {
      min: jobListing.salary?.min || 0,
      max: jobListing.salary?.max || 0,
      currency: jobListing.salary?.currency || 'USD',
    },
    description: jobListing.description || '',
    requirements: jobListing.requirements || [],
    benefits: jobListing.benefits || [],
    postedAt: jobListing.posted || new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    applications: 0,
    views: 0,
    rating: 4.5,
    featured: false,
    urgent: false,
    remote: jobListing.remote || false,
    visaSponsorship: false,
    equity: false,
    tags: jobListing.skills || [],
    industry: jobListing.industry || 'Technology',
    url: jobListing.url,
    source: jobListing.source,
  });

  const formatSalary = (job: JobListing) => {
    if (!job.salary) return 'Salary not specified';
    
    const { min, max, currency = 'USD', period = 'year' } = job.salary;
    const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);
    
    if (min && max) {
      return `$${formatNumber(min)} - $${formatNumber(max)}/${period}`;
    } else if (min) {
      return `$${formatNumber(min)}+/${period}`;
    } else if (max) {
      return `Up to $${formatNumber(max)}/${period}`;
    }
    
    return 'Salary not specified';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date not specified';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <>
      <SEO seoData={PAGE_SEO['/']} url="/" />
      <div className="bg-gray-50">
        
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                  Find Your <span className="text-blue-600">Dream Job</span>
                  <br />
                  <span className="text-2xl md:text-4xl text-gray-600 font-normal">
                    Search • Build • Analyze • Boost
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto lg:mx-0">
                  Search real job listings, build your resume, analyze ATS compatibility, and boost your career with AI-powered insights.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button 
                    size="lg" 
                    onClick={() => document.getElementById('job-search')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-lg px-8 py-6"
                  >
                    <SearchIcon className="h-5 w-5 mr-2" />
                    Start Job Search
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => setActiveTab("upload")}
                    className="text-lg px-8 py-6"
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Build Resume
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <SearchIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold mb-2">1. Search Jobs</h3>
                      <p className="text-sm text-gray-600">Find real opportunities from multiple sources</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold mb-2">2. Build Resume</h3>
                      <p className="text-sm text-gray-600">Create professional resumes instantly</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <BarChart3 className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold mb-2">3. ATS Analysis</h3>
                      <p className="text-sm text-gray-600">Check resume compatibility</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Rocket className="h-6 w-6 text-orange-600" />
                      </div>
                      <h3 className="font-semibold mb-2">4. Career Boost</h3>
                      <p className="text-sm text-gray-600">Get AI-powered career insights</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8" id="job-search">
            {/* Desktop Tabs */}
            <div className="hidden md:block">
              <div className="bg-gray-100/30 backdrop-blur-sm border border-gray-200 rounded-t-xl p-1">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setActiveTab("search")}
                    className={`flex items-center gap-2 px-6 py-4 rounded-t-lg transition-all duration-200 relative ${
                      activeTab === "search" 
                        ? "bg-white text-blue-700 shadow-sm border-b-2 border-blue-600" 
                        : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                    }`}
                  >
                    <SearchIcon className="h-5 w-5" />
                    <span className="font-semibold">Job Search</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("upload")}
                    className={`flex items-center gap-2 px-6 py-4 rounded-t-lg transition-all duration-200 relative ${
                      activeTab === "upload" 
                        ? "bg-white text-green-700 shadow-sm border-b-2 border-green-600" 
                        : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                    }`}
                  >
                    <FileText className="h-5 w-5" />
                    <span className="font-semibold">Resume Builder</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("ats")}
                    className={`flex items-center gap-2 px-6 py-4 rounded-t-lg transition-all duration-200 relative ${
                      activeTab === "ats" 
                        ? "bg-white text-purple-700 shadow-sm border-b-2 border-purple-600" 
                        : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                    }`}
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span className="font-semibold">ATS Analysis</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("boost")}
                    className={`flex items-center gap-2 px-6 py-4 rounded-t-lg transition-all duration-200 relative ${
                      activeTab === "boost" 
                        ? "bg-white text-orange-700 shadow-sm border-b-2 border-orange-600" 
                        : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                    }`}
                  >
                    <Rocket className="h-5 w-5" />
                    <span className="font-semibold">Career Boost</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Tabs */}
            <div className="md:hidden space-y-3">
              {[
                { id: "search", label: "Job Search", icon: SearchIcon, desc: "Find real opportunities", color: "blue" },
                { id: "upload", label: "Resume Builder", icon: FileText, desc: "Create professional resumes", color: "green" },
                { id: "ats", label: "ATS Analysis", icon: BarChart3, desc: "Check compatibility", color: "purple" },
                { id: "boost", label: "Career Boost", icon: Rocket, desc: "Get AI insights", color: "orange" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id 
                      ? `bg-${tab.color}-100 border-2 border-${tab.color}-200 text-${tab.color}-700 shadow-sm` 
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activeTab === tab.id ? `bg-${tab.color}-200` : "bg-gray-100"
                  }`}>
                    <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? `text-${tab.color}-700` : "text-gray-600"}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-semibold text-base">{tab.label}</span>
                    <p className="text-sm text-gray-500">{tab.desc}</p>
                  </div>
                  {activeTab === tab.id && (
                    <div className={`w-2 h-2 bg-${tab.color}-500 rounded-full`}></div>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-b-xl border border-gray-200 shadow-sm">
              {/* Job Search Tab */}
              {activeTab === "search" && (
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Search Header */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Find Your Next Opportunity</h3>
                      <p className="text-gray-600">Search real job listings from top companies and job boards worldwide</p>
                    </div>

                    {/* Search Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          placeholder="Job title, keywords, or company"
                          value={searchParams.query || ''}
                          onChange={(e) => handleSearch({ query: e.target.value })}
                          className="pl-10 h-12"
                        />
                      </div>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          placeholder="City, state, or remote"
                          value={searchParams.location || ''}
                          onChange={(e) => handleSearch({ location: e.target.value })}
                          className="pl-10 h-12"
                        />
                      </div>
                      <Button 
                        onClick={loadJobs}
                        disabled={loading}
                        className="h-12"
                      >
                        {loading ? (
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        ) : (
                          <SearchIcon className="h-5 w-5 mr-2" />
                        )}
                        Search Jobs
                      </Button>
                    </div>

                    {/* Always-Visible Filters */}
                    <Card className="bg-gray-50/50 border-dashed">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Sliders className="h-5 w-5 text-blue-600" />
                          Search Filters
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                          {/* Remote Filter */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Work Type</label>
                            <Button
                              variant={searchParams.remote ? "default" : "outline"}
                              onClick={() => handleSearch({ remote: !searchParams.remote })}
                              className="w-full justify-start"
                              size="sm"
                            >
                              <Globe className="h-4 w-4 mr-2" />
                              Remote Only
                            </Button>
                          </div>

                          {/* Job Type */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Job Type</label>
                            <Select
                              value={searchParams.jobType || 'any'}
                              onValueChange={(value) => handleSearch({ jobType: value })}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Any type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="any">Any type</SelectItem>
                                <SelectItem value="full-time">Full-time</SelectItem>
                                <SelectItem value="part-time">Part-time</SelectItem>
                                <SelectItem value="contract">Contract</SelectItem>
                                <SelectItem value="internship">Internship</SelectItem>
                                <SelectItem value="freelance">Freelance</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Experience Level */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Experience</label>
                            <Select
                              value={searchParams.experience || 'any'}
                              onValueChange={(value) => handleSearch({ experience: value })}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Any level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="any">Any level</SelectItem>
                                <SelectItem value="entry">Entry Level</SelectItem>
                                <SelectItem value="mid">Mid Level</SelectItem>
                                <SelectItem value="senior">Senior Level</SelectItem>
                                <SelectItem value="executive">Executive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Industry */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Industry</label>
                            <Select
                              value={searchParams.industry || 'any'}
                              onValueChange={(value) => handleSearch({ industry: value })}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Any industry" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="any">Any industry</SelectItem>
                                <SelectItem value="technology">Technology</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="government">Government</SelectItem>
                                <SelectItem value="consulting">Consulting</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Job Sources */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Sources ({sources.filter(s => searchParams.sources?.includes(s.id)).length})</label>
                            <div className="relative">
                              <Select
                                value=""
                                onValueChange={(value) => handleSourceToggle(value)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Toggle sources" />
                                </SelectTrigger>
                                <SelectContent>
                                  {sources.map((source) => (
                                    <SelectItem key={source.id} value={source.id}>
                                      <div className="flex items-center justify-between w-full">
                                        <span className="flex items-center gap-2">
                                          {searchParams.sources?.includes(source.id) ? '✓ ' : '○ '}
                                          {source.name}
                                        </span>
                                        {apiStatus[source.id] !== undefined && (
                                          <span 
                                            className={`inline-block w-2 h-2 rounded-full ml-2 ${
                                              apiStatus[source.id] ? 'bg-green-500' : 'bg-red-500'
                                            }`} 
                                          />
                                        )}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {/* Active Filters Display */}
                        {(searchParams.jobType || searchParams.experience || searchParams.industry || searchParams.remote) && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-medium text-gray-600">Active:</span>
                              {searchParams.remote && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  Remote
                                  <button 
                                    onClick={() => handleSearch({ remote: false })}
                                    className="ml-1 hover:bg-gray-300 rounded-full"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              )}
                              {searchParams.jobType && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Briefcase className="h-3 w-3" />
                                  {searchParams.jobType}
                                  <button 
                                    onClick={() => handleSearch({ jobType: '' })}
                                    className="ml-1 hover:bg-gray-300 rounded-full"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              )}
                              {searchParams.experience && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Award className="h-3 w-3" />
                                  {searchParams.experience}
                                  <button 
                                    onClick={() => handleSearch({ experience: '' })}
                                    className="ml-1 hover:bg-gray-300 rounded-full"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              )}
                              {searchParams.industry && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  {searchParams.industry}
                                  <button 
                                    onClick={() => handleSearch({ industry: '' })}
                                    className="ml-1 hover:bg-gray-300 rounded-full"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  handleSearch({
                                    remote: false,
                                    jobType: 'any',
                                    experience: 'any',
                                    industry: 'any'
                                  });
                                }}
                                className="text-xs text-gray-500 hover:text-gray-700"
                              >
                                Clear all
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Results */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold">
                          {loading ? 'Searching...' : `${jobs.length} Jobs Found`}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Button
                            variant={viewMode === 'list' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                          >
                            <List className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={viewMode === 'grid' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                          >
                            <Grid className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {loading && (
                        <JobSkeletonGrid count={6} />
                      )}
                      {!loading && jobs.length === 0 && (
                        <div className="text-center py-8">
                          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h4 className="text-lg font-semibold text-gray-600 mb-2">No jobs found</h4>
                          <p className="text-gray-500">Try adjusting your search criteria or check back later.</p>
                        </div>
                      )}

                      {!loading && jobs.length > 0 && (
                        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                          {jobs.slice(0, 10).map((job) => (
                            <JobCard
                              key={job.id}
                              job={job}
                              onClick={handleJobSelect}
                            />
                          ))}
                        </div>
                      )}                    </div>
                  </div>
                </div>
              )}

              {/* Resume Builder Tab */}
              {activeTab === "upload" && (
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Resume Builder</h3>
                        <p className="text-gray-600">Create, upload, or edit your professional resume</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={resumeBuilderMode === 'upload' ? 'default' : 'outline'}
                          onClick={() => setResumeBuilderMode('upload')}
                          size="sm"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                        <Button
                          variant={resumeBuilderMode === 'build' ? 'default' : 'outline'}
                          onClick={() => setResumeBuilderMode('build')}
                          size="sm"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Build
                        </Button>
                        <Button
                          variant={resumeBuilderMode === 'templates' ? 'default' : 'outline'}
                          onClick={() => setResumeBuilderMode('templates')}
                          size="sm"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Templates
                        </Button>
                      </div>
                    </div>

                    {/* Upload Mode */}
                    {resumeBuilderMode === 'upload' && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            Upload Existing Resume
                          </CardTitle>
                          <CardDescription>
                            Upload your current resume to edit, analyze, or optimize
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResumeUpload onResumeUpload={handleResumeUpload} uploadedResume={uploadedResume} />
                          {uploadedResume && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center gap-2 text-green-700">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="font-medium">Resume uploaded successfully!</span>
                              </div>
                              <p className="text-green-600 text-sm mt-1">
                                File: {uploadedResume.name} ({(uploadedResume.size / 1024 / 1024).toFixed(2)} MB)
                              </p>
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  onClick={() => setResumeBuilderMode('build')}
                                >
                                  <Edit3 className="h-4 w-4 mr-2" />
                                  Edit Resume
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setActiveTab('ats')}
                                >
                                  <BarChart3 className="h-4 w-4 mr-2" />
                                  Analyze ATS
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Build Mode - Embedded Resume Builder */}
                    {resumeBuilderMode === 'build' && (
                      <div className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Edit3 className="h-5 w-5" />
                              Professional Resume Builder
                            </CardTitle>
                            <CardDescription>
                              Create a professional resume with our advanced builder
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-0">
                            <div className="border-t">
                              <ResumeBuilder 
                                onSave={(resumeData) => {
                                  setBuiltResume(resumeData);
                                  toast({
                                    title: "Resume Saved",
                                    description: "Your resume has been saved successfully.",
                                  });
                                }}
                                initialData={builtResume}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* Templates Mode */}
                    {resumeBuilderMode === 'templates' && (
                      <div className="space-y-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Professional Resume Templates</CardTitle>
                            <CardDescription>Choose from our collection of ATS-optimized templates</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {[
                                {
                                  name: 'Professional',
                                  description: 'Clean and professional design for corporate roles',
                                  color: 'blue',
                                  icon: Briefcase,
                                  features: ['ATS Optimized', 'Clean Layout', 'Professional']
                                },
                                {
                                  name: 'Creative',
                                  description: 'Modern and creative design for design roles',
                                  color: 'purple',
                                  icon: Sparkles,
                                  features: ['Modern Design', 'Visual Appeal', 'Creative']
                                },
                                {
                                  name: 'Technical',
                                  description: 'Structured layout perfect for tech professionals',
                                  color: 'green',
                                  icon: Settings,
                                  features: ['Tech Focused', 'Structured', 'Skills Highlight']
                                },
                                {
                                  name: 'Executive',
                                  description: 'Sophisticated design for leadership positions',
                                  color: 'gray',
                                  icon: Crown,
                                  features: ['Leadership Focus', 'Sophisticated', 'Executive']
                                },
                                {
                                  name: 'Academic',
                                  description: 'Research-focused layout for academic positions',
                                  color: 'indigo',
                                  icon: GraduationCap,
                                  features: ['Research Focus', 'Publications', 'Academic']
                                },
                                {
                                  name: 'Startup',
                                  description: 'Dynamic design for startup and entrepreneurial roles',
                                  color: 'orange',
                                  icon: Rocket,
                                  features: ['Dynamic', 'Entrepreneurial', 'Innovation']
                                }
                              ].map((template) => (
                                <Card 
                                  key={template.name} 
                                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200"
                                  onClick={() => {
                                    setResumeBuilderMode('build');
                                    toast({
                                      title: "Template Selected",
                                      description: `Starting with ${template.name} template`,
                                    });
                                  }}
                                >
                                  <CardContent className="p-6">
                                    <div className={`w-12 h-12 bg-${template.color}-100 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                                      <template.icon className={`h-6 w-6 text-${template.color}-600`} />
                                    </div>
                                    <h4 className="font-bold text-lg mb-2 text-center">{template.name}</h4>
                                    <p className="text-sm text-gray-600 text-center mb-4">{template.description}</p>
                                    <div className="flex flex-wrap gap-1 justify-center">
                                      {template.features.map((feature) => (
                                        <Badge key={feature} variant="secondary" className="text-xs">
                                          {feature}
                                        </Badge>
                                      ))}
                                    </div>
                                    <Button className="w-full mt-4" size="sm">
                                      <FileText className="h-4 w-4 mr-2" />
                                      Use Template
                                    </Button>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Get started quickly with common resume tasks</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <Button
                                variant="outline"
                                className="h-auto p-4 flex flex-col items-center gap-2"
                                onClick={() => setResumeBuilderMode('build')}
                              >
                                <Plus className="h-6 w-6" />
                                <span className="text-sm font-medium">Start from Scratch</span>
                              </Button>
                              <Button
                                variant="outline"
                                className="h-auto p-4 flex flex-col items-center gap-2"
                                onClick={() => setResumeBuilderMode('upload')}
                              >
                                <Upload className="h-6 w-6" />
                                <span className="text-sm font-medium">Upload & Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                className="h-auto p-4 flex flex-col items-center gap-2"
                                onClick={() => window.open('/builder', '_blank')}
                              >
                                <ExternalLink className="h-6 w-6" />
                                <span className="text-sm font-medium">Full Builder</span>
                              </Button>
                              <Button
                                variant="outline"
                                className="h-auto p-4 flex flex-col items-center gap-2"
                                onClick={() => setActiveTab('ats')}
                              >
                                <BarChart3 className="h-6 w-6" />
                                <span className="text-sm font-medium">ATS Analysis</span>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ATS Analysis Tab */}
              {activeTab === "ats" && (
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">ATS Analysis</h3>
                      <p className="text-gray-600">Analyze your resume's compatibility with Applicant Tracking Systems</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      {/* Upload for ATS Analysis */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            Upload Resume for Analysis
                          </CardTitle>
                          <CardDescription>
                            Upload a resume file to analyze its ATS compatibility
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResumeUpload onResumeUpload={handleResumeUpload} uploadedResume={uploadedResume} />
                        </CardContent>
                      </Card>

                      {/* Use Existing Resume */}
                      {builtResume && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <FileText className="h-5 w-5" />
                              Analyze Built Resume
                            </CardTitle>
                            <CardDescription>
                              Analyze the resume you built in the Resume Builder tab
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                              <div className="flex items-center gap-2 text-blue-700">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="font-medium">Resume ready for analysis</span>
                              </div>
                              <p className="text-blue-600 text-sm mt-1">
                                Resume built with {builtResume.template || 'custom'} template
                              </p>
                            </div>
                            <Button 
                              className="w-full"
                              onClick={() => {
                                // Analyze the built resume
                                setAtsScore(85); // Simulate analysis
                                toast({
                                  title: "Analysis Complete",
                                  description: "Your built resume has been analyzed for ATS compatibility.",
                                });
                              }}
                            >
                              <BarChart3 className="h-4 w-4 mr-2" />
                              Analyze Built Resume
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {uploadedResume || builtResume ? (
                      <div className="space-y-6">
                        {/* ATS Score */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <BarChart3 className="h-5 w-5" />
                              ATS Compatibility Score
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {atsScore === null ? (
                              <div className="text-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                                <p className="text-gray-600">Analyzing your resume...</p>
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-sm font-medium">Overall Score</span>
                                  <span className={`text-lg font-bold ${
                                    atsScore >= 80 ? 'text-green-600' : 
                                    atsScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    {atsScore}%
                                  </span>
                                </div>
                                <Progress value={atsScore} className="mb-4" />
                                <div className={`text-sm ${
                                  atsScore >= 80 ? 'text-green-600' : 
                                  atsScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {atsScore >= 80 ? '✓ Excellent ATS compatibility' :
                                   atsScore >= 60 ? '⚠ Good with some improvements needed' :
                                   '⚠ Needs significant improvements'}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Analysis Details */}
                        {atsAnalysis && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Target className="h-4 w-4 text-blue-600" />
                                  <span className="font-medium">Keyword Match</span>
                                </div>
                                <p className="text-sm text-gray-600">{atsAnalysis.keywordMatch}</p>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileCheck className="h-4 w-4 text-green-600" />
                                  <span className="font-medium">Formatting</span>
                                </div>
                                <p className="text-sm text-gray-600">{atsAnalysis.formatting}</p>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <ClipboardList className="h-4 w-4 text-purple-600" />
                                  <span className="font-medium">Sections</span>
                                </div>
                                <p className="text-sm text-gray-600">{atsAnalysis.sections}</p>
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {/* Recommendations */}
                        {atsAnalysis && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Lightbulb className="h-5 w-5" />
                                Recommendations
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {atsAnalysis.recommendations.map((rec: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Upload className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-600 mb-2">No Resume Available</h4>
                        <p className="text-gray-500 mb-6">Upload a resume or build one to start ATS analysis</p>
                        <div className="flex gap-3 justify-center">
                          <Button onClick={() => setActiveTab("upload")}>
                            <FileText className="h-4 w-4 mr-2" />
                            Go to Resume Builder
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Career Boost Tab */}
              {activeTab === "boost" && (
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Career Boost</h3>
                      <p className="text-gray-600">Get AI-powered insights and tools to accelerate your career</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Resume Optimization */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            AI Resume Optimization
                          </CardTitle>
                          <CardDescription>
                            Get AI-powered suggestions to improve your resume
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button 
                            className="w-full"
                            onClick={() => window.location.href = "/resume-optimizer"}
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Optimize Resume
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Career Insights */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Career Insights
                          </CardTitle>
                          <CardDescription>
                            Discover trends and opportunities in your field
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full" variant="outline">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View Insights
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Salary Analysis */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Salary Analysis
                          </CardTitle>
                          <CardDescription>
                            Compare your potential salary with market rates
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full" variant="outline">
                            <Activity className="h-4 w-4 mr-2" />
                            Analyze Salary
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Interview Prep */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Interview Preparation
                          </CardTitle>
                          <CardDescription>
                            Practice with AI-powered interview questions
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full" variant="outline">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Start Practice
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Career Tips */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Daily Career Tips</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            "Tailor your resume for each job application",
                            "Network actively on LinkedIn and industry events",
                            "Keep your skills updated with latest industry trends",
                            "Practice coding challenges regularly for tech roles"
                          ].map((tip, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                              <Crown className="h-5 w-5 text-yellow-600 mt-0.5" />
                              <span className="text-sm">{tip}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </Tabs>
        </div>
      </div>

      {/* Job Detail Modal */}
        {selectedJob && showJobDetails && (
          <JobDetailModal
            job={convertJobListingToJob(selectedJob)}
            isOpen={showJobDetails}
            onClose={() => setShowJobDetails(false)}
            onApply={(job) => {
              window.open(job.url || '#', '_blank');
            }}
            onSave={(job) => {
              toast({
                title: "Job Saved",
                description: "Job has been saved to your favorites.",
              });
            }}
            onShare={(job) => {
              if (navigator.share) {
                navigator.share({
                  title: job.title,
                  text: `Check out this job: ${job.title} at ${job.company}`,
                  url: job.url || window.location.href,
                });
              }
            }}
          />
        )}
    </>
  );
};

export default Index; 