import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface StudentSignUpFormProps {
  onSignUpSuccess: () => void;
  onSignUpError: (error: string) => void;
}

export const StudentSignUpForm = ({ 
  onSignUpSuccess,
  onSignUpError
}: StudentSignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    university: '',
    major: '',
    graduation_year: '',
    phone: '',
    location: '',
    linkedin_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signUp(email, password, 'student');
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
          <Label htmlFor="university">University *</Label>
          <Input
            id="university"
            value={formData.university}
            onChange={(e) => setFormData({...formData, university: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="major">Major *</Label>
          <Input
            id="major"
            value={formData.major}
            onChange={(e) => setFormData({...formData, major: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="graduation_year">Graduation Year</Label>
          <Input
            id="graduation_year"
            type="number"
            value={formData.graduation_year}
            onChange={(e) => setFormData({...formData, graduation_year: e.target.value})}
            placeholder="2024"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
        />
      </div>

      <div>
        <Label htmlFor="linkedin_url">LinkedIn URL</Label>
        <Input
          id="linkedin_url"
          value={formData.linkedin_url}
          onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
          placeholder="https://linkedin.com/in/yourname"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-orange-600 hover:bg-orange-700"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : null}
        Create Student Account
      </Button>
    </form>
  );
};
