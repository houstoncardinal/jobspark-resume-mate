import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target, 
  BarChart3, 
  Zap, 
  Crown,
  Shield,
  Globe,
  Star,
  Award
} from "lucide-react";

interface CompanyMetrics {
  totalJobs: number;
  activeUsers: number;
  applications: number;
  revenue: number;
  growthRate: number;
  satisfaction: number;
}

interface EnterpriseFeature {
  id: string;
  name: string;
  description: string;
  tier: 'basic' | 'pro' | 'enterprise';
  price: number;
  features: string[];
  popular?: boolean;
}

export const EnterpriseDashboard = () => {
  const [metrics, setMetrics] = useState<CompanyMetrics>({
    totalJobs: 1250000,
    activeUsers: 850000,
    applications: 3200000,
    revenue: 45000000,
    growthRate: 340,
    satisfaction: 4.8
  });

  const [selectedTier, setSelectedTier] = useState<'basic' | 'pro' | 'enterprise'>('pro');

  const enterpriseFeatures: EnterpriseFeature[] = [
    {
      id: 'ats-integration',
      name: 'ATS Integration',
      description: 'Seamlessly integrate with 50+ ATS systems',
      tier: 'enterprise',
      price: 500,
      features: ['Workday Integration', 'BambooHR Sync', 'Greenhouse API', 'Custom ATS Support'],
      popular: true
    },
    {
      id: 'ai-matching',
      name: 'AI Job Matching',
      description: 'Advanced ML algorithms for perfect job-candidate matching',
      tier: 'pro',
      price: 200,
      features: ['Smart Recommendations', 'Skill Gap Analysis', 'Cultural Fit Scoring', 'Predictive Analytics']
    },
    {
      id: 'recruiting-tools',
      name: 'Recruiting Suite',
      description: 'Complete recruiting and hiring management platform',
      tier: 'enterprise',
      price: 1000,
      features: ['Interview Scheduling', 'Video Interviews', 'Reference Checks', 'Onboarding Automation']
    },
    {
      id: 'analytics',
      name: 'Advanced Analytics',
      description: 'Deep insights into hiring trends and performance',
      tier: 'pro',
      price: 150,
      features: ['Hiring Funnel Analysis', 'Time-to-Hire Metrics', 'Source Performance', 'ROI Tracking']
    },
    {
      id: 'white-label',
      name: 'White-Label Solution',
      description: 'Custom branded platform for enterprise clients',
      tier: 'enterprise',
      price: 2000,
      features: ['Custom Branding', 'Dedicated Support', 'API Access', 'Custom Integrations']
    },
    {
      id: 'compliance',
      name: 'Compliance Suite',
      description: 'EEO, GDPR, and regulatory compliance tools',
      tier: 'enterprise',
      price: 300,
      features: ['EEO Reporting', 'GDPR Compliance', 'Audit Trails', 'Legal Documentation']
    }
  ];

  const tiers = [
    {
      name: 'Basic',
      price: 0,
      description: 'Perfect for individuals and small teams',
      features: ['5 job searches/month', 'Basic resume optimization', 'Email support'],
      color: 'border-gray-200'
    },
    {
      name: 'Pro',
      price: 29,
      description: 'For growing companies and professionals',
      features: ['Unlimited job searches', 'AI resume optimization', 'Priority support', 'Advanced analytics'],
      color: 'border-blue-500',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 99,
      description: 'For large organizations and enterprises',
      features: ['Everything in Pro', 'ATS integration', 'White-label options', 'Dedicated support', 'Custom features'],
      color: 'border-purple-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Company Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-bold">{(metrics.totalJobs / 1000000).toFixed(1)}M</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+{metrics.growthRate}%</span>
              <span className="text-sm text-muted-foreground ml-2">vs last year</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{(metrics.activeUsers / 1000).toFixed(0)}K</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+{Math.floor(metrics.growthRate * 0.8)}%</span>
              <span className="text-sm text-muted-foreground ml-2">monthly active</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold">{(metrics.applications / 1000000).toFixed(1)}M</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+{Math.floor(metrics.growthRate * 1.2)}%</span>
              <span className="text-sm text-muted-foreground ml-2">this quarter</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">${(metrics.revenue / 1000000).toFixed(0)}M</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+{Math.floor(metrics.growthRate * 0.6)}%</span>
              <span className="text-sm text-muted-foreground ml-2">ARR growth</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Streams */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Revenue Streams & Growth Strategy
          </CardTitle>
          <CardDescription>
            Multiple revenue streams driving Fortune 500 growth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTier} onValueChange={(v: any) => setSelectedTier(v)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">B2C SaaS</TabsTrigger>
              <TabsTrigger value="pro">B2B Enterprise</TabsTrigger>
              <TabsTrigger value="enterprise">Marketplace</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tiers.map((tier, index) => (
                  <Card key={index} className={`relative ${tier.color} ${tier.popular ? 'ring-2 ring-blue-500' : ''}`}>
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-500">Most Popular</Badge>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl">{tier.name}</CardTitle>
                      <div className="text-3xl font-bold">${tier.price}<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                      <CardDescription>{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full mt-6" variant={tier.popular ? "default" : "outline"}>
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pro" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enterpriseFeatures.filter(f => f.tier === 'pro' || f.tier === 'enterprise').map((feature) => (
                  <Card key={feature.id} className="relative">
                    {feature.popular && (
                      <div className="absolute -top-2 -right-2">
                        <Crown className="h-6 w-6 text-yellow-500" />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{feature.name}</CardTitle>
                        <Badge variant={feature.tier === 'enterprise' ? 'default' : 'secondary'}>
                          {feature.tier}
                        </Badge>
                      </div>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold mb-4">${feature.price}<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                      <ul className="space-y-2 mb-4">
                        {feature.features.map((f, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full">Learn More</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="enterprise" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Job Marketplace
                    </CardTitle>
                    <CardDescription>Commission-based revenue from job postings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Premium Job Postings</span>
                        <span className="font-bold">$299/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Featured Listings</span>
                        <span className="font-bold">$99/listing</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recruiter Tools</span>
                        <span className="font-bold">$199/month</span>
                      </div>
                      <div className="text-2xl font-bold text-primary">$2.5M ARR</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Enterprise Solutions
                    </CardTitle>
                    <CardDescription>Custom solutions for Fortune 500 companies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Custom ATS Integration</span>
                        <span className="font-bold">$50K+</span>
                      </div>
                      <div className="flex justify-between">
                        <span>White-label Platform</span>
                        <span className="font-bold">$100K+</span>
                      </div>
                      <div className="flex justify-between">
                        <span>AI Training & Consulting</span>
                        <span className="font-bold">$25K+</span>
                      </div>
                      <div className="text-2xl font-bold text-primary">$15M ARR</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Growth Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Growth Trajectory to Fortune 500
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-4">Key Milestones</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Series A: $10M</div>
                    <div className="text-sm text-muted-foreground">Q2 2024</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">1M Users</div>
                    <div className="text-sm text-muted-foreground">Q3 2024</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">Fortune 500 Clients</div>
                    <div className="text-sm text-muted-foreground">Q4 2024</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-medium">IPO Ready</div>
                    <div className="text-sm text-muted-foreground">Q2 2025</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Revenue Projections</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>2024 ARR</span>
                  <span className="font-bold">$50M</span>
                </div>
                <Progress value={60} className="h-2" />
                <div className="flex justify-between">
                  <span>2025 ARR</span>
                  <span className="font-bold">$150M</span>
                </div>
                <Progress value={40} className="h-2" />
                <div className="flex justify-between">
                  <span>2026 ARR</span>
                  <span className="font-bold">$500M</span>
                </div>
                <Progress value={20} className="h-2" />
                <div className="flex justify-between">
                  <span>2027 ARR</span>
                  <span className="font-bold">$1B+</span>
                </div>
                <Progress value={10} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
