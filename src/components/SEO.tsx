import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { SEOData, generateMetaTags, generateStructuredData } from '@/lib/seo';

interface SEOProps {
  seoData: SEOData;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({ seoData, url = '' }) => {
  const metaTags = generateMetaTags(seoData);

  useEffect(() => {
    // Update document title
    document.title = metaTags.title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', metaTags.description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = metaTags.description;
      document.head.appendChild(meta);
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', metaTags.canonical);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', metaTags.canonical);
      document.head.appendChild(canonical);
    }
  }, [metaTags]);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{metaTags.title}</title>
      <meta name="description" content={metaTags.description} />
      {metaTags.keywords && <meta name="keywords" content={metaTags.keywords} />}
      <meta name="robots" content={metaTags.robots} />
      {metaTags.author && <meta name="author" content={metaTags.author} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={metaTags.canonical} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={metaTags['og:title']} />
      <meta property="og:description" content={metaTags['og:description']} />
      <meta property="og:image" content={metaTags['og:image']} />
      <meta property="og:url" content={metaTags['og:url']} />
      <meta property="og:type" content={metaTags['og:type']} />
      <meta property="og:site_name" content={metaTags['og:site_name']} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={metaTags['twitter:card']} />
      <meta name="twitter:title" content={metaTags['twitter:title']} />
      <meta name="twitter:description" content={metaTags['twitter:description']} />
      <meta name="twitter:image" content={metaTags['twitter:image']} />
      <meta name="twitter:site" content={metaTags['twitter:site']} />
      <meta name="twitter:creator" content={metaTags['twitter:creator']} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData('home'))}
      </script>
    </Helmet>
  );
};
