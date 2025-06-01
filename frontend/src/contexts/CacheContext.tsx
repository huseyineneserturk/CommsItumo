import React, { createContext, useContext, useState, useEffect } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheContextType {
  // YouTube Kanal Analizi
  youtubeAnalysis: any | null;
  setYoutubeAnalysis: (data: any, ttl?: number) => void;
  
  // Video Analizleri
  videoAnalyses: { [key: string]: any };
  setVideoAnalysis: (videoId: string, data: any, ttl?: number) => void;
  getVideoAnalysis: (videoId: string) => any | null;
  
  // Yorumlar
  comments: any | null;
  setComments: (data: any, ttl?: number) => void;
  
  // CSV Analizleri
  csvAnalyses: { [key: string]: any };
  setCsvAnalysis: (analysisId: string, data: any, ttl?: number) => void;
  getCsvAnalysis: (analysisId: string) => any | null;
  
  // Genel metodlar
  clearCache: () => void;
  clearExpiredItems: () => void;
  isDataValid: (key: string) => boolean;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

// Default TTL değerleri (milliseconds)
const DEFAULT_TTL = {
  YOUTUBE_ANALYSIS: 10 * 60 * 1000, // 10 dakika
  VIDEO_ANALYSIS: 15 * 60 * 1000,   // 15 dakika
  COMMENTS: 5 * 60 * 1000,          // 5 dakika
  CSV_ANALYSIS: 30 * 60 * 1000,     // 30 dakika
};

const CACHE_KEY_PREFIX = 'comms_itumo_cache_';

export const CacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [youtubeAnalysis, setYoutubeAnalysisState] = useState<any | null>(null);
  const [videoAnalyses, setVideoAnalysesState] = useState<{ [key: string]: any }>({});
  const [comments, setCommentsState] = useState<any | null>(null);
  const [csvAnalyses, setCsvAnalysesState] = useState<{ [key: string]: any }>({});

  // localStorage'dan veri okuma
  const loadFromStorage = <T,>(key: string): CacheItem<T> | null => {
    try {
      const item = localStorage.getItem(CACHE_KEY_PREFIX + key);
      if (!item) return null;
      
      const parsed: CacheItem<T> = JSON.parse(item);
      
      // TTL kontrolü
      if (Date.now() > parsed.timestamp + parsed.ttl) {
        localStorage.removeItem(CACHE_KEY_PREFIX + key);
        return null;
      }
      
      return parsed;
    } catch (error) {
      console.error('Cache okuma hatası:', error);
      return null;
    }
  };

  // localStorage'a veri yazma
  const saveToStorage = <T,>(key: string, data: T, ttl: number) => {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl
      };
      localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Cache yazma hatası:', error);
    }
  };

  // Component mount edildiğinde cache'i yükle
  useEffect(() => {
    const loadInitialCache = () => {
      // YouTube analizi yükle
      const youtubeCache = loadFromStorage<any>('youtube_analysis');
      if (youtubeCache) {
        setYoutubeAnalysisState(youtubeCache.data);
      }

      // Yorumları yükle
      const commentsCache = loadFromStorage<any>('comments');
      if (commentsCache) {
        setCommentsState(commentsCache.data);
      }

      // Video analizlerini yükle
      const videoKeys = Object.keys(localStorage).filter(key => 
        key.startsWith(CACHE_KEY_PREFIX + 'video_')
      );
      const videoCache: { [key: string]: any } = {};
      videoKeys.forEach(key => {
        const videoId = key.replace(CACHE_KEY_PREFIX + 'video_', '');
        const cache = loadFromStorage<any>('video_' + videoId);
        if (cache) {
          videoCache[videoId] = cache.data;
        }
      });
      setVideoAnalysesState(videoCache);

      // CSV analizlerini yükle
      const csvKeys = Object.keys(localStorage).filter(key => 
        key.startsWith(CACHE_KEY_PREFIX + 'csv_')
      );
      const csvCache: { [key: string]: any } = {};
      csvKeys.forEach(key => {
        const analysisId = key.replace(CACHE_KEY_PREFIX + 'csv_', '');
        const cache = loadFromStorage<any>('csv_' + analysisId);
        if (cache) {
          csvCache[analysisId] = cache.data;
        }
      });
      setCsvAnalysesState(csvCache);
    };

    loadInitialCache();
    
    // Süresi dolmuş verileri temizle
    clearExpiredItems();
  }, []);

  // YouTube analizi set etme
  const setYoutubeAnalysis = (data: any, ttl: number = DEFAULT_TTL.YOUTUBE_ANALYSIS) => {
    setYoutubeAnalysisState(data);
    saveToStorage('youtube_analysis', data, ttl);
  };

  // Video analizi set etme
  const setVideoAnalysis = (videoId: string, data: any, ttl: number = DEFAULT_TTL.VIDEO_ANALYSIS) => {
    setVideoAnalysesState(prev => ({ ...prev, [videoId]: data }));
    saveToStorage('video_' + videoId, data, ttl);
  };

  // Video analizi alma
  const getVideoAnalysis = (videoId: string): any | null => {
    return videoAnalyses[videoId] || null;
  };

  // Yorumları set etme
  const setComments = (data: any, ttl: number = DEFAULT_TTL.COMMENTS) => {
    setCommentsState(data);
    saveToStorage('comments', data, ttl);
  };

  // CSV analizi set etme
  const setCsvAnalysis = (analysisId: string, data: any, ttl: number = DEFAULT_TTL.CSV_ANALYSIS) => {
    setCsvAnalysesState(prev => ({ ...prev, [analysisId]: data }));
    saveToStorage('csv_' + analysisId, data, ttl);
  };

  // CSV analizi alma
  const getCsvAnalysis = (analysisId: string): any | null => {
    return csvAnalyses[analysisId] || null;
  };

  // Veri geçerliliğini kontrol etme
  const isDataValid = (key: string): boolean => {
    const cache = loadFromStorage(key);
    return cache !== null;
  };

  // Tüm cache'i temizleme
  const clearCache = () => {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(CACHE_KEY_PREFIX)
    );
    keys.forEach(key => localStorage.removeItem(key));
    
    setYoutubeAnalysisState(null);
    setVideoAnalysesState({});
    setCommentsState(null);
    setCsvAnalysesState({});
  };

  // Süresi dolmuş öğeleri temizleme
  const clearExpiredItems = () => {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(CACHE_KEY_PREFIX)
    );
    
    keys.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed: CacheItem<any> = JSON.parse(item);
          if (Date.now() > parsed.timestamp + parsed.ttl) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        // Geçersiz cache öğesini sil
        localStorage.removeItem(key);
      }
    });
  };

  const value: CacheContextType = {
    youtubeAnalysis,
    setYoutubeAnalysis,
    videoAnalyses,
    setVideoAnalysis,
    getVideoAnalysis,
    comments,
    setComments,
    csvAnalyses,
    setCsvAnalysis,
    getCsvAnalysis,
    clearCache,
    clearExpiredItems,
    isDataValid,
  };

  return (
    <CacheContext.Provider value={value}>
      {children}
    </CacheContext.Provider>
  );
};

export const useCache = (): CacheContextType => {
  const context = useContext(CacheContext);
  if (context === undefined) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
}; 