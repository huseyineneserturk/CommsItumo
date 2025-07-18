import React, { useState, useEffect } from 'react';
import { Check, Star, Users, Zap, Shield, ArrowRight, Loader2, DollarSign } from 'lucide-react';
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
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-6" />
          <p className="text-xl text-slate-600">Kanal bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-xl border border-red-200/20 rounded-3xl p-8 shadow-2xl">
            <p className="text-red-800 text-xl mb-6">{error}</p>
            <button 
              onClick={loadChannelStats}
              className="bg-red-600 text-white px-8 py-4 rounded-2xl hover:bg-red-700 transition-all duration-300 hover:-translate-y-1 shadow-lg text-lg font-semibold"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center py-8 mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-xl border border-white/20">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Fiyatlandırma
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Kanal büyüklüğünüze uygun AI destekli yorum analizi paketlerini keşfedin
          </p>
          
          {channelStats && (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 max-w-md mx-auto mt-8 border border-white/20">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-slate-500 mb-1">Kanalınızın Abone Sayısı</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {formatSubscriberCount(channelStats.subscribers)}
                  </p>
                </div>
              </div>
              {recommendedTier && (
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl p-3 border border-purple-300/30">
                  <p className="text-sm text-purple-800 flex items-center justify-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    Size <span className="font-bold mx-1">{recommendedTier.name}</span> paketi öneriyoruz
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-12">
          {pricingTiers.map((tier) => {
            const isRecommended = recommendedTier?.id === tier.id;
            
            return (
              <div
                key={tier.id}
                className={`relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(147,51,234,0.3)] border border-white/20 ${
                  isRecommended ? 'ring-4 ring-purple-500/50 scale-105' : 'hover:scale-105 hover:-translate-y-2'
                }`}
              >
                {isRecommended && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 font-bold text-sm">
                    <Star className="w-4 h-4 inline mr-1" />
                    ÖNERİLEN
                  </div>
                )}
                
                <div className={`p-4 ${isRecommended ? 'pt-12' : 'pt-4'}`}>
                  <div className="text-center mb-4">
                    <h3 className="text-lg lg:text-xl font-bold text-slate-800 mb-1">
                      {tier.name}
                    </h3>
                    <p className="text-slate-500 text-xs mb-3">
                      {tier.subscriberRange} abone
                    </p>
                    <div className="mb-3">
                      <span className="text-2xl lg:text-3xl font-bold text-slate-800">
                        ${tier.price}
                      </span>
                      <span className="text-sm text-slate-500">/ay</span>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-lg p-2 mb-4 border border-purple-300/30">
                      <div className="flex items-center justify-center">
                        <Zap className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-bold text-sm text-slate-800">
                          {tier.requests.toLocaleString()} İstek
                        </span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-slate-700 text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center shadow-lg ${
                      isRecommended
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:-translate-y-1'
                        : 'bg-white/20 backdrop-blur-xl text-slate-700 hover:bg-white/30 hover:-translate-y-1 border border-white/30'
                    }`}
                    disabled
                  >
                    Yakında Aktif
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 lg:p-8 border border-white/20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Tüm Paketlerde Standart Özellikler
            </h2>
            <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto">
              CommsItumo ile YouTube kanalınızı profesyonel düzeyde analiz edin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Yorum Analizi
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Videolarınızdaki yorumları detaylı olarak analiz edin
              </p>
            </div>

            <div className="text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                AI Destekli
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Yapay zeka ile güçlendirilmiş sentiment analizi
              </p>
            </div>

            <div className="text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Güvenli & Hızlı
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Verileriniz güvende, analizler hızla tamamlanır
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
          <p className="text-lg text-slate-600 mb-4">
            Sorularınız mı var? Yardım için iletişime geçin.
          </p>
          <p className="text-base text-slate-500">
            * Satın alma özelliği yakında aktif edilecektir
          </p>
        </div>
      </div>
    </div>
  );
} 