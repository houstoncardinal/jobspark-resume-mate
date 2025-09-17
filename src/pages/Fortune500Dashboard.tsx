import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Zap, 
  Crown,
  Globe,
  Shield,
  Brain,
  Award
} from "lucide-react";
import { EnterpriseDashboard } from "@/components/EnterpriseDashboard";
import { ViralGrowthHub } from "@/components/ViralGrowthHub";
import { AIPowerSuite } from "@/components/AIPowerSuite";

const Fortune500Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const companyStats = {
    valuation: 1250000000, // $1.25B
    revenue: 45000000, // $45M ARR
    users: 850000,
    employees: 150,
    growth: 340,
    clients: 2500,
    countries: 25
  };

  const milestones = [
    {
      quarter: "Q1 2024",
      status: "completed",
      achievements: ["Enhanced Platform Launch", "100K Users", "Series A: $10M"],
      revenue: 5000000
    },
    {
      quarter: "Q2 2024",
      status: "completed",
      achievements: ["AI Features Launch", "500K Users", "B2B MVP"],
      revenue: 15000000
    },
    {
      quarter: "Q3 2024",
      status: "in_progress",
      achievements: ["Enterprise Suite", "1M Users", "Series B: $50M"],
      revenue: 25000000
    },
    {
      quarter: "Q4 2024",
      status: "planned",
      achievements: ["Global Expansion", "Fortune 500 Clients", "IPO Prep"],
      revenue: 45000000
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Gigm8
            </h1>
            <Badge className="bg-yellow-100 text-yellow-800 text-lg px-4 py-2">
              Fortune 500 Bound
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Building the world's leading AI-powered job matching platform
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Valuation</p>
                  <p className="text-2xl font-bold">${(companyStats.valuation / 1000000000).toFixed(1)}B</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-green-600">+{companyStats.growth}%</span>
                <span className="text-sm text-muted-foreground ml-2">YoY growth</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue (ARR)</p>
                  <p className="text-2xl font-bold">${(companyStats.revenue / 1000000).toFixed(0)}M</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-green-600">+{Math.floor(companyStats.growth * 0.8)}%</span>
                <span className="text-sm text-muted-foreground ml-2">this year</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Users</p>
                  <p className="text-2xl font-bold">{(companyStats.users / 1000).toFixed(0)}K</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-green-600">+{Math.floor(companyStats.growth * 0.6)}%</span>
                <span className="text-sm text-muted-foreground ml-2">monthly active</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Global Reach</p>
                  <p className="text-2xl font-bold">{companyStats.countries}+</p>
                </div>
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-green-600">+{Math.floor(companyStats.growth * 0.1)}</span>
                <span className="text-sm text-muted-foreground ml-2">countries</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
            <TabsTrigger value="viral">Viral Growth</TabsTrigger>
            <TabsTrigger value="ai">AI Suite</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Company Milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Company Milestones & Roadmap
                </CardTitle>
                <CardDescription>
                  Key achievements and upcoming milestones on our path to Fortune 500
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        milestone.status === 'completed' ? 'bg-green-100 text-green-600' :
                        milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {milestone.status === 'completed' ? (
                          <Award className="h-4 w-4" />
                        ) : milestone.status === 'in_progress' ? (
                          <Zap className="h-4 w-4" />
                        ) : (
                          <Target className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{milestone.quarter}</h4>
                          <Badge variant={
                            milestone.status === 'completed' ? 'default' :
                            milestone.status === 'in_progress' ? 'secondary' : 'outline'
                          }>
                            {milestone.status.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm font-medium text-primary">
                            ${(milestone.revenue / 1000000).toFixed(0)}M ARR
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {milestone.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Streams */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue Streams
                </CardTitle>
                <CardDescription>
                  Multiple revenue streams driving Fortune 500 growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold mb-2">B2C SaaS</h4>
                    <p className="text-2xl font-bold text-primary mb-1">$15M</p>
                    <p className="text-sm text-muted-foreground">33% of revenue</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Building2 className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold mb-2">B2B Enterprise</h4>
                    <p className="text-2xl font-bold text-primary mb-1">$20M</p>
                    <p className="text-sm text-muted-foreground">44% of revenue</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Marketplace</h4>
                    <p className="text-2xl font-bold text-primary mb-1">$8M</p>
                    <p className="text-sm text-muted-foreground">18% of revenue</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Brain className="h-6 w-6 text-orange-600" />
                    </div>
                    <h4 className="font-semibold mb-2">AI Services</h4>
                    <p className="text-2xl font-bold text-primary mb-1">$2M</p>
                    <p className="text-sm text-muted-foreground">5% of revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Competitive Advantages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Competitive Advantages
                </CardTitle>
                <CardDescription>
                  What sets Gigm8 apart in the competitive landscape
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Brain className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">AI-First Approach</h4>
                        <p className="text-sm text-muted-foreground">
                          Most advanced job matching algorithms with 95% accuracy
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Target className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Comprehensive Platform</h4>
                        <p className="text-sm text-muted-foreground">
                          All-in-one solution for job search, resume optimization, and career development
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Data Advantage</h4>
                        <p className="text-sm text-muted-foreground">
                          Largest job market dataset with real-time insights and predictions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">User Experience</h4>
                        <p className="text-sm text-muted-foreground">
                          Intuitive, mobile-first design with gamification and social features
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enterprise">
            <EnterpriseDashboard />
          </TabsContent>

          <TabsContent value="viral">
            <ViralGrowthHub />
          </TabsContent>

          <TabsContent value="ai">
            <AIPowerSuite />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Fortune500Dashboard;
