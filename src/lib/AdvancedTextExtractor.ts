// @ts-ignore
import * as mammoth from 'mammoth';
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import Tesseract from 'tesseract.js';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ExtractionResult {
  success: boolean;
  text: string;
  metadata: {
    wordCount: number;
    characterCount: number;
    pageCount: number;
    fileSize: string;
    fileType: string;
    fileName: string;
    confidence?: number;
    language?: string;
  };
  error?: string;
  sections?: {
    [key: string]: string;
  };
}

export class AdvancedTextExtractor {
  private static readonly SUPPORTED_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'text/rtf',
    'application/rtf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/webp'
  ];

  static async extractText(file: File): Promise<ExtractionResult> {
    const fileType = file.type;
    const fileName = file.name;
    const fileSize = `${(file.size / 1024).toFixed(2)} KB`;

    try {
      // Check if file type is supported
      if (!this.SUPPORTED_TYPES.includes(fileType)) {
        throw new Error(`Unsupported file type: ${fileType}`);
      }

      let text = '';
      let pageCount = 0;
      let confidence = 100;
      let language = 'en';

      if (fileType === 'application/pdf') {
        const result = await this.extractFromPDF(file);
        text = result.text;
        pageCount = result.pageCount;
        confidence = result.confidence;
      } else if (fileType.includes('officedocument') || fileType === 'application/msword') {
        const result = await this.extractFromWord(file);
        text = result.text;
        pageCount = result.pageCount;
      } else if (fileType.startsWith('text/')) {
        text = await file.text();
      } else if (fileType.startsWith('image/')) {
        const result = await this.extractFromImage(file);
        text = result.text;
        confidence = result.confidence;
      } else {
        throw new Error('Unsupported file type for text extraction');
      }

      // Clean and organize the extracted text
      const cleanedText = this.cleanText(text);
      const sections = this.organizeIntoSections(cleanedText);

      const wordCount = cleanedText.split(/\s+/).filter(word => word.length > 0).length;
      const characterCount = cleanedText.length;

      return {
        success: true,
        text: cleanedText,
        metadata: {
          wordCount,
          characterCount,
          pageCount,
          fileSize,
          fileType,
          fileName,
          confidence,
          language
        },
        sections
      };

    } catch (error) {
      console.error('Error during text extraction:', error);
      return {
        success: false,
        text: '',
        metadata: {
          wordCount: 0,
          characterCount: 0,
          pageCount: 0,
          fileSize,
          fileType,
          fileName,
          confidence: 0
        },
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private static async extractFromPDF(file: File): Promise<{ text: string; pageCount: number; confidence: number }> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      
      let fullText = '';
      const pageCount = pdf.numPages;

      // Extract text from each page
      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      return {
        text: fullText,
        pageCount,
        confidence: 95 // PDF text extraction is generally reliable
      };
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF. The file may be corrupted or password-protected.');
    }
  }

  private static async extractFromWord(file: File): Promise<{ text: string; pageCount: number }> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      return {
        text: result.value,
        pageCount: Math.ceil(result.value.length / 2000) // Rough estimate
      };
    } catch (error) {
      console.error('Word extraction error:', error);
      throw new Error('Failed to extract text from Word document.');
    }
  }

  private static async extractFromImage(file: File): Promise<{ text: string; confidence: number }> {
    try {
      const { data: { text, confidence } } = await Tesseract.recognize(file, 'eng', {
        logger: m => console.log(m)
      });
      
      return {
        text,
        confidence: Math.round(confidence)
      };
    } catch (error) {
      console.error('OCR extraction error:', error);
      throw new Error('Failed to extract text from image using OCR.');
    }
  }

  private static cleanText(text: string): string {
    return text
      // Remove excessive whitespace
      .replace(/\s+/g, ' ')
      // Remove special characters that might be artifacts
      .replace(/[^\w\s.,!?;:()\-@]/g, '')
      // Fix common OCR mistakes
      .replace(/\b0\b/g, 'O') // Replace standalone 0 with O
      .replace(/\b1\b/g, 'I') // Replace standalone 1 with I
      .replace(/\bl\b/g, 'I') // Replace lowercase l with I
      // Remove page numbers and headers/footers
      .replace(/^\d+\s*$/gm, '')
      .replace(/^Page \d+ of \d+$/gm, '')
      // Clean up email addresses
      .replace(/(\w+)@(\w+)\.(\w+)/g, '$1@$2.$3')
      // Clean up phone numbers
      .replace(/(\d{3})[^\d](\d{3})[^\d](\d{4})/g, '($1) $2-$3')
      .trim();
  }

  private static organizeIntoSections(text: string): { [key: string]: string } {
    const sections: { [key: string]: string } = {};
    
    // Common resume section patterns
    const sectionPatterns = {
      'contact': /(?:contact|personal)\s*information/i,
      'summary': /(?:summary|profile|objective|about)\s*(?:me|myself)?/i,
      'experience': /(?:work\s*)?experience|employment|career\s*history/i,
      'education': /education|academic|qualifications/i,
      'skills': /skills|technical\s*skills|competencies/i,
      'projects': /projects|portfolio|key\s*projects/i,
      'certifications': /certifications|certificates|licenses/i,
      'awards': /awards|honors|achievements/i,
      'languages': /languages|language\s*skills/i,
      'interests': /interests|hobbies|activities/i
    };

    // Split text into lines
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    let currentSection = 'other';
    let currentContent: string[] = [];

    for (const line of lines) {
      let foundSection = false;
      
      // Check if this line matches any section header
      for (const [sectionName, pattern] of Object.entries(sectionPatterns)) {
        if (pattern.test(line)) {
          // Save previous section
          if (currentContent.length > 0) {
            sections[currentSection] = currentContent.join('\n').trim();
          }
          
          // Start new section
          currentSection = sectionName;
          currentContent = [];
          foundSection = true;
          break;
        }
      }
      
      if (!foundSection) {
        currentContent.push(line);
      }
    }
    
    // Save the last section
    if (currentContent.length > 0) {
      sections[currentSection] = currentContent.join('\n').trim();
    }

    return sections;
  }

  static getFileIcon(fileType: string): string {
    switch (fileType) {
      case 'application/pdf':
        return '📄';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword':
        return '📝';
      case 'text/plain':
        return '📃';
      case 'application/rtf':
        return '📑';
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
      case 'image/bmp':
      case 'image/tiff':
      case 'image/webp':
        return '🖼️';
      default:
        return '📁';
    }
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
