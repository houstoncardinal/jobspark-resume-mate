// RSS Job Feed Integration
// Provides mock RSS job data for immediate functionality

export interface RSSJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  source: string;
  url: string;
  type: string;
  posted: string;
  remote: boolean;
}

export function getMockRSSJobs(): RSSJob[] {
  return [
    {
      id: 'rss-1',
      title: 'Senior React Developer',
      company: 'TechStart Inc.',
      location: 'San Francisco, CA',
      description: 'We are looking for a senior React developer to join our fast-growing team. You will work on cutting-edge web applications and help shape our product roadmap.',
      source: 'RSS Feed',
      url: 'https://example.com/job/1',
      type: 'Full-time',
      posted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      remote: false
    },
    {
      id: 'rss-2',
      title: 'DevOps Engineer',
      company: 'CloudCorp',
      location: 'Remote',
      description: 'Join our DevOps team to manage and scale our cloud infrastructure. Experience with AWS, Docker, and Kubernetes required.',
      source: 'RSS Feed',
      url: 'https://example.com/job/2',
      type: 'Full-time',
      posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      remote: true
    },
    {
      id: 'rss-3',
      title: 'Product Designer',
      company: 'DesignCo',
      location: 'New York, NY',
      description: 'We are seeking a talented product designer to create beautiful and intuitive user experiences for our mobile and web applications.',
      source: 'RSS Feed',
      url: 'https://example.com/job/3',
      type: 'Full-time',
      posted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      remote: false
    },
    {
      id: 'rss-4',
      title: 'Data Analyst',
      company: 'AnalyticsPro',
      location: 'Chicago, IL',
      description: 'Analyze large datasets to provide business insights and drive data-driven decisions. SQL and Python experience required.',
      source: 'RSS Feed',
      url: 'https://example.com/job/4',
      type: 'Full-time',
      posted: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      remote: false
    },
    {
      id: 'rss-5',
      title: 'Marketing Manager',
      company: 'GrowthHack',
      location: 'Austin, TX',
      description: 'Lead our marketing efforts and drive user acquisition. Experience with digital marketing and growth strategies required.',
      source: 'RSS Feed',
      url: 'https://example.com/job/5',
      type: 'Full-time',
      posted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      remote: false
    }
  ];
}

export async function getAllRSSJobs(): Promise<RSSJob[]> {
  // In a real implementation, this would fetch from actual RSS feeds
  // For now, return mock data
  return getMockRSSJobs();
}
