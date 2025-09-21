import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  BookOpen,
  Calendar,
  User,
  Tag,
  Download,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  Star,
  ExternalLink,
  Plus,
  Image,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorEmail: string;
  status: 'draft' | 'pending' | 'published' | 'archived';
  category: string;
  tags: string[];
  featuredImage?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: '10 Tips for Landing Your Dream Job in 2024',
    slug: '10-tips-landing-dream-job-2024',
    excerpt: 'Discover the essential strategies that will help you stand out in today\'s competitive job market.',
    content: 'The job market in 2024 is more competitive than ever...',
    author: 'Sarah Johnson',
    authorEmail: 'sarah.johnson@example.com',
    status: 'published',
    category: 'Career Advice',
    tags: ['career', 'job search', 'tips', '2024'],
    featuredImage: '/api/placeholder/600/300',
    publishedAt: '2024-11-25',
    createdAt: '2024-11-20',
    updatedAt: '2024-11-25',
    views: 1250,
    likes: 89,
    comments: 23,
    featured: true,
    seoTitle: '10 Tips for Landing Your Dream Job in 2024 | Gigm8',
    seoDescription: 'Learn the top 10 strategies to land your dream job in 2024. Expert career advice and proven tips.'
  },
  {
    id: '2',
    title: 'The Future of Remote Work: Trends and Predictions',
    slug: 'future-remote-work-trends-predictions',
    excerpt: 'Explore how remote work is evolving and what it means for job seekers and employers.',
    content: 'Remote work has fundamentally changed the way we think about employment...',
    author: 'Mike Wilson',
    authorEmail: 'mike.wilson@example.com',
    status: 'pending',
    category: 'Industry Trends',
    tags: ['remote work', 'future', 'trends', 'workplace'],
    featuredImage: '/api/placeholder/600/300',
    createdAt: '2024-11-28',
    updatedAt: '2024-11-30',
    views: 0,
    likes: 0,
    comments: 0,
    featured: false,
    seoTitle: 'The Future of Remote Work: Trends and Predictions | Gigm8',
    seoDescription: 'Discover the latest trends and predictions for remote work in 2024 and beyond.'
  },
  {
    id: '3',
    title: 'Resume Writing Guide for Tech Professionals',
    slug: 'resume-writing-guide-tech-professionals',
    excerpt: 'A comprehensive guide to crafting the perfect resume for technology roles.',
    content: 'Writing a resume for tech roles requires a different approach...',
    author: 'John Doe',
    authorEmail: 'john.doe@example.com',
    status: 'draft',
    category: 'Resume Tips',
    tags: ['resume', 'tech', 'guide', 'career'],
    createdAt: '2024-12-01',
    updatedAt: '2024-12-01',
    views: 0,
    likes: 0,
    comments: 0,
    featured: false
  },
  {
    id: '4',
    title: 'How to Negotiate Your Salary Like a Pro',
    slug: 'how-negotiate-salary-like-pro',
    excerpt: 'Master the art of salary negotiation with these expert strategies.',
    content: 'Salary negotiation is one of the most important skills...',
    author: 'Jane Smith',
    authorEmail: 'jane.smith@example.com',
    status: 'published',
    category: 'Career Advice',
    tags: ['salary', 'negotiation', 'career', 'money'],
    featuredImage: '/api/placeholder/600/300',
    publishedAt: '2024-11-15',
    createdAt: '2024-11-10',
    updatedAt: '2024-11-15',
    views: 890,
    likes: 67,
    comments: 15,
    featured: false,
    seoTitle: 'How to Negotiate Your Salary Like a Pro | Gigm8',
    seoDescription: 'Learn expert strategies for salary negotiation and get the compensation you deserve.'
  }
];

