import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Zap, 
  Target, 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Award,
  Lightbulb,
  Shield,
  Globe
} from "lucide-react";

interface AIFeature {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  usage: number;
  impact: string;
  status: 'active' | 'beta' | 'coming_soon';
  category: 'matching' | 'optimization' | 'analytics' | 'prediction';
}

interface AIPrediction {
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}

export const AIPowerSuite = () => {
  const [aiFeatures, setAiFeatures] = useState<AIFeature[]>([
    {
      id: 'smart-matching',
      name: 'Smart Job Matching',
      description: 'AI-powered job-candidate matching with 95% accuracy',
      accuracy: 95,
      usage: 125000,
      impact: 'Reduces time-to-hire by 60%',
      status: 'active',
      category: 'matching'
    },
    {
      id: 'resume-optimization',
      name: 'Resume Optimization',
      description: 'AI analyzes and optimizes resumes for ATS compatibility',
      accuracy: 92,
      usage: 89000,
      impact: 'Increases interview rate by 340%',
      status: 'active',
      category: 'optimization'
    },
    {
      id: 'salary-prediction',
      name: 'Salary Prediction',
      description: 'Predicts optimal salary ranges based on market data',
      accuracy: 88,
      usage: 67000,
      impact: 'Users earn 23% more on average',
      status: 'active',
      category: 'prediction'
    },
    {
      id: 'skill-gap-analysis',
      name: 'Skill Gap Analysis',
      description: 'Identifies missing skills and suggests learning paths',
      accuracy: 90,
      usage: 45000,
      impact: 'Improves skill development by 280%',
      status: 'active',
      category: 'analytics'
    },
    {
      id: 'interview-prep',
      name: 'AI Interview Prep',
      description: 'Personalized interview questions and practice sessions',
      accuracy: 85,
      usage: 32000,
      impact: 'Increases interview success by 180%',
      status: 'beta',
      category: 'optimization'
    },
    {
      id: 'cultural-fit',
      name: 'Cultural Fit Analysis',
      description: 'Matches candidates with company culture and values',
      accuracy: 87,
      usage: 28000,
      impact: 'Reduces turnover by 45%',
      status: 'beta',
      category: 'matching'
    },
    {
      id: 'market-trends',
      name: 'Market Trend Analysis',
      description: 'Predicts job market trends and skill demands',
      accuracy: 82,
      usage: 15000,
      impact: 'Helps 90% of users stay ahead of trends',
      status: 'active',
      category: 'analytics'
    },
    {
      id: 'negotiation-coach',
      name: 'AI Negotiation Coach',
      description: 'Personalized salary negotiation strategies',
      accuracy: 89,
      usage: 22000,
      impact: 'Increases negotiation success by 250%',
      status: 'coming_soon',
      category: 'optimization'
    }
  ]);

  const [predictions, setPredictions] = useState<AIPrediction[]>([
    {
      metric: 'Job Market Growth',
      current: 12.5,
      predicted: 18.3,
      confidence: 92,
      trend: 'up'
    },
    {
      metric: 'Remote Work Adoption',
      current: 45.2,
      predicted: 67.8,
      confidence: 88,
      trend: 'up'
    },
    {
      metric: 'AI Skills Demand',
      current: 23.1,
      predicted: 41.7,
      confidence: 95,
      trend: 'up'
    },
    {
      metric: 'Average Salary',
      current: 75000,
      predicted: 89000,
      confidence: 85,
      trend: 'up'
    }
  ]);

  const [aiMetrics, setAiMetrics] = useState({
    totalPredictions: 2500000,
    accuracyRate: 91.5,
    timeSaved: 45000,
    revenueGenerated: 2500000
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'matching': return <Target className="h-5 w-5" />;
      case 'optimization': return <Zap className="h-5 w-5" />;
      case 'analytics': return <BarChart3 className="h-5 w-5" />;
      case 'prediction': return <TrendingUp className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'matching': return 'bg-blue-100 text-blue-800';
      case 'optimization': return 'bg-green-100 text-green-800';
      case 'analytics': return 'bg-purple-100 text-purple-800';
      case 'prediction': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* AI Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Predictions</p>
                <p className="text-2xl font-bold">{(aiMetrics.totalPredictions / 1000000).toFixed(1)}M</p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+{Math.floor(aiMetrics.accuracyRate * 0.1)}%</span>
              <span className="text-sm text-muted-foreground ml-2">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Accuracy Rate</p>
                <p className="text-2xl font-bold">{aiMetrics.accuracyRate}%</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <Progress value={aiMetrics.accuracyRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hours Saved</p>
                <p className="text-2xl font-bold">{(aiMetrics.timeSaved / 1000).toFixed(0)}K</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+{Math.floor(aiMetrics.accuracyRate * 0.2)}%</span>
              <span className="text-sm text-muted-foreground ml-2">efficiency gain</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue Impact</p>
                <p className="text-2xl font-bold">${(aiMetrics.revenueGenerated / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">+{Math.floor(aiMetrics.accuracyRate * 0.3)}%</span>
              <span className="text-sm text-muted-foreground ml-2">AI-driven revenue</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Features by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Features
          </CardTitle>
          <CardDescription>
            Advanced AI capabilities driving platform growth and user success
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="matching" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="matching">Matching</TabsTrigger>
              <TabsTrigger value="optimization">Optimization</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="prediction">Prediction</TabsTrigger>
            </TabsList>
            
            {['matching', 'optimization', 'analytics', 'prediction'].map((category) => (
              <TabsContent key={category} value={category} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aiFeatures.filter(f => f.category === category).map((feature) => (
                    <Card key={feature.id} className="relative">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(feature.category)}
                            <CardTitle className="text-lg">{feature.name}</CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={feature.status === 'active' ? 'default' : 
                                      feature.status === 'beta' ? 'secondary' : 'outline'}
                            >
                              {feature.status}
                            </Badge>
                            <Badge className={getCategoryColor(feature.category)}>
                              {feature.category}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Accuracy</p>
                              <p className="text-xl font-bold">{feature.accuracy}%</p>
                              <Progress value={feature.accuracy} className="h-2 mt-1" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Usage</p>
                              <p className="text-xl font-bold">{(feature.usage / 1000).toFixed(0)}K</p>
                              <p className="text-xs text-muted-foreground">monthly users</p>
                            </div>
                          </div>
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium text-primary">Impact</p>
                            <p className="text-sm">{feature.impact}</p>
                          </div>
                          <Button className="w-full" variant={feature.status === 'coming_soon' ? 'outline' : 'default'}>
                            {feature.status === 'active' ? 'Use Feature' : 
                             feature.status === 'beta' ? 'Join Beta' : 'Coming Soon'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* AI Predictions Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            AI Market Predictions
          </CardTitle>
          <CardDescription>
            Real-time predictions powered by advanced machine learning models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {predictions.map((prediction, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">{prediction.metric}</h4>
                    <div className="flex items-center gap-2">
                      {prediction.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : prediction.trend === 'down' ? (
                        <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                      ) : (
                        <div className="w-4 h-4 bg-gray-400 rounded-full" />
                      )}
                      <Badge variant={prediction.confidence > 90 ? 'default' : 'secondary'}>
                        {prediction.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Current</span>
                      <span className="font-bold">
                        {prediction.metric.includes('Salary') ? `$${prediction.current.toLocaleString()}` : 
                         `${prediction.current}%`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Predicted (6 months)</span>
                      <span className="font-bold text-primary">
                        {prediction.metric.includes('Salary') ? `$${prediction.predicted.toLocaleString()}` : 
                         `${prediction.predicted}%`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Change</span>
                      <span className={`font-bold ${prediction.trend === 'up' ? 'text-green-600' : 
                                                      prediction.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                        {prediction.trend === 'up' ? '+' : prediction.trend === 'down' ? '-' : ''}
                        {prediction.metric.includes('Salary') ? 
                         `$${(prediction.predicted - prediction.current).toLocaleString()}` :
                         `${(prediction.predicted - prediction.current).toFixed(1)}%`}
                      </span>
                    </div>
                    <Progress 
                      value={(prediction.current / prediction.predicted) * 100} 
                      className="h-2" 
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Ethics & Transparency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            AI Ethics & Transparency
          </CardTitle>
          <CardDescription>
            Committed to responsible AI development and transparent algorithms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Bias-Free Algorithms</h4>
              <p className="text-sm text-muted-foreground">
                Regular audits ensure our AI treats all candidates fairly regardless of background
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Transparent Decisions</h4>
              <p className="text-sm text-muted-foreground">
                Users can see exactly how AI decisions are made and provide feedback
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Continuous Improvement</h4>
              <p className="text-sm text-muted-foreground">
                AI models are constantly updated with new data and user feedback
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
