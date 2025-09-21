import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface JobSeekerSignUpFormProps {
  onSignUpSuccess: () => void;
  onSignUpError: (error: string) => void;
}

export const JobSeekerSignUpForm = ({ 
  onSignUpSuccess,
  onSignUpError
}: JobSeekerSignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    location: '',
    experience_level: 'mid',
    skills: '',
    education: '',
    linkedin_url: '',
    portfolio_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signUp(email, password, 'job_seeker');
      onSignUpSuccess();
    } catch (error: any) {
      onSignUpError(error.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="password">Password *</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="experience_level">Experience Level</Label>
        <select
          id="experience_level"
          value={formData.experience_level}
          onChange={(e) => setFormData({...formData, experience_level: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="entry">Entry Level</option>
          <option value="mid">Mid Level</option>
          <option value="senior">Senior Level</option>
          <option value="executive">Executive</option>
        </select>
      </div>

      <div>
        <Label htmlFor="skills">Skills (comma separated)</Label>
        <Input
          id="skills"
          value={formData.skills}
          onChange={(e) => setFormData({...formData, skills: e.target.value})}
          placeholder="JavaScript, React, Node.js"
        />
      </div>

      <div>
        <Label htmlFor="education">Education</Label>
        <Input
          id="education"
          value={formData.education}
          onChange={(e) => setFormData({...formData, education: e.target.value})}
          placeholder="Bachelor's in Computer Science"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="linkedin_url">LinkedIn URL</Label>
          <Input
            id="linkedin_url"
            value={formData.linkedin_url}
            onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
            placeholder="https://linkedin.com/in/yourname"
          />
        </div>
        <div>
          <Label htmlFor="portfolio_url">Portfolio URL</Label>
          <Input
            id="portfolio_url"
            value={formData.portfolio_url}
            onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})}
            placeholder="https://yourportfolio.com"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : null}
        Create Job Seeker Account
      </Button>
    </form>
  );
};
