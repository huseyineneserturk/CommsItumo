import axios from 'axios';

export interface AnalysisResult {
    comments: Comment[];
    sentiment_stats: SentimentStats;
    word_cloud: WordCloudItem[];
}

export interface Comment {
    id: string;
    text: string;
    author: string;
    date: string;
    video_id: string;
    video_title: string;
    sentiment: {
        category: 'positive' | 'neutral' | 'negative';
        score: number;
        subcategory?: string;
        confidence?: number;
        language: 'tr' | 'en';
    };
    theme: {
        [key: string]: number;
    };
}

export interface SentimentStats {
    total: number;
    categories: {
        positive: number;
        neutral: number;
        negative: number;
    };
    average_polarity: number;
    language_distribution: {
        tr: number;
        en: number;
    };
    themes: {
        [key: string]: number;
    };
}

export interface WordCloudItem {
    text: string;
    value: number;
}

class SentimentService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
}

    async getCommentsAnalysis(): Promise<AnalysisResult> {
        try {
            const response = await axios.get(`${this.baseUrl}/api/sentiment/analysis`);
            return response.data;
        } catch (error) {
            console.error('Duygu analizi alınamadı:', error);
            throw error;
        }
    }
}

export const sentimentService = new SentimentService(); 