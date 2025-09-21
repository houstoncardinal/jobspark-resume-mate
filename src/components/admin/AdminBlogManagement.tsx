import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Tag,
  Hash,
  Image,
  Upload,
  Save,
  X,
  CheckCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  Share2,
  Heart,
  MessageSquare,
  TrendingUp,
  Star,
  BookOpen,
  RefreshCw,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/supabaseClient";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  author_id: string;
  status: string;
  published_at: string;
  views: number;
  likes: number;
  shares: number;
  reading_time: number;
  seo_title: string;
  seo_description: string;
  tags: string[];
  categories: string[];
  is_featured: boolean;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export const AdminBlogManagement = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost>>({});

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles:author_id(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast({
        title: "Error",
        description: "Failed to load blog posts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePostAction = async (postId: string, action: string) => {
    try {
      let updateData: any = {};
      
      switch (action) {
        case 'publish':
          updateData = { 
            status: 'published',
            published_at: new Date().toISOString()
          };
          break;
        case 'draft':
          updateData = { status: 'draft' };
          break;
        case 'archive':
          updateData = { status: 'archived' };
          break;
        case 'feature':
          updateData = { is_featured: true };
          break;
        case 'unfeature':
          updateData = { is_featured: false };
          break;
        case 'pin':
          updateData = { is_pinned: true };
          break;
        case 'unpin':
          updateData = { is_pinned: false };
          break;
        case 'delete':
          const { error: deleteError } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', postId);
          
          if (deleteError) throw deleteError;
          break;
      }

      if (action !== 'delete') {
        const { error } = await supabase
          .from('blog_posts')
          .update(updateData)
          .eq('id', postId);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Post ${action} completed successfully.`,
      });

      loadPosts();
    } catch (error) {
      console.error('Error performing post action:', error);
      toast({
        title: "Error",
        description: "Failed to perform post action.",
        variant: "destructive",
      });
    }
  };

  const handleCreatePost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
          title: editingPost.title || 'Untitled Post',
          slug: editingPost.slug || 'untitled-post',
          excerpt: editingPost.excerpt || '',
          content: editingPost.content || '',
          featured_image_url: editingPost.featured_image_url || '',
          author_id: 'current-user-id', // This should be the current admin user ID
          status: 'draft',
          seo_title: editingPost.seo_title || editingPost.title || '',
          seo_description: editingPost.seo_description || editingPost.excerpt || '',
          tags: editingPost.tags || [],
          categories: editingPost.categories || [],
          reading_time: Math.ceil((editingPost.content?.length || 0) / 200) // Estimate reading time
        }])
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post created successfully.",
      });

      setIsCreateModalOpen(false);
      setEditingPost({});
      loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create blog post.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePost = async () => {
    if (!selectedPost) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          ...editingPost,
          updated_at: new Date().toISOString(),
          reading_time: Math.ceil((editingPost.content?.length || 0) / 200)
        })
        .eq('id', selectedPost.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post updated successfully.",
      });

      setIsPostModalOpen(false);
      setEditingPost({});
      loadPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error",
        description: "Failed to update blog post.",
        variant: "destructive",
      });
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
          <p className="text-gray-600">Create, edit, and manage blog posts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreateModalOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
          <Button onClick={loadPosts} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search posts by title or content..."
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
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts ({filteredPosts.length})</CardTitle>
          <CardDescription>
            Manage your blog content and publishing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {post.featured_image_url && (
                          <img 
                            src={post.featured_image_url} 
                            alt={post.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="font-medium flex items-center gap-2">
                            {post.title}
                            {post.is_featured && (
                              <Star className="h-4 w-4 text-yellow-500" />
                            )}
                            {post.is_pinned && (
                              <Hash className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {post.excerpt}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {post.tags?.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                            {post.tags && post.tags.length > 3 && (
                              <span className="text-xs text-gray-400">
                                +{post.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(post.status)}>
                        {post.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {post.profiles?.full_name || 'Unknown Author'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {post.views.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {post.shares}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {post.published_at 
                          ? new Date(post.published_at).toLocaleDateString()
                          : 'Not published'
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedPost(post);
                            setEditingPost(post);
                            setIsPostModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {post.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePostAction(post.id, 'publish')}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {post.status === 'published' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePostAction(post.id, 'draft')}
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePostAction(post.id, 'delete')}
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

      {/* Create Post Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
            <DialogDescription>
              Create a new blog post with advanced features
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Title *</label>
                <Input
                  value={editingPost.title || ''}
                  onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Slug *</label>
                <Input
                  value={editingPost.slug || ''}
                  onChange={(e) => setEditingPost({...editingPost, slug: e.target.value})}
                  placeholder="post-url-slug"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Excerpt</label>
              <Textarea
                value={editingPost.excerpt || ''}
                onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})}
                placeholder="Brief description of the post"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Content *</label>
              <Textarea
                value={editingPost.content || ''}
                onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                placeholder="Write your blog post content here..."
                rows={10}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Featured Image URL</label>
              <Input
                value={editingPost.featured_image_url || ''}
                onChange={(e) => setEditingPost({...editingPost, featured_image_url: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">SEO Title</label>
                <Input
                  value={editingPost.seo_title || ''}
                  onChange={(e) => setEditingPost({...editingPost, seo_title: e.target.value})}
                  placeholder="SEO optimized title"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">SEO Description</label>
                <Input
                  value={editingPost.seo_description || ''}
                  onChange={(e) => setEditingPost({...editingPost, seo_description: e.target.value})}
                  placeholder="SEO meta description"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Tags (comma separated)</label>
              <Input
                value={editingPost.tags?.join(', ') || ''}
                onChange={(e) => setEditingPost({...editingPost, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
                placeholder="technology, career, tips"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePost}>
              <Save className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Post Modal */}
      <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Edit and manage your blog post
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Title *</label>
                <Input
                  value={editingPost.title || ''}
                  onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Slug *</label>
                <Input
                  value={editingPost.slug || ''}
                  onChange={(e) => setEditingPost({...editingPost, slug: e.target.value})}
                  placeholder="post-url-slug"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Excerpt</label>
              <Textarea
                value={editingPost.excerpt || ''}
                onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})}
                placeholder="Brief description of the post"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Content *</label>
              <Textarea
                value={editingPost.content || ''}
                onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                placeholder="Write your blog post content here..."
                rows={10}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Featured Image URL</label>
              <Input
                value={editingPost.featured_image_url || ''}
                onChange={(e) => setEditingPost({...editingPost, featured_image_url: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">SEO Title</label>
                <Input
                  value={editingPost.seo_title || ''}
                  onChange={(e) => setEditingPost({...editingPost, seo_title: e.target.value})}
                  placeholder="SEO optimized title"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">SEO Description</label>
                <Input
                  value={editingPost.seo_description || ''}
                  onChange={(e) => setEditingPost({...editingPost, seo_description: e.target.value})}
                  placeholder="SEO meta description"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Tags (comma separated)</label>
              <Input
                value={editingPost.tags?.join(', ') || ''}
                onChange={(e) => setEditingPost({...editingPost, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
                placeholder="technology, career, tips"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPostModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePost}>
              <Save className="h-4 w-4 mr-2" />
              Update Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
