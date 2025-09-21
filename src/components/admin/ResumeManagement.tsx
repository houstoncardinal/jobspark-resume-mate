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
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  FileText, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Download, 
  Shield, 
  ShieldCheck, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  File,
  HardDrive,
  Calendar
} from "lucide-react";
import { supabase } from "@/integrations/supabase/supabaseClient";
import { useToast } from "@/hooks/use-toast";

interface ResumeFile {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  is_public: boolean;
  is_verified: boolean;
  safety_score: number;
  safety_issues: string[];
  admin_reviewed: boolean;
  admin_notes: string;
  download_count: number;
  created_at: string;
  updated_at: string;
  user?: {
    email: string;
    full_name: string;
    first_name: string;
    last_name: string;
  };
}

export const ResumeManagement = () => {
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [safetyFilter, setSafetyFilter] = useState("all");
  const [selectedResumes, setSelectedResumes] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resume_files')
        .select(`
          *,
          user:profiles!resume_files_user_id_fkey(email, full_name, first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast({
        title: "Error",
        description: "Failed to load resumes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResume = async (resumeId: string) => {
    try {
      const { error } = await supabase
        .from('resume_files')
        .update({ 
          is_verified: true,
          admin_reviewed: true,
          safety_score: 100
        })
        .eq('id', resumeId);

      if (error) throw error;

      setResumes(resumes.map(resume => 
        resume.id === resumeId ? { 
          ...resume, 
          is_verified: true, 
          admin_reviewed: true,
          safety_score: 100
        } : resume
      ));

      toast({
        title: "Success",
        description: "Resume verified successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify resume.",
        variant: "destructive",
      });
    }
  };

  const handleFlagResume = async (resumeId: string, issues: string[]) => {
    try {
      const { error } = await supabase
        .from('resume_files')
        .update({ 
          is_verified: false,
          admin_reviewed: true,
          safety_issues: issues,
          safety_score: Math.max(0, 100 - (issues.length * 20))
        })
        .eq('id', resumeId);

      if (error) throw error;

      setResumes(resumes.map(resume => 
        resume.id === resumeId ? { 
          ...resume, 
          is_verified: false, 
          admin_reviewed: true,
          safety_issues: issues,
          safety_score: Math.max(0, 100 - (issues.length * 20))
        } : resume
      ));

      toast({
        title: "Success",
        description: "Resume flagged with safety issues.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to flag resume.",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSafetyBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getSafetyStatus = (score: number) => {
    if (score >= 80) return 'Safe';
    if (score >= 60) return 'Warning';
    return 'Danger';
  };

  const filteredResumes = resumes.filter(resume => {
    const matchesSearch = resume.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resume.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resume.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "verified" && resume.is_verified) ||
                         (statusFilter === "unverified" && !resume.is_verified) ||
                         (statusFilter === "reviewed" && resume.admin_reviewed) ||
                         (statusFilter === "unreviewed" && !resume.admin_reviewed);
    
    const matchesSafety = safetyFilter === "all" ||
                         (safetyFilter === "safe" && resume.safety_score >= 80) ||
                         (safetyFilter === "warning" && resume.safety_score >= 60 && resume.safety_score < 80) ||
                         (safetyFilter === "danger" && resume.safety_score < 60);
    
    return matchesSearch && matchesStatus && matchesSafety;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Resume Management</h2>
          <p className="text-gray-600">Review and manage uploaded resume files</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {filteredResumes.length} resumes
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total Files</span>
            </div>
            <p className="text-2xl font-bold">{resumes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Verified</span>
            </div>
            <p className="text-2xl font-bold">{resumes.filter(r => r.is_verified).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Needs Review</span>
            </div>
            <p className="text-2xl font-bold">{resumes.filter(r => !r.admin_reviewed).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Total Downloads</span>
            </div>
            <p className="text-2xl font-bold">{resumes.reduce((sum, r) => sum + r.download_count, 0)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search resumes by filename or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="unreviewed">Unreviewed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={safetyFilter} onValueChange={setSafetyFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by safety" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Safety Levels</SelectItem>
                <SelectItem value="safe">Safe (80+)</SelectItem>
                <SelectItem value="warning">Warning (60-79)</SelectItem>
                <SelectItem value="danger">Danger (&lt;60)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resumes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume Files ({filteredResumes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      className="rounded"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedResumes(filteredResumes.map(r => r.id));
                        } else {
                          setSelectedResumes([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Safety</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResumes.map((resume) => (
                  <TableRow key={resume.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedResumes.includes(resume.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedResumes([...selectedResumes, resume.id]);
                          } else {
                            setSelectedResumes(selectedResumes.filter(id => id !== resume.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <File className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 truncate max-w-xs">
                            {resume.file_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {resume.file_type.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">
                            {resume.user?.full_name || `${resume.user?.first_name || ''} ${resume.user?.last_name || ''}`.trim() || 'Unknown User'}
                          </p>
                          <p className="text-xs text-gray-500">{resume.user?.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {resume.file_type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <HardDrive className="h-3 w-3" />
                        {formatFileSize(resume.file_size)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className={getSafetyBadgeColor(resume.safety_score)}>
                          {resume.safety_score}/100
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {getSafetyStatus(resume.safety_score)}
                        </span>
                      </div>
                      {resume.safety_issues.length > 0 && (
                        <div className="mt-1">
                          <p className="text-xs text-red-600">
                            Issues: {resume.safety_issues.join(', ')}
                          </p>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {resume.is_verified ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">Verified</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-orange-600">
                            <XCircle className="h-4 w-4" />
                            <span className="text-sm">Unverified</span>
                          </div>
                        )}
                        {resume.admin_reviewed && (
                          <Badge variant="outline" className="text-xs">
                            Reviewed
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Download className="h-3 w-3" />
                        {resume.download_count}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(resume.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview File
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          {!resume.is_verified && (
                            <DropdownMenuItem onClick={() => handleVerifyResume(resume.id)}>
                              <ShieldCheck className="h-4 w-4 mr-2" />
                              Verify File
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleFlagResume(resume.id, ['Suspicious content', 'Malware detected'])}
                            className="text-red-600"
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Flag Issues
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedResumes.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedResumes.length} resume(s) selected
              </p>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Verify Selected
                </Button>
                <Button size="sm" variant="outline">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Flag Selected
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
