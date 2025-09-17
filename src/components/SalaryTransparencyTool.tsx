import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingUp, MapPin, Building2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";

interface SalaryData {
  job_title: string;
  location: string;
  salary_min: number;
  salary_max: number;
  count: number;
  avg_salary: number;
}

interface SalaryInsight {
  percentile: number;
  salary: number;
  description: string;
}

export const SalaryTransparencyTool = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<string>("mid");
  const [salaryData, setSalaryData] = useState<SalaryData[]>([]);
  const [insights, setInsights] = useState<SalaryInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userSalary, setUserSalary] = useState("");
  const [userInsight, setUserInsight] = useState<SalaryInsight | null>(null);

  const experienceLevels = [
    { value: "entry", label: "Entry Level (0-2 years)" },
    { value: "mid", label: "Mid Level (3-5 years)" },
    { value: "senior", label: "Senior Level (6+ years)" },
    { value: "executive", label: "Executive Level" }
  ];

  const fetchSalaryData = async () => {
    if (!jobTitle.trim()) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('salary_insights')
        .select('*')
        .ilike('job_title', `%${jobTitle}%`)
        .eq('experience_level', experienceLevel);

      if (error) throw error;

      // Process and aggregate data
      const processed = data.reduce((acc: Record<string, SalaryData>, item) => {
        const key = `${item.job_title}-${item.location || 'Remote'}`;
        if (!acc[key]) {
          acc[key] = {
            job_title: item.job_title,
            location: item.location || 'Remote',
            salary_min: item.salary_min || 0,
            salary_max: item.salary_max || 0,
            count: 0,
            avg_salary: 0
          };
        }
        acc[key].count += 1;
        acc[key].avg_salary = (acc[key].avg_salary + (item.salary_min + item.salary_max) / 2) / 2;
        return acc;
      }, {});

      const sorted = Object.values(processed)
        .sort((a, b) => b.avg_salary - a.avg_salary)
        .slice(0, 10);

      setSalaryData(sorted);

      // Generate insights
      const allSalaries = data
        .map(d => (d.salary_min + d.salary_max) / 2)
        .filter(s => s > 0)
        .sort((a, b) => a - b);

      if (allSalaries.length > 0) {
        const percentile25 = allSalaries[Math.floor(allSalaries.length * 0.25)];
        const percentile50 = allSalaries[Math.floor(allSalaries.length * 0.5)];
        const percentile75 = allSalaries[Math.floor(allSalaries.length * 0.75)];
        const percentile90 = allSalaries[Math.floor(allSalaries.length * 0.9)];

        setInsights([
          { percentile: 25, salary: percentile25, description: "Below market rate" },
          { percentile: 50, salary: percentile50, description: "Market average" },
          { percentile: 75, salary: percentile75, description: "Above average" },
          { percentile: 90, salary: percentile90, description: "Top performer" }
        ]);
      }

      trackEvent('salary_search', 'engagement', jobTitle);
    } catch (error) {
      console.error('Error fetching salary data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateUserInsight = () => {
    if (!userSalary || !insights.length) return;
    
    const salary = parseFloat(userSalary);
    const userInsight = insights.find(insight => salary <= insight.salary) || insights[insights.length - 1];
    setUserInsight(userInsight);
    
    trackEvent('salary_calculation', 'engagement', `${jobTitle}-${userInsight.percentile}th`);
  };

  const submitSalary = async () => {
    if (!userSalary || !jobTitle) return;
    
    try {
      const { error } = await supabase
        .from('salary_insights')
        .insert({
          job_title: jobTitle,
          location: location || null,
          salary_min: parseFloat(userSalary),
          salary_max: parseFloat(userSalary),
          experience_level: experienceLevel,
          source: 'user_submitted'
        });

      if (error) throw error;
      
      trackEvent('salary_submit', 'engagement', jobTitle);
      // Refresh data
      fetchSalaryData();
    } catch (error) {
      console.error('Error submitting salary:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Salary Transparency Tool
          </CardTitle>
          <CardDescription>
            Discover real salary data and see where you stand in the market
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Job Title</label>
              <Input
                placeholder="e.g., Software Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location (Optional)</label>
              <Input
                placeholder="e.g., San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Experience Level</label>
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={fetchSalaryData} disabled={isLoading || !jobTitle.trim()}>
            {isLoading ? "Analyzing..." : "Get Salary Insights"}
          </Button>
        </CardContent>
      </Card>

      {salaryData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Salary Data for {jobTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Average Salary']} />
                  <Bar dataKey="avg_salary" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Salary Percentiles</CardTitle>
            <CardDescription>See where your salary falls in the market</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {insights.map((insight) => (
                <div key={insight.percentile} className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    ${insight.salary.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {insight.percentile}th Percentile
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {insight.description}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">What's your current salary?</h4>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter your salary"
                  value={userSalary}
                  onChange={(e) => setUserSalary(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={calculateUserInsight} disabled={!userSalary}>
                  Calculate
                </Button>
              </div>
              
              {userInsight && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">Your Market Position</span>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {userInsight.percentile}th Percentile
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {userInsight.description} - You're earning more than {100 - userInsight.percentile}% of people in this role
                  </div>
                </div>
              )}

              <div className="mt-4">
                <Button onClick={submitSalary} variant="outline" size="sm">
                  Submit Your Salary (Anonymous)
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  Help others by sharing your salary data anonymously
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
