// Text extraction utilities for different file types

export interface TextExtractionResult {
  success: boolean;
  text: string;
  error?: string;
  metadata?: {
    pageCount?: number;
    wordCount?: number;
    characterCount?: number;
    language?: string;
  };
}

export class TextExtractor {
  static async extractText(file: File): Promise<TextExtractionResult> {
    try {
      switch (file.type) {
        case 'text/plain':
        case 'text/rtf':
        case 'application/rtf':
          return await this.extractFromTextFile(file);
        
        case 'application/pdf':
          return await this.extractFromPDF(file);
        
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
          return await this.extractFromWordDocument(file);
        
        default:
          return {
            success: false,
            text: '',
            error: `Unsupported file type: ${file.type}`
          };
      }
    } catch (error) {
      return {
        success: false,
        text: '',
        error: `Error extracting text: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private static async extractFromTextFile(file: File): Promise<TextExtractionResult> {
    try {
      const text = await file.text();
      const metadata = this.analyzeText(text);
      
      return {
        success: true,
        text: this.cleanText(text),
        metadata
      };
    } catch (error) {
      return {
        success: false,
        text: '',
        error: 'Failed to read text file'
      };
    }
  }

  private static async extractFromPDF(file: File): Promise<TextExtractionResult> {
    try {
      // Dynamic import to avoid bundling issues
      const pdfParse = await import('pdf-parse');
      
      const arrayBuffer = await file.arrayBuffer();
      const data = await pdfParse.default(arrayBuffer);
      
      if (!data.text || data.text.trim().length === 0) {
        return {
          success: false,
          text: '',
          error: 'No readable text found in PDF. The PDF may contain only images or be password-protected.'
        };
      }
      
      const metadata = this.analyzeText(data.text);
      metadata.pageCount = data.numpages;
      
      return {
        success: true,
        text: this.cleanText(data.text),
        metadata
      };
    } catch (error) {
      console.error('PDF extraction error:', error);
      
      // Fallback to basic extraction if pdf-parse fails
      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const content = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);
        
        // Look for text between BT and ET markers (PDF text objects)
        const textMatches = content.match(/BT\s*([^E]*?)ET/g);
        let extractedText = '';
        
        if (textMatches) {
          extractedText = textMatches
            .map(match => match.replace(/BT\s*/, '').replace(/\s*ET/, ''))
            .join(' ')
            .replace(/[^\x20-\x7E]/g, ' ') // Remove non-printable characters
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
        }
        
        // Fallback: try to extract any readable text
        if (!extractedText) {
          const readableText = content
            .replace(/[^\x20-\x7E]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          
          // Look for common resume keywords to validate it's actually text content
          const resumeKeywords = [
            'experience', 'education', 'skills', 'objective', 'summary',
            'employment', 'work', 'job', 'position', 'responsibilities',
            'achievements', 'projects', 'certifications', 'languages',
            'contact', 'phone', 'email', 'address', 'linkedin'
          ];
          
          const hasResumeContent = resumeKeywords.some(keyword => 
            readableText.toLowerCase().includes(keyword)
          );
          
          if (hasResumeContent) {
            extractedText = readableText;
          }
        }
        
        if (!extractedText) {
          return {
            success: false,
            text: '',
            error: 'No readable text found in PDF. Please ensure the PDF contains text (not just images) or try converting to a text file.'
          };
        }
        
        const metadata = this.analyzeText(extractedText);
        
        return {
          success: true,
          text: this.cleanText(extractedText),
          metadata
        };
      } catch (fallbackError) {
        return {
          success: false,
          text: '',
          error: 'Failed to extract text from PDF. Please try converting to a text file or DOCX format.'
        };
      }
    }
  }

  private static async extractFromWordDocument(file: File): Promise<TextExtractionResult> {
    try {
      // This is a simplified Word document extraction
      // In production, you'd want to use a proper library like mammoth.js
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const content = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);
      
      // Look for readable text patterns
      const textPatterns = [
        /[A-Za-z][A-Za-z0-9\s.,;:!?\-()]{10,}/g, // Words and sentences
        /[A-Za-z]{2,}/g // Individual words
      ];
      
      let extractedText = '';
      for (const pattern of textPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          extractedText = matches.join(' ');
          break;
        }
      }
      
      if (!extractedText) {
        return {
          success: false,
          text: '',
          error: 'No readable text found in Word document. Please save as a text file or PDF for better compatibility.'
        };
      }
      
      const metadata = this.analyzeText(extractedText);
      
      return {
        success: true,
        text: this.cleanText(extractedText),
        metadata
      };
    } catch (error) {
      return {
        success: false,
        text: '',
        error: 'Failed to extract text from Word document'
      };
    }
  }

  private static cleanText(text: string): string {
    return text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\r/g, '\n') // Normalize line endings
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines
      .replace(/[ \t]+/g, ' ') // Normalize spaces and tabs
      .replace(/^\s+|\s+$/g, '') // Trim whitespace
      .replace(/\s*\n\s*/g, '\n') // Clean up line breaks
      .trim();
  }

  private static analyzeText(text: string): {
    pageCount?: number;
    wordCount: number;
    characterCount: number;
    language?: string;
  } {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    
    // Estimate page count (assuming ~250 words per page)
    const estimatedPages = Math.ceil(words.length / 250);
    
    // Simple language detection (basic)
    const language = this.detectLanguage(text);
    
    return {
      pageCount: estimatedPages,
      wordCount: words.length,
      characterCount: characters,
      language
    };
  }

  private static detectLanguage(text: string): string {
    // Simple language detection based on common words
    const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const spanishWords = ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te'];
    const frenchWords = ['le', 'la', 'de', 'et', 'à', 'un', 'il', 'que', 'ne', 'se', 'ce', 'pas'];
    
    const lowerText = text.toLowerCase();
    
    const englishCount = englishWords.reduce((count, word) => 
      count + (lowerText.split(word).length - 1), 0
    );
    const spanishCount = spanishWords.reduce((count, word) => 
      count + (lowerText.split(word).length - 1), 0
    );
    const frenchCount = frenchWords.reduce((count, word) => 
      count + (lowerText.split(word).length - 1), 0
    );
    
    if (englishCount > spanishCount && englishCount > frenchCount) return 'en';
    if (spanishCount > englishCount && spanishCount > frenchCount) return 'es';
    if (frenchCount > englishCount && frenchCount > spanishCount) return 'fr';
    
    return 'unknown';
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static getFileTypeIcon(mimeType: string): string {
    switch (mimeType) {
      case 'application/pdf':
        return '📄';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword':
        return '📝';
      case 'text/plain':
        return '📃';
      case 'text/rtf':
      case 'application/rtf':
        return '📋';
      default:
        return '📁';
    }
  }
}
