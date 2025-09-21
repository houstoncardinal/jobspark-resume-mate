// RSS Job Feeds Integration
// Fetches jobs from various company RSS feeds

export interface RSSJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  posted: string;
  source: string;
  type?: string;
  remote?: boolean;
}

const RSS_FEEDS = [
  {
    name: 'Lever',
    url: 'https://jobs.lever.co/feed',
    company: 'Various Companies',
    parser: (item: any) => ({
      title: item.title,
      company: item.company || 'Lever Company',
      location: item.location || 'Various',
      description: item.description || '',
      url: item.link,
      posted: item.pubDate,
      source: 'Lever',
      type: 'Full-time',
    })
  },
  {
    name: 'Ashby',
    url: 'https://jobs.ashbyhq.com/feed',
    company: 'Various Companies',
    parser: (item: any) => ({
      title: item.title,
      company: item.company || 'Ashby Company',
      location: item.location || 'Various',
      description: item.description || '',
      url: item.link,
      posted: item.pubDate,
      source: 'Ashby',
      type: 'Full-time',
    })
  },
  {
    name: 'Greenhouse',
    url: 'https://jobs.greenhouse.io/feed',
    company: 'Various Companies',
    parser: (item: any) => ({
      title: item.title,
      company: item.company || 'Greenhouse Company',
      location: item.location || 'Various',
      description: item.description || '',
      url: item.link,
      posted: item.pubDate,
      source: 'Greenhouse',
      type: 'Full-time',
    })
  },
  {
    name: 'Workable',
    url: 'https://jobs.workable.com/feed',
    company: 'Various Companies',
    parser: (item: any) => ({
      title: item.title,
      company: item.company || 'Workable Company',
      location: item.location || 'Various',
      description: item.description || '',
      url: item.link,
      posted: item.pubDate,
      source: 'Workable',
      type: 'Full-time',
    })
  },
  {
    name: 'SmartRecruiters',
    url: 'https://jobs.smartrecruiters.com/feed',
    company: 'Various Companies',
    parser: (item: any) => ({
      title: item.title,
      company: item.company || 'SmartRecruiters Company',
      location: item.location || 'Various',
      description: item.description || '',
      url: item.link,
      posted: item.pubDate,
      source: 'SmartRecruiters',
      type: 'Full-time',
    })
  }
];

// Parse RSS feed (simplified - would need a proper RSS parser in production)
export async function parseRSSFeed(feedUrl: string): Promise<RSSJob[]> {
  try {
    // In a real implementation, you'd use a CORS proxy or backend service
    // to fetch RSS feeds due to CORS restrictions
    console.log(`Would fetch RSS feed: ${feedUrl}`);
    return [];
  } catch (error) {
    console.error(`Error parsing RSS feed ${feedUrl}:`, error);
    return [];
  }
}

// Get jobs from all RSS feeds
export async function getAllRSSJobs(): Promise<RSSJob[]> {
  const allJobs: RSSJob[] = [];
  
  for (const feed of RSS_FEEDS) {
    try {
      const jobs = await parseRSSFeed(feed.url);
      allJobs.push(...jobs);
    } catch (error) {
      console.error(`Error fetching ${feed.name} jobs:`, error);
    }
  }
  
  return allJobs;
}

// Mock RSS jobs for demonstration
export function getMockRSSJobs(): RSSJob[] {
  return [
    {
      id: 'rss-1',
      title: 'Senior Software Engineer',
      company: 'Tech Startup Inc.',
      location: 'San Francisco, CA',
      description: 'Join our growing team as a Senior Software Engineer...',
      url: 'https://jobs.lever.co/tech-startup/senior-software-engineer',
      posted: new Date().toISOString(),
      source: 'Lever',
      type: 'Full-time',
      remote: true,
    },
    {
      id: 'rss-2',
      title: 'Product Manager',
      company: 'Innovation Corp',
      location: 'New York, NY',
      description: 'We are looking for a Product Manager to drive our product strategy...',
      url: 'https://jobs.ashbyhq.com/innovation-corp/product-manager',
      posted: new Date(Date.now() - 86400000).toISOString(),
      source: 'Ashby',
      type: 'Full-time',
      remote: false,
    },
    {
      id: 'rss-3',
      title: 'UX Designer',
      company: 'Design Studio',
      location: 'Remote',
      description: 'Create amazing user experiences for our products...',
      url: 'https://jobs.greenhouse.io/design-studio/ux-designer',
      posted: new Date(Date.now() - 172800000).toISOString(),
      source: 'Greenhouse',
      type: 'Full-time',
      remote: true,
    }
  ];
}
