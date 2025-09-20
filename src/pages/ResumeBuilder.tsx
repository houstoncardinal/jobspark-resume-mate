import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { ResumeBuilder } from '@/components/ResumeBuilder';
import { setSeo, injectJsonLd } from '@/lib/seo';

const ResumeBuilderPage = () => {
  useEffect(() => {
    setSeo({
      title: "AI Resume Builder - Gigm8",
      description: "Create professional resumes with AI assistance. Choose from multiple templates, customize sections, and export in various formats.",
      canonical: "https://gigm8.com/builder",
    });

    injectJsonLd('jsonld-resume-builder', {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Gigm8 Resume Builder",
      "url": "https://gigm8.com/builder",
      "description": "AI-powered resume builder with professional templates and customization options",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "AI-powered resume optimization",
        "Professional templates",
        "Multiple export formats",
        "Real-time editing",
        "Section customization",
        "Profile integration"
      ]
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <ResumeBuilder />
    </div>
  );
};

export default ResumeBuilderPage;
