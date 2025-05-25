// Firestore entegrasyonu için analiz tipleri
export interface AnalysisResult {
  id: string;
  userId: string;
  videoId?: string;
  videoTitle?: string;
  createdAt: Date;
  sentimentStats: {
    total: number;
    categories: {
      positive: number;
      neutral: number;
      negative: number;
    };
    averagePolarity: number;
    languageDistribution: {
      tr: number;
      en: number;
    };
    themes: Record<string, number>;
  };
  wordCloud: Array<{
    text: string;
    value: number;
  }>;
  comments: Array<{
    id: string;
    text: string;
    author: string;
    date: string;
    sentiment: {
      polarity: number;
      category: string;
      confidence: number;
      language: string;
    };
    theme: Record<string, number>;
  }>;
}

// Firestore'a kaydetmek için kullanılacak tip
export interface AnalysisData {
  userId: string;
  videoId?: string;
  videoTitle?: string;
  sentimentStats: AnalysisResult['sentimentStats'];
  wordCloud: AnalysisResult['wordCloud'];
  comments: AnalysisResult['comments'];
}

// Analiz listesi için kullanılacak özet tip
export interface AnalysisSummary {
  id: string;
  userId: string;
  videoId?: string;
  videoTitle?: string;
  createdAt: Date;
  totalComments: number;
  averagePolarity: number;
  dominantSentiment: 'positive' | 'neutral' | 'negative';
}

// Analiz filtreleme için kullanılacak tip
export interface AnalysisFilter {
  userId?: string;
  videoId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sentiment?: 'positive' | 'neutral' | 'negative';
  limit?: number;
} 