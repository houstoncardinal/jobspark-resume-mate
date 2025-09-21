import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { SEOData, generateMetaTags, generateStructuredData } from '@/lib/seo';

interface SEOProps {
  seoData: SEOData;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({ seoData, url = '' }) => {
  const metaTags = generateMetaTags(seoData, url);

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
      
      {/* Article Meta Tags */}
      {metaTags['article:published_time'] && (
        <meta property="article:published_time" content={metaTags['article:published_time']} />
      )}
      {metaTags['article:modified_time'] && (
        <meta property="article:modified_time" content={metaTags['article:modified_time']} />
      )}
      
      {/* Structured Data */}
      {seoData.schema && (
        <script type="application/ld+json">
          {JSON.stringify(generateStructuredData(seoData.schema))}
        </script>
      )}
      
      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Helmet>
  );
};
