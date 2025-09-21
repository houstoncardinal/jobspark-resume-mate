
import { SEO } from '@/components/SEO';
import { PAGE_SEO } from '@/lib/seo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Calendar, 
  User, 
  ArrowRight,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Target,
  Users,
  Briefcase
} from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      id: '1',
      title: '10 Essential Tips for Landing Your Dream Job in 2024',
      excerpt: 'Discover the most effective strategies to stand out in today\'s competitive job market and land your dream position.',
      author: 'Sarah Johnson',
      date: '2024-01-15',
      readTime: '5 min read',
      category: 'Career Advice',
      image: '/blog/job-search-tips.jpg',
      featured: true
    },
    {
      id: '2',
      title: 'How to Write a Resume That Gets Past ATS Systems',
      excerpt: 'Learn the secrets to creating an ATS-friendly resume that will make it through automated screening systems.',
      author: 'Mike Chen',
      date: '2024-01-12',
      readTime: '7 min read',
      category: 'Resume Tips',
      image: '/blog/ats-resume.jpg',
      featured: false
    },
    {
      id: '3',
      title: 'Remote Work: The Future of Employment',
      excerpt: 'Explore the growing trend of remote work and how to position yourself for success in a distributed workforce.',
      author: 'Emily Rodriguez',
      date: '2024-01-10',
      readTime: '6 min read',
      category: 'Industry Trends',
      image: '/blog/remote-work.jpg',
      featured: false
    },
    {
      id: '4',
      title: 'Networking Strategies That Actually Work',
      excerpt: 'Build meaningful professional relationships with these proven networking techniques and strategies.',
      author: 'David Kim',
      date: '2024-01-08',
      readTime: '4 min read',
      category: 'Networking',
      image: '/blog/networking.jpg',
      featured: false
    },
    {
      id: '5',
      title: 'Salary Negotiation: Get What You\'re Worth',
      excerpt: 'Master the art of salary negotiation with these expert tips and strategies for maximizing your compensation.',
      author: 'Lisa Wang',
      date: '2024-01-05',
      readTime: '8 min read',
      category: 'Career Advice',
      image: '/blog/salary-negotiation.jpg',
      featured: false
    },
    {
      id: '6',
      title: 'The Rise of AI in Recruitment: What Job Seekers Need to Know',
      excerpt: 'Understand how artificial intelligence is changing the hiring process and how to adapt your job search strategy.',
      author: 'Alex Thompson',
      date: '2024-01-03',
      readTime: '6 min read',
      category: 'Technology',
      image: '/blog/ai-recruitment.jpg',
      featured: false
    }
  ];

  const categories = [
    'All',
    'Career Advice',
    'Resume Tips',
    'Industry Trends',
    'Networking',
    'Technology',
    'Interview Tips',
    'Job Search'
  ];

  return (
    <>
      <SEO seoData={PAGE_SEO['/blog']} url="/blog" />
      <div className="min-h-screen bg-gray-50">
        
        <main className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Career Blog
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Get expert career advice, job search tips, and industry insights to advance your professional journey.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search articles..."
                className="pl-10 pr-4 py-3"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === 'All' ? 'default' : 'outline'}
                size="sm"
                className="mb-2"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Featured Article */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              Featured Article
            </h2>
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-blue-100 text-blue-800">
                      {blogPosts[0].category}
                    </Badge>
                    <Badge variant="outline">
                      Featured
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                    {blogPosts[0].title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {blogPosts[0].author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(blogPosts[0].date).toLocaleDateString()}
                    </div>
                    <span>{blogPosts[0].readTime}</span>
                  </div>
                  <Button className="group">
                    Read Article
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Featured Article Image</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Blog Posts Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              Latest Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.slice(1).map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                      <Button variant="ghost" size="sm" className="group">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-blue-100 mb-6">
                Get the latest career tips and job market insights delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  placeholder="Enter your email"
                  className="bg-white text-gray-900"
                />
                <Button className="bg-white text-blue-600 hover:bg-gray-100">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        
  
      </div>
    </>
  );
};

export default Blog;
