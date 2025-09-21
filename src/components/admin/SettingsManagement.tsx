import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Shield, 
  Mail, 
  Globe, 
  Database, 
  Bell, 
  Users, 
  FileText, 
  Image,
  DollarSign,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SettingsManagement = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Gigm8',
    siteDescription: 'AI-Powered Job Search Platform',
    siteUrl: 'https://gigm8.com',
    adminEmail: 'admin@gigm8.com',
    timezone: 'America/New_York',
    language: 'en',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: 'noreply@gigm8.com',
    smtpPassword: '••••••••••••',
    fromName: 'Gigm8 Team',
    fromEmail: 'noreply@gigm8.com',
    enableNotifications: true,
    enableMarketing: false
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireTwoFactor: false,
    enableApiAccess: true,
    apiKey: 'sk-1234567890abcdef',
    allowedDomains: 'gigm8.com,app.gigm8.com',
    enableAuditLog: true
  });

  // Job Settings
  const [jobSettings, setJobSettings] = useState({
    autoApproveJobs: false,
    requireJobApproval: true,
    jobExpiryDays: 30,
    maxJobsPerUser: 10,
    enableJobAlerts: true,
    enableSalaryRange: true,
    enableRemoteWork: true,
    enableVisaSponsorship: true
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    enablePayments: true,
    currency: 'USD',
    stripePublicKey: 'pk_test_1234567890',
    stripeSecretKey: 'sk_test_1234567890',
    enableFeaturedJobs: true,
    featuredJobPrice: 99,
    enablePremiumUsers: true,
    premiumUserPrice: 29
  });

  const handleSave = async (settingsType: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: `${settingsType} settings have been updated successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = (settingsType: string) => {
    toast({
      title: "Settings Reset",
      description: `${settingsType} settings have been reset to defaults`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
          <p className="text-gray-600">Configure platform settings and preferences</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-600" />
                General Settings
              </CardTitle>
              <CardDescription>
                Configure basic platform settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={generalSettings.siteUrl}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={generalSettings.adminEmail}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={generalSettings.timezone} onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">Enable maintenance mode to temporarily disable the site</p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={generalSettings.maintenanceMode}
                    onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowRegistration">Allow Registration</Label>
                    <p className="text-sm text-gray-500">Allow new users to register on the platform</p>
                  </div>
                  <Switch
                    id="allowRegistration"
                    checked={generalSettings.allowRegistration}
                    onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, allowRegistration: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                    <p className="text-sm text-gray-500">Require users to verify their email address</p>
                  </div>
                  <Switch
                    id="requireEmailVerification"
                    checked={generalSettings.requireEmailVerification}
                    onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, requireEmailVerification: checked }))}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleReset('General')}>
                  Reset
                </Button>
                <Button onClick={() => handleSave('General')} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-blue-600" />
                Email Settings
              </CardTitle>
              <CardDescription>
                Configure email server and notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    value={emailSettings.smtpUsername}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUsername: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, fromName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableNotifications">Enable Notifications</Label>
                    <p className="text-sm text-gray-500">Send email notifications to users</p>
                  </div>
                  <Switch
                    id="enableNotifications"
                    checked={emailSettings.enableNotifications}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, enableNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableMarketing">Enable Marketing Emails</Label>
                    <p className="text-sm text-gray-500">Send marketing and promotional emails</p>
                  </div>
                  <Switch
                    id="enableMarketing"
                    checked={emailSettings.enableMarketing}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, enableMarketing: checked }))}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleReset('Email')}>
                  Reset
                </Button>
                <Button onClick={() => handleSave('Email')} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="passwordMinLength">Password Min Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="allowedDomains">Allowed Domains</Label>
                  <Input
                    id="allowedDomains"
                    value={securitySettings.allowedDomains}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, allowedDomains: e.target.value }))}
                    placeholder="domain1.com,domain2.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    value={securitySettings.apiKey}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, apiKey: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireTwoFactor">Require Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Force users to enable 2FA for enhanced security</p>
                  </div>
                  <Switch
                    id="requireTwoFactor"
                    checked={securitySettings.requireTwoFactor}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, requireTwoFactor: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableApiAccess">Enable API Access</Label>
                    <p className="text-sm text-gray-500">Allow API access for third-party integrations</p>
                  </div>
                  <Switch
                    id="enableApiAccess"
                    checked={securitySettings.enableApiAccess}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, enableApiAccess: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableAuditLog">Enable Audit Log</Label>
                    <p className="text-sm text-gray-500">Log all administrative actions for security</p>
                  </div>
                  <Switch
                    id="enableAuditLog"
                    checked={securitySettings.enableAuditLog}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, enableAuditLog: checked }))}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleReset('Security')}>
                  Reset
                </Button>
                <Button onClick={() => handleSave('Security')} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Job Settings */}
        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Job Settings
              </CardTitle>
              <CardDescription>
                Configure job posting and management settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobExpiryDays">Job Expiry Days</Label>
                  <Input
                    id="jobExpiryDays"
                    type="number"
                    value={jobSettings.jobExpiryDays}
                    onChange={(e) => setJobSettings(prev => ({ ...prev, jobExpiryDays: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxJobsPerUser">Max Jobs Per User</Label>
                  <Input
                    id="maxJobsPerUser"
                    type="number"
                    value={jobSettings.maxJobsPerUser}
                    onChange={(e) => setJobSettings(prev => ({ ...prev, maxJobsPerUser: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoApproveJobs">Auto-Approve Jobs</Label>
                    <p className="text-sm text-gray-500">Automatically approve new job postings</p>
                  </div>
                  <Switch
                    id="autoApproveJobs"
                    checked={jobSettings.autoApproveJobs}
                    onCheckedChange={(checked) => setJobSettings(prev => ({ ...prev, autoApproveJobs: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireJobApproval">Require Job Approval</Label>
                    <p className="text-sm text-gray-500">Require admin approval for all job postings</p>
                  </div>
                  <Switch
                    id="requireJobApproval"
                    checked={jobSettings.requireJobApproval}
                    onCheckedChange={(checked) => setJobSettings(prev => ({ ...prev, requireJobApproval: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableJobAlerts">Enable Job Alerts</Label>
                    <p className="text-sm text-gray-500">Allow users to set up job alerts</p>
                  </div>
                  <Switch
                    id="enableJobAlerts"
                    checked={jobSettings.enableJobAlerts}
                    onCheckedChange={(checked) => setJobSettings(prev => ({ ...prev, enableJobAlerts: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableSalaryRange">Enable Salary Range</Label>
                    <p className="text-sm text-gray-500">Show salary range in job postings</p>
                  </div>
                  <Switch
                    id="enableSalaryRange"
                    checked={jobSettings.enableSalaryRange}
                    onCheckedChange={(checked) => setJobSettings(prev => ({ ...prev, enableSalaryRange: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableRemoteWork">Enable Remote Work</Label>
                    <p className="text-sm text-gray-500">Allow remote work options in job postings</p>
                  </div>
                  <Switch
                    id="enableRemoteWork"
                    checked={jobSettings.enableRemoteWork}
                    onCheckedChange={(checked) => setJobSettings(prev => ({ ...prev, enableRemoteWork: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableVisaSponsorship">Enable Visa Sponsorship</Label>
                    <p className="text-sm text-gray-500">Allow visa sponsorship options in job postings</p>
                  </div>
                  <Switch
                    id="enableVisaSponsorship"
                    checked={jobSettings.enableVisaSponsorship}
                    onCheckedChange={(checked) => setJobSettings(prev => ({ ...prev, enableVisaSponsorship: checked }))}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleReset('Jobs')}>
                  Reset
                </Button>
                <Button onClick={() => handleSave('Jobs')} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                Payment Settings
              </CardTitle>
              <CardDescription>
                Configure payment processing and subscription settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={paymentSettings.currency} onValueChange={(value) => setPaymentSettings(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="stripePublicKey">Stripe Public Key</Label>
                  <Input
                    id="stripePublicKey"
                    value={paymentSettings.stripePublicKey}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, stripePublicKey: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="stripeSecretKey"
                    type={showApiKey ? "text" : "password"}
                    value={paymentSettings.stripeSecretKey}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, stripeSecretKey: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="featuredJobPrice">Featured Job Price</Label>
                  <Input
                    id="featuredJobPrice"
                    type="number"
                    value={paymentSettings.featuredJobPrice}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, featuredJobPrice: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="premiumUserPrice">Premium User Price (monthly)</Label>
                  <Input
                    id="premiumUserPrice"
                    type="number"
                    value={paymentSettings.premiumUserPrice}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, premiumUserPrice: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enablePayments">Enable Payments</Label>
                    <p className="text-sm text-gray-500">Enable payment processing on the platform</p>
                  </div>
                  <Switch
                    id="enablePayments"
                    checked={paymentSettings.enablePayments}
                    onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, enablePayments: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableFeaturedJobs">Enable Featured Jobs</Label>
                    <p className="text-sm text-gray-500">Allow users to pay for featured job listings</p>
                  </div>
                  <Switch
                    id="enableFeaturedJobs"
                    checked={paymentSettings.enableFeaturedJobs}
                    onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, enableFeaturedJobs: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enablePremiumUsers">Enable Premium Users</Label>
                    <p className="text-sm text-gray-500">Allow users to upgrade to premium accounts</p>
                  </div>
                  <Switch
                    id="enablePremiumUsers"
                    checked={paymentSettings.enablePremiumUsers}
                    onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, enablePremiumUsers: checked }))}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleReset('Payments')}>
                  Reset
                </Button>
                <Button onClick={() => handleSave('Payments')} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
