import { supabase } from "@/integrations/supabase/supabaseClient";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2, Building2, Users, DollarSign, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface EmployerFormData {
  // Basic Info
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  timezone: string;
  
  // Company Info
  companyName: string;
  position: string;
  department: string;
  yearsExperience: string;
  companySize: string;
  industry: string;
  companyStage: string;
  
  // Hiring Info
  hiringNeeds: string[];
  budgetMin: string;
  budgetMax: string;
  currency: string;
  locations: string[];
  workModels: string[];
  
  // Links
  linkedinUrl: string;
  companyWebsite: string;
  bio: string;
}

interface EmployerSignUpFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const EmployerSignUpForm = ({ onSuccess, onBack }: EmployerSignUpFormProps) => {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EmployerFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    companyName: "",
    position: "",
    department: "",
    yearsExperience: "",
    companySize: "",
    industry: "",
    companyStage: "",
    hiringNeeds: [],
    budgetMin: "",
    budgetMax: "",
    currency: "USD",
    locations: [],
    workModels: [],
    linkedinUrl: "",
    companyWebsite: "",
    bio: ""
  });

  const [tempHiringNeed, setTempHiringNeed] = useState("");
  const [tempLocation, setTempLocation] = useState("");

  const companySizes = [
    { value: "startup", label: "Startup (1-10 employees)" },
    { value: "small", label: "Small (11-50 employees)" },
    { value: "medium", label: "Medium (51-200 employees)" },
    { value: "large", label: "Large (201-1000 employees)" },
    { value: "enterprise", label: "Enterprise (1000+ employees)" }
  ];

  const companyStages = [
    { value: "startup", label: "Startup" },
    { value: "growth", label: "Growth Stage" },
    { value: "established", label: "Established" },
    { value: "enterprise", label: "Enterprise" }
  ];

  const workModels = [
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
    { value: "onsite", label: "On-site" }
  ];

  const commonIndustries = [
    "Technology", "Healthcare", "Finance", "Education", "Retail",
    "Manufacturing", "Consulting", "Non-profit", "Government"
  ];

  const commonHiringNeeds = [
    "Software Engineers", "Product Managers", "Sales Representatives",
    "Marketing Specialists", "Data Analysts", "Designers", "DevOps Engineers"
  ];

  const handleInputChange = (field: keyof EmployerFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addToList = (field: 'hiringNeeds' | 'locations', tempValue: string, setTemp: (value: string) => void) => {
    if (tempValue.trim() && !formData[field].includes(tempValue.trim())) {
      handleInputChange(field, [...formData[field], tempValue.trim()]);
      setTemp("");
    }
  };

  const removeFromList = (field: 'hiringNeeds' | 'locations', value: string) => {
    handleInputChange(field, formData[field].filter(item => item !== value));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Create user account
      const { data: authData, error: authError } = await signUp(
        `${formData.firstName}.${formData.lastName}@example.com`,
        "tempPassword123",
        "employer"
      );

      if (authError) throw authError;

      // Create company first
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: formData.companyName,
          industry: formData.industry,
          company_size: formData.companySize,
          headquarters: formData.location,
          website_url: formData.companyWebsite,
          status: 'active'
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // Create employer profile
      const { error: profileError } = await supabase
        .from('employer_profiles')
        .insert({
          user_id: authData.user?.id,
          company_id: companyData.id,
          position: formData.position,
          department: formData.department,
          years_experience: parseInt(formData.yearsExperience) || null,
          company_size: formData.companySize,
          industry: formData.industry,
          company_stage: formData.companyStage,
          hiring_needs: formData.hiringNeeds,
          budget_range_min: parseInt(formData.budgetMin) || null,
          budget_range_max: parseInt(formData.budgetMax) || null,
          currency: formData.currency,
          locations: formData.locations,
          work_models: formData.workModels,
          linkedin_url: formData.linkedinUrl,
          bio: formData.bio
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
          role: 'employer'
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
                step <= currentStep ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Create Your Employer Profile</h2>
          <p className="text-gray-600 mt-2">
            Step {currentStep} of 3: {
              currentStep === 1 ? "Basic Information" :
              currentStep === 2 ? "Company Details" :
              "Hiring Needs & Preferences"
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
                      <Label htmlFor="position">Your Position *</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        placeholder="CEO, HR Director, etc."
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        placeholder="Human Resources"
                      />
                    </div>
                    <div>
                      <Label htmlFor="yearsExperience">Years of Experience</Label>
                      <Input
                        id="yearsExperience"
                        type="number"
                        value={formData.yearsExperience}
                        onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                        placeholder="5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div>
                      <Label htmlFor="companyStage">Company Stage *</Label>
                      <Select value={formData.companyStage} onValueChange={(value) => handleInputChange('companyStage', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company stage" />
                        </SelectTrigger>
                        <SelectContent>
                          {companyStages.map((stage) => (
                            <SelectItem key={stage.value} value={stage.value}>
                              {stage.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {commonIndustries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="companyWebsite">Company Website</Label>
                    <Input
                      id="companyWebsite"
                      type="url"
                      value={formData.companyWebsite}
                      onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label>Hiring Needs *</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={tempHiringNeed}
                        onChange={(e) => setTempHiringNeed(e.target.value)}
                        placeholder="Add a role you're hiring for"
                        onKeyPress={(e) => e.key === 'Enter' && addToList('hiringNeeds', tempHiringNeed, setTempHiringNeed)}
                      />
                      <Button
                        type="button"
                        onClick={() => addToList('hiringNeeds', tempHiringNeed, setTempHiringNeed)}
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.hiringNeeds.map((need) => (
                        <Badge key={need} variant="secondary" className="flex items-center gap-1">
                          {need}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeFromList('hiringNeeds', need)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {commonHiringNeeds.map((need) => (
                          <Button
                            key={need}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => addToList('hiringNeeds', need, setTempHiringNeed)}
                            disabled={formData.hiringNeeds.includes(need)}
                          >
                            {need}
                          </Button>
                        ))}
                      </div>
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
                    <Label>Work Models *</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {workModels.map((model) => (
                        <div key={model.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={model.value}
                            checked={formData.workModels.includes(model.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleInputChange('workModels', [...formData.workModels, model.value]);
                              } else {
                                handleInputChange('workModels', formData.workModels.filter(m => m !== model.value));
                              }
                            }}
                            className="rounded"
                          />
                          <Label htmlFor={model.value}>{model.label}</Label>
                        </div>
                      ))}
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
                      placeholder="Tell us about your company and hiring goals..."
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
                <Building2 className="h-5 w-5 text-green-600" />
                Employer Benefits
              </CardTitle>
              <CardDescription>
                What you'll get with your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-sm">Access to Talent Pool</p>
                    <p className="text-xs text-gray-600">Search through qualified candidates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-sm">Job Posting Tools</p>
                    <p className="text-xs text-gray-600">Create and manage job postings</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-sm">Company Branding</p>
                    <p className="text-xs text-gray-600">Showcase your company culture</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-sm">Analytics Dashboard</p>
                    <p className="text-xs text-gray-600">Track hiring performance</p>
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
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
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
