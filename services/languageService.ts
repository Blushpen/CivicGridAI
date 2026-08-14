export type SupportedLanguageCode = 'en' | 'hi' | 'te' | 'und';

export interface NormalizedTextResult {
  language: SupportedLanguageCode;
  confidence: number;
  originalText: string;
  normalizedText: string;
}

const HINDI_TO_ENGLISH: Record<string, string> = {
  'गड्ढा': 'pothole',
  'गड्ढे': 'pothole',
  'गड्ढों': 'pothole',
  'सड़क': 'road',
  'रास्ता': 'road',
  'कचरा': 'garbage',
  'कचरे': 'garbage',
  'पानी': 'water',
  'जल': 'water',
  'नाली': 'drain',
  'नालियों': 'drain',
  'लाइट': 'streetlight',
  'टूटा': 'broken',
  'खराब': 'broken',
  'यहाँ': 'here',
  'बड़ा': 'large',
  'पड़ा': 'large',
  'सामने': 'near',
  'पास': 'near',
  'बस': 'bus',
  'स्टॉप': 'stop',
  'मोटरसाइकिल': 'motorcycle',
  'मोटरसाइकिलें': 'motorcycles',
  'समस्या': 'problem',
  'सुरक्षा': 'safety',
};

const TELUGU_TO_ENGLISH: Record<string, string> = {
  'గుంత': 'pothole',
  'పొద్దు': 'streetlight',
  'చెట్టు': 'tree',
  'కార్లు': 'cars',
  'సంక్షేమం': 'problem',
  'పెద్ద': 'large',
  'ఇక్కడ': 'here',
  'సమీపంలో': 'near',
  'బస్': 'bus',
  'స్టాప్': 'stop',
  'మోటార్సైకిళ్లు': 'motorcycles',
  'పూర్తి': 'full',
  'చెదరగొట్టే': 'damaged',
  'సంక్షేపంల': 'problem',
  'రోడ్': 'road',
  'వాటర్': 'water',
  'మురుగు': 'garbage',
  'ఇచ్చిన': 'given',
};

export class LanguageService {
  detectLanguage(text: string): { language: SupportedLanguageCode; confidence: number } {
    const clean = (text ?? '').trim();
    if (!clean) {
      return { language: 'und', confidence: 0.2 };
    }

    if (/[\u0900-\u097F]/.test(clean)) {
      return { language: 'hi', confidence: 0.96 };
    }

    if (/[\u0C00-\u0C7F]/.test(clean)) {
      return { language: 'te', confidence: 0.96 };
    }

    if (/[A-Za-z]/.test(clean)) {
      return { language: 'en', confidence: 0.92 };
    }

    return { language: 'und', confidence: 0.35 };
  }

  normalizeText(text: string): NormalizedTextResult {
    const originalText = text ?? '';
    const { language } = this.detectLanguage(originalText);
    const normalizedText = this.toNormalizedEnglish(originalText, language);

    return {
      language,
      confidence: language === 'und' ? 0.35 : 0.96,
      originalText,
      normalizedText,
    };
  }

  private toNormalizedEnglish(text: string, language: SupportedLanguageCode): string {
    const source = (text ?? '').trim();
    if (!source) {
      return '';
    }

    if (language === 'hi') {
      return this.applyDictionary(source, HINDI_TO_ENGLISH, 'hi');
    }

    if (language === 'te') {
      return this.applyDictionary(source, TELUGU_TO_ENGLISH, 'te');
    }

    return source
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/\s*[,.;!?]+\s*/g, ' ')
      .trim();
  }

  private applyDictionary(text: string, mapping: Record<string, string>, language: SupportedLanguageCode): string {
    let result = text.toLowerCase();

    const entries = Object.entries(mapping).sort((a, b) => b[0].length - a[0].length);
    for (const [token, replacement] of entries) {
      const pattern = new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      result = result.replace(pattern, replacement);
    }

    const englishResult = result
      .replace(/\s+/g, ' ')
      .replace(/\s*[,.;!?]+\s*/g, ' ')
      .trim();

    if (language === 'hi' && /गड्ढा|सड़क|कचरा|पानी|नाली/.test(text)) {
      return englishResult.includes('pothole') || englishResult.includes('road') || englishResult.includes('garbage')
        ? englishResult
        : `${englishResult} issue`;
    }

    if (language === 'te' && /గుంత|రోడ్|మురుగు|వాటర్/.test(text)) {
      return englishResult.includes('pothole') || englishResult.includes('road') || englishResult.includes('garbage')
        ? englishResult
        : `${englishResult} issue`;
    }

    return englishResult;
  }
}

export const languageService = new LanguageService();
