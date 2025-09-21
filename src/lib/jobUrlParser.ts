export interface ParsedJob {
  title: string;
  company: string;
  location?: string;
  description: string;
  url: string;
  salary?: string;
  type?: string;
  postedDate?: string;
  requirements?: string[];
  benefits?: string[];
}

export class JobUrlParser {
  private static readonly SUPPORTED_DOMAINS = [
    'linkedin.com',
    'indeed.com',
    'glassdoor.com',
    'monster.com',
    'ziprecruiter.com',
    'careerbuilder.com',
    'dice.com',
    'angel.co',
    'wellfound.com',
    'remote.co',
    'flexjobs.com',
    'upwork.com',
    'freelancer.com'
  ];

  static async parseJobUrl(url: string): Promise<ParsedJob | null> {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();
      
      // Check if domain is supported
      const isSupported = this.SUPPORTED_DOMAINS.some(supportedDomain => 
        domain.includes(supportedDomain)
      );
      
      if (!isSupported) {
        throw new Error('Unsupported job website');
      }

      // For now, we'll simulate parsing since we can't make actual requests
      // In a real implementation, you'd use a backend service or proxy
      return await this.simulateJobParsing(url, domain);
      
    } catch (error) {
      console.error('Error parsing job URL:', error);
      return null;
    }
  }

  private static async simulateJobParsing(url: string, domain: string): Promise<ParsedJob> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate realistic job data based on domain
    const jobTemplates = {
      'linkedin.com': {
        title: 'Senior Software Engineer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$120,000 - $180,000'
      },
      'indeed.com': {
        title: 'Full Stack Developer',
        company: 'Innovation Labs',
        location: 'New York, NY',
        type: 'Full-time',
        salary: '$100,000 - $150,000'
      },
      'glassdoor.com': {
        title: 'Product Manager',
        company: 'StartupXYZ',
        location: 'Austin, TX',
        type: 'Full-time',
        salary: '$110,000 - $160,000'
      }
    };

    const template = jobTemplates[domain as keyof typeof jobTemplates] || jobTemplates['linkedin.com'];
    
    return {
      title: template.title,
      company: template.company,
      location: template.location,
      description: `We are looking for a ${template.title} to join our team. This role involves working on cutting-edge projects, collaborating with cross-functional teams, and driving innovation in our products.

Key Responsibilities:
• Design and develop scalable applications
• Collaborate with product and design teams
• Write clean, maintainable code
• Mentor junior developers
• Participate in code reviews

Requirements:
• Bachelor's degree in Computer Science or related field
• 5+ years of experience in software development
• Proficiency in modern programming languages
• Experience with cloud platforms
• Strong problem-solving skills

Benefits:
• Competitive salary and equity
• Health, dental, and vision insurance
• Flexible work arrangements
• Professional development opportunities
• Team building events`,
      url,
      salary: template.salary,
      type: template.type,
      postedDate: new Date().toISOString().split('T')[0],
      requirements: [
        'Bachelor\'s degree in Computer Science',
        '5+ years of experience',
        'Proficiency in modern programming languages',
        'Experience with cloud platforms',
        'Strong problem-solving skills'
      ],
      benefits: [
        'Competitive salary and equity',
        'Health, dental, and vision insurance',
        'Flexible work arrangements',
        'Professional development opportunities'
      ]
    };
  }

  static isValidJobUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return this.SUPPORTED_DOMAINS.some(domain => 
        urlObj.hostname.toLowerCase().includes(domain)
      );
    } catch {
      return false;
    }
  }

  static getDomainName(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return 'Unknown';
    }
  }
}