export const ContentManagement = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    filterPosts();
  }, [searchTerm, statusFilter, categoryFilter, posts]);

  const filterPosts = () => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => post.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }

    setFilteredPosts(filtered);
  };

  const handleStatusChange = async (postId: string, newStatus: BlogPost['status']) => {
    setIsLoading(true);
    try {
      setPosts(prev => prev.map(post => 
        post.id === postId ? { 
          ...post, 
          status: newStatus,
          publishedAt: newStatus === 'published' ? new Date().toISOString().split('T')[0] : post.publishedAt
        } : post
      ));
      
      toast({
        title: "Status Updated",
        description: `Post status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    setIsLoading(true);
    try {
      setPosts(prev => prev.filter(post => post.id !== postId));
      toast({
        title: "Post Deleted",
        description: "Blog post has been permanently deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: BlogPost['status']) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', icon: Edit },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      published: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      archived: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryColors = {
      'Career Advice': 'bg-blue-100 text-blue-800',
      'Industry Trends': 'bg-green-100 text-green-800',
      'Resume Tips': 'bg-purple-100 text-purple-800',
      'Interview Tips': 'bg-orange-100 text-orange-800',
      'Salary & Benefits': 'bg-pink-100 text-pink-800'
    };
    
    const color = categoryColors[category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800';
    
    return (
      <Badge className={color}>
        {category}
      </Badge>
    );
  };

  const exportPosts = () => {
    const csvContent = [
      ['Title', 'Author', 'Status', 'Category', 'Views', 'Likes', 'Comments', 'Published'],
      ...filteredPosts.map(post => [
        post.title,
        post.author,
        post.status,
        post.category,
        post.views.toString(),
        post.likes.toString(),
        post.comments.toString(),
        post.publishedAt || 'Not published'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blog-posts.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Blog post data has been exported to CSV",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
          <p className="text-gray-600">Manage blog posts, articles, and content</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={exportPosts} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-green-600">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.filter(p => p.status === 'published').length}</div>
            <p className="text-xs text-green-600">Active content</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.reduce((sum, post) => sum + post.views, 0).toLocaleString()}</div>
            <p className="text-xs text-green-600">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Posts</CardTitle>
            <Edit className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.filter(p => p.status === 'draft').length}</div>
            <p className="text-xs text-yellow-600">In progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Career Advice">Career Advice</SelectItem>
                  <SelectItem value="Industry Trends">Industry Trends</SelectItem>
                  <SelectItem value="Resume Tips">Resume Tips</SelectItem>
                  <SelectItem value="Interview Tips">Interview Tips</SelectItem>
                  <SelectItem value="Salary & Benefits">Salary & Benefits</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
                variant="outline"
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts ({filteredPosts.length})</CardTitle>
          <CardDescription>Manage blog posts and content</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center">
                        {post.title}
                        {post.featured && <Star className="h-4 w-4 ml-2 text-yellow-500" />}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {post.excerpt}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      {post.author}
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryBadge(post.category)}</TableCell>
                  <TableCell>{getStatusBadge(post.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {post.views.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-3 w-3 mr-1" />
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Not published'}
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          setSelectedPost(post);
                          setIsViewDialogOpen(true);
                        }}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Post
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedPost(post);
                          setIsEditDialogOpen(true);
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Post
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {post.status === 'draft' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(post.id, 'pending')}>
                            <Clock className="h-4 w-4 mr-2" />
                            Submit for Review
                          </DropdownMenuItem>
                        )}
                        {post.status === 'pending' && (
                          <>
                            <DropdownMenuItem onClick={() => handleStatusChange(post.id, 'published')}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Publish
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(post.id, 'draft')}>
                              <Edit className="h-4 w-4 mr-2" />
                              Return to Draft
                            </DropdownMenuItem>
                          </>
                        )}
                        {post.status === 'published' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(post.id, 'archived')}>
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Post
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Post Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Blog Post Details</DialogTitle>
            <DialogDescription>
              Complete information about this blog post
            </DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{selectedPost.title}</h3>
                  <p className="text-gray-600">by {selectedPost.author}</p>
                </div>
                <div className="text-right">
                  {getStatusBadge(selectedPost.status)}
                  {getCategoryBadge(selectedPost.category)}
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 mr-2 text-gray-400" />
                  {selectedPost.views} views
                </div>
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 mr-2 text-gray-400" />
                  {selectedPost.likes} likes
                </div>
                <div className="flex items-center text-sm">
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  {selectedPost.comments} comments
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  {selectedPost.publishedAt ? new Date(selectedPost.publishedAt).toLocaleDateString() : 'Not published'}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Excerpt</h4>
                <p className="text-gray-700">{selectedPost.excerpt}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Content</h4>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{selectedPost.content}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPost.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setIsViewDialogOpen(false);
                  setIsEditDialogOpen(true);
                }}>
                  Edit Post
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Update blog post information
            </DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  defaultValue={selectedPost.title}
                />
              </div>
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  defaultValue={selectedPost.excerpt}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    defaultValue={selectedPost.author}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select defaultValue={selectedPost.category}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Career Advice">Career Advice</SelectItem>
                      <SelectItem value="Industry Trends">Industry Trends</SelectItem>
                      <SelectItem value="Resume Tips">Resume Tips</SelectItem>
                      <SelectItem value="Interview Tips">Interview Tips</SelectItem>
                      <SelectItem value="Salary & Benefits">Salary & Benefits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  defaultValue={selectedPost.content}
                  rows={6}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "Post Updated",
                    description: "Blog post has been updated successfully",
                  });
                  setIsEditDialogOpen(false);
                }}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
