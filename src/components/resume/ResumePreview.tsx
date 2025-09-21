import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, Printer } from 'lucide-react';
import { ResumeTemplate } from '@/lib/ResumeTemplates';
import { useToast } from '@/hooks/use-toast';

interface ResumePreviewProps {
  template: ResumeTemplate;
  resumeData?: {
    text: string;
    sections?: { [key: string]: string };
  };
  data?: any;
  isFullscreen?: boolean;
  isPreview?: boolean;
}

export const ResumePreview = ({ template, resumeData, data, isFullscreen, isPreview }: ResumePreviewProps) => {
  // Use resumeData if provided, otherwise fallback to data or empty object
  const resume = resumeData || data || { text: 'Your resume content will appear here...' };
  const { toast } = useToast();

  const handleDownload = () => {
    // Create a printable version of the resume
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Resume - ${template.name}</title>
            <style>
              body { 
                font-family: ${template.styling.fontFamily}, sans-serif; 
                margin: 0; 
                padding: 20px; 
                background: white;
                color: #333;
                line-height: 1.6;
              }
              .resume-container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                padding: 40px;
              }
              .header {
                border-bottom: 2px solid ${template.styling.primaryColor};
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .name {
                font-size: 2.5em;
                font-weight: bold;
                color: ${template.styling.primaryColor};
                margin-bottom: 10px;
              }
              .contact {
                color: ${template.styling.secondaryColor};
                font-size: 1.1em;
              }
              .section {
                margin-bottom: 30px;
              }
              .section-title {
                font-size: 1.3em;
                font-weight: bold;
                color: ${template.styling.primaryColor};
                border-bottom: 1px solid ${template.styling.primaryColor};
                padding-bottom: 5px;
                margin-bottom: 15px;
              }
              .content {
                white-space: pre-wrap;
                font-size: 1em;
                line-height: 1.6;
              }
              @media print {
                body { margin: 0; padding: 0; }
                .resume-container { box-shadow: none; }
              }
            </style>
          </head>
          <body>
            <div class="resume-container">
              <div class="header">
                <div class="name">Your Name</div>
                <div class="contact">your.email@example.com • (555) 123-4567 • City, State</div>
              </div>
              <div class="content">${resume.text}</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
    toast({
      title: "Resume Ready",
      description: "Resume opened in new window for printing or saving as PDF",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Resume Preview</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>
      
      <Card className="border-2">
        <CardContent className="p-0">
          <div 
            className="resume-preview"
            style={{
              fontFamily: template.styling.fontFamily,
              color: '#333',
              lineHeight: '1.6',
              padding: '40px',
              background: 'white',
              minHeight: '800px'
            }}
          >
            {/* Header */}
            <div 
              className="header"
              style={{
                borderBottom: `2px solid ${template.styling.primaryColor}`,
                paddingBottom: '20px',
                marginBottom: '30px'
              }}
            >
              <div 
                className="name"
                style={{
                  fontSize: '2.5em',
                  fontWeight: 'bold',
                  color: template.styling.primaryColor,
                  marginBottom: '10px'
                }}
              >
                Your Name
              </div>
              <div 
                className="contact"
                style={{
                  color: template.styling.secondaryColor,
                  fontSize: '1.1em'
                }}
              >
                your.email@example.com • (555) 123-4567 • City, State
              </div>
            </div>

            {/* Content */}
            <div 
              className="content"
              style={{
                whiteSpace: 'pre-wrap',
                fontSize: '1em',
                lineHeight: '1.6'
              }}
            >
              {resume.text}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
