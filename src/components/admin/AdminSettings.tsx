import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Shield, 
  Mail, 
  Globe, 
  Database, 
  FileText, 
  Users, 
  Briefcase, 
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/supabaseClient";

interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description: string;
  updated_at: string;
}

export const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('key');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load system settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({ 
          value: typeof value === 'string' ? value : JSON.stringify(value),
          updated_at: new Date().toISOString()
        })
        .eq('key', key);

      if (error) throw error;

      // Update local state
      setSettings(prev => prev.map(setting => 
        setting.key === key 
          ? { ...setting, value: typeof value === 'string' ? value : JSON.stringify(value) }
          : setting
      ));

      toast({
        title: "Success",
        description: "Setting updated successfully.",
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getSettingValue = (key: string) => {
    const setting = settings.find(s => s.key === key);
    if (!setting) return '';
    
    try {
      return JSON.parse(setting.value);
    } catch {
      return setting.value;
    }
  };

  const isSecretKey = (key: string) => {
    return key.toLowerCase().includes('key') || 
           key.toLowerCase().includes('secret') || 
           key.toLowerCase().includes('password') ||
           key.toLowerCase().includes('token');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
          <p className="text-gray-600">Configure platform settings and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={loadSettings} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>
            Basic platform configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="site_name">Site Name</Label>
              <Input
                id="site_name"
                value={getSettingValue('site_name')}
                onChange={(e) => updateSetting('site_name', e.target.value)}
                placeholder="Gigm8"
              />
            </div>
            <div>
              <Label htmlFor="site_description">Site Description</Label>
              <Input
                id="site_description"
                value={getSettingValue('site_description')}
                onChange={(e) => updateSetting('site_description', e.target.value)}
                placeholder="AI-Powered Career Platform"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            File Upload Settings
          </CardTitle>
          <CardDescription>
            Configure file upload limits and restrictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max_file_size">Max File Size (bytes)</Label>
              <Input
                id="max_file_size"
                type="number"
                value={getSettingValue('max_file_size')}
                onChange={(e) => updateSetting('max_file_size', parseInt(e.target.value))}
                placeholder="10485760"
              />
              <p className="text-xs text-gray-500 mt-1">
                Current: {(getSettingValue('max_file_size') / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
            <div>
              <Label htmlFor="allowed_file_types">Allowed File Types</Label>
              <Input
                id="allowed_file_types"
                value={Array.isArray(getSettingValue('allowed_file_types')) 
                  ? getSettingValue('allowed_file_types').join(', ')
                  : getSettingValue('allowed_file_types')
                }
                onChange={(e) => updateSetting('allowed_file_types', e.target.value.split(',').map(t => t.trim()))}
                placeholder="pdf, doc, docx, txt"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Pagination Settings
          </CardTitle>
          <CardDescription>
            Configure items per page for different sections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="blog_posts_per_page">Blog Posts Per Page</Label>
              <Input
                id="blog_posts_per_page"
                type="number"
                value={getSettingValue('blog_posts_per_page')}
                onChange={(e) => updateSetting('blog_posts_per_page', parseInt(e.target.value))}
                placeholder="10"
              />
            </div>
            <div>
              <Label htmlFor="job_posts_per_page">Job Posts Per Page</Label>
              <Input
                id="job_posts_per_page"
                type="number"
                value={getSettingValue('job_posts_per_page')}
                onChange={(e) => updateSetting('job_posts_per_page', parseInt(e.target.value))}
                placeholder="20"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Feature Toggles
          </CardTitle>
          <CardDescription>
            Enable or disable platform features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto_approve_jobs">Auto Approve Jobs</Label>
                <p className="text-sm text-gray-500">
                  Automatically approve new job postings without manual review
                </p>
              </div>
              <Switch
                id="auto_approve_jobs"
                checked={getSettingValue('auto_approve_jobs')}
                onCheckedChange={(checked) => updateSetting('auto_approve_jobs', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require_email_verification">Require Email Verification</Label>
                <p className="text-sm text-gray-500">
                  Require users to verify their email before accessing the platform
                </p>
              </div>
              <Switch
                id="require_email_verification"
                checked={getSettingValue('require_email_verification')}
                onCheckedChange={(checked) => updateSetting('require_email_verification', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable_blog_comments">Enable Blog Comments</Label>
                <p className="text-sm text-gray-500">
                  Allow users to comment on blog posts
                </p>
              </div>
              <Switch
                id="enable_blog_comments"
                checked={getSettingValue('enable_blog_comments')}
                onCheckedChange={(checked) => updateSetting('enable_blog_comments', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="moderate_comments">Moderate Comments</Label>
                <p className="text-sm text-gray-500">
                  Require admin approval before comments are published
                </p>
              </div>
              <Switch
                id="moderate_comments"
                checked={getSettingValue('moderate_comments')}
                onCheckedChange={(checked) => updateSetting('moderate_comments', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Configure security and access controls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Secret Values</Label>
                <p className="text-sm text-gray-500">
                  Toggle visibility of sensitive configuration values
                </p>
              </div>
              <Switch
                checked={showSecrets}
                onCheckedChange={setShowSecrets}
              />
            </div>
          </div>

          <div className="space-y-4">
            {settings.map((setting) => (
              <div key={setting.id} className="space-y-2">
                <Label htmlFor={setting.key}>{setting.key.replace(/_/g, ' ').toUpperCase()}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id={setting.key}
                    type={isSecretKey(setting.key) && !showSecrets ? 'password' : 'text'}
                    value={getSettingValue(setting.key)}
                    onChange={(e) => updateSetting(setting.key, e.target.value)}
                    placeholder={`Enter ${setting.key}`}
                    className="flex-1"
                  />
                  {isSecretKey(setting.key) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSecrets(!showSecrets)}
                    >
                      {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
                {setting.description && (
                  <p className="text-xs text-gray-500">{setting.description}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Status
          </CardTitle>
          <CardDescription>
            Current system health and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Database</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">File Storage</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Email Service</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">AI Services</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
