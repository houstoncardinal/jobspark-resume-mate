import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileText, 
  Edit, 
  Download, 
  Trash2, 
  Eye, 
  Plus,
  Calendar,
  Clock,
  Star,
  MoreHorizontal,
  Copy,
  Share2,
  Settings
} from 'lucide-react';

interface SavedResume {
  id: string;
  title: string;
  sections: any[];
  template: any;
  userId: string;
  createdAt: string;
  lastModified: string;
  isPublic?: boolean;
  tags?: string[];
}

export const ResumeManager: React.FC = () => {
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState<SavedResume | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadSavedResumes();
  }, []);

  const loadSavedResumes = () => {
    try {
      const saved = localStorage.getItem('userResumes');
      if (saved) {
        const resumes = JSON.parse(saved);
        const userResumes = resumes.filter((resume: SavedResume) => resume.userId === user?.id);
        setSavedResumes(userResumes);
      }
    } catch (error) {
      console.error('Error loading saved resumes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditResume = (resume: SavedResume) => {
    setSelectedResume(resume);
    setEditTitle(resume.title);
    setIsEditModalOpen(true);
  };

  const handleUpdateResume = () => {
    if (!selectedResume) return;

    const updatedResumes = savedResumes.map(resume =>
      resume.id === selectedResume.id
        ? { ...resume, title: editTitle, lastModified: new Date().toISOString() }
        : resume
    );

    setSavedResumes(updatedResumes);
    localStorage.setItem('userResumes', JSON.stringify(updatedResumes));
    setIsEditModalOpen(false);
    setSelectedResume(null);

    toast({
      title: "Resume Updated!",
      description: "Your resume has been successfully updated.",
    });
  };

  const handleDeleteResume = (resumeId: string) => {
    const updatedResumes = savedResumes.filter(resume => resume.id !== resumeId);
    setSavedResumes(updatedResumes);
    localStorage.setItem('userResumes', JSON.stringify(updatedResumes));

    toast({
      title: "Resume Deleted",
      description: "Your resume has been permanently deleted.",
    });
  };

  const handleDuplicateResume = (resume: SavedResume) => {
    const duplicatedResume: SavedResume = {
      ...resume,
      id: `resume-${Date.now()}`,
      title: `${resume.title} (Copy)`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    const updatedResumes = [...savedResumes, duplicatedResume];
    setSavedResumes(updatedResumes);
    localStorage.setItem('userResumes', JSON.stringify(updatedResumes));

    toast({
      title: "Resume Duplicated!",
      description: "A copy of your resume has been created.",
    });
  };

  const handleExportResume = (resume: SavedResume, format: 'pdf' | 'docx' | 'txt') => {
    const content = resume.sections
      .filter((section: any) => section.visible)
      .map((section: any) => `${section.title}\n${section.content}`)
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.title}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Resume Exported!",
      description: `Your resume has been exported as ${format.toUpperCase()}.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Resumes</h2>
          <p className="text-gray-600">Manage and organize your saved resumes</p>
        </div>
        <Button asChild>
          <a href="/builder">
            <Plus className="h-4 w-4 mr-2" />
            Create New Resume
          </a>
        </Button>
      </div>

      {/* Resumes Grid */}
      {savedResumes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Resumes Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first professional resume to get started
            </p>
            <Button asChild>
              <a href="/builder">
                <Plus className="h-4 w-4 mr-2" />
                Create Resume
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedResumes.map((resume) => (
            <Card key={resume.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                      {resume.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {resume.sections.length} sections
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditResume(resume)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteResume(resume.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Template Badge */}
                {resume.template && (
                  <Badge variant="outline" className="mb-3">
                    {resume.template.name}
                  </Badge>
                )}

                {/* Metadata */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Created {formatDate(resume.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Modified {formatDate(resume.lastModified)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <a href={`/builder?resume=${resume.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Resume
                    </a>
                  </Button>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportResume(resume, 'pdf')}
                    >
                      PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportResume(resume, 'docx')}
                    >
                      DOCX
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicateResume(resume)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Resume</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="resume-title">Resume Title</Label>
              <Input
                id="resume-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter resume title..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateResume}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
