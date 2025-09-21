import React, { useState, useEffect, useCallback } from 'react';
import { SEO } from '@/components/SEO';
import { PAGE_SEO } from '@/lib/seo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, MessageSquare, Heart, Share2, Bookmark, Search, Filter, Star, TrendingUp, Award, 
  Shield, Zap, Target, Brain, Globe, Calendar, Clock, MapPin, Building2, Briefcase, 
  GraduationCap, User, Settings, Bell, LogOut, Menu, X as XIcon, Plus, Minus, Check, 
  AlertCircle, Info, RefreshCw, Download, Upload, ExternalLink, ArrowRight, ChevronDown,
  Edit3, Trash2, MoreHorizontal, ThumbsUp, ThumbsDown, Reply, Send, Image, Link, Smile,
  Hash, AtSign, Code, FileText, Video, Music, Paperclip, Eye, EyeOff, Lock, Unlock,
  Home, Compass, BookmarkCheck, UserPlus, MessageCircle, TrendingUp as Trending,
  Flame, Zap as Lightning, Crown, Sparkles, Target as Bullseye, Layers, Grid3X3,
  List, BarChart3, Activity, BarChart, PieChart, LineChart, TrendingUp as TrendingUpIcon
} from 'lucide-react';

// Types
interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    company?: string;
    job_title?: string;
  };
  created_at: string;
}

