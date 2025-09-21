import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  File, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Shield, 
  Eye,
  Download,
  Trash2,
  FileText,
  FileImage,
  FileSpreadsheet
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdvancedTextExtractor } from '@/lib/AdvancedTextExtractor';

interface FileUploadResult {
  file: File;
  id: string;
  status: 'uploading' | 'scanning' | 'success' | 'error' | 'warning';
  progress: number;
  message: string;
  extractedText?: string;
  fileType: string;
  size: number;
  securityScore: number;
  threats: string[];
  metadata?: {
    fileSize?: string;
    fileName?: string;
    wordCount: number;
    characterCount: number;
    language?: string;
    pageCount?: number;
    confidence?: number;
  };
  sections?: {
    [key: string]: string;
  };
}

interface SecureFileUploadProps {
  onFileUploadSuccess: (extractedText: string, metadata: any, sections?: any) => void;
  onFileUploadError: (error: string) => void;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  maxFiles?: number;
}

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword', // .doc
  'text/plain', // .txt
  'text/rtf', // .rtf
  'application/rtf', // .rtf
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'image/webp'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

export const SecureFileUpload = ({
  onFileUploadSuccess,
  onFileUploadError,
  maxFileSize = MAX_FILE_SIZE,
  acceptedTypes = ALLOWED_TYPES,
  maxFiles = MAX_FILES
}: SecureFileUploadProps) => {
  const [files, setFiles] = useState<FileUploadResult[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Security scanning functions
  const scanFileForThreats = async (file: File): Promise<{ score: number; threats: string[] }> => {
    const threats: string[] = [];
    let score = 100;

    // Check file size
    if (file.size > maxFileSize) {
      threats.push('File size exceeds limit');
      score -= 30;
    }

    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      threats.push('Unsupported file type');
      score -= 50;
    }

    // Check for suspicious file names
    const suspiciousPatterns = [
      /\.exe$/i, /\.bat$/i, /\.cmd$/i, /\.scr$/i, /\.pif$/i,
      /\.com$/i, /\.vbs$/i, /\.js$/i, /\.jar$/i, /\.zip$/i,
      /\.rar$/i, /\.7z$/i, /\.tar$/i, /\.gz$/i
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
      threats.push('Suspicious file extension');
      score -= 40;
    }

    // Check for double extensions
    if (file.name.includes('..') || file.name.split('.').length > 2) {
      threats.push('Suspicious file name pattern');
      score -= 20;
    }

    // Check for embedded scripts in text files
    if (file.type.startsWith('text/')) {
      try {
        const text = await file.text();
        const scriptPatterns = [
          /<script/i, /javascript:/i, /vbscript:/i, /onload=/i,
          /onerror=/i, /onclick=/i, /eval\(/i, /document\./i
        ];
        
        if (scriptPatterns.some(pattern => pattern.test(text))) {
          threats.push('Potential script content detected');
          score -= 30;
        }
      } catch (error) {
        threats.push('Unable to scan file content');
        score -= 10;
      }
    }

    // Check for PDF-specific threats
    if (file.type === 'application/pdf') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const text = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);
        
        // Check for embedded JavaScript in PDF
        if (/\/JS\s*\(/i.test(text) || /\/JavaScript\s*\(/i.test(text)) {
          threats.push('PDF contains embedded JavaScript');
          score -= 25;
        }
        
        // Check for form submissions
        if (/\/SubmitForm/i.test(text) || /\/URI\s*\(/i.test(text)) {
          threats.push('PDF contains form submission capabilities');
          score -= 15;
        }
      } catch (error) {
        threats.push('Unable to scan PDF content');
        score -= 5;
      }
    }

    // Check for Office document macros
    if (file.type.includes('officedocument') || file.type === 'application/msword') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const text = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);
        
        if (/VBAProject/i.test(text) || /Macro/i.test(text) || /\.vba/i.test(text)) {
          threats.push('Document may contain macros');
          score -= 20;
        }
      } catch (error) {
        threats.push('Unable to scan document content');
        score -= 5;
      }
    }

    return { score: Math.max(0, score), threats };
  };

  const processFile = async (file: File): Promise<FileUploadResult> => {
    const fileId = Math.random().toString(36).substr(2, 9);
    
    const result: FileUploadResult = {
      file,
      id: fileId,
      status: 'uploading',
      progress: 0,
      message: 'Uploading file...',
      fileType: file.type,
      size: file.size,
      securityScore: 0,
      threats: []
    };

    setFiles(prev => [...prev, result]);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress: i, message: `Uploading... ${i}%` } : f
        ));
      }

      // Security scanning
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'scanning', message: 'Scanning for security threats...' } : f
      ));

      const securityResult = await scanFileForThreats(file);
      
      if (securityResult.score < 50) {
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { 
            ...f, 
            status: 'error', 
            message: 'File rejected due to security concerns',
            securityScore: securityResult.score,
            threats: securityResult.threats
          } : f
        ));
        
        toast({
          title: "File Rejected",
          description: "File failed security scan and was rejected.",
          variant: "destructive",
        });
        
        return { ...result, status: 'error', securityScore: securityResult.score, threats: securityResult.threats };
      }

      if (securityResult.score < 80) {
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { 
            ...f, 
            status: 'warning', 
            message: 'File has some security warnings',
            securityScore: securityResult.score,
            threats: securityResult.threats
          } : f
        ));
      }

      // Extract text using the advanced TextExtractor
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, message: 'Extracting text content...' } : f
      ));

      const extractionResult = await AdvancedTextExtractor.extractText(file);
      
      if (!extractionResult.success) {
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { 
            ...f, 
            status: 'error', 
            message: extractionResult.error || 'Failed to extract text',
            securityScore: securityResult.score,
            threats: securityResult.threats
          } : f
        ));
        
        toast({
          title: "Text Extraction Failed",
          description: extractionResult.error || "Could not extract text from file.",
          variant: "destructive",
        });
        
        return { ...result, status: 'error', securityScore: securityResult.score, threats: securityResult.threats };
      }

      const finalResult = {
        ...result,
        status: 'success' as const,
        progress: 100,
        message: 'File processed successfully',
        extractedText: extractionResult.text,
        securityScore: securityResult.score,
        threats: securityResult.threats,
        metadata: extractionResult.metadata,
        sections: extractionResult.sections
      };

      setFiles(prev => prev.map(f => f.id === fileId ? finalResult : f));
      
      onFileUploadSuccess(extractionResult.text, extractionResult.metadata, extractionResult.sections);
      
      toast({
        title: "File Uploaded Successfully",
        description: `Text extracted: ${extractionResult.metadata?.wordCount || 0} words, ${extractionResult.metadata?.pageCount || 1} pages`,
      });

      return finalResult;

    } catch (error) {
      const errorResult = {
        ...result,
        status: 'error' as const,
        message: 'Error processing file',
        securityScore: 0,
        threats: ['Processing error']
      };
      
      setFiles(prev => prev.map(f => f.id === fileId ? errorResult : f));
      
      toast({
        title: "Upload Failed",
        description: "There was an error processing your file.",
        variant: "destructive",
      });

      return errorResult;
    }
  };

  const handleFileSelect = useCallback(async (selectedFiles: FileList) => {
    const fileArray = Array.from(selectedFiles);
    
    if (files.length + fileArray.length > maxFiles) {
      toast({
        title: "Too Many Files",
        description: `Maximum ${maxFiles} files allowed.`,
        variant: "destructive",
      });
      return;
    }

    for (const file of fileArray) {
      await processFile(file);
    }
  }, [files.length, maxFiles, onFileUploadSuccess, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === 'application/pdf') return FileText;
    if (fileType.includes('officedocument') || fileType === 'application/msword') return FileText;
    if (fileType.startsWith('text/')) return FileText;
    if (fileType.startsWith('image/')) return FileImage;
    return File;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'scanning': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-8 text-center">
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Upload Resume Files</h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your files here, or click to browse
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Supported formats: PDF, DOCX, DOC, TXT, RTF, Images (JPG, PNG, GIF, BMP, TIFF, WebP)</p>
            <p>Maximum file size: {maxFileSize / (1024 * 1024)}MB</p>
            <p>Maximum files: {maxFiles}</p>
          </div>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="mt-4"
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          All files are automatically scanned for security threats before processing. 
          Files with suspicious content will be rejected to protect your data.
        </AlertDescription>
      </Alert>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold">Uploaded Files</h4>
          {files.map((file) => {
            const FileIcon = getFileIcon(file.fileType);
            return (
              <Card key={file.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileIcon className="h-8 w-8 text-gray-500" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{file.file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {AdvancedTextExtractor.formatFileSize(file.size)}
                        </Badge>
                        <Badge 
                          variant={file.status === 'success' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          Security: {file.securityScore}%
                        </Badge>
                        {file.metadata?.confidence && (
                          <Badge variant="outline" className="text-xs">
                            Confidence: {file.metadata.confidence}%
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-sm ${getStatusColor(file.status)}`}>
                          {file.message}
                        </span>
                        {file.status === 'uploading' || file.status === 'scanning' ? (
                          <Progress value={file.progress} className="w-20 h-2" />
                        ) : file.status === 'success' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : file.status === 'error' ? (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        ) : null}
                      </div>
                      {file.metadata && (
                        <div className="text-xs text-gray-500 mt-1">
                          {file.metadata.wordCount} words • {file.metadata.characterCount} characters
                          {file.metadata.pageCount && ` • ${file.metadata.pageCount} pages`}
                        </div>
                      )}
                      {file.sections && Object.keys(file.sections).length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-blue-600 font-medium">Detected Sections:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.keys(file.sections).slice(0, 5).map(section => (
                              <Badge key={section} variant="secondary" className="text-xs">
                                {section}
                              </Badge>
                            ))}
                            {Object.keys(file.sections).length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{Object.keys(file.sections).length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      {file.threats.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-red-600 font-medium">Security Issues:</p>
                          <ul className="text-xs text-red-600 list-disc list-inside">
                            {file.threats.slice(0, 2).map((threat, index) => (
                              <li key={index}>{threat}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === 'success' && file.extractedText && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Show extracted text in a modal or new tab
                          const newWindow = window.open();
                          if (newWindow) {
                            newWindow.document.write(`
                              <html>
                                <head><title>Extracted Text - ${file.file.name}</title></head>
                                <body style="font-family: monospace; padding: 20px; white-space: pre-wrap;">
                                  ${file.extractedText}
                                </body>
                              </html>
                            `);
                          }
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFile(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
