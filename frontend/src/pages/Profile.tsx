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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-red-600" />
          <p className="text-lg text-gray-600">Profil bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error && !profileData.userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Bir Hata Oluştu</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={loadProfileData}
              className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors font-medium"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              <UserIcon className="inline-block mr-3 text-red-600" />
              Profilim
            </h1>
            <p className="text-gray-600 text-lg">
              Hesap bilgileriniz ve kanal istatistikleriniz
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 shadow-sm">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
              <p className="text-yellow-800">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Profile Card */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-0">
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden shadow-2xl">
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
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {userInfo?.channelInfo?.title || userInfo?.displayName || 'Kullanıcı'}
                </h2>
                <p className="text-red-600 font-medium mb-1">
                  YouTube İçerik Üreticisi
                </p>
                {userInfo?.channelInfo?.custom_url && (
                  <p className="text-sm text-gray-500">
                    youtube.com/{userInfo.channelInfo.custom_url}
                  </p>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">E-posta</p>
                    <p className="text-sm text-gray-500 truncate">{userInfo?.email || 'Bulunamadı'}</p>
                  </div>
                </div>
                
                {userInfo?.channelInfo?.published_at && (
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">YouTube'a Katılım</p>
                      <p className="text-sm text-gray-500">
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
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <LinkIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Ülke</p>
                      <p className="text-sm text-gray-500">{userInfo.channelInfo.country.toUpperCase()}</p>
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
              <div className="bg-white rounded-2xl shadow-xl p-8 border-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <BarChart className="mr-3 text-red-600" />
                  Kanal İstatistikleri
                </h3>
                
                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <StatCard
                     icon={<Users className="w-8 h-8 text-blue-500" />}
                     label="Abone Sayısı"
                     value={channelStats.subscribers?.toLocaleString('tr-TR') || '0'}
                     color="blue"
                   />
                   <StatCard
                     icon={<Eye className="w-8 h-8 text-green-500" />}
                     label="Toplam Görüntülenme"
                     value={channelStats.totalViews?.toLocaleString('tr-TR') || '0'}
                     color="green"
                   />
                   <StatCard
                     icon={<MessageCircle className="w-8 h-8 text-purple-500" />}
                     label="Video Sayısı"
                     value={channelStats.totalVideos?.toLocaleString('tr-TR') || '0'}
                     color="purple"
                   />
                   <StatCard
                     icon={<TrendingUp className="w-8 h-8 text-orange-500" />}
                     label="Ortalama Görüntülenme"
                     value={channelStats.averageViewsPerVideo?.toLocaleString('tr-TR') || '0'}
                     color="orange"
                   />
                 </div>
              </div>
            )}

            {/* Analysis Summary */}
            {analysisSummary && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Activity className="mr-3 text-red-600" />
                  Analiz Özeti
                </h3>
                
                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <StatCard
                     icon={<MessageCircle className="w-8 h-8 text-blue-500" />}
                     label="Toplam Analiz"
                     value={analysisSummary.totalAnalyses?.toString() || '0'}
                     color="blue"
                   />
                   <StatCard
                     icon={<ThumbsUp className="w-8 h-8 text-green-500" />}
                     label="Analiz Edilen Yorum"
                     value={analysisSummary.totalCommentsAnalyzed?.toLocaleString('tr-TR') || '0'}
                     color="green"
                   />
                   <StatCard
                     icon={<Award className="w-8 h-8 text-yellow-500" />}
                     label="Ortalama Sentiment"
                     value={`%${(analysisSummary.averageSentimentScore * 100).toFixed(0)}`}
                     color="yellow"
                   />
                   <StatCard
                     icon={<Clock className="w-8 h-8 text-red-500" />}
                     label="En Çok Analiz Edilen"
                     value={analysisSummary.mostAnalyzedVideo?.title || 'Henüz yok'}
                     color="red"
                   />
                 </div>
              </div>
            )}

                         {/* Recent Analyses */}
             {analysisSummary?.recentAnalyses && analysisSummary.recentAnalyses.length > 0 && (
               <div className="bg-white rounded-2xl shadow-xl p-8 border-0">
                 <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                   <Clock className="mr-3 text-red-600" />
                   Son Analizler
                 </h3>
                 
                 <div className="space-y-4">
                   {analysisSummary.recentAnalyses.map((analysis, index) => (
                     <div key={analysis.id || index} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                       <div className="flex justify-between items-start">
                         <div className="flex-1">
                           <h4 className="font-semibold text-gray-900 mb-2">
                             {analysis.videoTitle || 'Analiz'}
                           </h4>
                           <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                             <span className="flex items-center">
                               <MessageCircle className="w-4 h-4 mr-1" />
                               {analysis.totalComments || 0} yorum
                             </span>
                             <span className="flex items-center">
                               <Calendar className="w-4 h-4 mr-1" />
                               {analysis.createdAt 
                                 ? new Date(analysis.createdAt).toLocaleDateString('tr-TR')
                                 : 'Tarih bilinmiyor'
                               }
                             </span>
                           </div>
                         </div>
                         <div className="ml-4">
                           <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                             analysis.dominantSentiment === 'positive' 
                               ? 'bg-green-100 text-green-800' 
                               : analysis.dominantSentiment === 'negative'
                               ? 'bg-red-100 text-red-800'
                               : 'bg-gray-100 text-gray-800'
                           }`}>
                             %{(analysis.averagePolarity * 100).toFixed(0)} {
                               analysis.dominantSentiment === 'positive' ? 'Olumlu' :
                               analysis.dominantSentiment === 'negative' ? 'Olumsuz' : 'Nötr'
                             }
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
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600'
  };

  return (
    <div className="relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:transform hover:-translate-y-1">
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-shrink-0">
            {icon}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}