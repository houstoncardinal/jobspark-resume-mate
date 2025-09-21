export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'creative' | 'modern' | 'minimalist' | 'executive';
  preview: string;
  fields: {
    [section: string]: {
      required: boolean;
      fields: {
        [fieldKey: string]: {
          label: string;
          type: 'text' | 'textarea' | 'date' | 'email' | 'phone' | 'url' | 'select' | 'multiselect' | 'array';
          placeholder?: string;
          required: boolean;
          options?: string[];
          validation?: {
            min?: number;
            max?: number;
            pattern?: string;
          };
          helpText?: string;
        };
      };
    };
  };
  styling: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    layout: 'single-column' | 'two-column' | 'hybrid';
  };
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'professional-classic',
    name: 'Professional Classic',
    description: 'Clean, traditional design perfect for corporate roles',
    category: 'professional',
    preview: '/templates/professional-classic.png',
    fields: {
      contact: {
        required: true,
        fields: {
          fullName: {
            label: 'Full Name',
            type: 'text',
            placeholder: 'John Doe',
            required: true,
            validation: { min: 2, max: 50 }
          },
          email: {
            label: 'Email Address',
            type: 'email',
            placeholder: 'john.doe@email.com',
            required: true
          },
          phone: {
            label: 'Phone Number',
            type: 'phone',
            placeholder: '(832) 996-2231',
            required: true
          },
          location: {
            label: 'Location',
            type: 'text',
            placeholder: 'City, State',
            required: true
          },
          linkedin: {
            label: 'LinkedIn Profile',
            type: 'url',
            placeholder: 'https://linkedin.com/in/johndoe',
            required: false
          },
          website: {
            label: 'Personal Website',
            type: 'url',
            placeholder: 'https://johndoe.com',
            required: false
          }
        }
      },
      summary: {
        required: true,
        fields: {
          summary: {
            label: 'Professional Summary',
            type: 'textarea',
            placeholder: 'Experienced professional with 5+ years in...',
            required: true,
            validation: { min: 50, max: 500 },
            helpText: 'Write 2-3 sentences highlighting your key strengths and career goals'
          }
        }
      },
      experience: {
        required: true,
        fields: {
          experiences: {
            label: 'Work Experience',
            type: 'array',
            required: true,
            helpText: 'List your work experience in reverse chronological order'
          }
        }
      },
      education: {
        required: true,
        fields: {
          educations: {
            label: 'Education',
            type: 'array',
            required: true,
            helpText: 'Include your highest degree and relevant certifications'
          }
        }
      },
      skills: {
        required: true,
        fields: {
          technicalSkills: {
            label: 'Technical Skills',
            type: 'multiselect',
            placeholder: 'Select your technical skills',
            required: true,
            options: [
              'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'AWS',
              'Docker', 'Kubernetes', 'Git', 'MongoDB', 'PostgreSQL', 'TypeScript',
              'Angular', 'Vue.js', 'Express.js', 'Django', 'Flask', 'Spring Boot'
            ],
            helpText: 'Select all relevant technical skills'
          },
          softSkills: {
            label: 'Soft Skills',
            type: 'multiselect',
            placeholder: 'Select your soft skills',
            required: false,
            options: [
              'Leadership', 'Communication', 'Problem Solving', 'Teamwork',
              'Time Management', 'Adaptability', 'Critical Thinking', 'Creativity',
              'Project Management', 'Customer Service', 'Analytical Thinking'
            ]
          }
        }
      }
    },
    styling: {
      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
      fontFamily: 'Inter',
      layout: 'single-column'
    }
  },
  {
    id: 'modern-minimalist',
    name: 'Modern Minimalist',
    description: 'Sleek, contemporary design with clean lines',
    category: 'modern',
    preview: '/templates/modern-minimalist.png',
    fields: {
      contact: {
        required: true,
        fields: {
          fullName: {
            label: 'Full Name',
            type: 'text',
            placeholder: 'John Doe',
            required: true,
            validation: { min: 2, max: 50 }
          },
          title: {
            label: 'Professional Title',
            type: 'text',
            placeholder: 'Software Engineer',
            required: true
          },
          email: {
            label: 'Email',
            type: 'email',
            placeholder: 'john@email.com',
            required: true
          },
          phone: {
            label: 'Phone',
            type: 'phone',
            placeholder: '(832) 996-2231',
            required: true
          },
          location: {
            label: 'Location',
            type: 'text',
            placeholder: 'San Francisco, CA',
            required: true
          },
          linkedin: {
            label: 'LinkedIn',
            type: 'url',
            placeholder: 'linkedin.com/in/johndoe',
            required: false
          },
          github: {
            label: 'GitHub',
            type: 'url',
            placeholder: 'github.com/johndoe',
            required: false
          }
        }
      },
      summary: {
        required: true,
        fields: {
          summary: {
            label: 'About Me',
            type: 'textarea',
            placeholder: 'Passionate developer with expertise in...',
            required: true,
            validation: { min: 30, max: 300 },
            helpText: 'Write a brief, compelling summary of who you are professionally'
          }
        }
      },
      experience: {
        required: true,
        fields: {
          experiences: {
            label: 'Experience',
            type: 'array',
            required: true
          }
        }
      },
      education: {
        required: true,
        fields: {
          educations: {
            label: 'Education',
            type: 'array',
            required: true
          }
        }
      },
      skills: {
        required: true,
        fields: {
          skills: {
            label: 'Skills',
            type: 'multiselect',
            placeholder: 'Select your skills',
            required: true,
            options: [
              'JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker',
              'TypeScript', 'MongoDB', 'PostgreSQL', 'Git', 'Kubernetes'
            ]
          }
        }
      },
      projects: {
        required: false,
        fields: {
          projects: {
            label: 'Key Projects',
            type: 'array',
            required: false,
            helpText: 'Highlight your most impressive projects'
          }
        }
      }
    },
    styling: {
      primaryColor: '#000000',
      secondaryColor: '#666666',
      fontFamily: 'Helvetica',
      layout: 'two-column'
    }
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    description: 'Bold, creative design perfect for designers and creatives',
    category: 'creative',
    preview: '/templates/creative-portfolio.png',
    fields: {
      contact: {
        required: true,
        fields: {
          fullName: {
            label: 'Full Name',
            type: 'text',
            placeholder: 'Jane Smith',
            required: true
          },
          title: {
            label: 'Creative Title',
            type: 'text',
            placeholder: 'UX/UI Designer',
            required: true
          },
          email: {
            label: 'Email',
            type: 'email',
            placeholder: 'jane@creative.com',
            required: true
          },
          phone: {
            label: 'Phone',
            type: 'phone',
            placeholder: '(555) 987-6543',
            required: true
          },
          location: {
            label: 'Location',
            type: 'text',
            placeholder: 'New York, NY',
            required: true
          },
          portfolio: {
            label: 'Portfolio Website',
            type: 'url',
            placeholder: 'https://janesmith.design',
            required: true
          },
          behance: {
            label: 'Behance',
            type: 'url',
            placeholder: 'behance.net/janesmith',
            required: false
          },
          dribbble: {
            label: 'Dribbble',
            type: 'url',
            placeholder: 'dribbble.com/janesmith',
            required: false
          }
        }
      },
      summary: {
        required: true,
        fields: {
          summary: {
            label: 'Creative Statement',
            type: 'textarea',
            placeholder: 'I create beautiful, functional designs that...',
            required: true,
            validation: { min: 40, max: 400 },
            helpText: 'Write a compelling statement about your creative vision and approach'
          }
        }
      },
      experience: {
        required: true,
        fields: {
          experiences: {
            label: 'Experience',
            type: 'array',
            required: true
          }
        }
      },
      education: {
        required: true,
        fields: {
          educations: {
            label: 'Education',
            type: 'array',
            required: true
          }
        }
      },
      skills: {
        required: true,
        fields: {
          designSkills: {
            label: 'Design Skills',
            type: 'multiselect',
            placeholder: 'Select design skills',
            required: true,
            options: [
              'UI Design', 'UX Design', 'Web Design', 'Mobile Design', 'Branding',
              'Illustration', 'Typography', 'Color Theory', 'Wireframing', 'Prototyping'
            ]
          },
          tools: {
            label: 'Design Tools',
            type: 'multiselect',
            placeholder: 'Select tools',
            required: true,
            options: [
              'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator',
              'InDesign', 'After Effects', 'Principle', 'Framer', 'InVision'
            ]
          }
        }
      },
      projects: {
        required: true,
        fields: {
          projects: {
            label: 'Featured Projects',
            type: 'array',
            required: true,
            helpText: 'Showcase your best creative work'
          }
        }
      },
      awards: {
        required: false,
        fields: {
          awards: {
            label: 'Awards & Recognition',
            type: 'array',
            required: false
          }
        }
      }
    },
    styling: {
      primaryColor: '#ff6b6b',
      secondaryColor: '#4ecdc4',
      fontFamily: 'Poppins',
      layout: 'hybrid'
    }
  },
  {
    id: 'executive-premium',
    name: 'Executive Premium',
    description: 'Sophisticated design for senior executives and C-level positions',
    category: 'executive',
    preview: '/templates/executive-premium.png',
    fields: {
      contact: {
        required: true,
        fields: {
          fullName: {
            label: 'Full Name',
            type: 'text',
            placeholder: 'Robert Johnson',
            required: true
          },
          title: {
            label: 'Executive Title',
            type: 'text',
            placeholder: 'Chief Executive Officer',
            required: true
          },
          email: {
            label: 'Email',
            type: 'email',
            placeholder: 'robert@company.com',
            required: true
          },
          phone: {
            label: 'Phone',
            type: 'phone',
            placeholder: '(832) 996-2231',
            required: true
          },
          location: {
            label: 'Location',
            type: 'text',
            placeholder: 'New York, NY',
            required: true
          },
          linkedin: {
            label: 'LinkedIn',
            type: 'url',
            placeholder: 'linkedin.com/in/robertjohnson',
            required: true
          }
        }
      },
      summary: {
        required: true,
        fields: {
          summary: {
            label: 'Executive Summary',
            type: 'textarea',
            placeholder: 'Results-driven executive with 15+ years of experience...',
            required: true,
            validation: { min: 100, max: 600 },
            helpText: 'Write a comprehensive summary highlighting your leadership achievements and strategic vision'
          }
        }
      },
      experience: {
        required: true,
        fields: {
          experiences: {
            label: 'Executive Experience',
            type: 'array',
            required: true
          }
        }
      },
      education: {
        required: true,
        fields: {
          educations: {
            label: 'Education',
            type: 'array',
            required: true
          }
        }
      },
      skills: {
        required: true,
        fields: {
          leadershipSkills: {
            label: 'Leadership Skills',
            type: 'multiselect',
            placeholder: 'Select leadership skills',
            required: true,
            options: [
              'Strategic Planning', 'Team Leadership', 'Change Management', 'M&A',
              'Financial Management', 'Operations', 'Business Development', 'P&L Management'
            ]
          },
          industryExpertise: {
            label: 'Industry Expertise',
            type: 'multiselect',
            placeholder: 'Select industries',
            required: true,
            options: [
              'Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail',
              'Consulting', 'Real Estate', 'Energy', 'Media', 'Automotive'
            ]
          }
        }
      },
      achievements: {
        required: true,
        fields: {
          achievements: {
            label: 'Key Achievements',
            type: 'array',
            required: true,
            helpText: 'Highlight your most significant business achievements with metrics'
          }
        }
      },
      boardPositions: {
        required: false,
        fields: {
          boardPositions: {
            label: 'Board Positions',
            type: 'array',
            required: false
          }
        }
      },
      publications: {
        required: false,
        fields: {
          publications: {
            label: 'Publications & Speaking',
            type: 'array',
            required: false
          }
        }
      }
    },
    styling: {
      primaryColor: '#1e40af',
      secondaryColor: '#374151',
      fontFamily: 'Times New Roman',
      layout: 'single-column'
    }
  }
];

export const getTemplateById = (id: string): ResumeTemplate | undefined => {
  return RESUME_TEMPLATES.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): ResumeTemplate[] => {
  return RESUME_TEMPLATES.filter(template => template.category === category);
};

export const getFieldConfig = (templateId: string, section: string, field: string) => {
  const template = getTemplateById(templateId);
  if (!template || !template.fields[section]) return null;
  return template.fields[section].fields[field] || null;
};
