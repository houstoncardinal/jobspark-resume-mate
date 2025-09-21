// SEO Configuration and Utilities for GIGM8
// Comprehensive SEO setup for all pages

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  robots?: string;
  author?: string;
  'og:title'?: string;
  'og:description'?: string;
  'og:image'?: string;
  'og:url'?: string;
  'og:type'?: string;
  'og:site_name'?: string;
  'twitter:card'?: string;
  'twitter:title'?: string;
  'twitter:description'?: string;
  'twitter:image'?: string;
  'twitter:site'?: string;
  'twitter:creator'?: string;
}

// Dynamic SEO function
export function setSeo({ title, description, canonical }: { title?: string; description?: string; canonical?: string }) {
  if (title) document.title = title;
  if (description) {
    let el = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', 'description');
      document.head.appendChild(el);
    }
    el.setAttribute('content', description);
  }
  if (canonical) {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);
  }
}

// Page-specific SEO data
export const PAGE_SEO = {
  '/': {
    title: 'Gigm8 — Find Jobs, Match & Optimize Your Resume',
    description: 'Search high-quality job listings worldwide, analyze your resume against any role, and use AI to optimize your resume in real time.',
    keywords: 'jobs, job search, resume optimizer, ATS, AI resume, job board, career, hiring, remote jobs',
    canonical: 'https://gigm8.com/',
    robots: 'index, follow',
    author: 'Gigm8',
    'og:title': 'Gigm8 — Find Jobs, Match & Optimize Your Resume',
    'og:description': 'Search high-quality job listings worldwide, analyze your resume against any role, and use AI to optimize your resume in real time.',
    'og:image': 'https://gigm8.com/thumbnail-og.png',
    'og:url': 'https://gigm8.com/',
    'og:type': 'website',
    'og:site_name': 'Gigm8',
    'twitter:card': 'summary_large_image',
    'twitter:title': 'Gigm8 — Find Jobs, Match & Optimize Your Resume',
    'twitter:description': 'Search high-quality job listings worldwide, analyze your resume against any role, and use AI to optimize your resume in real time.',
    'twitter:image': 'https://gigm8.com/thumbnail-og.png',
    'twitter:site': '@gigm8',
    'twitter:creator': '@gigm8'
  },
  '/builder': {
    title: 'AI Resume Builder - Create Professional Resumes | Gigm8',
    description: 'Build professional resumes with our AI-powered resume builder. Choose from premium templates and get instant optimization suggestions.',
    keywords: 'resume builder, AI resume, professional resume, resume templates, job application',
    canonical: 'https://gigm8.com/builder',
    robots: 'index, follow',
    author: 'Gigm8',
    'og:title': 'AI Resume Builder - Create Professional Resumes | Gigm8',
    'og:description': 'Build professional resumes with our AI-powered resume builder. Choose from premium templates and get instant optimization suggestions.',
    'og:image': 'https://gigm8.com/thumbnail-og.png',
    'og:url': 'https://gigm8.com/builder',
    'og:type': 'website',
    'og:site_name': 'Gigm8',
    'twitter:card': 'summary_large_image',
    'twitter:title': 'AI Resume Builder - Create Professional Resumes | Gigm8',
    'twitter:description': 'Build professional resumes with our AI-powered resume builder. Choose from premium templates and get instant optimization suggestions.',
    'twitter:image': 'https://gigm8.com/thumbnail-og.png',
    'twitter:site': '@gigm8',
    'twitter:creator': '@gigm8'
  },
  '/jobs': {
    title: 'Find Jobs - Search High-Quality Job Listings | Gigm8',
    description: 'Discover thousands of job opportunities from top companies. Advanced search filters, real-time updates, and personalized job recommendations.',
    keywords: 'jobs, job search, employment, career opportunities, hiring',
    canonical: 'https://gigm8.com/jobs',
    robots: 'index, follow',
    author: 'Gigm8',
    'og:title': 'Find Jobs - Search High-Quality Job Listings | Gigm8',
    'og:description': 'Discover thousands of job opportunities from top companies. Advanced search filters, real-time updates, and personalized job recommendations.',
    'og:image': 'https://gigm8.com/thumbnail-og.png',
    'og:url': 'https://gigm8.com/jobs',
    'og:type': 'website',
    'og:site_name': 'Gigm8',
    'twitter:card': 'summary_large_image',
    'twitter:title': 'Find Jobs - Search High-Quality Job Listings | Gigm8',
    'twitter:description': 'Discover thousands of job opportunities from top companies. Advanced search filters, real-time updates, and personalized job recommendations.',
    'twitter:image': 'https://gigm8.com/thumbnail-og.png',
    'twitter:site': '@gigm8',
    'twitter:creator': '@gigm8'
  },
  '/resume-optimizer': {
    title: 'Resume Optimizer - AI-Powered Resume Analysis | Gigm8',
    description: 'Optimize your resume with AI-powered analysis. Get instant feedback on ATS compatibility, keyword optimization, and formatting improvements.',
    keywords: 'resume optimizer, AI resume analysis, ATS optimization, resume improvement',
    canonical: 'https://gigm8.com/resume-optimizer',
    robots: 'index, follow',
    author: 'Gigm8',
    'og:title': 'Resume Optimizer - AI-Powered Resume Analysis | Gigm8',
    'og:description': 'Optimize your resume with AI-powered analysis. Get instant feedback on ATS compatibility, keyword optimization, and formatting improvements.',
    'og:image': 'https://gigm8.com/thumbnail-og.png',
    'og:url': 'https://gigm8.com/resume-optimizer',
    'og:type': 'website',
    'og:site_name': 'Gigm8',
    'twitter:card': 'summary_large_image',
    'twitter:title': 'Resume Optimizer - AI-Powered Resume Analysis | Gigm8',
    'twitter:description': 'Optimize your resume with AI-powered analysis. Get instant feedback on ATS compatibility, keyword optimization, and formatting improvements.',
    'twitter:image': 'https://gigm8.com/thumbnail-og.png',
    'twitter:site': '@gigm8',
    'twitter:creator': '@gigm8'
  },
  '/resume-templates': {
    title: 'Resume Templates - Professional Resume Designs | Gigm8',
    description: 'Choose from our collection of professional resume templates. ATS-friendly designs that help you stand out to employers.',
    keywords: 'resume templates, professional resume, ATS resume, resume design',
    canonical: 'https://gigm8.com/resume-templates',
    robots: 'index, follow',
    author: 'Gigm8',
    'og:title': 'Resume Templates - Professional Resume Designs | Gigm8',
    'og:description': 'Choose from our collection of professional resume templates. ATS-friendly designs that help you stand out to employers.',
    'og:image': 'https://gigm8.com/thumbnail-og.png',
    'og:url': 'https://gigm8.com/resume-templates',
    'og:type': 'website',
    'og:site_name': 'Gigm8',
    'twitter:card': 'summary_large_image',
    'twitter:title': 'Resume Templates - Professional Resume Designs | Gigm8',
    'twitter:description': 'Choose from our collection of professional resume templates. ATS-friendly designs that help you stand out to employers.',
    'twitter:image': 'https://gigm8.com/thumbnail-og.png',
    'twitter:site': '@gigm8',
    'twitter:creator': '@gigm8'
  },
  '/resume-scanner': {
    title: 'Resume Scanner - ATS Compatibility Check | Gigm8',
    description: 'Scan your resume for ATS compatibility issues. Get detailed feedback on formatting, keywords, and optimization opportunities.',
    keywords: 'resume scanner, ATS check, resume analysis, job application',
    canonical: 'https://gigm8.com/resume-scanner',
    robots: 'index, follow',
    author: 'Gigm8',
    'og:title': 'Resume Scanner - ATS Compatibility Check | Gigm8',
    'og:description': 'Scan your resume for ATS compatibility issues. Get detailed feedback on formatting, keywords, and optimization opportunities.',
    'og:image': 'https://gigm8.com/thumbnail-og.png',
    'og:url': 'https://gigm8.com/resume-scanner',
    'og:type': 'website',
    'og:site_name': 'Gigm8',
    'twitter:card': 'summary_large_image',
    'twitter:title': 'Resume Scanner - ATS Compatibility Check | Gigm8',
    'twitter:description': 'Scan your resume for ATS compatibility issues. Get detailed feedback on formatting, keywords, and optimization opportunities.',
    'twitter:image': 'https://gigm8.com/thumbnail-og.png',
    'twitter:site': '@gigm8',
    'twitter:creator': '@gigm8'
  },
  '/cover-letter-builder': {
    title: 'Cover Letter Builder - AI-Powered Cover Letters | Gigm8',
    description: 'Create compelling cover letters with our AI-powered builder. Personalized templates and optimization suggestions for every application.',
    keywords: 'cover letter builder, AI cover letter, job application, professional writing',
    canonical: 'https://gigm8.com/cover-letter-builder',
    robots: 'index, follow',
    author: 'Gigm8',
    'og:title': 'Cover Letter Builder - AI-Powered Cover Letters | Gigm8',
    'og:description': 'Create compelling cover letters with our AI-powered builder. Personalized templates and optimization suggestions for every application.',
    'og:image': 'https://gigm8.com/thumbnail-og.png',
    'og:url': 'https://gigm8.com/cover-letter-builder',
    'og:type': 'website',
    'og:site_name': 'Gigm8',
    'twitter:card': 'summary_large_image',
    'twitter:title': 'Cover Letter Builder - AI-Powered Cover Letters | Gigm8',
    'twitter:description': 'Create compelling cover letters with our AI-powered builder. Personalized templates and optimization suggestions for every application.',
    'twitter:image': 'https://gigm8.com/thumbnail-og.png',
    'twitter:site': '@gigm8',
    'twitter:creator': '@gigm8'
  },
  '/resume-review': {
    title: 'Resume Review - Expert Resume Analysis | Gigm8',
    description: 'Get professional feedback from resume experts. Detailed analysis, improvement recommendations, and priority action items.',
    keywords: 'resume review, professional feedback, resume analysis, career advice',
    canonical: 'https://gigm8.com/resume-review',
    robots: 'index, follow',
    author: 'Gigm8',
    'og:title': 'Resume Review - Expert Resume Analysis | Gigm8',
    'og:description': 'Get professional feedback from resume experts. Detailed analysis, improvement recommendations, and priority action items.',
    'og:image': 'https://gigm8.com/thumbnail-og.png',
    'og:url': 'https://gigm8.com/resume-review',
    'og:type': 'website',
    'og:site_name': 'Gigm8',
    'twitter:card': 'summary_large_image',
    'twitter:title': 'Resume Review - Expert Resume Analysis | Gigm8',
    'twitter:description': 'Get professional feedback from resume experts. Detailed analysis, improvement recommendations, and priority action items.',
    'twitter:image': 'https://gigm8.com/thumbnail-og.png',
    'twitter:site': '@gigm8',
    'twitter:creator': '@gigm8'
  },
  '/blog': {
    title: 'Career Blog - Job Search Tips & Career Advice | Gigm8',
    description: 'Expert career advice, job search tips, and industry insights to help you advance your career and land your dream job.',
    keywords: 'career advice, job search tips, professional development, career blog',
    canonical: 'https://gigm8.com/blog',
    robots: 'index, follow',
    author: 'Gigm8',
    'og:title': 'Career Blog - Job Search Tips & Career Advice | Gigm8',
    'og:description': 'Expert career advice, job search tips, and industry insights to help you advance your career and land your dream job.',
    'og:image': 'https://gigm8.com/thumbnail-og.png',
    'og:url': 'https://gigm8.com/blog',
    'og:type': 'website',
    'og:site_name': 'Gigm8',
    'twitter:card': 'summary_large_image',
    'twitter:title': 'Career Blog - Job Search Tips & Career Advice | Gigm8',
    'twitter:description': 'Expert career advice, job search tips, and industry insights to help you advance your career and land your dream job.',
    'twitter:image': 'https://gigm8.com/thumbnail-og.png',
    'twitter:site': '@gigm8',
    'twitter:creator': '@gigm8'
  },
  '/networking': {
    title: 'Networking Hub - Connect with Professionals | Gigm8',
    description: 'Join our professional networking community. Connect with industry experts, share insights, and advance your career.',
    keywords: 'professional networking, career connections, industry experts, networking hub',
    canonical: 'https://gigm8.com/networking',
    robots: 'index, follow',
    author: 'Gigm8',
    'og:title': 'Networking Hub - Connect with Professionals | Gigm8',
    'og:description': 'Join our professional networking community. Connect with industry experts, share insights, and advance your career.',
    'og:image': 'https://gigm8.com/thumbnail-og.png',
    'og:url': 'https://gigm8.com/networking',
    'og:type': 'website',
    'og:site_name': 'Gigm8',
    'twitter:card': 'summary_large_image',
    'twitter:title': 'Networking Hub - Connect with Professionals | Gigm8',
    'twitter:description': 'Join our professional networking community. Connect with industry experts, share insights, and advance your career.',
    'twitter:image': 'https://gigm8.com/thumbnail-og.png',
    'twitter:site': '@gigm8',
    'twitter:creator': '@gigm8'
  },
  '/signin': {
    title: 'Sign In - Gigm8 Account Access | Gigm8',
    description: 'Sign in to your Gigm8 account to access job search tools, resume builder, and career resources.',
    keywords: 'sign in, login, account access, Gigm8 login',
    canonical: 'https://gigm8.com/signin',
    robots: 'index, follow',
    author: 'Gigm8',
    'og:title': 'Sign In - Gigm8 Account Access | Gigm8',
    'og:description': 'Sign in to your Gigm8 account to access job search tools, resume builder, and career resources.',
    'og:image': 'https://gigm8.com/thumbnail-og.png',
    'og:url': 'https://gigm8.com/signin',
    'og:type': 'website',
    'og:site_name': 'Gigm8',
    'twitter:card': 'summary_large_image',
    'twitter:title': 'Sign In - Gigm8 Account Access | Gigm8',
    'twitter:description': 'Sign in to your Gigm8 account to access job search tools, resume builder, and career resources.',
    'twitter:image': 'https://gigm8.com/thumbnail-og.png',
    'twitter:site': '@gigm8',
    'twitter:creator': '@gigm8'
  }
};

