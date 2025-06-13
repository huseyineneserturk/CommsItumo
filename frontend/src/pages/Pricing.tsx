import React, { useState, useEffect } from 'react';
import { Check, Star, Users, Zap, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { profileService, ChannelStatistics } from '../services/profileService';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  requests: number;
  subscriberRange: string;
  features: string[];
  recommended?: boolean;
  minSubscribers: number;
  maxSubscribers: number;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Başlangıç',
    price: 2,
    requests: 200,
    subscriberRange: '10K ve altı',
    minSubscribers: 0,
    maxSubscribers: 10000,
    features: [
      '200 AI İstek Hakkı',
      'Yorum Analizi',
      'Sentiment Analizi',
      'Temel Raporlar',
      'Email Destek'
    ]
  },
  {
    id: 'growth',
    name: 'Büyüme',
    price: 5,
    requests: 500,
    subscriberRange: '10K - 50K',
    minSubscribers: 10001,
    maxSubscribers: 50000,
    features: [
      '500 AI İstek Hakkı',
      'Gelişmiş Yorum Analizi',
      'Detaylı Sentiment Raporları',
      'Video Analizi',
      'Öncelikli Destek'
    ]
  },
  {
    id: 'professional',
    name: 'Profesyonel',
    price: 7,
    requests: 1000,
    subscriberRange: '50K - 100K',
    minSubscribers: 50001,
    maxSubscribers: 100000,
    features: [
      '1000 AI İstek Hakkı',
      'Kapsamlı Kanal Analizi',
      'Rakip Analizi',
      'Otomatik Raporlama',
      'Telefon Desteği'
    ]
  },
  {
    id: 'enterprise',
    name: 'Kurumsal',
    price: 15,
    requests: 2500,
    subscriberRange: '100K - 1M',
    minSubscribers: 100001,
    maxSubscribers: 1000000,
    features: [
      '2500 AI İstek Hakkı',
      'Tüm Premium Özellikler',
      'API Erişimi',
      'Özel Entegrasyonlar',
      '7/24 Destek'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 25,
    requests: 6000,
    subscriberRange: '1M+',
    minSubscribers: 1000001,
    maxSubscribers: Infinity,
    features: [
      '6000 AI İstek Hakkı',
      'Sınırsız Analiz',
      'Özel Algoritmalar',
      'Kişisel Hesap Yöneticisi',
      'İleri Seviye Entegrasyonlar'
    ]
  }
];

export function Pricing() {
  const [channelStats, setChannelStats] = useState<ChannelStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendedTier, setRecommendedTier] = useState<PricingTier | null>(null);

  useEffect(() => {
    loadChannelStats();
  }, []);

  const loadChannelStats = async () => {
    try {
      setLoading(true);
      const stats = await profileService.getChannelStatistics();
      setChannelStats(stats);
      
      // Abone sayısına göre önerilen paketi belirle
      const subscribers = stats.subscribers;
      const recommended = pricingTiers.find(tier => 
        subscribers >= tier.minSubscribers && subscribers <= tier.maxSubscribers
      );
      setRecommendedTier(recommended || pricingTiers[0]);
      
    } catch (err) {
      console.error('Kanal istatistikleri yüklenemedi:', err);
      setError('Kanal bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const formatSubscriberCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Kanal bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={loadChannelStats}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Fiyatlandırma
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Kanal büyüklüğünüze uygun AI destekli yorum analizi paketlerini keşfedin
          </p>
          
          {channelStats && (
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Kanalınızın Abone Sayısı</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatSubscriberCount(channelStats.subscribers)}
                  </p>
                </div>
              </div>
              {recommendedTier && (
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-sm text-red-800">
                    <Star className="w-4 h-4 inline mr-1" />
                    Size <span className="font-semibold">{recommendedTier.name}</span> paketi öneriyoruz
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
          {pricingTiers.map((tier) => {
            const isRecommended = recommendedTier?.id === tier.id;
            
            return (
              <div
                key={tier.id}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  isRecommended ? 'ring-4 ring-red-500 scale-105' : 'hover:scale-105'
                }`}
              >
                {isRecommended && (
                  <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-center py-2 font-semibold text-sm">
                    <Star className="w-4 h-4 inline mr-1" />
                    ÖNERİLEN
                  </div>
                )}
                
                <div className={`p-8 ${isRecommended ? 'pt-16' : ''}`}>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      {tier.subscriberRange} abone
                    </p>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">
                        ${tier.price}
                      </span>
                      <span className="text-gray-500">/ay</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 mb-6">
                      <div className="flex items-center justify-center">
                        <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                        <span className="font-semibold text-gray-900">
                          {tier.requests.toLocaleString()} İstek
                        </span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center ${
                      isRecommended
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    disabled
                  >
                    Yakında Aktif
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tüm Paketlerde Standart Özellikler
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              CommsItumo ile YouTube kanalınızı profesyonel düzeyde analiz edin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Yorum Analizi
              </h3>
              <p className="text-gray-600">
                Videolarınızdaki yorumları detaylı olarak analiz edin
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI Destekli
              </h3>
              <p className="text-gray-600">
                Yapay zeka ile güçlendirilmiş sentiment analizi
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Güvenli & Hızlı
              </h3>
              <p className="text-gray-600">
                Verileriniz güvende, analizler hızla tamamlanır
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            Sorularınız mı var? Yardım için iletişime geçin.
          </p>
          <p className="text-sm text-gray-500">
            * Satın alma özelliği yakında aktif edilecektir
          </p>
        </div>
      </div>
    </div>
  );
} 