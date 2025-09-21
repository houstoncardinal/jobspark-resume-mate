import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { PAGE_SEO } from '@/lib/seo';
import { NetworkingHub } from '@/components/NetworkingHub';

const NetworkingHubPage = () => {
  return (
    <>
      <SEO seoData={PAGE_SEO['/networking']} url="/networking" />
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <NetworkingHub />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default NetworkingHubPage;
