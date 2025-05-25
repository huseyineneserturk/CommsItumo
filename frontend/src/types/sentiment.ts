export interface Sentiment {
    polarity: number;
    category: 'positive' | 'neutral' | 'negative';
    subcategory: string;
    confidence: number;
    language: string;
    detailed_scores?: {
        positive: {
            mutlu: number;
            teşekkür: number;
            övgü: number;
            destek: number;
        };
        negative: {
            kızgın: number;
            hayal_kırıklığı: number;
            şikayet: number;
            eleştiri: number;
        };
        neutral: {
            bilgi: number;
            soru: number;
            öneri: number;
        };
    };
    vader_scores?: {
        neg: number;
        neu: number;
        pos: number;
        compound: number;
    };
}

export interface Comment {
    id: string;
    text: string;
    author: string;
    date: string;
    language: string;
    video_title: string;
    sentiment: Sentiment;
    theme?: Record<string, number>;
}

export interface SentimentStats {
    total: number;
    categories: {
        positive: {
            mutlu: number;
            teşekkür: number;
            övgü: number;
            destek: number;
        };
        negative: {
            kızgın: number;
            hayal_kırıklığı: number;
            şikayet: number;
            eleştiri: number;
        };
        neutral: {
            bilgi: number;
            soru: number;
            öneri: number;
        };
    };
    average_polarity: number;
    language_distribution: {
        tr: number;
        en: number;
    };
}

export interface WordCloudItem {
    text: string;
    value: number;
}

export interface ThemeAnalysis {
    theme: string;
    count: number;
    percentage: number;
}

export interface LegacyAnalysisResult {
    sentiment_stats: SentimentStats;
    word_cloud: WordCloudItem[];
    theme_analysis: ThemeAnalysis[];
    comments: Comment[];
}

export interface SentimentAnalysisResponse {
    polarity: number;
    category: string;
    confidence: number;
    language: string;
    sentence_analyses?: Array<{
        text: string;
        sentiment: string;
        score: number;
    }>;
    theme?: Record<string, number>;
    error?: string;
} 