interface Post {
  id: string;
  user_id: string;
  content: string;
  images: string[];
  tags: string[];
  category: string;
  visibility: 'public' | 'followers' | 'private';
  is_pinned: boolean;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  likes: number;
  comments: number;
  bookmarks: number;
  author?: User;
  user_reaction?: string;
  is_bookmarked?: boolean;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  likes: number;
  author?: User;
  user_reaction?: string;
  replies?: Comment[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

const CommunityPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState({
    content: '',
    category: 'General',
    tags: '',
    visibility: 'public' as 'public' | 'followers' | 'private'
  });
  const [newComment, setNewComment] = useState<{ [postId: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [postId: string]: boolean }>({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const { toast } = useToast();
  const { user } = useAuth();

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load posts when filters change
  useEffect(() => {
    loadPosts();
  }, [selectedCategory, searchQuery, sortBy]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadCategories(),
        loadCurrentUser(),
        loadPosts()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast({
        title: "Error loading data",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentUser = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      setCurrentUser(data);
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('community_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadPosts = async () => {
    try {
      let query = supabase
        .from('post_stats')
        .select(`
          *,
          author:profiles!community_posts_user_id_fkey(*)
        `)
        .eq('visibility', 'public');

      // Apply category filter
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      // Apply search filter
      if (searchQuery) {
        query = query.or(`content.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`);
      }

      // Apply sorting
      switch (sortBy) {
        case 'recent':
          query = query.order('created_at', { ascending: false });
          break;
        case 'popular':
          query = query.order('likes', { ascending: false });
          break;
        case 'trending':
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;

      // Load user reactions and bookmarks
      if (user) {
        const { data: reactions } = await supabase
          .from('post_reactions')
          .select('post_id, reaction_type')
          .eq('user_id', user.id);

        const { data: bookmarks } = await supabase
          .from('post_bookmarks')
          .select('post_id')
          .eq('user_id', user.id);

        const postsWithUserData = (data || []).map(post => ({
          ...post,
          user_reaction: reactions?.find(r => r.post_id === post.id)?.reaction_type,
          is_bookmarked: bookmarks?.some(b => b.post_id === post.id) || false
        }));

        setPosts(postsWithUserData);
      } else {
        setPosts(data || []);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      toast({
        title: "Error loading posts",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const loadComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('community_comments')
        .select(`
          *,
          author:profiles!community_comments_user_id_fkey(*)
        `)
        .eq('post_id', postId)
        .is('parent_id', null)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Load user reactions for comments
      if (user) {
        const { data: reactions } = await supabase
          .from('comment_reactions')
          .select('comment_id, reaction_type')
          .eq('user_id', user.id);

        const commentsWithUserData = (data || []).map(comment => ({
          ...comment,
          user_reaction: reactions?.find(r => r.comment_id === comment.id)?.reaction_type,
          likes: 0 // TODO: Add comment likes count
        }));

        setComments(prev => ({
          ...prev,
          [postId]: commentsWithUserData
        }));
      } else {
        setComments(prev => ({
          ...prev,
          [postId]: data || []
        }));
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!user || !newPost.content.trim()) {
      toast({
        title: "Content required",
        description: "Please write something before posting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          content: newPost.content,
          tags: newPost.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          category: newPost.category,
          visibility: newPost.visibility
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Post created",
        description: "Your post has been shared with the community.",
      });

      setNewPost({ content: '', category: 'General', tags: '', visibility: 'public' });
      setShowCreatePost(false);
      loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error creating post",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleEditPost = async (postId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('community_posts')
        .update({
          content: newPost.content,
          category: newPost.category,
          tags: newPost.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          visibility: newPost.visibility,
          is_edited: true
        })
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Post updated",
        description: "Your post has been updated successfully.",
      });

      setEditingPost(null);
      setNewPost({ content: '', category: 'General', tags: '', visibility: 'public' });
      setShowCreatePost(false);
      loadPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error updating post",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Post deleted",
        description: "Your post has been removed.",
      });

      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error deleting post",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleReaction = async (postId: string, reactionType: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('post_reactions')
        .upsert({
          post_id: postId,
          user_id: user.id,
          reaction_type: reactionType
        });

      if (error) throw error;

      loadPosts();
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  const handleBookmark = async (postId: string) => {
    if (!user) return;

    try {
      const isBookmarked = posts.find(p => p.id === postId)?.is_bookmarked;
      
      if (isBookmarked) {
        const { error } = await supabase
          .from('post_bookmarks')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('post_bookmarks')
          .insert({
            post_id: postId,
            user_id: user.id
          });
        
        if (error) throw error;
      }

      loadPosts();
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!user || !newComment[postId]?.trim()) return;

    try {
      const { error } = await supabase
        .from('community_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: newComment[postId]
        });

      if (error) throw error;

      setNewComment({ ...newComment, [postId]: '' });
      loadPosts();
      loadComments(postId);
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted.",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error adding comment",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const sidebarItems = [
    { id: 'explore', label: 'Explore', icon: Compass, count: posts.length },
    { id: 'following', label: 'Following', icon: UserPlus, count: 0 },
    { id: 'bookmarks', label: 'Bookmarks', icon: BookmarkCheck, count: 0 },
    { id: 'trending', label: 'Trending', icon: Trending, count: 0 },
    { id: 'recent', label: 'Recent', icon: Clock, count: 0 }
  ];

  const reactionTypes = [
    { type: 'like', icon: ThumbsUp, color: 'text-blue-600' },
    { type: 'love', icon: Heart, color: 'text-red-600' },
    { type: 'laugh', icon: Smile, color: 'text-yellow-600' },
    { type: 'wow', icon: Sparkles, color: 'text-purple-600' },
    { type: 'sad', icon: AlertCircle, color: 'text-gray-600' },
    { type: 'angry', icon: Zap, color: 'text-orange-600' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO {...PAGE_SEO.community} />
      <div className="min-h-screen bg-gray-50 flex">
        {/* Left Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <h2 className="text-xl font-bold text-gray-900">Community</h2>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {sidebarItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className={`h-4 w-4 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.count > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {item.count}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              ))}
            </div>

            {/* Categories */}
            {!sidebarCollapsed && (
              <div className="p-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                <div className="space-y-1">
                  <Button
                    variant={selectedCategory === 'all' ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory('all')}
                  >
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    All Categories
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.name ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {!sidebarCollapsed && (
              <div className="p-4 border-t border-gray-200">
                <Button
                  onClick={() => setShowCreatePost(true)}
                  className="w-full mb-3"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
                
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search posts, tags, or users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'list' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <ScrollArea className="flex-1">
            <div className="p-6">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
                  <p className="text-gray-600 mb-4">Be the first to share something with the community!</p>
                  <Button onClick={() => setShowCreatePost(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Post
                  </Button>
                </div>
              ) : (
                <div className={`space-y-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : ''}`}>
                  {posts.map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={post.author?.user_metadata?.avatar_url} />
                              <AvatarFallback>
                                {post.author?.user_metadata?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900">
                                  {post.author?.user_metadata?.full_name || 'Anonymous'}
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                  {post.category}
                                </Badge>
                                {post.is_pinned && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Star className="h-3 w-3 mr-1" />
                                    Pinned
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                {formatTimeAgo(post.created_at)}
                                {post.is_edited && ' • Edited'}
                              </p>
                            </div>
                          </div>
                          {post.user_id === user?.id && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingPost(post);
                                  setNewPost({
                                    content: post.content,
                                    category: post.category,
                                    tags: post.tags.join(', '),
                                    visibility: post.visibility
                                  });
                                  setShowCreatePost(true);
                                }}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="mb-4">
                          <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
                        </div>

                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                <Hash className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-6">
                            {/* Reactions */}
                            <div className="flex items-center gap-2">
                              {reactionTypes.map((reaction) => (
                                <Button
                                  key={reaction.type}
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleReaction(post.id, reaction.type)}
                                  className={`${post.user_reaction === reaction.type ? reaction.color : 'text-gray-600'}`}
                                >
                                  <reaction.icon className={`h-4 w-4 ${post.user_reaction === reaction.type ? 'fill-current' : ''}`} />
                                </Button>
                              ))}
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setShowComments({
                                  ...showComments,
                                  [post.id]: !showComments[post.id]
                                });
                                if (!showComments[post.id]) {
                                  loadComments(post.id);
                                }
                              }}
                              className="text-gray-600"
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              {post.comments}
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600"
                            >
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBookmark(post.id)}
                            className={post.is_bookmarked ? 'text-blue-600' : 'text-gray-600'}
                          >
                            <Bookmark className={`h-4 w-4 ${post.is_bookmarked ? 'fill-current' : ''}`} />
                          </Button>
                        </div>

                        {/* Comments Section */}
                        {showComments[post.id] && (
                          <div className="mt-6 pt-4 border-t">
                            <div className="space-y-4">
                              {comments[post.id]?.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={comment.author?.user_metadata?.avatar_url} />
                                    <AvatarFallback>
                                      {comment.author?.user_metadata?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm">
                                          {comment.author?.user_metadata?.full_name || 'Anonymous'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {formatTimeAgo(comment.created_at)}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-900">{comment.content}</p>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs text-gray-600"
                                      >
                                        <ThumbsUp className="h-3 w-3 mr-1" />
                                        {comment.likes}
                                      </Button>
                                      <Button variant="ghost" size="sm" className="text-xs text-gray-600">
                                        <Reply className="h-3 w-3 mr-1" />
                                        Reply
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {/* Add Comment */}
                            {user && (
                              <div className="mt-4 flex gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={currentUser?.user_metadata?.avatar_url} />
                                  <AvatarFallback>
                                    {currentUser?.user_metadata?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <Textarea
                                    placeholder="Write a comment..."
                                    value={newComment[post.id] || ''}
                                    onChange={(e) => setNewComment({
                                      ...newComment,
                                      [post.id]: e.target.value
                                    })}
                                    className="min-h-[80px]"
                                  />
                                  <div className="flex justify-end mt-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleAddComment(post.id)}
                                      disabled={!newComment[post.id]?.trim()}
                                    >
                                      <Send className="h-4 w-4 mr-2" />
                                      Comment
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Create/Edit Post Dialog */}
        <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </DialogTitle>
              <DialogDescription>
                Share your thoughts, experiences, or ask questions with the community.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <Textarea
                  placeholder="What's on your mind?"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visibility
                  </label>
                  <Select value={newPost.visibility} onValueChange={(value: any) => setNewPost({ ...newPost, visibility: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="followers">Followers Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <Input
                  placeholder="e.g., career, success, interview"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreatePost(false);
                    setEditingPost(null);
                    setNewPost({ content: '', category: 'General', tags: '', visibility: 'public' });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingPost ? handleEditPost : handleCreatePost}
                  disabled={!newPost.content.trim()}
                >
                  {editingPost ? 'Update Post' : 'Create Post'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default CommunityPage;
