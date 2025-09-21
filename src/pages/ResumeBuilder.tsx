import React from 'react';
import { BuilderDashboard } from '@/components/BuilderDashboard';
import { SEO } from '@/components/SEO';
import { PAGE_SEO } from '@/lib/seo';

const ResumeBuilderPage = () => {
  return (
    <>
      <SEO seoData={PAGE_SEO['/builder']} url="/builder" />
      <BuilderDashboard />
    </>
  );
};

export default ResumeBuilderPage;
