import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trophy, Star, Target, Zap, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface ScoreBreakdown {
  ats_compatibility: number;
  keyword_density: number;
  formatting: number;
  experience_highlight: number;
  skills_relevance: number;
  overall: number;
}

interface ImprovementSuggestion {
  category: string;
  issue: string;
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
}

export const ResumeScoreChallenge = () => {
  const [resumeText, setResumeText] = useState("");
  const [score, setScore] = useState<ScoreBreakdown | null>(null);
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('resume_challenge_best_score');
    if (saved) setBestScore(parseInt(saved));
  }, []);

  const analyzeResume = async () => {
    if (!resumeText.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay for better UX
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // ATS Compatibility Check
      const atsScore = checkATSCompatibility(resumeText);
      
      // Keyword Density Analysis
      const keywordScore = analyzeKeywordDensity(resumeText);
      
      // Formatting Check
      const formattingScore = checkFormatting(resumeText);
      
      // Experience Highlight
      const experienceScore = checkExperienceHighlight(resumeText);
      
      // Skills Relevance
      const skillsScore = checkSkillsRelevance(resumeText);
      
      const overall = Math.round((atsScore + keywordScore + formattingScore + experienceScore + skillsScore) / 5);
      
      const breakdown: ScoreBreakdown = {
        ats_compatibility: atsScore,
        keyword_density: keywordScore,
        formatting: formattingScore,
        experience_highlight: experienceScore,
        skills_relevance: skillsScore,
        overall
      };
      
      setScore(breakdown);
      setSuggestions(generateSuggestions(breakdown));
      
      if (overall > bestScore) {
        setBestScore(overall);
        localStorage.setItem('resume_challenge_best_score', overall.toString());
        setChallengeCompleted(true);
      }
      
      trackEvent('resume_score_challenge', 'engagement', `score_${overall}`);
    } catch (error) {
      console.error('Error analyzing resume:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const checkATSCompatibility = (text: string): number => {
    let score = 100;
    
    // Check for common ATS issues
    if (text.includes('&nbsp;') || text.includes('&amp;')) score -= 20;
    if (text.includes('•') && !text.includes('• ')) score -= 10;
    if (text.match(/\b[A-Z]{2,}\b/)) score -= 15; // All caps words
    if (text.includes('http://') || text.includes('https://')) score -= 10;
    if (text.length < 200) score -= 30;
    if (text.length > 2000) score -= 10;
    
    return Math.max(0, score);
  };

  const analyzeKeywordDensity = (text: string): number => {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const totalWords = words.length;
    
    if (totalWords < 50) return 20;
    
    // Look for action verbs and technical terms
    const actionVerbs = ['developed', 'created', 'implemented', 'managed', 'led', 'designed', 'built', 'optimized', 'improved', 'delivered'];
    const techTerms = ['javascript', 'python', 'react', 'node', 'sql', 'api', 'database', 'cloud', 'aws', 'docker'];
    
    const actionCount = actionVerbs.reduce((count, verb) => count + (text.toLowerCase().includes(verb) ? 1 : 0), 0);
    const techCount = techTerms.reduce((count, term) => count + (text.toLowerCase().includes(term) ? 1 : 0), 0);
    
    const density = ((actionCount + techCount) / totalWords) * 100;
    return Math.min(100, Math.round(density * 10));
  };

  const checkFormatting = (text: string): number => {
    let score = 100;
    
    // Check for proper sections
    const sections = ['experience', 'education', 'skills', 'summary', 'objective'];
    const foundSections = sections.filter(section => text.toLowerCase().includes(section));
    score -= (sections.length - foundSections.length) * 15;
    
    // Check for bullet points
    if (!text.includes('•') && !text.includes('-') && !text.includes('*')) score -= 20;
    
    // Check for consistent formatting
    const lines = text.split('\n');
    const bulletLines = lines.filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'));
    if (bulletLines.length > 0) {
      const inconsistent = bulletLines.filter(line => !line.match(/^[•\-]\s/));
      score -= inconsistent.length * 5;
    }
    
    return Math.max(0, score);
  };

  const checkExperienceHighlight = (text: string): number => {
    let score = 100;
    
    // Look for quantified achievements
    const numbers = text.match(/\d+%|\$\d+|\d+\+|\d+x|\d+ years?/g);
    if (!numbers || numbers.length < 2) score -= 30;
    
    // Check for action verbs
    const actionVerbs = ['achieved', 'increased', 'reduced', 'improved', 'delivered', 'managed', 'led', 'created', 'developed'];
    const hasActions = actionVerbs.some(verb => text.toLowerCase().includes(verb));
    if (!hasActions) score -= 25;
    
    // Check for time periods
    const hasTimeframes = /\d{4}|\d+\s+(months?|years?)/.test(text);
    if (!hasTimeframes) score -= 20;
    
    return Math.max(0, score);
  };

  const checkSkillsRelevance = (text: string): number => {
    const skills = text.toLowerCase().match(/\b(?:javascript|python|java|react|angular|vue|node|sql|aws|docker|kubernetes|git|agile|scrum|leadership|communication|problem.solving)\b/g);
    return Math.min(100, (skills?.length || 0) * 10);
  };

  const generateSuggestions = (breakdown: ScoreBreakdown): ImprovementSuggestion[] => {
    const suggestions: ImprovementSuggestion[] = [];
    
    if (breakdown.ats_compatibility < 80) {
      suggestions.push({
        category: 'ATS Compatibility',
        issue: 'Your resume may not pass ATS screening',
        suggestion: 'Remove special characters, use standard bullet points, and avoid complex formatting',
        impact: 'high'
      });
    }
    
    if (breakdown.keyword_density < 60) {
      suggestions.push({
        category: 'Keywords',
        issue: 'Low keyword density',
        suggestion: 'Add more relevant technical terms and action verbs',
        impact: 'high'
      });
    }
    
    if (breakdown.formatting < 70) {
      suggestions.push({
        category: 'Formatting',
        issue: 'Inconsistent formatting',
        suggestion: 'Use consistent bullet points and section headers',
        impact: 'medium'
      });
    }
    
    if (breakdown.experience_highlight < 70) {
      suggestions.push({
        category: 'Experience',
        issue: 'Missing quantified achievements',
        suggestion: 'Add numbers, percentages, and specific results to your experience',
        impact: 'high'
      });
    }
    
    if (breakdown.skills_relevance < 60) {
      suggestions.push({
        category: 'Skills',
        issue: 'Limited relevant skills mentioned',
        suggestion: 'Include more technical skills and soft skills relevant to your target role',
        impact: 'medium'
      });
    }
    
    return suggestions;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Resume Score Challenge
          </CardTitle>
          <CardDescription>
            Test your resume against ATS systems and get an instant score
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary">Beat the ATS!</div>
              <div className="text-sm text-muted-foreground">Get your resume score and improve it</div>
            </div>
            {bestScore > 0 && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Best Score</div>
                <div className="text-2xl font-bold text-primary">{bestScore}/100</div>
              </div>
            )}
          </div>
          
          <Textarea
            placeholder="Paste your resume text here to get an instant ATS score..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="min-h-[200px]"
          />
          
          <Button 
            onClick={analyzeResume} 
            disabled={isAnalyzing || !resumeText.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-pulse" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Get My Score
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {score && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Your Resume Score: {score.overall}/100
            </CardTitle>
            <CardDescription>
              {score.overall >= 80 ? "Excellent! Your resume is ATS-ready." : 
               score.overall >= 60 ? "Good, but there's room for improvement." : 
               "Your resume needs significant improvements to pass ATS screening."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ATS Compatibility</span>
                <div className="flex items-center gap-2">
                  {getScoreIcon(score.ats_compatibility)}
                  <span className={`font-bold ${getScoreColor(score.ats_compatibility)}`}>
                    {score.ats_compatibility}/100
                  </span>
                </div>
              </div>
              <Progress value={score.ats_compatibility} className="h-2" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Keyword Density</span>
                <div className="flex items-center gap-2">
                  {getScoreIcon(score.keyword_density)}
                  <span className={`font-bold ${getScoreColor(score.keyword_density)}`}>
                    {score.keyword_density}/100
                  </span>
                </div>
              </div>
              <Progress value={score.keyword_density} className="h-2" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Formatting</span>
                <div className="flex items-center gap-2">
                  {getScoreIcon(score.formatting)}
                  <span className={`font-bold ${getScoreColor(score.formatting)}`}>
                    {score.formatting}/100
                  </span>
                </div>
              </div>
              <Progress value={score.formatting} className="h-2" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Experience Highlight</span>
                <div className="flex items-center gap-2">
                  {getScoreIcon(score.experience_highlight)}
                  <span className={`font-bold ${getScoreColor(score.experience_highlight)}`}>
                    {score.experience_highlight}/100
                  </span>
                </div>
              </div>
              <Progress value={score.experience_highlight} className="h-2" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Skills Relevance</span>
                <div className="flex items-center gap-2">
                  {getScoreIcon(score.skills_relevance)}
                  <span className={`font-bold ${getScoreColor(score.skills_relevance)}`}>
                    {score.skills_relevance}/100
                  </span>
                </div>
              </div>
              <Progress value={score.skills_relevance} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Improvement Suggestions</CardTitle>
            <CardDescription>Here's how to improve your resume score</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <Alert key={index}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{suggestion.category}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {suggestion.issue}
                      </div>
                      <div className="text-sm mt-2">
                        {suggestion.suggestion}
                      </div>
                    </div>
                    <Badge 
                      variant={suggestion.impact === 'high' ? 'destructive' : 
                              suggestion.impact === 'medium' ? 'default' : 'secondary'}
                    >
                      {suggestion.impact} impact
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {challengeCompleted && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-600">
              <Trophy className="h-5 w-5" />
              <span className="font-bold">New Personal Best!</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Congratulations! You've improved your resume score to {bestScore}/100
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
