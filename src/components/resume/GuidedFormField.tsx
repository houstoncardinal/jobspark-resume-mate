import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  MapPin, 
  Building2, 
  GraduationCap, 
  Award,
  Briefcase,
  Code,
  Palette,
  Target,
  Users,
  Star,
  Lightbulb,
  HelpCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FieldConfig {
  label: string;
  type: 'text' | 'textarea' | 'date' | 'email' | 'phone' | 'url' | 'select' | 'multiselect' | 'array';
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  helpText?: string;
}

interface GuidedFormFieldProps {
  fieldKey: string;
  config: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  section: string;
  index?: number;
  onRemove?: () => void;
}

export const GuidedFormField: React.FC<GuidedFormFieldProps> = ({
  fieldKey,
  config,
  value,
  onChange,
  section,
  index,
  onRemove
}) => {
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  const validateField = (val: any): boolean => {
    if (config.required && (!val || (typeof val === 'string' && val.trim() === ''))) {
      setErrorMessage('This field is required');
      setIsValid(false);
      return false;
    }

    if (config.validation) {
      if (config.validation.min && typeof val === 'string' && val.length < config.validation.min) {
        setErrorMessage(`Minimum ${config.validation.min} characters required`);
        setIsValid(false);
        return false;
      }

      if (config.validation.max && typeof val === 'string' && val.length > config.validation.max) {
        setErrorMessage(`Maximum ${config.validation.max} characters allowed`);
        setIsValid(false);
        return false;
      }

      if (config.validation.pattern && typeof val === 'string') {
        const regex = new RegExp(config.validation.pattern);
        if (!regex.test(val)) {
          setErrorMessage('Invalid format');
          setIsValid(false);
          return false;
        }
      }
    }

    setErrorMessage('');
    setIsValid(true);
    return true;
  };

  const handleChange = (newValue: any) => {
    onChange(newValue);
    validateField(newValue);
  };

  const getFieldIcon = () => {
    const iconMap: { [key: string]: any } = {
      fullName: Users,
      email: '📧',
      phone: '📞',
      location: MapPin,
      linkedin: '💼',
      website: '🌐',
      github: Code,
      title: Briefcase,
      summary: Target,
      experience: Briefcase,
      education: GraduationCap,
      skills: Code,
      projects: Palette,
      awards: Award,
      certifications: Award
    };

    const icon = iconMap[fieldKey] || HelpCircle;
    return typeof icon === 'string' ? icon : icon;
  };

  const renderField = () => {
    const Icon = getFieldIcon();
    const isArrayField = config.type === 'array';
    const isMultiselect = config.type === 'multiselect';

    if (isArrayField) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              {typeof Icon === 'string' ? (
                <span className="text-lg">{Icon}</span>
              ) : (
                <Icon className="h-4 w-4" />
              )}
              {config.label}
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newItem = getDefaultArrayItem(section);
                onChange([...value, newItem]);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {section.slice(0, -1)}
            </Button>
          </div>
          
          {value && value.length > 0 ? (
            <div className="space-y-3">
              {value.map((item: any, idx: number) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-sm">
                      {section === 'experiences' ? item.position || `Experience ${idx + 1}` :
                       section === 'educations' ? item.degree || `Education ${idx + 1}` :
                       section === 'projects' ? item.name || `Project ${idx + 1}` :
                       section === 'awards' ? item.title || `Award ${idx + 1}` :
                       `${section.slice(0, -1)} ${idx + 1}`}
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newValue = value.filter((_: any, i: number) => i !== idx);
                        onChange(newValue);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {renderArrayItemFields(section, item, (newItem) => {
                    const newValue = [...value];
                    newValue[idx] = newItem;
                    onChange(newValue);
                  })}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📝</div>
              <p>No {section} added yet</p>
              <p className="text-sm">Click "Add {section.slice(0, -1)}" to get started</p>
            </div>
          )}
        </div>
      );
    }

    if (isMultiselect) {
      const selectedValues = value || [];
      
      return (
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            {typeof Icon === 'string' ? (
              <span className="text-lg">{Icon}</span>
            ) : (
              <Icon className="h-4 w-4" />
            )}
            {config.label}
          </Label>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {config.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${fieldKey}-${option}`}
                  checked={selectedValues.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleChange([...selectedValues, option]);
                    } else {
                      handleChange(selectedValues.filter((v: string) => v !== option));
                    }
                  }}
                />
                <Label
                  htmlFor={`${fieldKey}-${option}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
          
          {selectedValues.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedValues.map((val: string) => (
                <Badge key={val} variant="secondary" className="flex items-center gap-1">
                  {val}
                  <button
                    type="button"
                    onClick={() => {
                      handleChange(selectedValues.filter((v: string) => v !== val));
                    }}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          {typeof Icon === 'string' ? (
            <span className="text-lg">{Icon}</span>
          ) : (
            <Icon className="h-4 w-4" />
          )}
          {config.label}
          {config.required && <span className="text-red-500">*</span>}
        </Label>
        
        {config.type === 'textarea' ? (
          <Textarea
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={config.placeholder}
            className={`min-h-[100px] ${!isValid ? 'border-red-500' : ''}`}
          />
        ) : config.type === 'select' ? (
          <Select value={value || ''} onValueChange={handleChange}>
            <SelectTrigger className={!isValid ? 'border-red-500' : ''}>
              <SelectValue placeholder={config.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {config.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            type={config.type === 'date' ? 'date' : 
                  config.type === 'email' ? 'email' : 
                  config.type === 'url' ? 'url' : 
                  config.type === 'phone' ? 'tel' : 'text'}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={config.placeholder}
            className={!isValid ? 'border-red-500' : ''}
          />
        )}
        
        {config.helpText && (
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Lightbulb className="h-3 w-3" />
            {config.helpText}
          </p>
        )}
        
        {!isValid && errorMessage && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errorMessage}
          </p>
        )}
      </div>
    );
  };

  const getDefaultArrayItem = (section: string) => {
    switch (section) {
      case 'experiences':
        return {
          position: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
          achievements: []
        };
      case 'educations':
        return {
          degree: '',
          institution: '',
          location: '',
          graduationDate: '',
          gpa: '',
          relevantCoursework: []
        };
      case 'projects':
        return {
          name: '',
          description: '',
          technologies: [],
          url: '',
          startDate: '',
          endDate: '',
          current: false
        };
      case 'awards':
        return {
          title: '',
          organization: '',
          date: '',
          description: ''
        };
      default:
        return {};
    }
  };

  const renderArrayItemFields = (section: string, item: any, onChange: (item: any) => void) => {
    switch (section) {
      case 'experiences':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-medium">Job Title *</Label>
              <Input
                value={item.position || ''}
                onChange={(e) => onChange({ ...item, position: e.target.value })}
                placeholder="e.g., Software Engineer"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Company *</Label>
              <Input
                value={item.company || ''}
                onChange={(e) => onChange({ ...item, company: e.target.value })}
                placeholder="e.g., Google"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Location</Label>
              <Input
                value={item.location || ''}
                onChange={(e) => onChange({ ...item, location: e.target.value })}
                placeholder="e.g., San Francisco, CA"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Employment Type</Label>
              <Select value={item.employmentType || ''} onValueChange={(val) => onChange({ ...item, employmentType: val })}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-medium">Start Date *</Label>
              <Input
                type="month"
                value={item.startDate || ''}
                onChange={(e) => onChange({ ...item, startDate: e.target.value })}
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">End Date</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="month"
                  value={item.endDate || ''}
                  onChange={(e) => onChange({ ...item, endDate: e.target.value })}
                  className="text-sm"
                  disabled={item.current}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`current-${index}`}
                    checked={item.current || false}
                    onCheckedChange={(checked) => onChange({ ...item, current: checked, endDate: checked ? '' : item.endDate })}
                  />
                  <Label htmlFor={`current-${index}`} className="text-xs">Current</Label>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs font-medium">Description *</Label>
              <Textarea
                value={item.description || ''}
                onChange={(e) => onChange({ ...item, description: e.target.value })}
                placeholder="Describe your key responsibilities and achievements..."
                className="text-sm min-h-[80px]"
              />
            </div>
          </div>
        );
      
      case 'educations':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-medium">Degree *</Label>
              <Input
                value={item.degree || ''}
                onChange={(e) => onChange({ ...item, degree: e.target.value })}
                placeholder="e.g., Bachelor of Science in Computer Science"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Institution *</Label>
              <Input
                value={item.institution || ''}
                onChange={(e) => onChange({ ...item, institution: e.target.value })}
                placeholder="e.g., Stanford University"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Location</Label>
              <Input
                value={item.location || ''}
                onChange={(e) => onChange({ ...item, location: e.target.value })}
                placeholder="e.g., Stanford, CA"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Graduation Date</Label>
              <Input
                type="month"
                value={item.graduationDate || ''}
                onChange={(e) => onChange({ ...item, graduationDate: e.target.value })}
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">GPA (Optional)</Label>
              <Input
                value={item.gpa || ''}
                onChange={(e) => onChange({ ...item, gpa: e.target.value })}
                placeholder="e.g., 3.8/4.0"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Relevant Coursework</Label>
              <Input
                value={item.relevantCoursework?.join(', ') || ''}
                onChange={(e) => onChange({ ...item, relevantCoursework: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                placeholder="e.g., Data Structures, Algorithms, Machine Learning"
                className="text-sm"
              />
            </div>
          </div>
        );
      
      case 'projects':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium">Project Name *</Label>
                <Input
                  value={item.name || ''}
                  onChange={(e) => onChange({ ...item, name: e.target.value })}
                  placeholder="e.g., E-commerce Platform"
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-medium">Project URL</Label>
                <Input
                  value={item.url || ''}
                  onChange={(e) => onChange({ ...item, url: e.target.value })}
                  placeholder="https://project-url.com"
                  className="text-sm"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium">Description *</Label>
              <Textarea
                value={item.description || ''}
                onChange={(e) => onChange({ ...item, description: e.target.value })}
                placeholder="Describe what the project does and your role..."
                className="text-sm min-h-[80px]"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Technologies Used</Label>
              <Input
                value={item.technologies?.join(', ') || ''}
                onChange={(e) => onChange({ ...item, technologies: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                placeholder="e.g., React, Node.js, MongoDB"
                className="text-sm"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium">Start Date</Label>
                <Input
                  type="month"
                  value={item.startDate || ''}
                  onChange={(e) => onChange({ ...item, startDate: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-medium">End Date</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="month"
                    value={item.endDate || ''}
                    onChange={(e) => onChange({ ...item, endDate: e.target.value })}
                    className="text-sm"
                    disabled={item.current}
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`project-current-${index}`}
                      checked={item.current || false}
                      onCheckedChange={(checked) => onChange({ ...item, current: checked, endDate: checked ? '' : item.endDate })}
                    />
                    <Label htmlFor={`project-current-${index}`} className="text-xs">Ongoing</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'awards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-medium">Award Title *</Label>
              <Input
                value={item.title || ''}
                onChange={(e) => onChange({ ...item, title: e.target.value })}
                placeholder="e.g., Employee of the Year"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Organization</Label>
              <Input
                value={item.organization || ''}
                onChange={(e) => onChange({ ...item, organization: e.target.value })}
                placeholder="e.g., Company Name"
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Date</Label>
              <Input
                type="month"
                value={item.date || ''}
                onChange={(e) => onChange({ ...item, date: e.target.value })}
                className="text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs font-medium">Description</Label>
              <Textarea
                value={item.description || ''}
                onChange={(e) => onChange({ ...item, description: e.target.value })}
                placeholder="Brief description of the award..."
                className="text-sm min-h-[60px]"
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {renderField()}
    </div>
  );
};
