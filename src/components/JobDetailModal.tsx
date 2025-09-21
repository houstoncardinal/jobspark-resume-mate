import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  X, 
  MapPin, 
  Building2, 
  Clock, 
  DollarSign, 
  Users, 
  Star, 
  Globe, 
  Shield, 
  Diamond, 
  Calendar, 
  ExternalLink, 
  Heart, 
  Share2, 
  Bookmark,
  CheckCircle,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Award,
  Target,
  Zap,
  ArrowRight,
  Download,
  Mail,
  Phone,
  Link as LinkIcon
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

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (job: Job) => void;
  onSave: (job: Job) => void;
  onShare: (job: Job) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  isOpen,
  onClose,
  onApply,
  onSave,
  onShare
}) => {
  if (!job) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                  {job.company.charAt(0)}
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white mb-1">
                    {job.title}
                  </DialogTitle>
                  <p className="text-blue-100 text-lg">{job.company}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-blue-100">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  <span>{job.industry}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                </div>
                {job.remote && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <span>Remote</span>
                  </div>
                )}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Job Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-gray-900">Salary Range</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">Applications</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{job.applications}</p>
                <p className="text-sm text-gray-500">{job.views} views</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold text-gray-900">Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-yellow-600">{job.rating}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(job.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge className={`${getJobTypeColor(job.type)} border-2`}>
              {job.type.replace('-', ' ').toUpperCase()}
            </Badge>
            <Badge className={`${getExperienceColor(job.experienceLevel)} border-2`}>
              {job.experienceLevel.toUpperCase()}
            </Badge>
            {job.featured && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {job.urgent && (
              <Badge variant="destructive" className="border-0">
                <Clock className="h-3 w-3 mr-1" />
                Urgent
              </Badge>
            )}
            {job.visaSponsorship && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
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

          {/* Job Description */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="text-gray-700 leading-relaxed whitespace-pre-line prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: job.description.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                }}
              />
            </CardContent>
          </Card>

          {/* Requirements */}
          {job.requirements.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Benefits */}
          {job.benefits.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Benefits & Perks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Award className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Skills & Tags */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                Skills & Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => onApply(job)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              size="lg"
            >
              <ArrowRight className="h-5 w-5 mr-2" />
              Apply Now
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => onSave(job)}
              className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
              size="lg"
            >
              <Bookmark className="h-5 w-5 mr-2" />
              Save Job
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => onShare(job)}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              size="lg"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Posted:</span> {new Date(job.postedAt).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Expires:</span> {new Date(job.expiresAt).toLocaleDateString()}
              </div>
              {job.source && (
                <div>
                  <span className="font-medium">Source:</span> {job.source}
                </div>
              )}
              {job.url && (
                <div>
                  <span className="font-medium">Original Posting:</span>{' '}
                  <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    View Original <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