export function generateMetaTags(seoData: SEOData) {
  const baseUrl = 'https://gigm8.com';
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    canonical: seoData.canonical,
    robots: seoData.robots || 'index, follow',
    author: seoData.author || 'Gigm8',
    'og:title': seoData['og:title'] || seoData.title,
    'og:description': seoData['og:description'] || seoData.description,
    'og:image': seoData['og:image'] || `${baseUrl}/thumbnail-og.png`,
    'og:url': seoData['og:url'] || seoData.canonical,
    'og:type': seoData['og:type'] || 'website',
    'og:site_name': seoData['og:site_name'] || 'Gigm8',
    'twitter:card': seoData['twitter:card'] || 'summary_large_image',
    'twitter:title': seoData['twitter:title'] || seoData.title,
    'twitter:description': seoData['twitter:description'] || seoData.description,
    'twitter:image': seoData['twitter:image'] || `${baseUrl}/thumbnail-og.png`,
    'twitter:site': seoData['twitter:site'] || '@gigm8',
    'twitter:creator': seoData['twitter:creator'] || '@gigm8'
  };
}

export function generateStructuredData(page: string, additionalData?: any) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Gigm8',
    url: 'https://gigm8.com',
    description: 'AI-powered job search and resume optimization platform',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://gigm8.com/jobs?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  switch (page) {
    case 'home':
      return {
        ...baseStructuredData,
        '@type': 'WebSite',
        name: 'Gigm8',
        description: 'Search high-quality job listings worldwide, analyze your resume against any role, and use AI to optimize your resume in real time.'
      };
    case 'jobs':
      return {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        name: 'Job Search Platform',
        description: 'Discover thousands of job opportunities from top companies',
        url: 'https://gigm8.com/jobs',
        ...additionalData
      };
    default:
      return baseStructuredData;
  }
}
