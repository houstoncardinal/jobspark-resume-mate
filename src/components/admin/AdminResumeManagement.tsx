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
  Download,
  Calendar,
  User,
  FileText,
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Upload,
  File,
  Image,
  Archive,
  ExternalLink,
  Zap,
  Database
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/supabaseClient";

interface ResumeFile {
  id: string;
  user_id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  file_type: string;
  mime_type: string;
  is_verified: boolean;
  is_safe: boolean;
  virus_scan_status: string;
  content_hash: string;
  metadata: any;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

export const AdminResumeManagement = () => {
  const { toast } = useToast();
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedResume, setSelectedResume] = useState<ResumeFile | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('resume_files')
        .select(`
          *,
          profiles:user_id(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error) {
      console.error('Error loading resumes:', error);
      toast({
        title: "Error",
        description: "Failed to load resume files.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResumeAction = async (resumeId: string, action: string) => {
    try {
      let updateData: any = {};
      
      switch (action) {
        case 'verify':
          updateData = { is_verified: true };
          break;
        case 'unverify':
          updateData = { is_verified: false };
          break;
        case 'mark_safe':
          updateData = { is_safe: true, virus_scan_status: 'clean' };
          break;
        case 'mark_unsafe':
          updateData = { is_safe: false, virus_scan_status: 'infected' };
          break;
        case 'scan_virus':
          updateData = { virus_scan_status: 'pending' };
          // In a real implementation, you would trigger a virus scan service
          break;
        case 'delete':
          const { error: deleteError } = await supabase
            .from('resume_files')
            .delete()
            .eq('id', resumeId);
          
          if (deleteError) throw deleteError;
          break;
      }

      if (action !== 'delete') {
        const { error } = await supabase
          .from('resume_files')
          .update(updateData)
          .eq('id', resumeId);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Resume ${action} completed successfully.`,
      });

      loadResumes();
    } catch (error) {
      console.error('Error performing resume action:', error);
      toast({
        title: "Error",
        description: "Failed to perform resume action.",
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

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return <FileText className="h-4 w-4 text-red-500" />;
      case 'doc':
      case 'docx': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'txt': return <FileText className="h-4 w-4 text-gray-500" />;
      default: return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSafetyBadgeColor = (isSafe: boolean, scanStatus: string) => {
    if (!isSafe || scanStatus === 'infected') return 'bg-red-100 text-red-800';
    if (scanStatus === 'clean') return 'bg-green-100 text-green-800';
    if (scanStatus === 'pending') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getVerificationBadgeColor = (isVerified: boolean) => {
    return isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const filteredResumes = resumes.filter(resume => {
    const matchesSearch = resume.original_filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resume.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resume.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'verified') matchesStatus = resume.is_verified;
    else if (statusFilter === 'unverified') matchesStatus = !resume.is_verified;
    else if (statusFilter === 'safe') matchesStatus = resume.is_safe;
    else if (statusFilter === 'unsafe') matchesStatus = !resume.is_safe;
    else if (statusFilter === 'pending_scan') matchesStatus = resume.virus_scan_status === 'pending';
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume files...</p>
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
          <Button onClick={loadResumes} variant="outline" size="sm">
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
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Files</p>
                <p className="text-2xl font-bold">{resumes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold">{resumes.filter(r => r.is_verified).length}</p>
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
                <p className="text-sm font-medium text-gray-600">Safe Files</p>
                <p className="text-2xl font-bold">{resumes.filter(r => r.is_safe).length}</p>
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
                <p className="text-sm font-medium text-gray-600">Pending Scan</p>
                <p className="text-2xl font-bold">{resumes.filter(r => r.virus_scan_status === 'pending').length}</p>
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
                  placeholder="Search resumes by filename or user..."
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
                <SelectItem value="all">All Files</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
                <SelectItem value="safe">Safe</SelectItem>
                <SelectItem value="unsafe">Unsafe</SelectItem>
                <SelectItem value="pending_scan">Pending Scan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resumes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Resume Files ({filteredResumes.length})</CardTitle>
          <CardDescription>
            Review and manage uploaded resume files for safety and verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Safety</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResumes.map((resume) => (
                  <TableRow key={resume.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getFileTypeIcon(resume.file_type)}
                        <div>
                          <div className="font-medium text-sm">{resume.original_filename}</div>
                          <div className="text-xs text-gray-500">
                            {resume.filename}
                          </div>
                          {resume.content_hash && (
                            <div className="text-xs text-gray-400 font-mono">
                              {resume.content_hash.substring(0, 8)}...
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">
                          {resume.profiles?.full_name || 'Unknown User'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {resume.profiles?.email || 'No email'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {resume.file_type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatFileSize(resume.file_size)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getVerificationBadgeColor(resume.is_verified)}>
                        {resume.is_verified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={getSafetyBadgeColor(resume.is_safe, resume.virus_scan_status)}>
                          {resume.is_safe ? 'Safe' : 'Unsafe'}
                        </Badge>
                        <div className="text-xs text-gray-500">
                          {resume.virus_scan_status}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(resume.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedResume(resume);
                            setIsResumeModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!resume.is_verified && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResumeAction(resume.id, 'verify')}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {resume.is_verified && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResumeAction(resume.id, 'unverify')}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {resume.virus_scan_status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResumeAction(resume.id, 'scan_virus')}
                          >
                            <Zap className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleResumeAction(resume.id, 'delete')}
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

      {/* Resume Detail Modal */}
      <Dialog open={isResumeModalOpen} onOpenChange={setIsResumeModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Resume File Details</DialogTitle>
            <DialogDescription>
              Review file details and security information
            </DialogDescription>
          </DialogHeader>
          {selectedResume && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Original Filename</label>
                  <p className="text-sm font-medium">{selectedResume.original_filename}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">File Type</label>
                  <p className="text-sm">{selectedResume.file_type.toUpperCase()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">File Size</label>
                  <p className="text-sm">{formatFileSize(selectedResume.file_size)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">MIME Type</label>
                  <p className="text-sm">{selectedResume.mime_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Uploaded By</label>
                  <p className="text-sm">{selectedResume.profiles?.full_name || 'Unknown User'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">User Email</label>
                  <p className="text-sm">{selectedResume.profiles?.email || 'No email'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Verification Status</label>
                  <Badge className={getVerificationBadgeColor(selectedResume.is_verified)}>
                    {selectedResume.is_verified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Safety Status</label>
                  <Badge className={getSafetyBadgeColor(selectedResume.is_safe, selectedResume.virus_scan_status)}>
                    {selectedResume.is_safe ? 'Safe' : 'Unsafe'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Virus Scan Status</label>
                  <p className="text-sm">{selectedResume.virus_scan_status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Content Hash</label>
                  <p className="text-sm font-mono text-xs">{selectedResume.content_hash}</p>
                </div>
              </div>

              {selectedResume.metadata && Object.keys(selectedResume.metadata).length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Metadata</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(selectedResume.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <Button
                  onClick={() => {
                    // In a real implementation, you would download the file
                    window.open(selectedResume.file_path, '_blank');
                  }}
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </Button>
                <Button
                  onClick={() => {
                    // In a real implementation, you would preview the file
                    window.open(selectedResume.file_path, '_blank');
                  }}
                  variant="outline"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <div className="flex gap-2">
              {selectedResume && (
                <>
                  {!selectedResume.is_verified && (
                    <Button 
                      onClick={() => {
                        handleResumeAction(selectedResume.id, 'verify');
                        setIsResumeModalOpen(false);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify File
                    </Button>
                  )}
                  {selectedResume.virus_scan_status === 'pending' && (
                    <Button 
                      onClick={() => {
                        handleResumeAction(selectedResume.id, 'scan_virus');
                        setIsResumeModalOpen(false);
                      }}
                      variant="outline"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Scan for Viruses
                    </Button>
                  )}
                </>
              )}
              <Button variant="outline" onClick={() => setIsResumeModalOpen(false)}>
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
