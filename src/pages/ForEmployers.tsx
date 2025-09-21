import React from 'react';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { PAGE_SEO } from '@/lib/seo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Target, TrendingUp, Shield, Zap, Star, Award, Globe, Calendar, Clock, MapPin, Briefcase, GraduationCap, User, Settings, Bell, LogOut, Menu, X as XIcon, Plus, Minus, Check, AlertCircle, Info, RefreshCw, Download, Upload, ExternalLink, ArrowRight, ChevronDown, Search, Filter, Heart, Share2, Bookmark, MessageSquare, Brain, Crown, Diamond, Flame, Rocket, Star as StarIcon, CheckCircle, AlertTriangle } from 'lucide-react';

const ForEmployersPage = () => {
  return (
    <>
      <SEO {...PAGE_SEO['for-employers']} />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              For Employers
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Find the best talent and grow your team with our AI-powered hiring platform
            </p>
          </div>

          {/* Employer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="text-center p-6">
                <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
                <p className="text-gray-600">Companies</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center p-6">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">50,000+</h3>
                <p className="text-gray-600">Candidates</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center p-6">
                <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">95%</h3>
                <p className="text-gray-600">Match Accuracy</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center p-6">
                <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">30%</h3>
                <p className="text-gray-600">Faster Hiring</p>
              </CardContent>
            </Card>
          </div>

          {/* Employer Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  AI-Powered Matching
                </CardTitle>
                <CardDescription>
                  Our AI analyzes job requirements and candidate profiles to find the perfect match
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Learn More</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Verified Candidates
                </CardTitle>
                <CardDescription>
                  All candidates are verified and pre-screened to ensure quality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">View Process</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Premium Support
                </CardTitle>
                <CardDescription>
                  Get dedicated support from our hiring experts throughout the process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Get Support</Button>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Plans */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-center">Choose Your Plan</CardTitle>
              <CardDescription className="text-center">
                Select the plan that best fits your hiring needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Starter</CardTitle>
                    <CardDescription>Perfect for small teams</CardDescription>
                    <div className="text-3xl font-bold">$99<span className="text-lg font-normal">/month</span></div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Up to 5 job postings</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Basic AI matching</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Email support</span>
                      </li>
                    </ul>
                    <Button className="w-full">Get Started</Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-500 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500">Most Popular</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>Professional</CardTitle>
                    <CardDescription>Ideal for growing companies</CardDescription>
                    <div className="text-3xl font-bold">$299<span className="text-lg font-normal">/month</span></div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Up to 25 job postings</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Advanced AI matching</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Priority support</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Analytics dashboard</span>
                      </li>
                    </ul>
                    <Button className="w-full">Get Started</Button>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Enterprise</CardTitle>
                    <CardDescription>For large organizations</CardDescription>
                    <div className="text-3xl font-bold">Custom</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Unlimited job postings</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Custom AI models</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Dedicated support</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Custom integrations</span>
                      </li>
                    </ul>
                    <Button className="w-full">Contact Sales</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-blue-600 text-white">
            <CardContent className="text-center p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Hire?</h2>
              <p className="text-xl mb-8 text-blue-100">
                Join hundreds of companies already using our platform to find top talent
              </p>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Hiring Today
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ForEmployersPage;
