import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2, Briefcase, MapPin, DollarSign, Calendar, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/supabaseClient";

interface JobSeekerFormData {
  // Basic Info
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  timezone: string;
  
  // Professional Info
  currentTitle: string;
  desiredTitle: string;
  experienceLevel: string;
  salaryMin: string;
  salaryMax: string;
  currency: string;
  availability: string;
  workPreference: string;
  willingToRelocate: boolean;
  
  // Skills & Interests
  skills: string[];
  industries: string[];
  jobTypes: string[];
  
  // Links
  linkedinUrl: string;
  githubUrl: string;
  websiteUrl: string;
  portfolioUrl: string;
  
  // Additional
  bio: string;
  achievements: string[];
  certifications: string[];
  languages: string[];
}

interface JobSeekerSignUpFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const JobSeekerSignUpForm = ({ onSuccess, onBack }: JobSeekerSignUpFormProps) => {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<JobSeekerFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    currentTitle: "",
    desiredTitle: "",
    experienceLevel: "",
    salaryMin: "",
    salaryMax: "",
    currency: "USD",
    availability: "",
    workPreference: "",
    willingToRelocate: false,
    skills: [],
    industries: [],
    jobTypes: [],
    linkedinUrl: "",
    githubUrl: "",
    websiteUrl: "",
    portfolioUrl: "",
    bio: "",
    achievements: [],
    certifications: [],
    languages: []
  });

  const [tempSkill, setTempSkill] = useState("");
  const [tempAchievement, setTempAchievement] = useState("");
  const [tempCertification, setTempCertification] = useState("");
  const [tempLanguage, setTempLanguage] = useState("");

  const experienceLevels = [
    { value: "entry", label: "Entry Level (0-2 years)" },
    { value: "mid", label: "Mid Level (3-5 years)" },
    { value: "senior", label: "Senior Level (6-10 years)" },
    { value: "executive", label: "Executive (10+ years)" }
  ];

  const workPreferences = [
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
    { value: "onsite", label: "On-site" }
  ];

  const availabilityOptions = [
    { value: "immediate", label: "Immediately" },
    { value: "2weeks", label: "2 weeks notice" },
    { value: "1month", label: "1 month notice" },
    { value: "flexible", label: "Flexible" }
  ];

  const jobTypes = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" }
  ];

  const commonSkills = [
    "JavaScript", "Python", "React", "Node.js", "SQL", "AWS", "Docker",
    "Project Management", "Sales", "Marketing", "Design", "Data Analysis"
  ];

  const commonIndustries = [
    "Technology", "Healthcare", "Finance", "Education", "Retail",
    "Manufacturing", "Consulting", "Non-profit", "Government"
  ];

  const handleInputChange = (field: keyof JobSeekerFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addToList = (field: 'skills' | 'achievements' | 'certifications' | 'languages', tempValue: string, setTemp: (value: string) => void) => {
    if (tempValue.trim() && !formData[field].includes(tempValue.trim())) {
      handleInputChange(field, [...formData[field], tempValue.trim()]);
      setTemp("");
    }
  };

  const removeFromList = (field: 'skills' | 'achievements' | 'certifications' | 'languages', value: string) => {
    handleInputChange(field, formData[field].filter(item => item !== value));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Create user account
      const { data: authData, error: authError } = await signUp(
        `${formData.firstName}.${formData.lastName}@example.com`, // This will be replaced with actual email
        "tempPassword123", // This will be replaced with actual password
        "job_seeker"
      );

      if (authError) throw authError;

      // Create job seeker profile
      const { error: profileError } = await supabase
        .from('job_seeker_profiles')
        .insert({
          user_id: authData.user?.id,
          current_title: formData.currentTitle,
          desired_title: formData.desiredTitle,
          experience_level: formData.experienceLevel,
          salary_expectation_min: parseInt(formData.salaryMin) || null,
          salary_expectation_max: parseInt(formData.salaryMax) || null,
          currency: formData.currency,
          availability: formData.availability,
          work_preference: formData.workPreference,
          willing_to_relocate: formData.willingToRelocate,
          skills: formData.skills,
          industries: formData.industries,
          job_types: formData.jobTypes,
          linkedin_url: formData.linkedinUrl,
          github_url: formData.githubUrl,
          website_url: formData.websiteUrl,
          portfolio_url: formData.portfolioUrl,
          bio: formData.bio,
          achievements: formData.achievements,
          certifications: formData.certifications,
          languages: formData.languages
        });

      if (profileError) throw profileError;

      // Update main profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          location: formData.location,
          timezone: formData.timezone,
          role: 'job_seeker'
        })
        .eq('id', authData.user?.id);

      if (updateError) throw updateError;

      toast({
        title: "Account Created!",
        description: "Welcome to Gigm8! Please check your email to verify your account.",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Create Your Job Seeker Profile</h2>
          <p className="text-gray-600 mt-2">
            Step {currentStep} of 4: {
              currentStep === 1 ? "Basic Information" :
              currentStep === 2 ? "Professional Details" :
              currentStep === 3 ? "Skills & Experience" :
              "Links & Additional Info"
            }
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="San Francisco, CA"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currentTitle">Current Job Title</Label>
                      <Input
                        id="currentTitle"
                        value={formData.currentTitle}
                        onChange={(e) => handleInputChange('currentTitle', e.target.value)}
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div>
                      <Label htmlFor="desiredTitle">Desired Job Title *</Label>
                      <Input
                        id="desiredTitle"
                        value={formData.desiredTitle}
                        onChange={(e) => handleInputChange('desiredTitle', e.target.value)}
                        placeholder="Senior Software Engineer"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experienceLevel">Experience Level *</Label>
                      <Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="workPreference">Work Preference *</Label>
                      <Select value={formData.workPreference} onValueChange={(value) => handleInputChange('workPreference', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select work preference" />
                        </SelectTrigger>
                        <SelectContent>
                          {workPreferences.map((pref) => (
                            <SelectItem key={pref.value} value={pref.value}>
                              {pref.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="salaryMin">Salary Range (Min)</Label>
                      <Input
                        id="salaryMin"
                        type="number"
                        value={formData.salaryMin}
                        onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                        placeholder="50000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="salaryMax">Salary Range (Max)</Label>
                      <Input
                        id="salaryMax"
                        type="number"
                        value={formData.salaryMax}
                        onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                        placeholder="80000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="availability">Availability *</Label>
                    <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="When can you start?" />
                      </SelectTrigger>
                      <SelectContent>
                        {availabilityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="willingToRelocate"
                      checked={formData.willingToRelocate}
                      onChange={(e) => handleInputChange('willingToRelocate', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="willingToRelocate">Willing to relocate</Label>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label>Skills *</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={tempSkill}
                        onChange={(e) => setTempSkill(e.target.value)}
                        placeholder="Add a skill"
                        onKeyPress={(e) => e.key === 'Enter' && addToList('skills', tempSkill, setTempSkill)}
                      />
                      <Button
                        type="button"
                        onClick={() => addToList('skills', tempSkill, setTempSkill)}
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeFromList('skills', skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-2">Common skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {commonSkills.map((skill) => (
                          <Button
                            key={skill}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => addToList('skills', skill, setTempSkill)}
                            disabled={formData.skills.includes(skill)}
                          >
                            {skill}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Industries of Interest *</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={tempSkill}
                        onChange={(e) => setTempSkill(e.target.value)}
                        placeholder="Add an industry"
                        onKeyPress={(e) => e.key === 'Enter' && addToList('industries', tempSkill, setTempSkill)}
                      />
                      <Button
                        type="button"
                        onClick={() => addToList('industries', tempSkill, setTempSkill)}
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.industries.map((industry) => (
                        <Badge key={industry} variant="secondary" className="flex items-center gap-1">
                          {industry}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeFromList('industries', industry)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {commonIndustries.map((industry) => (
                          <Button
                            key={industry}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => addToList('industries', industry, setTempSkill)}
                            disabled={formData.industries.includes(industry)}
                          >
                            {industry}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Job Types *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {jobTypes.map((type) => (
                        <div key={type.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={type.value}
                            checked={formData.jobTypes.includes(type.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleInputChange('jobTypes', [...formData.jobTypes, type.value]);
                              } else {
                                handleInputChange('jobTypes', formData.jobTypes.filter(t => t !== type.value));
                              }
                            }}
                            className="rounded"
                          />
                          <Label htmlFor={type.value}>{type.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                      <Input
                        id="linkedinUrl"
                        type="url"
                        value={formData.linkedinUrl}
                        onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                        placeholder="https://linkedin.com/in/yourname"
                      />
                    </div>
                    <div>
                      <Label htmlFor="githubUrl">GitHub URL</Label>
                      <Input
                        id="githubUrl"
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                        placeholder="https://github.com/yourname"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="websiteUrl">Personal Website</Label>
                      <Input
                        id="websiteUrl"
                        type="url"
                        value={formData.websiteUrl}
                        onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                        placeholder="https://yourname.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                      <Input
                        id="portfolioUrl"
                        type="url"
                        value={formData.portfolioUrl}
                        onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                        placeholder="https://yourname.portfolio.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself, your experience, and what you're looking for..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label>Achievements</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={tempAchievement}
                        onChange={(e) => setTempAchievement(e.target.value)}
                        placeholder="Add an achievement"
                        onKeyPress={(e) => e.key === 'Enter' && addToList('achievements', tempAchievement, setTempAchievement)}
                      />
                      <Button
                        type="button"
                        onClick={() => addToList('achievements', tempAchievement, setTempAchievement)}
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.achievements.map((achievement) => (
                        <Badge key={achievement} variant="secondary" className="flex items-center gap-1">
                          {achievement}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeFromList('achievements', achievement)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={currentStep === 1 ? onBack : prevStep}
                >
                  {currentStep === 1 ? "Back" : "Previous"}
                </Button>
                
                {currentStep < 4 ? (
                  <Button onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Job Seeker Benefits
              </CardTitle>
              <CardDescription>
                What you'll get with your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-sm">AI-Powered Job Matching</p>
                    <p className="text-xs text-gray-600">Get personalized job recommendations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-sm">Resume Optimization</p>
                    <p className="text-xs text-gray-600">AI tools to improve your resume</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-sm">Application Tracking</p>
                    <p className="text-xs text-gray-600">Track all your job applications</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-sm">Salary Insights</p>
                    <p className="text-xs text-gray-600">Know your worth in the market</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Step {currentStep} of 4</span>
                  <span>{Math.round((currentStep / 4) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
