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
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  BookOpen, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  TrendingUp,
  Heart,
  Share2,
  Image,
  Tag,
  Hash,
  User,
  Globe,
  Lock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/supabaseClient";
import { useToast } from "@/hooks/use-toast";

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
  tags: string[];
  categories: string[];
  meta_title: string;
  meta_description: string;
  view_count: number;
  like_count: number;
  share_count: number;
  is_featured: boolean;
  is_pinned: boolean;
  seo_score: number;
  reading_time: number;
  created_at: string;
  updated_at: string;
  author?: {
    email: string;
    full_name: string;
  };
}

export const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();

  // Form state for create/edit
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    featured_image_url: "",
    tags: [] as string[],
    categories: [] as string[],
    meta_title: "",
    meta_description: "",
    status: "draft"
  });

  const [tempTag, setTempTag] = useState("");
  const [tempCategory, setTempCategory] = useState("");

  const commonTags = [
    "career", "job-search", "resume", "interview", "networking",
    "salary", "remote-work", "leadership", "skills", "education"
  ];

  const commonCategories = [
    "Career Advice", "Job Search Tips", "Resume Writing", "Interview Prep",
    "Salary Negotiation", "Remote Work", "Leadership", "Skills Development"
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:profiles!blog_posts_author_id_fkey(email, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load blog posts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    try {
      const slug = formData.title.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');

      const readingTime = Math.ceil(formData.content.split(' ').length / 200);

      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          ...formData,
          slug,
          reading_time: readingTime,
          published_at: formData.status === 'published' ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (error) throw error;

      setPosts([data, ...posts]);
      setIsCreateModalOpen(false);
      resetForm();
      
      toast({
        title: "Success",
        description: "Blog post created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create blog post.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          ...formData,
          published_at: formData.status === 'published' && editingPost.status !== 'published' 
            ? new Date().toISOString() 
            : editingPost.published_at
        })
        .eq('id', editingPost.id);

      if (error) throw error;

      setPosts(posts.map(post => 
        post.id === editingPost.id ? { ...post, ...formData } : post
      ));
      setEditingPost(null);
      resetForm();
      
      toast({
        title: "Success",
        description: "Blog post updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update blog post.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setPosts(posts.filter(post => post.id !== postId));
      
      toast({
        title: "Success",
        description: "Blog post deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog post.",
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const { error } = await supabase
        .from('blog_posts')
        .update({ is_featured: !post.is_featured })
        .eq('id', postId);

      if (error) throw error;

      setPosts(posts.map(p => 
        p.id === postId ? { ...p, is_featured: !p.is_featured } : p
      ));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update featured status.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      featured_image_url: "",
      tags: [],
      categories: [],
      meta_title: "",
      meta_description: "",
      status: "draft"
    });
    setTempTag("");
    setTempCategory("");
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
    setTempTag("");
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addCategory = (category: string) => {
    if (category.trim() && !formData.categories.includes(category.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, category.trim()]
      }));
    }
    setTempCategory("");
  };

  const removeCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      featured_image_url: post.featured_image_url,
      tags: post.tags,
      categories: post.categories,
      meta_title: post.meta_title,
      meta_description: post.meta_description,
      status: post.status
    });
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || post.categories.includes(categoryFilter);
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
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
          <p className="text-gray-600">Create, edit, and manage blog posts with advanced features</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {filteredPosts.length} posts
          </Badge>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingPost(null); }}>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Blog Post</DialogTitle>
                <DialogDescription>
                  Create a new blog post with advanced features
                </DialogDescription>
              </DialogHeader>
              <BlogPostForm 
                formData={formData}
                setFormData={setFormData}
                tempTag={tempTag}
                setTempTag={setTempTag}
                tempCategory={tempCategory}
                setTempCategory={setTempCategory}
                addTag={addTag}
                removeTag={removeTag}
                addCategory={addCategory}
                removeCategory={removeCategory}
                commonTags={commonTags}
                commonCategories={commonCategories}
                onSubmit={handleCreatePost}
                onCancel={() => setIsCreateModalOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total Posts</span>
            </div>
            <p className="text-2xl font-bold">{posts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Published</span>
            </div>
            <p className="text-2xl font-bold">{posts.filter(p => p.status === 'published').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Total Views</span>
            </div>
            <p className="text-2xl font-bold">{posts.reduce((sum, p) => sum + p.view_count, 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Total Likes</span>
            </div>
            <p className="text-2xl font-bold">{posts.reduce((sum, p) => sum + p.like_count, 0)}</p>
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
                  placeholder="Search posts by title, content, or tags..."
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
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {commonCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Blog Posts ({filteredPosts.length})
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
                          setSelectedPosts(filteredPosts.map(p => p.id));
                        } else {
                          setSelectedPosts([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Stats</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedPosts.includes(post.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPosts([...selectedPosts, post.id]);
                          } else {
                            setSelectedPosts(selectedPosts.filter(id => id !== post.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {post.featured_image_url ? (
                          <img 
                            src={post.featured_image_url} 
                            alt={post.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Image className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">
                            {post.title}
                            {post.is_featured && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Featured
                              </Badge>
                            )}
                            {post.is_pinned && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Pinned
                              </Badge>
                            )}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">
                              {post.reading_time} min read
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-400">
                              SEO: {post.seo_score}/100
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {post.author?.full_name || 'Unknown Author'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(post.status)}>
                        {post.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.view_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.like_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="h-3 w-3" />
                          {post.share_count}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.published_at 
                          ? new Date(post.published_at).toLocaleDateString()
                          : 'Not published'
                        }
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
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditModal(post)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Post
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleFeatured(post.id)}>
                            {post.is_featured ? (
                              <>
                                <XCircle className="h-4 w-4 mr-2" />
                                Remove from Featured
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Featured
                              </>
                            )}
                          </DropdownMenuItem>
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
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Update your blog post content and settings
            </DialogDescription>
          </DialogHeader>
          {editingPost && (
            <BlogPostForm 
              formData={formData}
              setFormData={setFormData}
              tempTag={tempTag}
              setTempTag={setTempTag}
              tempCategory={tempCategory}
              setTempCategory={setTempCategory}
              addTag={addTag}
              removeTag={removeTag}
              addCategory={addCategory}
              removeCategory={removeCategory}
              commonTags={commonTags}
              commonCategories={commonCategories}
              onSubmit={handleUpdatePost}
              onCancel={() => setEditingPost(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Blog Post Form Component
const BlogPostForm = ({ 
  formData, 
  setFormData, 
  tempTag, 
  setTempTag, 
  tempCategory, 
  setTempCategory,
  addTag,
  removeTag,
  addCategory,
  removeCategory,
  commonTags,
  commonCategories,
  onSubmit,
  onCancel
}: any) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Title *</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Enter blog post title"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Excerpt</label>
        <Textarea
          value={formData.excerpt}
          onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
          placeholder="Brief description of the post"
          rows={3}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Content *</label>
        <Textarea
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          placeholder="Write your blog post content here..."
          rows={10}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Featured Image URL</label>
        <Input
          value={formData.featured_image_url}
          onChange={(e) => setFormData({...formData, featured_image_url: e.target.value})}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Tags</label>
        <div className="flex gap-2 mb-2">
          <Input
            value={tempTag}
            onChange={(e) => setTempTag(e.target.value)}
            placeholder="Add a tag"
            onKeyPress={(e) => e.key === 'Enter' && addTag(tempTag)}
          />
          <Button onClick={() => addTag(tempTag)} size="sm">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              #{tag}
              <XCircle 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {commonTags.map((tag: string) => (
            <Button
              key={tag}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => addTag(tag)}
              disabled={formData.tags.includes(tag)}
            >
              #{tag}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Categories</label>
        <div className="flex gap-2 mb-2">
          <Input
            value={tempCategory}
            onChange={(e) => setTempCategory(e.target.value)}
            placeholder="Add a category"
            onKeyPress={(e) => e.key === 'Enter' && addCategory(tempCategory)}
          />
          <Button onClick={() => addCategory(tempCategory)} size="sm">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.categories.map((category: string) => (
            <Badge key={category} variant="secondary" className="flex items-center gap-1">
              {category}
              <XCircle 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeCategory(category)}
              />
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {commonCategories.map((category: string) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => addCategory(category)}
              disabled={formData.categories.includes(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Meta Title</label>
          <Input
            value={formData.meta_title}
            onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
            placeholder="SEO title"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Meta Description</label>
          <Input
            value={formData.meta_description}
            onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
            placeholder="SEO description"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {editingPost ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </div>
  );
};
