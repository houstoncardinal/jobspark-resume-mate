import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Calendar,
  User,
  MapPin,
  DollarSign,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Star,
  TrendingUp,
  RefreshCw,
  Download,
  Briefcase,
  Users,
  Target,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/supabaseClient";

interface JobPosting {
  id: string;
  title: string;
  company_id: string;
  posted_by: string;
  description: string;
  requirements: string;
  benefits: string;
  location: string;
  remote_allowed: boolean;
  salary_min: number;
  salary_max: number;
  currency: string;
  employment_type: string;
  experience_level: string;
  status: string;
  is_featured: boolean;
  is_urgent: boolean;
  application_deadline: string;
  views: number;
  applications_count: number;
  created_at: string;
  updated_at: string;
  companies: {
    name: string;
    logo_url: string;
  };
  profiles: {
    full_name: string;
    email: string;
  };
}

export const AdminJobManagement = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select(`
          *,
          companies:company_id(name, logo_url),
          profiles:posted_by(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load job postings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJobAction = async (jobId: string, action: string) => {
    try {
      let updateData: any = {};
      
      switch (action) {
        case 'approve':
          updateData = { status: 'approved' };
          break;
        case 'reject':
          updateData = { status: 'rejected' };
          break;
        case 'feature':
          updateData = { is_featured: true };
          break;
        case 'unfeature':
          updateData = { is_featured: false };
          break;
        case 'urgent':
          updateData = { is_urgent: true };
          break;
        case 'not_urgent':
          updateData = { is_urgent: false };
          break;
        case 'delete':
          const { error: deleteError } = await supabase
            .from('job_postings')
            .delete()
            .eq('id', jobId);
          
          if (deleteError) throw deleteError;
          break;
      }

      if (action !== 'delete') {
        const { error } = await supabase
          .from('job_postings')
          .update(updateData)
          .eq('id', jobId);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Job ${action} completed successfully.`,
      });

      loadJobs();
    } catch (error) {
      console.error('Error performing job action:', error);
      toast({
        title: "Error",
        description: "Failed to perform job action.",
        variant: "destructive",
      });
    }
  };

  const exportJobs = () => {
    const csvContent = [
      ['Title', 'Company', 'Location', 'Status', 'Employment Type', 'Experience Level', 'Salary Range', 'Views', 'Applications', 'Created At'],
      ...jobs.map(job => [
        job.title,
        job.companies?.name || 'Unknown Company',
        job.location,
        job.status,
        job.employment_type,
        job.experience_level,
        `${job.currency} ${job.salary_min || 0} - ${job.salary_max || 0}`,
        job.views.toString(),
        job.applications_count.toString(),
        new Date(job.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jobs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.companies?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getEmploymentTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-blue-100 text-blue-800';
      case 'part-time': return 'bg-purple-100 text-purple-800';
      case 'contract': return 'bg-orange-100 text-orange-800';
      case 'internship': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job postings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Management</h2>
          <p className="text-gray-600">Review, approve, and manage job postings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={exportJobs} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={loadJobs} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold">{jobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{jobs.filter(j => j.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold">{jobs.filter(j => j.status === 'approved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-2xl font-bold">{jobs.filter(j => j.is_featured).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search jobs by title, company, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Job Postings ({filteredJobs.length})</CardTitle>
          <CardDescription>
            Review and manage job postings from employers and recruiters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Details</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Metrics</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="font-medium flex items-center gap-2">
                            {job.title}
                            {job.is_featured && (
                              <Star className="h-4 w-4 text-yellow-500" />
                            )}
                            {job.is_urgent && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                            {job.remote_allowed && (
                              <Badge variant="secondary" className="text-xs">
                                Remote OK
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Posted by {job.profiles?.full_name || 'Unknown'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {job.companies?.logo_url && (
                          <img 
                            src={job.companies.logo_url} 
                            alt={job.companies.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                        )}
                        <div>
                          <div className="font-medium text-sm">
                            {job.companies?.name || 'Unknown Company'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(job.status)}>
                        {job.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={getEmploymentTypeBadgeColor(job.employment_type)}>
                          {job.employment_type?.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <div className="text-xs text-gray-500">
                          {job.experience_level?.replace('-', ' ').toUpperCase()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {job.salary_min && job.salary_max ? (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {job.currency} {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-500">Not specified</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {job.views} views
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {job.applications_count} applications
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedJob(job);
                            setIsJobModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {job.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleJobAction(job.id, 'approve')}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleJobAction(job.id, 'reject')}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {job.status === 'approved' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleJobAction(job.id, 'feature')}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleJobAction(job.id, 'delete')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Job Detail Modal */}
      <Dialog open={isJobModalOpen} onOpenChange={setIsJobModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Job Posting Details</DialogTitle>
            <DialogDescription>
              Review job posting details and take action
            </DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Job Title</label>
                  <p className="text-sm font-medium">{selectedJob.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Company</label>
                  <p className="text-sm">{selectedJob.companies?.name || 'Unknown Company'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="text-sm">{selectedJob.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Employment Type</label>
                  <p className="text-sm">{selectedJob.employment_type?.replace('-', ' ').toUpperCase()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Experience Level</label>
                  <p className="text-sm">{selectedJob.experience_level?.replace('-', ' ').toUpperCase()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Salary Range</label>
                  <p className="text-sm">
                    {selectedJob.salary_min && selectedJob.salary_max 
                      ? `${selectedJob.currency} ${selectedJob.salary_min.toLocaleString()} - ${selectedJob.salary_max.toLocaleString()}`
                      : 'Not specified'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Remote Allowed</label>
                  <p className="text-sm">{selectedJob.remote_allowed ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Application Deadline</label>
                  <p className="text-sm">
                    {selectedJob.application_deadline 
                      ? new Date(selectedJob.application_deadline).toLocaleDateString()
                      : 'No deadline'
                    }
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Job Description</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm whitespace-pre-wrap">
                  {selectedJob.description}
                </div>
              </div>

              {selectedJob.requirements && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Requirements</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm whitespace-pre-wrap">
                    {selectedJob.requirements}
                  </div>
                </div>
              )}

              {selectedJob.benefits && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Benefits</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm whitespace-pre-wrap">
                    {selectedJob.benefits}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Views</label>
                  <p className="text-sm">{selectedJob.views}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Applications</label>
                  <p className="text-sm">{selectedJob.applications_count}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <div className="flex gap-2">
              {selectedJob?.status === 'pending' && (
                <>
                  <Button 
                    onClick={() => {
                      handleJobAction(selectedJob.id, 'approve');
                      setIsJobModalOpen(false);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    onClick={() => {
                      handleJobAction(selectedJob.id, 'reject');
                      setIsJobModalOpen(false);
                    }}
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={() => setIsJobModalOpen(false)}>
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
