import { supabase } from "@/integrations/supabase/supabaseClient";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2, Users, Building2, DollarSign, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface RecruiterFormData {
  // Basic Info
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  timezone: string;
  
  // Professional Info
  currentTitle: string;
  department: string;
  yearsExperience: string;
  companyName: string;
  companySize: string;
  teamSize: string;
  hiringVolume: string;
  
  // Specializations
  specializations: string[];
  industries: string[];
  jobLevels: string[];
  locations: string[];
  
  // Budget
  budgetMin: string;
  budgetMax: string;
  currency: string;
  
  // Links
  linkedinUrl: string;
  bio: string;
  achievements: string[];
  certifications: string[];
}

interface RecruiterSignUpFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const RecruiterSignUpForm = ({ onSuccess, onBack }: RecruiterSignUpFormProps) => {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RecruiterFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    currentTitle: "",
    department: "",
    yearsExperience: "",
    companyName: "",
    companySize: "",
    teamSize: "",
    hiringVolume: "",
    specializations: [],
    industries: [],
    jobLevels: [],
    locations: [],
    budgetMin: "",
    budgetMax: "",
    currency: "USD",
    linkedinUrl: "",
    bio: "",
    achievements: [],
    certifications: []
  });

  const [tempSpecialization, setTempSpecialization] = useState("");
  const [tempAchievement, setTempAchievement] = useState("");
  const [tempCertification, setTempCertification] = useState("");

  const companySizes = [
    { value: "startup", label: "Startup (1-10 employees)" },
    { value: "small", label: "Small (11-50 employees)" },
    { value: "medium", label: "Medium (51-200 employees)" },
    { value: "large", label: "Large (201-1000 employees)" },
    { value: "enterprise", label: "Enterprise (1000+ employees)" }
  ];

  const jobLevels = [
    { value: "entry", label: "Entry Level" },
    { value: "mid", label: "Mid Level" },
    { value: "senior", label: "Senior Level" },
    { value: "executive", label: "Executive" }
  ];

  const commonSpecializations = [
    "Technical Recruiting", "Executive Search", "Healthcare", "Finance",
    "Sales", "Marketing", "Engineering", "Product Management"
  ];

  const commonIndustries = [
    "Technology", "Healthcare", "Finance", "Education", "Retail",
    "Manufacturing", "Consulting", "Non-profit", "Government"
  ];

  const handleInputChange = (field: keyof RecruiterFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addToList = (field: 'specializations' | 'achievements' | 'certifications', tempValue: string, setTemp: (value: string) => void) => {
    if (tempValue.trim() && !formData[field].includes(tempValue.trim())) {
      handleInputChange(field, [...formData[field], tempValue.trim()]);
      setTemp("");
    }
  };

  const removeFromList = (field: 'specializations' | 'achievements' | 'certifications', value: string) => {
    handleInputChange(field, formData[field].filter(item => item !== value));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Create user account
      const { data: authData, error: authError } = await signUp(
        `${formData.firstName}.${formData.lastName}@example.com`,
        "tempPassword123",
        "recruiter"
      );

      if (authError) throw authError;

      // Create recruiter profile
      const { error: profileError } = await supabase
        .from('recruiter_profiles')
        .insert({
          user_id: authData.user?.id,
          current_title: formData.currentTitle,
          department: formData.department,
          years_experience: parseInt(formData.yearsExperience) || null,
          specializations: formData.specializations,
          industries: formData.industries,
          job_levels: formData.jobLevels,
          locations: formData.locations,
          budget_range_min: parseInt(formData.budgetMin) || null,
          budget_range_max: parseInt(formData.budgetMax) || null,
          currency: formData.currency,
          hiring_volume: parseInt(formData.hiringVolume) || null,
          team_size: parseInt(formData.teamSize) || null,
          linkedin_url: formData.linkedinUrl,
          bio: formData.bio,
          achievements: formData.achievements,
          certifications: formData.certifications
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
          role: 'recruiter'
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

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? 'bg-purple-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Create Your Recruiter Profile</h2>
          <p className="text-gray-600 mt-2">
            Step {currentStep} of 3: {
              currentStep === 1 ? "Basic Information" :
              currentStep === 2 ? "Professional Details" :
              "Specializations & Experience"
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
                      <Label htmlFor="currentTitle">Current Title *</Label>
                      <Input
                        id="currentTitle"
                        value={formData.currentTitle}
                        onChange={(e) => handleInputChange('currentTitle', e.target.value)}
                        placeholder="Senior Recruiter"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        placeholder="Human Resources"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="Tech Solutions Inc."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="companySize">Company Size *</Label>
                      <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          {companySizes.map((size) => (
                            <SelectItem key={size.value} value={size.value}>
                              {size.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="yearsExperience">Years of Experience *</Label>
                      <Input
                        id="yearsExperience"
                        type="number"
                        value={formData.yearsExperience}
                        onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                        placeholder="5"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="teamSize">Team Size</Label>
                      <Input
                        id="teamSize"
                        type="number"
                        value={formData.teamSize}
                        onChange={(e) => handleInputChange('teamSize', e.target.value)}
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hiringVolume">Monthly Hires</Label>
                      <Input
                        id="hiringVolume"
                        type="number"
                        value={formData.hiringVolume}
                        onChange={(e) => handleInputChange('hiringVolume', e.target.value)}
                        placeholder="5"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label>Specializations *</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={tempSpecialization}
                        onChange={(e) => setTempSpecialization(e.target.value)}
                        placeholder="Add a specialization"
                        onKeyPress={(e) => e.key === 'Enter' && addToList('specializations', tempSpecialization, setTempSpecialization)}
                      />
                      <Button
                        type="button"
                        onClick={() => addToList('specializations', tempSpecialization, setTempSpecialization)}
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.specializations.map((spec) => (
                        <Badge key={spec} variant="secondary" className="flex items-center gap-1">
                          {spec}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeFromList('specializations', spec)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {commonSpecializations.map((spec) => (
                          <Button
                            key={spec}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => addToList('specializations', spec, setTempSpecialization)}
                            disabled={formData.specializations.includes(spec)}
                          >
                            {spec}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Industries *</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={tempSpecialization}
                        onChange={(e) => setTempSpecialization(e.target.value)}
                        placeholder="Add an industry"
                        onKeyPress={(e) => e.key === 'Enter' && addToList('industries', tempSpecialization, setTempSpecialization)}
                      />
                      <Button
                        type="button"
                        onClick={() => addToList('industries', tempSpecialization, setTempSpecialization)}
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
                            onClick={() => addToList('industries', industry, setTempSpecialization)}
                            disabled={formData.industries.includes(industry)}
                          >
                            {industry}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Job Levels You Recruit For *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {jobLevels.map((level) => (
                        <div key={level.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={level.value}
                            checked={formData.jobLevels.includes(level.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleInputChange('jobLevels', [...formData.jobLevels, level.value]);
                              } else {
                                handleInputChange('jobLevels', formData.jobLevels.filter(l => l !== level.value));
                              }
                            }}
                            className="rounded"
                          />
                          <Label htmlFor={level.value}>{level.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="budgetMin">Budget Range (Min)</Label>
                      <Input
                        id="budgetMin"
                        type="number"
                        value={formData.budgetMin}
                        onChange={(e) => handleInputChange('budgetMin', e.target.value)}
                        placeholder="50000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="budgetMax">Budget Range (Max)</Label>
                      <Input
                        id="budgetMax"
                        type="number"
                        value={formData.budgetMax}
                        onChange={(e) => handleInputChange('budgetMax', e.target.value)}
                        placeholder="150000"
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
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about your recruiting experience and expertise..."
                      rows={4}
                    />
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
                
                {currentStep < 3 ? (
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
                <Users className="h-5 w-5 text-purple-600" />
                Recruiter Benefits
              </CardTitle>
              <CardDescription>
                What you'll get with your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-sm">Access to Candidate Database</p>
                    <p className="text-xs text-gray-600">Search through thousands of profiles</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-sm">AI-Powered Matching</p>
                    <p className="text-xs text-gray-600">Find the best candidates automatically</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-sm">Job Posting Tools</p>
                    <p className="text-xs text-gray-600">Create and manage job postings</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-sm">Analytics Dashboard</p>
                    <p className="text-xs text-gray-600">Track your hiring performance</p>
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
                  <span>Step {currentStep} of 3</span>
                  <span>{Math.round((currentStep / 3) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
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
