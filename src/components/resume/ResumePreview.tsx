import React from 'react';
import { ResumeTemplate } from '@/lib/ResumeTemplates';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  Github, 
  Twitter,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Calendar,
  User,
  Star,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface ResumePreviewProps {
  template: ResumeTemplate | null;
  data: any;
  isPreview?: boolean;
  isFullscreen?: boolean;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  template,
  data,
  isPreview = false,
  isFullscreen = false
}) => {
  if (!template) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">Select a template to see preview</p>
        </div>
      </div>
    );
  }

  const renderContactInfo = () => {
    const contact = data.contact || {};
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">{contact.fullName || 'Your Name'}</h1>
        {contact.title && <p className="text-lg text-gray-700">{contact.title}</p>}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {contact.email && (
            <div className="flex items-center space-x-1">
              <Mail className="w-4 h-4" />
              <span>{contact.email}</span>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>{contact.phone}</span>
            </div>
          )}
          {contact.location && (
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{contact.location}</span>
            </div>
          )}
          {contact.linkedin && (
            <div className="flex items-center space-x-1">
              <Linkedin className="w-4 h-4" />
              <span>{contact.linkedin}</span>
            </div>
          )}
          {contact.github && (
            <div className="flex items-center space-x-1">
              <Github className="w-4 h-4" />
              <span>{contact.github}</span>
            </div>
          )}
          {contact.website && (
            <div className="flex items-center space-x-1">
              <Globe className="w-4 h-4" />
              <span>{contact.website}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    const summary = data.summary?.summary || '';
    if (!summary && !isPreview) return null;
    
    return (
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1">
          {template.id === 'creative-portfolio' ? 'Creative Statement' : 
           template.id === 'executive-premium' ? 'Executive Summary' : 'Professional Summary'}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {summary || (isPreview ? 'Your professional summary will appear here. Write 2-3 sentences highlighting your key strengths and career goals.' : '')}
        </p>
      </div>
    );
  };

  const renderExperience = () => {
    const experiences = data.experience?.experiences || [];
    if (!experiences.length && !isPreview) return null;
    
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1">
          {template.id === 'executive-premium' ? 'Executive Experience' : 'Experience'}
        </h2>
        {experiences.length > 0 ? (
          <div className="space-y-4">
            {experiences.map((exp: any, index: number) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.title || 'Job Title'}</h3>
                    <p className="text-gray-700">{exp.company || 'Company Name'}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{exp.startDate || 'Start Date'} - {exp.current ? 'Present' : (exp.endDate || 'End Date')}</p>
                    {exp.location && <p>{exp.location}</p>}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : isPreview ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">Senior Software Engineer</h3>
                  <p className="text-gray-700">Tech Company Inc.</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>2020 - Present</p>
                  <p>San Francisco, CA</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Led development of scalable web applications using React and Node.js, resulting in 40% improvement in user engagement.
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">Software Engineer</h3>
                  <p className="text-gray-700">StartupXYZ</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>2018 - 2020</p>
                  <p>New York, NY</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Developed and maintained full-stack applications, collaborating with cross-functional teams to deliver high-quality software solutions.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const renderEducation = () => {
    const educations = data.education?.educations || [];
    if (!educations.length && !isPreview) return null;
    
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1">
          Education
        </h2>
        {educations.length > 0 ? (
          <div className="space-y-3">
            {educations.map((edu: any, index: number) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree || 'Degree'}</h3>
                    <p className="text-gray-700">{edu.institution || 'Institution Name'}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{edu.graduationDate || 'Graduation Date'}</p>
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                  </div>
                </div>
                {edu.honors && (
                  <p className="text-gray-700 text-sm">{edu.honors}</p>
                )}
              </div>
            ))}
          </div>
        ) : isPreview ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">Bachelor of Science in Computer Science</h3>
                  <p className="text-gray-700">University of California, Berkeley</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>2018</p>
                  <p>GPA: 3.8/4.0</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">Magna Cum Laude, Dean's List</p>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const renderSkills = () => {
    const skills = data.skills || {};
    const hasSkills = Object.values(skills).some((skill: any) => 
      Array.isArray(skill) ? skill.length > 0 : skill
    );
    
    if (!hasSkills && !isPreview) return null;
    
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1">
          Skills
        </h2>
        <div className="space-y-3">
          {Object.entries(skills).map(([skillType, skillList]) => {
            if (!Array.isArray(skillList) || skillList.length === 0) return null;
            
            return (
              <div key={skillType} className="space-y-1">
                <h3 className="font-medium text-gray-800 capitalize">
                  {skillType.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillList.map((skill: string, index: number) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
          
          {isPreview && !hasSkills && (
            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="font-medium text-gray-800">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'].map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-gray-800">Soft Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {['Leadership', 'Communication', 'Problem Solving', 'Teamwork'].map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    const projects = data.projects?.projects || [];
    if (!projects.length && !isPreview) return null;
    
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1">
          {template.id === 'creative-portfolio' ? 'Featured Projects' : 'Key Projects'}
        </h2>
        {projects.length > 0 ? (
          <div className="space-y-3">
            {projects.map((project: any, index: number) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{project.name || 'Project Name'}</h3>
                    {project.url && (
                      <a 
                        href={project.url} 
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View Project</span>
                      </a>
                    )}
                  </div>
                </div>
                {project.description && (
                  <p className="text-gray-700 text-sm leading-relaxed">{project.description}</p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech: string, techIndex: number) => (
                      <span 
                        key={techIndex}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : isPreview ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900">E-Commerce Platform</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Built a full-stack e-commerce platform using React, Node.js, and MongoDB. Implemented payment processing, user authentication, and inventory management.
              </p>
              <div className="flex flex-wrap gap-1">
                {['React', 'Node.js', 'MongoDB', 'Stripe'].map((tech, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const getTemplateStyles = () => {
    if (!template) return {};
    
    return {
      '--primary-color': template.styling.primaryColor,
      '--secondary-color': template.styling.secondaryColor,
      '--font-family': template.styling.fontFamily,
    } as React.CSSProperties;
  };

  const renderResumeContent = () => {
    const isTwoColumn = template?.styling.layout === 'two-column';
    const isHybrid = template?.styling.layout === 'hybrid';
    
    if (isTwoColumn) {
      return (
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            {renderContactInfo()}
            {renderSummary()}
            {renderExperience()}
          </div>
          <div className="space-y-6">
            {renderSkills()}
            {renderEducation()}
            {renderProjects()}
          </div>
        </div>
      );
    }
    
    if (isHybrid) {
      return (
        <div className="space-y-6">
          {renderContactInfo()}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              {renderSummary()}
              {renderExperience()}
            </div>
            <div className="space-y-6">
              {renderSkills()}
              {renderEducation()}
            </div>
          </div>
          {renderProjects()}
        </div>
      );
    }
    
    // Single column layout
    return (
      <div className="space-y-6">
        {renderContactInfo()}
        {renderSummary()}
        {renderExperience()}
        {renderEducation()}
        {renderSkills()}
        {renderProjects()}
      </div>
    );
  };

  return (
    <div 
      className={`w-full bg-white text-gray-900 ${isFullscreen ? 'p-8' : 'p-6'} ${isPreview ? 'border-2 border-dashed border-gray-300' : ''}`}
      style={getTemplateStyles()}
    >
      <div className="max-w-4xl mx-auto">
        {renderResumeContent()}
      </div>
    </div>
  );
};
