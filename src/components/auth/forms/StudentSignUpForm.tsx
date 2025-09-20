import { supabase } from "@/integrations/supabase/supabaseClient";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2, GraduationCap, BookOpen, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface StudentFormData {
  // Basic Info
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  timezone: string;
  
  // Academic Info
  university: string;
  degreeProgram: string;
  graduationYear: string;
  gpa: string;
  major: string;
  minor: string;
  expectedGraduation: string;
  
  // Career Info
  careerGoals: string;
  interests: string[];
  skills: string[];
  projects: string[];
  internships: string[];
  volunteerWork: string[];
  extracurriculars: string[];
  
  // Links
  portfolioUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  resumeUrl: string;
  bio: string;
}

interface StudentSignUpFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const StudentSignUpForm = ({ onSuccess, onBack }: StudentSignUpFormProps) => {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    location: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    university: "",
    degreeProgram: "",
    graduationYear: "",
    gpa: "",
    major: "",
    minor: "",
    expectedGraduation: "",
    careerGoals: "",
    interests: [],
    skills: [],
    projects: [],
    internships: [],
    volunteerWork: [],
    extracurriculars: [],
    portfolioUrl: "",
    linkedinUrl: "",
    githubUrl: "",
    resumeUrl: "",
    bio: ""
  });

  const [tempInterest, setTempInterest] = useState("");
  const [tempSkill, setTempSkill] = useState("");
  const [tempProject, setTempProject] = useState("");

  const degreePrograms = [
    { value: "bachelor", label: "Bachelor's Degree" },
    { value: "master", label: "Master's Degree" },
    { value: "phd", label: "PhD" },
    { value: "associate", label: "Associate Degree" },
    { value: "certificate", label: "Certificate Program" }
  ];

  const commonInterests = [
    "Software Development", "Data Science", "Design", "Marketing",
    "Business", "Healthcare", "Education", "Non-profit"
  ];

  const commonSkills = [
    "JavaScript", "Python", "React", "Node.js", "SQL", "AWS", "Docker",
    "Project Management", "Sales", "Marketing", "Design", "Data Analysis"
  ];

  const handleInputChange = (field: keyof StudentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addToList = (field: 'interests' | 'skills' | 'projects', tempValue: string, setTemp: (value: string) => void) => {
    if (tempValue.trim() && !formData[field].includes(tempValue.trim())) {
      handleInputChange(field, [...formData[field], tempValue.trim()]);
      setTemp("");
    }
  };

  const removeFromList = (field: 'interests' | 'skills' | 'projects', value: string) => {
    handleInputChange(field, formData[field].filter(item => item !== value));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Create user account
      const { data: authData, error: authError } = await signUp(
        `${formData.firstName}.${formData.lastName}@example.com`,
        "tempPassword123",
        "student"
      );

      if (authError) throw authError;

      // Create student profile
      const { error: profileError } = await supabase
        .from('student_profiles')
        .insert({
          user_id: authData.user?.id,
          university: formData.university,
          degree_program: formData.degreeProgram,
          graduation_year: parseInt(formData.graduationYear) || null,
          gpa: parseFloat(formData.gpa) || null,
          major: formData.major,
          minor: formData.minor,
          expected_graduation: formData.expectedGraduation || null,
          career_goals: formData.careerGoals,
          interests: formData.interests,
          skills: formData.skills,
          projects: formData.projects,
          internships: formData.internships,
          volunteer_work: formData.volunteerWork,
          extracurriculars: formData.extracurriculars,
          portfolio_url: formData.portfolioUrl,
          linkedin_url: formData.linkedinUrl,
          github_url: formData.githubUrl,
          resume_url: formData.resumeUrl,
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
          role: 'student'
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
                step <= currentStep ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? 'bg-orange-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Create Your Student Profile</h2>
          <p className="text-gray-600 mt-2">
            Step {currentStep} of 3: {
              currentStep === 1 ? "Basic Information" :
              currentStep === 2 ? "Academic Details" :
              "Career Goals & Experience"
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
                      <Label htmlFor="university">University *</Label>
                      <Input
                        id="university"
                        value={formData.university}
                        onChange={(e) => handleInputChange('university', e.target.value)}
                        placeholder="Stanford University"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="degreeProgram">Degree Program *</Label>
                      <Select value={formData.degreeProgram} onValueChange={(value) => handleInputChange('degreeProgram', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select degree program" />
                        </SelectTrigger>
                        <SelectContent>
                          {degreePrograms.map((program) => (
                            <SelectItem key={program.value} value={program.value}>
                              {program.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="major">Major *</Label>
                      <Input
                        id="major"
                        value={formData.major}
                        onChange={(e) => handleInputChange('major', e.target.value)}
                        placeholder="Computer Science"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="minor">Minor</Label>
                      <Input
                        id="minor"
                        value={formData.minor}
                        onChange={(e) => handleInputChange('minor', e.target.value)}
                        placeholder="Business Administration"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="graduationYear">Graduation Year</Label>
                      <Input
                        id="graduationYear"
                        type="number"
                        value={formData.graduationYear}
                        onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                        placeholder="2024"
                        min="2020"
                        max="2030"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gpa">GPA</Label>
                      <Input
                        id="gpa"
                        type="number"
                        step="0.01"
                        min="0"
                        max="4"
                        value={formData.gpa}
                        onChange={(e) => handleInputChange('gpa', e.target.value)}
                        placeholder="3.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expectedGraduation">Expected Graduation</Label>
                      <Input
                        id="expectedGraduation"
                        type="date"
                        value={formData.expectedGraduation}
                        onChange={(e) => handleInputChange('expectedGraduation', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="careerGoals">Career Goals</Label>
                    <Textarea
                      id="careerGoals"
                      value={formData.careerGoals}
                      onChange={(e) => handleInputChange('careerGoals', e.target.value)}
                      placeholder="What are your career aspirations and goals?"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Interests *</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={tempInterest}
                        onChange={(e) => setTempInterest(e.target.value)}
                        placeholder="Add an interest"
                        onKeyPress={(e) => e.key === 'Enter' && addToList('interests', tempInterest, setTempInterest)}
                      />
                      <Button
                        type="button"
                        onClick={() => addToList('interests', tempInterest, setTempInterest)}
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.map((interest) => (
                        <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                          {interest}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeFromList('interests', interest)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {commonInterests.map((interest) => (
                          <Button
                            key={interest}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => addToList('interests', interest, setTempInterest)}
                            disabled={formData.interests.includes(interest)}
                          >
                            {interest}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

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
                      <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                      <Input
                        id="portfolioUrl"
                        type="url"
                        value={formData.portfolioUrl}
                        onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                        placeholder="https://yourname.portfolio.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="resumeUrl">Resume URL</Label>
                      <Input
                        id="resumeUrl"
                        type="url"
                        value={formData.resumeUrl}
                        onChange={(e) => handleInputChange('resumeUrl', e.target.value)}
                        placeholder="https://yourname.com/resume.pdf"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself, your studies, and what you're looking for..."
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
                <GraduationCap className="h-5 w-5 text-orange-600" />
                Student Benefits
              </CardTitle>
              <CardDescription>
                What you'll get with your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-sm">Internship Opportunities</p>
                    <p className="text-xs text-gray-600">Find internships and entry-level jobs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-sm">Career Resources</p>
                    <p className="text-xs text-gray-600">Resume tips and interview prep</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-sm">Mentorship Network</p>
                    <p className="text-xs text-gray-600">Connect with industry professionals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-sm">Project Showcase</p>
                    <p className="text-xs text-gray-600">Highlight your academic projects</p>
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
                    className="bg-orange-600 h-2 rounded-full transition-all duration-300"
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
