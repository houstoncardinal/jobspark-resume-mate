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

export function injectJsonLd(id: string, data: object) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  canonical: string;
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
  'article:published_time'?: string;
  'article:modified_time'?: string;
  schema?: any;
}

export const PAGE_SEO: Record<string, SEOData> = {
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
    description: 'Discover thousands of job opportunities across various industries. Search by location, salary, company, and more.',
    keywords: 'jobs, job search, employment, career opportunities, hiring',
    canonical: 'https://gigm8.com/jobs',
    robots: 'index, follow',
    author: 'Gigm8',
    'og:title': 'Find Jobs - Search High-Quality Job Listings | Gigm8',
    'og:description': 'Discover thousands of job opportunities across various industries. Search by location, salary, company, and more.',
    'og:image': 'https://gigm8.com/thumbnail-og.png',
    'og:url': 'https://gigm8.com/jobs',
    'og:type': 'website',
    'og:site_name': 'Gigm8',
    'twitter:card': 'summary_large_image',
    'twitter:title': 'Find Jobs - Search High-Quality Job Listings | Gigm8',
    'twitter:description': 'Discover thousands of job opportunities across various industries. Search by location, salary, company, and more.',
    'twitter:image': 'https://gigm8.com/thumbnail-og.png',
    'twitter:site': '@gigm8',
    'twitter:creator': '@gigm8'
  },
  '/blog': {
    title: 'Career Blog - Job Search Tips & Career Advice | Gigm8',
    description: 'Get expert career advice, job search tips, and industry insights to advance your professional journey.',
    keywords: 'career advice, job search tips, professional development, career blog',
    canonical: 'https://gigm8.com/blog',
    robots: 'index, follow',
    author: 'Gigm8',
    'og:title': 'Career Blog - Job Search Tips & Career Advice | Gigm8',
    'og:description': 'Get expert career advice, job search tips, and industry insights to advance your professional journey.',
    'og:image': 'https://gigm8.com/thumbnail-og.png',
    'og:url': 'https://gigm8.com/blog',
    'og:type': 'website',
    'og:site_name': 'Gigm8',
    'twitter:card': 'summary_large_image',
    'twitter:title': 'Career Blog - Job Search Tips & Career Advice | Gigm8',
    'twitter:description': 'Get expert career advice, job search tips, and industry insights to advance your professional journey.',
    'twitter:image': 'https://gigm8.com/thumbnail-og.png',
    'twitter:site': '@gigm8',
    'twitter:creator': '@gigm8'
  },
  '/networking': {
    title: 'Professional Networking Hub | Gigm8',
    description: 'Connect with professionals, expand your network, and discover new career opportunities.',
    keywords: 'professional networking, career connections, networking hub',
    canonical: 'https://gigm8.com/networking',
    robots: 'index, follow',
    author: 'Gigm8',
    'og:title': 'Professional Networking Hub | Gigm8',
    'og:description': 'Connect with professionals, expand your network, and discover new career opportunities.',
    'og:image': 'https://gigm8.com/thumbnail-og.png',
    'og:url': 'https://gigm8.com/networking',
    'og:type': 'website',
    'og:site_name': 'Gigm8',
    'twitter:card': 'summary_large_image',
    'twitter:title': 'Professional Networking Hub | Gigm8',
    'twitter:description': 'Connect with professionals, expand your network, and discover new career opportunities.',
    'twitter:image': 'https://gigm8.com/thumbnail-og.png',
    'twitter:site': '@gigm8',
    'twitter:creator': '@gigm8'
  },
  '/resume-optimizer': {
    title: 'Resume Optimizer - AI-Powered Resume Analysis | Gigm8',
    description: 'Upload your resume and get AI-powered optimization suggestions. Improve ATS compatibility, keyword density, and overall resume quality.',
    keywords: 'resume optimizer, AI resume analysis, ATS optimization, resume improvement, keyword enhancement',
    canonical: 'https://gigm8.com/resume-optimizer',
    robots: 'index, follow',
    author: 'Gigm8',
    'og:title': 'Resume Optimizer - AI-Powered Resume Analysis | Gigm8',
    'og:description': 'Upload your resume and get AI-powered optimization suggestions. Improve ATS compatibility, keyword density, and overall resume quality.',
    'og:image': 'https://gigm8.com/thumbnail-og.png',
    'og:url': 'https://gigm8.com/resume-optimizer',
    'og:type': 'website',
    'og:site_name': 'Gigm8',
    'twitter:card': 'summary_large_image',
    'twitter:title': 'Resume Optimizer - AI-Powered Resume Analysis | Gigm8',
    'twitter:description': 'Upload your resume and get AI-powered optimization suggestions. Improve ATS compatibility, keyword density, and overall resume quality.',
    'twitter:image': 'https://gigm8.com/thumbnail-og.png',
    'twitter:site': '@gigm8',
    'twitter:creator': '@gigm8'
  },
  '/resume-templates': {
    title: 'Resume Templates - Professional Resume Designs | Gigm8',
    description: 'Choose from professionally designed resume templates. Industry-specific designs for every career path.',
    keywords: 'resume templates, professional resume design, resume format, job application templates',
    canonical: 'https://gigm8.com/resume-templates',
    robots: 'index, follow',
    author: 'Gigm8',
    'og:title': 'Resume Templates - Professional Resume Designs | Gigm8',
    'og:description': 'Choose from professionally designed resume templates. Industry-specific designs for every career path.',
    'og:image': 'https://gigm8.com/thumbnail-og.png',
    'og:url': 'https://gigm8.com/resume-templates',
    'og:type': 'website',
    'og:site_name': 'Gigm8',
    'twitter:card': 'summary_large_image',
    'twitter:title': 'Resume Templates - Professional Resume Designs | Gigm8',
    'twitter:description': 'Choose from professionally designed resume templates. Industry-specific designs for every career path.',
    'twitter:image': 'https://gigm8.com/thumbnail-og.png',
    'twitter:site': '@gigm8',
    'twitter:creator': '@gigm8'
  },
  '/resume-scanner': {
    title: 'Resume Scanner - ATS Compatibility Check | Gigm8',
    description: 'Get instant ATS compatibility analysis and keyword optimization for your resume. Ensure your resume passes through applicant tracking systems.',
    keywords: 'resume scanner, ATS compatibility, resume analysis, keyword optimization, resume checker',
    canonical: 'https://gigm8.com/resume-scanner',
    robots: 'index, follow',
    author: 'Gigm8',
    'og:title': 'Resume Scanner - ATS Compatibility Check | Gigm8',
    'og:description': 'Get instant ATS compatibility analysis and keyword optimization for your resume. Ensure your resume passes through applicant tracking systems.',
    'og:image': 'https://gigm8.com/thumbnail-og.png',
    'og:url': 'https://gigm8.com/resume-scanner',
    'og:type': 'website',
    'og:site_name': 'Gigm8',
    'twitter:card': 'summary_large_image',
    'twitter:title': 'Resume Scanner - ATS Compatibility Check | Gigm8',
    'twitter:description': 'Get instant ATS compatibility analysis and keyword optimization for your resume. Ensure your resume passes through applicant tracking systems.',
    'twitter:image': 'https://gigm8.com/thumbnail-og.png',
    'twitter:site': '@gigm8',
    'twitter:creator': '@gigm8'
  },
  '/cover-letter-builder': {
    title: 'Cover Letter Builder - AI-Powered Cover Letters | Gigm8',
    description: 'Create compelling cover letters tailored to specific job applications. AI-powered content generation and professional templates.',
    keywords: 'cover letter builder, cover letter generator, job application, cover letter templates, AI cover letter',
    canonical: 'https://gigm8.com/cover-letter-builder',
    robots: 'index, follow',
    author: 'Gigm8',
    'og:title': 'Cover Letter Builder - AI-Powered Cover Letters | Gigm8',
    'og:description': 'Create compelling cover letters tailored to specific job applications. AI-powered content generation and professional templates.',
    'og:image': 'https://gigm8.com/thumbnail-og.png',
    'og:url': 'https://gigm8.com/cover-letter-builder',
    'og:type': 'website',
    'og:site_name': 'Gigm8',
    'twitter:card': 'summary_large_image',
    'twitter:title': 'Cover Letter Builder - AI-Powered Cover Letters | Gigm8',
    'twitter:description': 'Create compelling cover letters tailored to specific job applications. AI-powered content generation and professional templates.',
    'twitter:image': 'https://gigm8.com/thumbnail-og.png',
    'twitter:site': '@gigm8',
    'twitter:creator': '@gigm8'
  },
  '/resume-review': {
    title: 'Resume Review - Expert Resume Analysis | Gigm8',
    description: 'Get professional feedback from resume experts. Detailed analysis, improvement recommendations, and priority action items.',
    keywords: 'resume review, expert resume analysis, resume feedback, professional resume critique, resume improvement',
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
    'twitter:creator': seoData['twitter:creator'] || '@gigm8',
    'article:published_time': seoData['article:published_time'],
    'article:modified_time': seoData['article:modified_time']
  };
}

export function generateStructuredData(schema: any) {
  return schema;
}
