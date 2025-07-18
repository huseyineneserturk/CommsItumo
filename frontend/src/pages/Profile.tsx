import React, { useState, useEffect } from 'react';
import { Users, Eye, ThumbsUp, MessageCircle, BarChart, Clock, Calendar, Mail, Link as LinkIcon, Loader2, AlertCircle, UserIcon, TrendingUp, Award, Activity } from 'lucide-react';
import { profileService, UserProfileInfo, ChannelStatistics, AnalysisSummary } from '../services/profileService';
import { analysisService } from '../services/analysisService';
import { AnalysisSummary as AnalysisHistoryItem } from '../types/analysis';

interface ProfileData {
  userInfo: UserProfileInfo | null;
  channelStats: ChannelStatistics | null;
  analysisSummary: AnalysisSummary | null;
  recentAnalyses: AnalysisHistoryItem[];
}

export function Profile() {
  const [profileData, setProfileData] = useState<ProfileData>({
    userInfo: null,
    channelStats: null,
    analysisSummary: null,
    recentAnalyses: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Paralel olarak tüm verileri yükle
      const [userInfo, channelStats, recentAnalyses] = await Promise.allSettled([
        profileService.getUserProfileInfo(),
        profileService.getChannelStatistics(),
        analysisService.getUserAnalysesFromAPI('current-user', 5)
      ]);

      // Analiz özetini ayrı olarak yükle (hata olursa diğerleri etkilenmesin)
      let analysisSummary = null;
      try {
        analysisSummary = await profileService.getAnalysisSummary();
      } catch (summaryError) {
        console.warn('Analiz özeti yüklenemedi:', summaryError);
      }

      setProfileData({
        userInfo: userInfo.status === 'fulfilled' ? userInfo.value : null,
        channelStats: channelStats.status === 'fulfilled' ? channelStats.value : null,
        analysisSummary,
        recentAnalyses: recentAnalyses.status === 'fulfilled' ? recentAnalyses.value : []
      });

      // Hata kontrolü
      const errors = [];
      if (userInfo.status === 'rejected') errors.push('Kullanıcı bilgileri');
      if (channelStats.status === 'rejected') errors.push('Kanal istatistikleri');
      if (recentAnalyses.status === 'rejected') errors.push('Analiz geçmişi');

      if (errors.length > 0) {
        setError(`Şu veriler yüklenemedi: ${errors.join(', ')}`);
      }

    } catch (err) {
      console.error('Profil verileri yüklenirken hata:', err);
      setError('Profil verileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-purple-600" />
          <p className="text-xl text-slate-600">Profil bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error && !profileData.userInfo) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex justify-center items-center">
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 border border-white/20">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-6 text-red-500" />
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Bir Hata Oluştu</h3>
            <p className="text-slate-600 mb-8 text-lg">{error}</p>
            <button 
              onClick={loadProfileData}
              className="bg-red-600 text-white px-8 py-4 rounded-2xl hover:bg-red-700 transition-all duration-300 hover:-translate-y-1 shadow-lg font-semibold text-lg"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { userInfo, channelStats, analysisSummary, recentAnalyses } = profileData;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-yellow-50/80 backdrop-blur-xl border border-yellow-200/50 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-yellow-600 mr-4" />
              <p className="text-yellow-800 text-lg">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Profile Card */}
          <div className="xl:col-span-1">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mx-auto mb-6 flex items-center justify-center overflow-hidden shadow-2xl">
                    {userInfo?.channelInfo?.thumbnail ? (
                      <img 
                        src={userInfo.channelInfo.thumbnail} 
                        alt="Kanal resmi"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="text-4xl text-white font-bold">${userInfo?.channelInfo?.title?.charAt(0) || '?'}</span>`;
                          }
                        }}
                      />
                    ) : (
                      <span className="text-4xl text-white font-bold">
                        {userInfo?.channelInfo?.title?.charAt(0) || userInfo?.displayName?.charAt(0) || userInfo?.email?.charAt(0) || '?'}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-3">
                  {userInfo?.channelInfo?.title || userInfo?.displayName || 'Kullanıcı'}
                </h2>
                <p className="text-purple-600 font-semibold text-lg mb-2">
                  YouTube İçerik Üreticisi
                </p>
                {userInfo?.channelInfo?.custom_url && (
                  <p className="text-slate-500 text-base">
                    youtube.com/{userInfo.channelInfo.custom_url}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-slate-800">E-posta</p>
                    <p className="text-slate-600 truncate text-base">{userInfo?.email || 'Bulunamadı'}</p>
                  </div>
                </div>
                
                {userInfo?.channelInfo?.published_at && (
                  <div className="flex items-center p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-semibold text-slate-800">YouTube'a Katılım</p>
                      <p className="text-slate-600 text-base">
                        {new Date(userInfo.channelInfo.published_at).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
                
                {userInfo?.channelInfo?.country && (
                  <div className="flex items-center p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <LinkIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-semibold text-slate-800">Ülke</p>
                      <p className="text-slate-600 text-base">{userInfo.channelInfo.country.toUpperCase()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Channel Statistics */}
            {channelStats && (
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                <h3 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-8 flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <BarChart className="w-6 h-6 text-white" />
                  </div>
                  Kanal İstatistikleri
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    icon={<Users className="w-10 h-10 text-white" />}
                    label="Abone Sayısı"
                    value={channelStats.subscribers?.toLocaleString('tr-TR') || '0'}
                    color="blue"
                  />
                  <StatCard
                    icon={<Eye className="w-10 h-10 text-white" />}
                    label="Toplam Görüntülenme"
                    value={channelStats.totalViews?.toLocaleString('tr-TR') || '0'}
                    color="green"
                  />
                  <StatCard
                    icon={<MessageCircle className="w-10 h-10 text-white" />}
                    label="Video Sayısı"
                    value={channelStats.totalVideos?.toLocaleString('tr-TR') || '0'}
                    color="purple"
                  />
                  <StatCard
                    icon={<TrendingUp className="w-10 h-10 text-white" />}
                    label="Ortalama Görüntülenme"
                    value={channelStats.averageViewsPerVideo?.toLocaleString('tr-TR') || '0'}
                    color="orange"
                  />
                </div>
              </div>
            )}

            {/* Analysis Summary */}
            {analysisSummary && (
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                <h3 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-8 flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  Analiz Özeti
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    icon={<MessageCircle className="w-10 h-10 text-white" />}
                    label="Toplam Analiz"
                    value={analysisSummary.totalAnalyses?.toString() || '0'}
                    color="blue"
                  />
                  <StatCard
                    icon={<ThumbsUp className="w-10 h-10 text-white" />}
                    label="Analiz Edilen Yorum"
                    value={analysisSummary.totalCommentsAnalyzed?.toLocaleString('tr-TR') || '0'}
                    color="green"
                  />
                  <StatCard
                    icon={<Award className="w-10 h-10 text-white" />}
                    label="Ortalama Sentiment"
                    value={`${(analysisSummary.averageSentimentScore * 100).toFixed(0)}/100`}
                    color="yellow"
                  />
                  <StatCard
                    icon={<Clock className="w-10 h-10 text-white" />}
                    label="En Çok Analiz Edilen"
                    value={analysisSummary.mostAnalyzedVideo?.title || 'Henüz yok'}
                    color="red"
                  />
                </div>
              </div>
            )}

            {/* Recent Analyses */}
            {analysisSummary?.recentAnalyses && analysisSummary.recentAnalyses.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                <h3 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-8 flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  Son Analizler
                </h3>
                
                <div className="space-y-6">
                  {analysisSummary.recentAnalyses.map((analysis, index) => (
                    <div key={analysis.id || index} className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 shadow-lg border border-white/20">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 mb-3 text-lg">
                            {analysis.videoTitle || 'Analiz'}
                          </h4>
                          <div className="flex items-center space-x-6 text-slate-600 mb-4">
                            <span className="flex items-center text-base">
                              <MessageCircle className="w-5 h-5 mr-2" />
                              {analysis.totalComments || 0} yorum
                            </span>
                            <span className="flex items-center text-base">
                              <Calendar className="w-5 h-5 mr-2" />
                              {analysis.createdAt 
                                ? new Date(analysis.createdAt).toLocaleDateString('tr-TR')
                                : 'Tarih bilinmiyor'
                              }
                            </span>
                          </div>
                        </div>
                                                 <div className="ml-6">
                           <span className={`px-4 py-2 rounded-2xl text-base font-semibold ${
                             analysis.dominantSentiment === 'positive' 
                               ? 'bg-green-500/20 text-green-700 border border-green-300/30' 
                               : analysis.dominantSentiment === 'negative'
                               ? 'bg-red-500/20 text-red-700 border border-red-300/30'
                               : 'bg-slate-500/20 text-slate-700 border border-slate-300/30'
                           }`}>
                             {analysis.dominantSentiment === 'positive' ? 'Olumlu' :
                              analysis.dominantSentiment === 'negative' ? 'Olumsuz' : 'Nötr'}
                           </span>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'yellow' | 'red';
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-red-500',
    yellow: 'from-yellow-500 to-orange-500',
    red: 'from-red-500 to-pink-500'
  };

  return (
    <div className="relative overflow-hidden bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 group hover:-translate-y-2">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses[color]} rounded-2xl flex items-center justify-center shadow-lg`}>
            {icon}
          </div>
        </div>
        <div>
          <p className="text-base font-semibold text-slate-600 mb-2">{label}</p>
          <p className="text-2xl lg:text-3xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}