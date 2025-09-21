import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { PAGE_SEO } from '@/lib/seo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Heart, 
  Share2, 
  Bookmark, 
  MessageCircle,
  Plus,
  Filter,
  Clock,
  ThumbsUp,
  Eye,
  Star,
  Award,
  Target,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Coffee,
  Briefcase,
  FileText,
  Network,
  Calendar,
  Tag,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  Settings,
  Bell,
  Mail,
  Globe,
  Building2,
  MapPin
} from 'lucide-react';

interface User {
  id: string;
  full_name: string;
  avatar_url?: string;
  user_metadata: {
    role: string;
  };
}

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  images?: string[];
  likes: number;
  replies: number;
  views: number;
  created_at: string;
  updated_at: string;
  visibility: 'public' | 'private';
  featured: boolean;
  author: {
    full_name: string;
    avatar_url?: string;
  };
  user_reaction?: string;
  is_bookmarked: boolean;
}

const CommunityPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, [selectedCategory, sortBy, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadPosts(),
        loadCategories(),
        loadUsers(),
        loadCurrentUser()
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentUser = async () => {
    if (!user) return;
    
    // Mock current user data since tables don't exist yet
    setCurrentUser({
      id: user.id,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      user_metadata: { role: user.role }
    });
  };

  const loadCategories = async () => {
    // Mock categories data since tables don't exist yet
    setCategories([
      { id: 'general', name: 'General Discussion', description: 'General career topics', color: 'blue', icon: 'chat' },
      { id: 'jobs', name: 'Job Search', description: 'Job hunting tips and opportunities', color: 'green', icon: 'briefcase' },
      { id: 'resume', name: 'Resume Help', description: 'Resume reviews and advice', color: 'purple', icon: 'file' },
      { id: 'networking', name: 'Networking', description: 'Professional networking', color: 'orange', icon: 'users' }
    ]);
  };

  const loadPosts = async () => {
    // Mock posts data since tables don't exist yet
    const mockPosts = [
      {
        id: '1',
        user_id: '1',
        title: 'Best practices for technical interviews',
        content: 'I wanted to share some tips that helped me ace my recent interviews...',
        author: { full_name: 'John Doe', avatar_url: null },
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
        category: 'jobs',
        likes: 15,
        replies: 8,
        views: 142,
        tags: ['interviews', 'tech', 'tips'],
        images: [],
        visibility: 'public' as const,
        featured: false,
        user_reaction: undefined,
        is_bookmarked: false
      },
      {
        id: '2',
        user_id: '2', 
        title: 'Resume review - Software Engineer',
        content: 'Could someone please review my resume? I have 3 years of experience...',
        author: { full_name: 'Jane Smith', avatar_url: null },
        created_at: '2024-01-14T15:30:00Z',
        updated_at: '2024-01-14T15:30:00Z',
        category: 'resume',
        likes: 23,
        replies: 12,
        views: 89,
        tags: ['resume', 'review', 'software'],
        images: [],
        visibility: 'public' as const,
        featured: true,
        user_reaction: undefined,
        is_bookmarked: false
      }
    ];

    // Apply filters
    let filteredPosts = mockPosts;
    
    if (selectedCategory !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === selectedCategory);
    }
    
    if (searchQuery) {
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setPosts(filteredPosts);
  };

  const loadUsers = async () => {
    // Mock users data since tables don't exist yet
    setUsers([
      { id: '1', full_name: 'John Doe', avatar_url: null, user_metadata: { role: 'job_seeker' } },
      { id: '2', full_name: 'Jane Smith', avatar_url: null, user_metadata: { role: 'recruiter' } }
    ]);
  };

  const handleBookmark = async (postId: string) => {
    // Mock bookmark functionality since tables don't exist yet
    console.log('Bookmarking post:', postId);
  };

  const handleLike = async (postId: string) => {
    // Mock like functionality
    console.log('Liking post:', postId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const getCategoryIcon = (iconName: string) => {
    const icons = {
      chat: MessageSquare,
      briefcase: Briefcase,
      file: FileText,
      users: Users,
    };
    const IconComponent = icons[iconName as keyof typeof icons] || MessageSquare;
    return <IconComponent className="h-4 w-4" />;
  };

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      orange: 'bg-orange-100 text-orange-800',
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <SEO seoData={PAGE_SEO['/community']} url="/community" />
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="mb-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Career <span className="text-blue-600">Community</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Connect with professionals, share experiences, and grow your career together
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{users.length}</div>
                  <div className="text-sm text-gray-600">Members</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{posts.length}</div>
                  <div className="text-sm text-gray-600">Posts</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{categories.length}</div>
                  <div className="text-sm text-gray-600">Categories</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Eye className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {posts.reduce((sum, post) => sum + post.views, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Categories */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory('all')}
                  >
                    All Posts
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {getCategoryIcon(category.icon)}
                      <span className="ml-2">{category.name}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Active Members */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Active Members
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {users.slice(0, 5).map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar_url || ''} />
                        <AvatarFallback>
                          {member.full_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {member.full_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {member.user_metadata.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-3">
              {/* Search and Filters */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search posts..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="trending">Trending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {user && (
                    <Button onClick={() => setShowCreatePost(true)} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Post
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Posts Feed */}
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading posts...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No posts found
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {searchQuery 
                          ? "Try adjusting your search terms or filters"
                          : "Be the first to start a conversation in this community"
                        }
                      </p>
                      {user && (
                        <Button onClick={() => setShowCreatePost(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create First Post
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  posts.map((post) => (
                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={post.author.avatar_url || ''} />
                              <AvatarFallback>
                                {post.author.full_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{post.author.full_name}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="h-3 w-3" />
                                {formatDate(post.created_at)}
                                {post.featured && (
                                  <Badge variant="secondary" className="ml-2">
                                    <Star className="h-3 w-3 mr-1" />
                                    Featured
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Badge className={getCategoryColor(
                            categories.find(c => c.id === post.category)?.color || 'gray'
                          )}>
                            {categories.find(c => c.id === post.category)?.name || post.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">{post.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {post.content}
                        </p>
                        
                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <Separator className="my-4" />

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(post.id)}
                              className="flex items-center gap-1 text-gray-600 hover:text-red-600"
                            >
                              <Heart className="h-4 w-4" />
                              {post.likes}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                            >
                              <MessageCircle className="h-4 w-4" />
                              {post.replies}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-1 text-gray-600"
                            >
                              <Eye className="h-4 w-4" />
                              {post.views}
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleBookmark(post.id)}
                              className="text-gray-600 hover:text-yellow-600"
                            >
                              <Bookmark className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 hover:text-green-600"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CommunityPage;