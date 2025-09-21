// Advanced file security scanning utilities

export interface SecurityScanResult {
  isSafe: boolean;
  score: number; // 0-100
  threats: SecurityThreat[];
  warnings: string[];
  recommendations: string[];
}

export interface SecurityThreat {
  type: 'malware' | 'script' | 'macro' | 'suspicious' | 'size' | 'type';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  details?: string;
}

export class FileSecurityScanner {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'text/rtf',
    'application/rtf',
  ];

  private static readonly SUSPICIOUS_EXTENSIONS = [
    '.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.vbs', '.js', '.jar',
    '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz'
  ];

  private static readonly MALICIOUS_PATTERNS = [
    // JavaScript patterns
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
    /onclick\s*=/gi,
    /eval\s*\(/gi,
    /document\./gi,
    /window\./gi,
    
    // Shell command patterns
    /cmd\.exe/gi,
    /powershell/gi,
    /bash/gi,
    /sh\s+/gi,
    
    // Network patterns
    /http:\/\//gi,
    /https:\/\//gi,
    /ftp:\/\//gi,
    /file:\/\//gi,
    
    // File system patterns
    /\.\.\//gi,
    /\.\.\\/gi,
    /C:\\/gi,
    /\/etc\//gi,
    /\/bin\//gi,
    
    // PDF specific threats
    /\/JS\s*\(/gi,
    /\/JavaScript\s*\(/gi,
    /\/SubmitForm/gi,
    /\/URI\s*\(/gi,
    /\/GoTo/gi,
    /\/Launch/gi,
    
    // Office document threats
    /VBAProject/gi,
    /Macro/gi,
    /\.vba/gi,
    /AutoOpen/gi,
    /AutoClose/gi,
    /Document_Open/gi,
    /Document_Close/gi,
  ];

  static async scanFile(file: File): Promise<SecurityScanResult> {
    const threats: SecurityThreat[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Basic file validation
    const basicValidation = this.validateBasicProperties(file);
    threats.push(...basicValidation.threats);
    warnings.push(...basicValidation.warnings);
    score -= basicValidation.scoreReduction;

    // Content scanning
    const contentScan = await this.scanFileContent(file);
    threats.push(...contentScan.threats);
    warnings.push(...contentScan.warnings);
    score -= contentScan.scoreReduction;

    // File type specific scanning
    const typeSpecificScan = await this.scanFileTypeSpecific(file);
    threats.push(...typeSpecificScan.threats);
    warnings.push(...typeSpecificScan.warnings);
    score -= typeSpecificScan.scoreReduction;

    // Generate recommendations
    if (threats.length > 0) {
      recommendations.push('Review the file for suspicious content before proceeding');
    }
    if (file.size > 5 * 1024 * 1024) {
      recommendations.push('Consider using a smaller file size for better performance');
    }
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      recommendations.push('Use a supported file format (PDF, DOCX, TXT) for better compatibility');
    }

    const isSafe = threats.filter(t => t.severity === 'critical' || t.severity === 'high').length === 0;
    const finalScore = Math.max(0, Math.min(100, score));

    return {
      isSafe,
      score: finalScore,
      threats,
      warnings,
      recommendations
    };
  }

  private static validateBasicProperties(file: File): {
    threats: SecurityThreat[];
    warnings: string[];
    scoreReduction: number;
  } {
    const threats: SecurityThreat[] = [];
    const warnings: string[] = [];
    let scoreReduction = 0;

    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      threats.push({
        type: 'size',
        severity: 'high',
        description: 'File size exceeds maximum allowed limit',
        details: `File size: ${(file.size / 1024 / 1024).toFixed(2)}MB, Max allowed: ${this.MAX_FILE_SIZE / 1024 / 1024}MB`
      });
      scoreReduction += 30;
    } else if (file.size > 5 * 1024 * 1024) {
      warnings.push('Large file size may affect processing speed');
    }

    // Check file type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      threats.push({
        type: 'type',
        severity: 'medium',
        description: 'Unsupported file type',
        details: `File type: ${file.type}`
      });
      scoreReduction += 20;
    }

    // Check file name for suspicious patterns
    const fileName = file.name.toLowerCase();
    
    // Check for double extensions
    if (fileName.includes('..') || fileName.split('.').length > 2) {
      threats.push({
        type: 'suspicious',
        severity: 'high',
        description: 'Suspicious file name pattern detected',
        details: 'File name contains double extensions or suspicious characters'
      });
      scoreReduction += 25;
    }

    // Check for suspicious extensions
    const hasSuspiciousExtension = this.SUSPICIOUS_EXTENSIONS.some(ext => 
      fileName.endsWith(ext)
    );
    
    if (hasSuspiciousExtension) {
      threats.push({
        type: 'malware',
        severity: 'critical',
        description: 'Potentially malicious file extension detected',
        details: 'File has an extension commonly associated with executable or compressed files'
      });
      scoreReduction += 50;
    }

    // Check for very long file names
    if (file.name.length > 255) {
      warnings.push('File name is unusually long');
    }

    return { threats, warnings, scoreReduction };
  }

  private static async scanFileContent(file: File): Promise<{
    threats: SecurityThreat[];
    warnings: string[];
    scoreReduction: number;
  }> {
    const threats: SecurityThreat[] = [];
    const warnings: string[] = [];
    let scoreReduction = 0;

    try {
      let content = '';
      
      if (file.type.startsWith('text/')) {
        content = await file.text();
      } else {
        // For binary files, try to extract readable text
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        content = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);
      }

      // Scan for malicious patterns
      for (const pattern of this.MALICIOUS_PATTERNS) {
        const matches = content.match(pattern);
        if (matches) {
          const patternType = this.getPatternType(pattern);
          threats.push({
            type: patternType.type,
            severity: patternType.severity,
            description: patternType.description,
            details: `Found ${matches.length} matches: ${matches.slice(0, 3).join(', ')}${matches.length > 3 ? '...' : ''}`
          });
          scoreReduction += patternType.scoreReduction;
        }
      }

      // Check for excessive special characters (potential obfuscation)
      const specialCharCount = (content.match(/[^\w\s]/g) || []).length;
      const totalChars = content.length;
      const specialCharRatio = specialCharCount / totalChars;
      
      if (specialCharRatio > 0.3) {
        warnings.push('File contains high ratio of special characters');
      }

      // Check for base64 encoded content (potential obfuscation)
      const base64Matches = content.match(/[A-Za-z0-9+/]{50,}={0,2}/g);
      if (base64Matches && base64Matches.length > 5) {
        warnings.push('File contains multiple base64 encoded sections');
      }

    } catch (error) {
      warnings.push('Unable to scan file content for security threats');
    }

    return { threats, warnings, scoreReduction };
  }

  private static async scanFileTypeSpecific(file: File): Promise<{
    threats: SecurityThreat[];
    warnings: string[];
    scoreReduction: number;
  }> {
    const threats: SecurityThreat[] = [];
    const warnings: string[] = [];
    let scoreReduction = 0;

    try {
      if (file.type === 'application/pdf') {
        const pdfScan = await this.scanPDFFile(file);
        threats.push(...pdfScan.threats);
        warnings.push(...pdfScan.warnings);
        scoreReduction += pdfScan.scoreReduction;
      } else if (file.type.includes('officedocument') || file.type === 'application/msword') {
        const officeScan = await this.scanOfficeFile(file);
        threats.push(...officeScan.threats);
        warnings.push(...officeScan.warnings);
        scoreReduction += officeScan.scoreReduction;
      }
    } catch (error) {
      warnings.push('Unable to perform file type specific security scan');
    }

    return { threats, warnings, scoreReduction };
  }

  private static async scanPDFFile(file: File): Promise<{
    threats: SecurityThreat[];
    warnings: string[];
    scoreReduction: number;
  }> {
    const threats: SecurityThreat[] = [];
    const warnings: string[] = [];
    let scoreReduction = 0;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const content = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);

      // Check for JavaScript in PDF
      if (/\/JS\s*\(/i.test(content) || /\/JavaScript\s*\(/i.test(content)) {
        threats.push({
          type: 'script',
          severity: 'high',
          description: 'PDF contains embedded JavaScript',
          details: 'JavaScript in PDFs can be used for malicious purposes'
        });
        scoreReduction += 25;
      }

      // Check for form submissions
      if (/\/SubmitForm/i.test(content)) {
        threats.push({
          type: 'script',
          severity: 'medium',
          description: 'PDF contains form submission capabilities',
          details: 'Form submissions can be used to send data to external servers'
        });
        scoreReduction += 15;
      }

      // Check for external links
      if (/\/URI\s*\(/i.test(content)) {
        warnings.push('PDF contains external links');
      }

      // Check for launch actions
      if (/\/Launch/i.test(content)) {
        threats.push({
          type: 'malware',
          severity: 'high',
          description: 'PDF contains launch actions',
          details: 'Launch actions can execute external programs'
        });
        scoreReduction += 30;
      }

    } catch (error) {
      warnings.push('Unable to scan PDF content');
    }

    return { threats, warnings, scoreReduction };
  }

  private static async scanOfficeFile(file: File): Promise<{
    threats: SecurityThreat[];
    warnings: string[];
    scoreReduction: number;
  }> {
    const threats: SecurityThreat[] = [];
    const warnings: string[] = [];
    let scoreReduction = 0;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const content = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);

      // Check for VBA macros
      if (/VBAProject/i.test(content)) {
        threats.push({
          type: 'macro',
          severity: 'high',
          description: 'Document contains VBA macros',
          details: 'VBA macros can contain malicious code'
        });
        scoreReduction += 30;
      }

      // Check for macro-related keywords
      if (/Macro/i.test(content) || /\.vba/i.test(content)) {
        threats.push({
          type: 'macro',
          severity: 'medium',
          description: 'Document may contain macro code',
          details: 'Macro code can be used for malicious purposes'
        });
        scoreReduction += 20;
      }

      // Check for auto-execution macros
      if (/AutoOpen/i.test(content) || /AutoClose/i.test(content) || 
          /Document_Open/i.test(content) || /Document_Close/i.test(content)) {
        threats.push({
          type: 'macro',
          severity: 'critical',
          description: 'Document contains auto-execution macros',
          details: 'Auto-execution macros can run automatically when the document is opened'
        });
        scoreReduction += 40;
      }

    } catch (error) {
      warnings.push('Unable to scan Office document content');
    }

    return { threats, warnings, scoreReduction };
  }

  private static getPatternType(pattern: RegExp): {
    type: SecurityThreat['type'];
    severity: SecurityThreat['severity'];
    description: string;
    scoreReduction: number;
  } {
    const patternStr = pattern.toString();
    
    if (patternStr.includes('script') || patternStr.includes('javascript') || patternStr.includes('vbscript')) {
      return {
        type: 'script',
        severity: 'high',
        description: 'Script content detected',
        scoreReduction: 25
      };
    }
    
    if (patternStr.includes('cmd') || patternStr.includes('powershell') || patternStr.includes('bash')) {
      return {
        type: 'malware',
        severity: 'critical',
        description: 'Shell command patterns detected',
        scoreReduction: 40
      };
    }
    
    if (patternStr.includes('http') || patternStr.includes('ftp') || patternStr.includes('file://')) {
      return {
        type: 'suspicious',
        severity: 'medium',
        description: 'Network or file system access patterns detected',
        scoreReduction: 15
      };
    }
    
    if (patternStr.includes('VBA') || patternStr.includes('Macro')) {
      return {
        type: 'macro',
        severity: 'high',
        description: 'Macro-related content detected',
        scoreReduction: 30
      };
    }
    
    return {
      type: 'suspicious',
      severity: 'low',
      description: 'Suspicious pattern detected',
      scoreReduction: 10
    };
  }

  static getSecurityLevel(score: number): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 50) return 'fair';
    if (score >= 25) return 'poor';
    return 'critical';
  }

  static getSecurityColor(score: number): string {
    const level = this.getSecurityLevel(score);
    switch (level) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }
}
