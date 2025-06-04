interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  ttl: number;
  size: number;
}

interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  maxMemoryUsage: number; // bytes
}

class IntelligentCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private config: CacheConfig;
  private memoryUsage = 0;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: config.maxSize || 100,
      defaultTTL: config.defaultTTL || 30 * 60 * 1000, // 30 dakika
      maxMemoryUsage: config.maxMemoryUsage || 50 * 1024 * 1024 // 50MB
    };
  }

  set(key: string, data: T, ttl: number = this.config.defaultTTL): void {
    // Önce eski entry'yi temizle
    this.delete(key);

    // Data boyutunu tahmin et
    const size = this.estimateSize(data);

    // Memory limit kontrolü
    if (this.memoryUsage + size > this.config.maxMemoryUsage) {
      this.freeMemory(size);
    }

    // Cache boyutu kontrolü
    if (this.cache.size >= this.config.maxSize) {
      this.evictLeastUsed();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      accessCount: 0,
      lastAccessed: Date.now(),
      ttl,
      size
    };

    this.cache.set(key, entry);
    this.memoryUsage += size;

    console.log(`💾 Cache'e eklendi: ${key} (${this.formatSize(size)})`);
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // TTL kontrolü
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      console.log(`⏰ Cache expired: ${key}`);
      return null;
    }

    // Access statistics güncelle
    entry.accessCount++;
    entry.lastAccessed = Date.now();

    console.log(`📦 Cache hit: ${key} (${entry.accessCount}. erişim)`);
    return entry.data;
  }

  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.memoryUsage -= entry.size;
      this.cache.delete(key);
      console.log(`🗑️ Cache'den silindi: ${key}`);
      return true;
    }
    return false;
  }

  private estimateSize(data: T): number {
    try {
      // JSON string boyutunu tahmin et
      const jsonString = JSON.stringify(data);
      return jsonString.length * 2; // UTF-16 için
    } catch {
      return 1024; // Varsayılan boyut
    }
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }

  private freeMemory(requiredSize: number): void {
    console.log(`💾 Memory temizleniyor... (${this.formatSize(requiredSize)} gerekli)`);
    
    const entries = Array.from(this.cache.entries());
    
    // En az kullanılan ve en eski entry'leri sırala
    entries.sort(([, a], [, b]) => {
      const scoreA = this.calculateEvictionScore(a);
      const scoreB = this.calculateEvictionScore(b);
      return scoreA - scoreB;
    });

    let freed = 0;
    for (const [key, entry] of entries) {
      if (freed >= requiredSize) break;
      
      this.delete(key);
      freed += entry.size;
    }

    console.log(`💾 ${this.formatSize(freed)} memory temizlendi`);
  }

  private evictLeastUsed(): void {
    let leastUsedKey = '';
    let leastUsedScore = Infinity;

    for (const [key, entry] of this.cache) {
      const score = this.calculateEvictionScore(entry);
      
      if (score < leastUsedScore) {
        leastUsedScore = score;
        leastUsedKey = key;
      }
    }

    if (leastUsedKey) {
      this.delete(leastUsedKey);
    }
  }

  private calculateEvictionScore(entry: CacheEntry<T>): number {
    const now = Date.now();
    const age = now - entry.timestamp;
    const timeSinceAccess = now - entry.lastAccessed;
    
    // Score: access frequency / (age + time since last access)
    // Düşük score = eviction candidate
    return entry.accessCount / (age + timeSinceAccess + 1);
  }

  // Proactive cache warming
  async warmup(keys: string[], fetcher: (key: string) => Promise<T>): Promise<void> {
    console.log(`🔥 Cache warming başlatıldı: ${keys.length} key`);
    
    const promises = keys.map(async (key) => {
      if (!this.get(key)) {
        try {
          const data = await fetcher(key);
          this.set(key, data);
        } catch (error) {
          console.warn(`⚠️ Cache warmup failed for ${key}:`, error);
        }
      }
    });

    await Promise.all(promises);
    console.log(`🔥 Cache warming tamamlandı`);
  }

  // Cache'i optimize et
  optimize(): void {
    console.log('🔧 Cache optimizasyonu başlatıldı...');
    
    const now = Date.now();
    let cleaned = 0;
    let compacted = 0;

    // Expired entry'leri temizle
    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > entry.ttl) {
        this.delete(key);
        cleaned++;
      }
    }

    // Düşük score'lu entry'leri temizle
    if (this.cache.size > this.config.maxSize * 0.8) {
      const entries = Array.from(this.cache.entries());
      entries.sort(([, a], [, b]) => {
        return this.calculateEvictionScore(a) - this.calculateEvictionScore(b);
      });

      const toRemove = this.cache.size - Math.floor(this.config.maxSize * 0.7);
      for (let i = 0; i < toRemove && i < entries.length; i++) {
        this.delete(entries[i][0]);
        compacted++;
      }
    }

    console.log(`🔧 Cache optimize edildi: ${cleaned} expired, ${compacted} compacted`);
  }

  clear(): void {
    this.cache.clear();
    this.memoryUsage = 0;
    console.log('🧹 Cache tamamen temizlendi');
  }

  // Belirli pattern'e göre temizle
  clearByPattern(pattern: RegExp): number {
    let cleared = 0;
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.delete(key);
        cleared++;
      }
    }
    console.log(`🧹 Pattern ile temizlendi: ${cleared} entry`);
    return cleared;
  }

  // Statistics
  getStats() {
    const entries = Array.from(this.cache.values());
    const totalAccess = entries.reduce((sum, entry) => sum + entry.accessCount, 0);
    const avgAccess = entries.length > 0 ? totalAccess / entries.length : 0;
    
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      memoryUsage: this.formatSize(this.memoryUsage),
      maxMemoryUsage: this.formatSize(this.config.maxMemoryUsage),
      avgAccessCount: avgAccess.toFixed(2),
      totalAccess,
      hitRatio: this.calculateHitRatio(),
      oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : null,
      newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : null
    };
  }

  private calculateHitRatio(): string {
    // Bu basit bir implementation, gerçek hit ratio için ayrı counter gerekir
    const entries = Array.from(this.cache.values());
    const totalAccess = entries.reduce((sum, entry) => sum + entry.accessCount, 0);
    const estimatedRequests = totalAccess + entries.length; // Miss'ler için tahmin
    return totalAccess > 0 ? `${((totalAccess / estimatedRequests) * 100).toFixed(1)}%` : '0%';
  }

  // Hot keys (en çok erişilen)
  getHotKeys(limit: number = 10): Array<{key: string, accessCount: number, lastAccessed: Date}> {
    return Array.from(this.cache.entries())
      .map(([key, entry]) => ({
        key,
        accessCount: entry.accessCount,
        lastAccessed: new Date(entry.lastAccessed)
      }))
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, limit);
  }

  // Auto cleanup scheduler
  startAutoCleanup(intervalMs: number = 5 * 60 * 1000): () => void {
    const interval = setInterval(() => {
      this.optimize();
    }, intervalMs);

    console.log(`🔄 Auto cleanup başlatıldı: ${intervalMs}ms interval`);

    return () => {
      clearInterval(interval);
      console.log('🔄 Auto cleanup durduruldu');
    };
  }
}

// Singleton instances
export const analysisCache = new IntelligentCache({
  maxSize: 50,
  defaultTTL: 60 * 60 * 1000, // 1 saat
  maxMemoryUsage: 30 * 1024 * 1024 // 30MB
});

export const videoCache = new IntelligentCache({
  maxSize: 100,
  defaultTTL: 30 * 60 * 1000, // 30 dakika  
  maxMemoryUsage: 20 * 1024 * 1024 // 20MB
});

export const quickCache = new IntelligentCache({
  maxSize: 200,
  defaultTTL: 5 * 60 * 1000, // 5 dakika
  maxMemoryUsage: 10 * 1024 * 1024 // 10MB
});

// Auto cleanup başlat
analysisCache.startAutoCleanup();
videoCache.startAutoCleanup();
quickCache.startAutoCleanup(2 * 60 * 1000); // 2 dakika

export { IntelligentCache }; 