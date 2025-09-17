import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Share2, 
  Users, 
  TrendingUp, 
  Award, 
  Gift, 
  MessageCircle, 
  Heart, 
  ThumbsUp,
  Eye,
  Zap,
  Crown,
  Star,
  Target,
  BarChart3
} from "lucide-react";

interface ViralFeature {
  id: string;
  name: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  status: 'active' | 'planned' | 'beta';
  users: number;
  growth: number;
}

interface ReferralProgram {
  tier: string;
  reward: string;
  requirement: string;
  payout: string;
  color: string;
}

export const ViralGrowthHub = () => {
  const [viralFeatures, setViralFeatures] = useState<ViralFeature[]>([
    {
      id: 'resume-challenge',
      name: 'Resume Makeover Challenge',
      description: 'Users submit before/after resumes, community votes, winner gets featured',
      impact: 'high',
      status: 'active',
      users: 125000,
      growth: 340
    },
    {
      id: 'salary-transparency',
      name: 'Salary Transparency Movement',
      description: 'Anonymous salary sharing with industry reports and insights',
      impact: 'high',
      status: 'active',
      users: 89000,
      growth: 280
    },
    {
      id: 'success-stories',
      name: 'Success Stories Platform',
      description: 'User-generated content showcasing career transformations',
      impact: 'medium',
      status: 'active',
      users: 45000,
      growth: 190
    },
    {
      id: 'referral-program',
      name: 'Referral Rewards',
      description: 'Earn credits and premium features for successful referrals',
      impact: 'high',
      status: 'active',
      users: 67000,
      growth: 420
    },
    {
      id: 'social-feed',
      name: 'Career Social Feed',
      description: 'LinkedIn-style feed for job seekers and professionals',
      impact: 'medium',
      status: 'beta',
      users: 23000,
      growth: 150
    },
    {
      id: 'gamification',
      name: 'Career Gamification',
      description: 'Points, badges, and leaderboards for job search activities',
      impact: 'medium',
      status: 'planned',
      users: 0,
      growth: 0
    }
  ]);

  const [referralTiers, setReferralTiers] = useState<ReferralProgram[]>([
    {
      tier: 'Bronze',
      reward: '1 Month Pro Free',
      requirement: '3 successful referrals',
      payout: '$29 value',
      color: 'bg-amber-100 text-amber-800'
    },
    {
      tier: 'Silver',
      reward: '3 Months Pro Free',
      requirement: '10 successful referrals',
      payout: '$87 value',
      color: 'bg-gray-100 text-gray-800'
    },
    {
      tier: 'Gold',
      reward: '6 Months Pro Free',
      requirement: '25 successful referrals',
      payout: '$174 value',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      tier: 'Platinum',
      reward: 'Lifetime Pro + $500',
      requirement: '50 successful referrals',
      payout: '$1000+ value',
      color: 'bg-purple-100 text-purple-800'
    }
  ]);

  const [socialStats, setSocialStats] = useState({
    totalShares: 1250000,
    viralCoefficient: 2.4,
    monthlyActiveUsers: 850000,
    userGeneratedContent: 45000,
    communityEngagement: 78
  });

  return (
    <div className="space-y-8">
      {/* Viral Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Shares</p>
                <p className="text-2xl font-bold">{(socialStats.totalShares / 1000000).toFixed(1)}M</p>
              </div>
              <Share2 className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+{socialStats.viralCoefficient}x</span>
              <span className="text-sm text-muted-foreground ml-2">viral coefficient</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">MAU</p>
                <p className="text-2xl font-bold">{(socialStats.monthlyActiveUsers / 1000).toFixed(0)}K</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+{Math.floor(socialStats.viralCoefficient * 20)}%</span>
              <span className="text-sm text-muted-foreground ml-2">monthly growth</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">UGC Posts</p>
                <p className="text-2xl font-bold">{(socialStats.userGeneratedContent / 1000).toFixed(0)}K</p>
              </div>
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+{Math.floor(socialStats.viralCoefficient * 15)}%</span>
              <span className="text-sm text-muted-foreground ml-2">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engagement</p>
                <p className="text-2xl font-bold">{socialStats.communityEngagement}%</p>
              </div>
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+{Math.floor(socialStats.viralCoefficient * 5)}%</span>
              <span className="text-sm text-muted-foreground ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Viral Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Viral Growth Features
          </CardTitle>
          <CardDescription>
            Features designed to drive organic growth and user engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {viralFeatures.map((feature) => (
              <Card key={feature.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{feature.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={feature.status === 'active' ? 'default' : 
                                feature.status === 'beta' ? 'secondary' : 'outline'}
                      >
                        {feature.status}
                      </Badge>
                      <Badge 
                        variant={feature.impact === 'high' ? 'destructive' : 
                                feature.impact === 'medium' ? 'default' : 'secondary'}
                      >
                        {feature.impact} impact
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Users</p>
                      <p className="text-xl font-bold">{(feature.users / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Growth</p>
                      <p className="text-xl font-bold text-green-600">+{feature.growth}%</p>
                    </div>
                  </div>
                  <Button className="w-full" variant={feature.status === 'active' ? 'default' : 'outline'}>
                    {feature.status === 'active' ? 'View Feature' : 
                     feature.status === 'beta' ? 'Join Beta' : 'Coming Soon'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Referral Program */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Referral Rewards Program
          </CardTitle>
          <CardDescription>
            Earn rewards for bringing new users to the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {referralTiers.map((tier, index) => (
              <Card key={index} className="relative">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Crown className="h-6 w-6 text-yellow-500" />
                  </div>
                  <CardTitle className="text-lg">{tier.tier}</CardTitle>
                  <div className="text-2xl font-bold text-primary">{tier.reward}</div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Requirement</p>
                      <p className="font-medium">{tier.requirement}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Value</p>
                      <p className="font-bold text-green-600">{tier.payout}</p>
                    </div>
                    <Button className="w-full" variant={index === 0 ? 'default' : 'outline'}>
                      {index === 0 ? 'Get Started' : 'Upgrade'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Social & Community Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="feed">Career Feed</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
            </TabsList>
            
            <TabsContent value="feed" className="mt-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">JD</span>
                  </div>
                  <div className="flex-1">
                    <Textarea placeholder="Share your career update, job search tips, or success story..." className="min-h-[100px]" />
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">📷 Photo</Button>
                        <Button size="sm" variant="outline">📄 Resume</Button>
                        <Button size="sm" variant="outline">🎯 Job</Button>
                      </div>
                      <Button size="sm">Post</Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold">U{i}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">User {i}</span>
                              <span className="text-sm text-muted-foreground">2h ago</span>
                              <Badge variant="secondary">Software Engineer</Badge>
                            </div>
                            <p className="text-sm mb-3">
                              Just landed my dream job at a FAANG company! Here's what I learned during my 6-month job search...
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <button className="flex items-center gap-1 hover:text-primary">
                                <ThumbsUp className="h-4 w-4" />
                                {Math.floor(Math.random() * 50) + 10}
                              </button>
                              <button className="flex items-center gap-1 hover:text-primary">
                                <MessageCircle className="h-4 w-4" />
                                {Math.floor(Math.random() * 20) + 5}
                              </button>
                              <button className="flex items-center gap-1 hover:text-primary">
                                <Share2 className="h-4 w-4" />
                                Share
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="challenges" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Resume Makeover Challenge
                    </CardTitle>
                    <CardDescription>Transform your resume and win prizes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Participants</span>
                        <span className="font-bold">2,450</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prize Pool</span>
                        <span className="font-bold text-primary">$10,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time Left</span>
                        <span className="font-bold">5 days</span>
                      </div>
                      <Button className="w-full">Join Challenge</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Salary Negotiation Masterclass
                    </CardTitle>
                    <CardDescription>Learn to negotiate like a pro</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Enrolled</span>
                        <span className="font-bold">1,890</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Success Rate</span>
                        <span className="font-bold text-green-600">87%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg. Salary Increase</span>
                        <span className="font-bold text-primary">$15K</span>
                      </div>
                      <Button className="w-full">Enroll Now</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="groups" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Software Engineers', 'Data Scientists', 'Product Managers', 'Designers', 'Marketing', 'Sales'].map((group, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{group}</h4>
                          <p className="text-sm text-muted-foreground">{Math.floor(Math.random() * 5000) + 1000} members</p>
                        </div>
                      </div>
                      <Button size="sm" className="w-full">Join Group</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mentorship" className="mt-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Find a Mentor</CardTitle>
                    <CardDescription>Connect with industry professionals for career guidance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Input placeholder="Search by role, company, or skills..." className="flex-1" />
                      <Button>Search Mentors</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="font-bold">M{i}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">Mentor {i}</h4>
                            <p className="text-sm text-muted-foreground">Senior Software Engineer at Google</p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">4.9 (127 reviews)</span>
                            </div>
                            <Button size="sm" className="mt-2">Connect</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
