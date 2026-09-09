import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import PDFParser from 'pdf2json';
import mammoth from 'mammoth';
import WordExtractor from 'word-extractor';
import Tesseract from 'tesseract.js';

/**
 * Strategy 2: Extract text from PDF using pdf2json
 */
const extractPdfWithPdf2Json = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const pdfParser = new PDFParser(null, 1);
      pdfParser.on('pdfParser_dataError', (errData) => {
        reject(new Error(errData?.parserError || 'pdf2json failed'));
      });
      pdfParser.on('pdfParser_dataReady', () => {
        try {
          const rawText = pdfParser.getRawTextContent();
          resolve(rawText || '');
        } catch (e) {
          reject(e);
        }
      });
      pdfParser.loadPDF(filePath);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Strategy 3: Fallback raw stream text extraction from PDF buffer
 * Extracts text from FlateDecode streams or uncompressed text blocks
 */
const extractPdfRawStreams = (buffer) => {
  let extracted = '';
  try {
    // 1. Search for stream ... endstream blocks
    const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
    let match;
    while ((match = streamRegex.exec(buffer.toString('binary'))) !== null) {
      const streamData = Buffer.from(match[1], 'binary');
      let decompressed = null;
      try {
        decompressed = zlib.inflateSync(streamData);
      } catch {
        try {
          decompressed = zlib.inflateRawSync(streamData);
        } catch {
          // not compressed or different format
        }
      }

      const content = (decompressed || streamData).toString('utf-8');
      
      // Match PDF text operators: (text) Tj, [(t)(e)(x)(t)] TJ, etc.
      const textMatches = content.match(/\(([^()]*)\)\s*Tj/g) || [];
      for (const tm of textMatches) {
        const textVal = tm.replace(/^\(|\)\s*Tj$/g, '');
        if (textVal.trim()) extracted += textVal + ' ';
      }

      const tjMatches = content.match(/\[(.*?)\]\s*TJ/g) || [];
      for (const tm of tjMatches) {
        const innerStrings = tm.match(/\(([^()]*)\)/g) || [];
        for (const is of innerStrings) {
          const val = is.replace(/^\(|\)$/g, '');
          if (val.trim()) extracted += val + ' ';
        }
      }
    }
  } catch (err) {
    console.warn('Raw stream fallback warning:', err.message);
  }
  return extracted;
};

/**
 * Extract text from PDF with multiple cascading fallbacks
 */
export const extractTextFromPdf = async (filePath) => {
  let text = '';
  const buffer = fs.readFileSync(filePath);

  // Strategy 1: Standard pdf-parse
  try {
    const data = await pdfParse(buffer);
    if (data && data.text && data.text.trim().length >= 50) {
      return data.text;
    }
    text = data?.text || '';
  } catch (err1) {
    console.warn('pdf-parse failed, falling back to pdf2json:', err1.message);
  }

  // Strategy 2: pdf2json (fixes "Illegal character: 41" and modern PDF streams)
  try {
    const pdf2jsonText = await extractPdfWithPdf2Json(filePath);
    if (pdf2jsonText && pdf2jsonText.trim().length >= 50) {
      return pdf2jsonText;
    }
    if (pdf2jsonText && pdf2jsonText.trim().length > text.trim().length) {
      text = pdf2jsonText;
    }
  } catch (err2) {
    console.warn('pdf2json fallback failed:', err2.message);
  }

  // Strategy 3: Raw stream extraction
  try {
    const rawStreamText = extractPdfRawStreams(buffer);
    if (rawStreamText && rawStreamText.trim().length >= 50) {
      return rawStreamText;
    }
    if (rawStreamText && rawStreamText.trim().length > text.trim().length) {
      text = rawStreamText;
    }
  } catch (err3) {
    console.warn('Raw stream extraction failed:', err3.message);
  }

  // Strategy 4: If text is still empty or too short (scanned PDF / image-only PDF), run OCR
  if (!text || text.trim().length < 50) {
    try {
      console.log('Attempting OCR on PDF:', filePath);
      const ocrResult = await Tesseract.recognize(filePath, 'eng');
      if (ocrResult?.data?.text && ocrResult.data.text.trim().length >= 30) {
        return ocrResult.data.text;
      }
    } catch (ocrErr) {
      console.warn('PDF OCR fallback failed:', ocrErr.message);
    }
  }

  return text;
};

/**
 * Extract text from Word document (.docx, .doc)
 */
export const extractTextFromWord = async (filePath, ext) => {
  // Strategy 1: mammoth for .docx
  if (ext === '.docx') {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      if (result.value && result.value.trim().length >= 30) {
        return result.value;
      }
    } catch (err) {
      console.warn('mammoth extraction failed, trying word-extractor:', err.message);
    }
  }

  // Strategy 2: word-extractor for .doc and fallback for .docx
  try {
    const extractor = new WordExtractor();
    const extracted = await extractor.extract(filePath);
    const body = extracted.getBody();
    if (body && body.trim().length >= 30) {
      return body;
    }
  } catch (err) {
    console.warn('word-extractor failed:', err.message);
  }

  return '';
};

/**
 * Extract text from image using Tesseract OCR (.png, .jpg, .jpeg)
 */
export const extractTextFromImage = async (filePath) => {
  try {
    const result = await Tesseract.recognize(filePath, 'eng');
    return result?.data?.text || '';
  } catch (err) {
    console.error('Image OCR extraction failed:', err);
    throw new Error('Failed to read text from image. Please ensure the image is clear and well-lit.');
  }
};

/**
 * Main dispatcher: extract text from any supported resume format
 */
export const extractResumeText = async (file) => {
  const filePath = file.path;
  const originalName = file.originalname || '';
  const ext = path.extname(originalName).toLowerCase();
  const mimeType = file.mimetype || '';

  let rawText = '';

  if (ext === '.pdf' || mimeType === 'application/pdf') {
    rawText = await extractTextFromPdf(filePath);
  } else if (ext === '.docx' || ext === '.doc' || mimeType.includes('word') || mimeType.includes('officedocument')) {
    rawText = await extractTextFromWord(filePath, ext);
  } else if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext) || mimeType.startsWith('image/')) {
    rawText = await extractTextFromImage(filePath);
  } else if (ext === '.txt' || mimeType === 'text/plain') {
    rawText = fs.readFileSync(filePath, 'utf8');
  } else {
    // Default attempt: try Word then text
    try {
      rawText = await extractTextFromWord(filePath, ext);
    } catch {
      rawText = fs.readFileSync(filePath, 'utf8');
    }
  }

  // Clean extracted text: remove null bytes and excessive whitespace
  const cleanedText = (rawText || '')
    .replace(/\0/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim();

  if (!cleanedText || cleanedText.length < 30) {
    throw new Error(
      'Could not extract sufficient text from your resume. Please make sure the file contains selectable text or clear, readable content.'
    );
  }

  return cleanedText;
};
