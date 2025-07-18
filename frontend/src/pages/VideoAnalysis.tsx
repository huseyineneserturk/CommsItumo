import React, { useState, useEffect } from 'react';
import { Card, message, Spin, Typography, Row, Col, Statistic, Button, Input, Form, Alert, Tag, Tabs, List, Progress, Space, Switch } from 'antd';
import { analysisService } from '../services/analysisService';
import { AnalysisResult, AnalysisSummary } from '../types/analysis';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { YoutubeOutlined, PlayCircleOutlined, BarChartOutlined, FileTextOutlined, LinkOutlined, ReloadOutlined, EyeOutlined, LikeOutlined, MessageOutlined, CalendarOutlined, HistoryOutlined, SmileOutlined, MehOutlined, FrownOutlined, RiseOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { EnhancedWordCloud } from '../components/EnhancedWordCloud';
import { getAuth } from 'firebase/auth';
import { useAI } from '../contexts/AIContext';
import { useCache } from '../contexts/CacheContext';
import { AsyncAnalysisProgress } from '../components/AsyncAnalysisProgress';
import { asyncAnalysisService } from '../services/asyncAnalysisService';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

// WordCloudProps artık kullanılmıyor - EnhancedWordCloud ile değiştirildi

const VideoAnalysis: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [videoInfo, setVideoInfo] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('input');
  const [isFromCache, setIsFromCache] = useState(false);
  const [isAsyncAnalyzing, setIsAsyncAnalyzing] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const [currentVideoTitle, setCurrentVideoTitle] = useState<string>('');
  
  // Geçmiş analizler için state'ler
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisSummary[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const { setComments: setAIComments } = useAI();
  
  // Cache sistemini kullan
  const { getVideoAnalysis, setVideoAnalysis } = useCache();

  const extractVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const validateYouTubeUrl = (url: string): boolean => {
    return extractVideoId(url) !== null;
  };

  const fetchAnalysisHistory = async () => {
    if (!user) return;
    
    try {
      const history = await analysisService.getUserAnalysesFromAPI(user.uid);
      setAnalysisHistory(history);
    } catch (error) {
      console.error('Analiz geçmişi alınamadı:', error);
      message.error('Analiz geçmişi yüklenirken bir hata oluştu.');
    }
  };

  const handleAnalysisSelect = async (analysisId: string) => {
    try {
      setLoading(true);
      
      // Önce cache'e bak
      const cachedAnalysis = getVideoAnalysis(analysisId);
      if (cachedAnalysis) {
        console.log(`📦 Cache'den video analizi yüklendi:`, analysisId);
        setSelectedAnalysis(cachedAnalysis);
        setActiveTab('detail');
        setLoading(false);
        return;
      }
      
      console.log(`🌐 API'den video analizi çekiliyor:`, analysisId);
      const analysisDetail = await analysisService.getAnalysisByIdFromAPI(analysisId);
      if (analysisDetail) {
        setSelectedAnalysis(analysisDetail);
        setActiveTab('detail');
        
        // Cache'e kaydet
        setVideoAnalysis(analysisId, analysisDetail);
      }
    } catch (error) {
      console.error('Analiz detayı alınamadı:', error);
      message.error('Analiz detayı yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAnalysisHistory();
    }
  }, [user]);

  const handleAsyncAnalysisComplete = (result: any) => {
    console.log('✅ Async analiz tamamlandı:', result);
    setAnalysisResult(result);
    setVideoInfo(result.video_info);
    setActiveTab('results');
    setIsAsyncAnalyzing(false);
    
    // Cache'e kaydet
    setVideoAnalysis(currentVideoId, result);
    
    // AI Context'e yorumları gönder
    if (result.comments) {
      const aiComments = result.comments.map((comment: any) => ({
        id: comment.id || Math.random().toString(),
        text: comment.text,
        author: comment.author,
        date: comment.date,
        language: comment.sentiment?.language || 'tr',
        video_title: result.video_info?.title || 'Video',
        sentiment: {
          polarity: comment.sentiment?.polarity || comment.sentiment?.score || 0,
          subjectivity: 0.5,
          confidence: Math.abs(comment.sentiment?.polarity || comment.sentiment?.score || 0)
        }
      }));
      setAIComments(aiComments);
    }
    
    message.success(`Video analizi tamamlandı! ${result.total_comments} yorum analiz edildi.`);
    
    // Analiz geçmişini yenile
    fetchAnalysisHistory();
  };

  const handleAsyncAnalysisError = (error: string) => {
    console.error('❌ Async analiz hatası:', error);
    setError(error);
    setIsAsyncAnalyzing(false);
    message.error(error);
  };

  const handleAsyncAnalysisCancel = () => {
    console.log('🚫 Async analiz iptal edildi');
    setIsAsyncAnalyzing(false);
    setActiveTab('input');
  };

  const handleAnalyze = async (values: { videoUrl: string }) => {
    if (!user) {
      message.error('Lütfen önce giriş yapın.');
      return;
    }

    const videoId = extractVideoId(values.videoUrl);
    if (!videoId) {
      message.error('Geçerli bir YouTube video URL\'si girin.');
      return;
    }

    try {
      setError(null);
      setCurrentVideoId(videoId);
      
      // Önce cache'e bak
      const cachedResult = getVideoAnalysis(videoId);
      if (cachedResult) {
        console.log(`📦 Cache'den video analizi yüklendi:`, videoId);
        setAnalysisResult(cachedResult);
        setVideoInfo(cachedResult.video_info);
        setActiveTab('results');
        setIsFromCache(true);
        
        // Video title'ını set et
        setCurrentVideoTitle(cachedResult.video_info?.title || 'Bilinmeyen Video');
        
        // AI Context'e yorumları gönder
        if (cachedResult.comments) {
          const aiComments = cachedResult.comments.map((comment: any) => ({
            id: comment.id || Math.random().toString(),
            text: comment.text,
            author: comment.author,
            date: comment.date,
            language: comment.sentiment?.language || 'tr',
            video_title: cachedResult.video_info?.title || 'Video',
            sentiment: {
              polarity: comment.sentiment?.polarity || comment.sentiment?.score || 0,
              subjectivity: 0.5,
              confidence: Math.abs(comment.sentiment?.polarity || comment.sentiment?.score || 0)
            }
          }));
          setAIComments(aiComments);
        }
        
        message.success('Video analizi önbellekten yüklendi!');
        return;
      }
      
      // Video bilgilerini önce al
      const videoInfoResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`);
      const videoData = await videoInfoResponse.json();
      const title = videoData.items?.[0]?.snippet?.title || 'Bilinmeyen Video';
      setCurrentVideoTitle(title);

      // Async analiz başlat
      console.log(`🚀 Async video analizi başlatılıyor:`, videoId);
      setIsAsyncAnalyzing(true);
      setActiveTab('async-progress');
    } catch (error) {
      console.error('Video analizi hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Video analizi sırasında bir hata oluştu.';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setVideoInfo(null);
    setError(null);
    setSelectedAnalysis(null);
    setActiveTab('input');
    setIsFromCache(false);
    setIsAsyncAnalyzing(false);
    setCurrentVideoId('');
    setCurrentVideoTitle('');
    // WebSocket bağlantısını koru, sadece task'ları temizle
    asyncAnalysisService.clearActiveTasks();
    form.resetFields();
  };

  // WordCloudChart artık EnhancedWordCloud bileşeni ile değiştirildi

  // Geçmiş analizler bileşeni
  const AnalysisHistory = () => (
    <div className="space-y-8">
      <div className="text-center">
        <Title level={2} className="mb-4 text-slate-800">Video Analiz Geçmişi</Title>
        <Text type="secondary" className="text-xl text-slate-600">Analiz edilmiş videolarınızın geçmişi</Text>
      </div>
      
      {analysisHistory.length === 0 ? (
        <Card className="text-center py-20 shadow-2xl border-0 bg-white/10 backdrop-blur-xl rounded-3xl">
          <div className="mb-6">
            <YoutubeOutlined className="text-8xl text-slate-300" />
          </div>
          <Title level={3} className="text-slate-600 mb-4">Henüz video analizi bulunmuyor</Title>
          <Text className="text-slate-500 text-lg">
            Henüz hiç video analizi yapmadınız.
            <br />
            Analiz yapmak için "Video URL Girişi" tab'ından başlayın.
          </Text>
        </Card>
      ) : (
        <List
          grid={{ gutter: 24, column: 1 }}
          dataSource={analysisHistory}
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                onClick={() => handleAnalysisSelect(item.id)}
                className="cursor-pointer shadow-2xl hover:shadow-xl transition-all duration-500 border-0 hover:transform hover:-translate-y-2 bg-white/10 backdrop-blur-xl rounded-3xl"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Title level={4} className="mb-4 text-slate-800">
                      {item.videoTitle || 'Bilinmeyen Video'}
                    </Title>
                    <div className="space-y-3">
                      <div className="flex items-center text-slate-600">
                        <CalendarOutlined className="mr-3 text-lg" />
                        <Text type="secondary" className="text-base">
                          {new Date(item.createdAt).toLocaleDateString('tr-TR')}
                        </Text>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <MessageOutlined className="mr-3 text-lg" />
                        <Text type="secondary" className="text-base">
                          Toplam Yorum: {item.totalComments}
                        </Text>
                      </div>
                      <Tag color={
                        item.dominantSentiment === 'positive' ? 'green' :
                        item.dominantSentiment === 'negative' ? 'red' : 'blue'
                      } className="mt-3 px-4 py-2 text-base font-medium rounded-xl">
                        {item.dominantSentiment === 'positive' ? 'Pozitif' :
                         item.dominantSentiment === 'negative' ? 'Negatif' : 'Nötr'}
                      </Tag>
                    </div>
                  </div>
                  <div className="text-right ml-6">
                    <div className="text-center p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
                      <div className={`text-3xl font-bold ${
                        item.averagePolarity > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.averagePolarity.toFixed(2)}
                      </div>
                      <div className="text-sm text-slate-500 font-medium">Ortalama Polarite</div>
                    </div>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );

  const AnalysisResults = () => {
    if (!analysisResult) return null;

    const sentimentData = [
      { name: 'Pozitif', value: analysisResult.sentiment_stats?.categories?.positive || 0 },
      { name: 'Nötr', value: analysisResult.sentiment_stats?.categories?.neutral || 0 },
      { name: 'Negatif', value: analysisResult.sentiment_stats?.categories?.negative || 0 }
    ];

    const themeData = analysisResult.sentiment_stats?.themes ? 
      Object.entries(analysisResult.sentiment_stats.themes)
        .map(([theme, count]) => ({
          name: theme.charAt(0).toUpperCase() + theme.slice(1),
          value: count as number
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10) : [];

    return (
      <div className="space-y-10">
        {/* Video Bilgileri */}
        {videoInfo && (
          <Card className="shadow-2xl border-0 hover:shadow-xl transition-shadow bg-white/10 backdrop-blur-xl rounded-3xl">
            <div className="flex justify-between items-start mb-6">
              <Title level={3} className="mb-4 text-slate-800">
                {videoInfo.title || 'Video Başlığı'}
              </Title>
              {isFromCache && (
                <Tag color="blue" className="text-sm px-4 py-2 rounded-xl">
                  📦 Önbellekten
                </Tag>
              )}
            </div>
            
            <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Video Thumbnail */}
              <div className="flex-shrink-0">
                <div className="w-64 h-48 bg-slate-200 rounded-2xl overflow-hidden shadow-2xl">
                  {videoInfo.thumbnail ? (
                    <img 
                      src={videoInfo.thumbnail} 
                      alt={videoInfo.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <YoutubeOutlined className="text-6xl text-slate-400" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Video Detayları */}
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                    <EyeOutlined className="text-blue-600 mb-3 text-3xl" />
                    <div className="text-sm text-blue-600 font-medium">Görüntülenme</div>
                    <div className="font-bold text-blue-800 text-xl">
                      {videoInfo.view_count?.toLocaleString('tr-TR') || '0'}
                    </div>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200">
                    <LikeOutlined className="text-green-600 mb-3 text-3xl" />
                    <div className="text-sm text-green-600 font-medium">Beğeni</div>
                    <div className="font-bold text-green-800 text-xl">
                      {videoInfo.like_count?.toLocaleString('tr-TR') || '0'}
                    </div>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                    <MessageOutlined className="text-purple-600 mb-3 text-3xl" />
                    <div className="text-sm text-purple-600 font-medium">Yorum</div>
                    <div className="font-bold text-purple-800 text-xl">
                      {videoInfo.comment_count?.toLocaleString('tr-TR') || '0'}
                    </div>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
                    <CalendarOutlined className="text-orange-600 mb-3 text-3xl" />
                    <div className="text-sm text-orange-600 font-medium">Yayın Tarihi</div>
                    <div className="font-bold text-orange-800 text-lg">
                      {videoInfo.published_at ? 
                        new Date(videoInfo.published_at).toLocaleDateString('tr-TR') : 
                        'Bilinmiyor'
                      }
                    </div>
                  </div>
                </div>
                
                {videoInfo.description && (
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200">
                    <Text className="text-base text-slate-600 font-medium">
                      <strong>Açıklama:</strong>
                    </Text>
                    <Paragraph 
                      ellipsis={{ rows: 3, expandable: true, symbol: 'Daha fazla' }}
                      className="mt-3 text-slate-700 text-base"
                    >
                      {videoInfo.description}
                    </Paragraph>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Modern İstatistikler */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-500 border-0 bg-white/10 backdrop-blur-xl rounded-2xl">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                  <MessageOutlined className="text-2xl text-white" />
                </div>
              </div>
              <Statistic
                title={
                  <span>
                    <span className="text-slate-700 font-semibold text-base">Toplam Yorum</span>
                    {isFromCache && <div className="text-xs text-blue-500 mt-1">📦 Önbellekten</div>}
                  </span>
                }
                value={analysisResult.total_comments || 0}
                valueStyle={{ color: '#1890ff', fontSize: '2.5rem', fontWeight: 'bold' }}
              />
              <div className="mt-4">
                <Progress 
                  percent={100} 
                  size="small" 
                  strokeColor="#1890ff"
                  showInfo={false}
                  strokeWidth={6}
                />
                <Text type="secondary" className="text-sm mt-2 block font-medium">
                  {isFromCache ? '📦 Önbellekten' : '🌐 Canlı veri'}
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-500 border-0 bg-white/10 backdrop-blur-xl rounded-2xl">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                  <RiseOutlined className="text-2xl text-white" />
                </div>
              </div>
              <Statistic
                title={<span className="text-slate-700 font-semibold text-base">Ortalama Duygu</span>}
                value={analysisResult.sentiment_stats?.average_polarity || 0}
                precision={3}
                valueStyle={{ 
                  color: (analysisResult.sentiment_stats?.average_polarity || 0) > 0 ? '#52c41a' : '#ff4d4f',
                  fontSize: '2.5rem', 
                  fontWeight: 'bold' 
                }}
              />
              <div className="mt-4">
                <Progress 
                  percent={Math.abs((analysisResult.sentiment_stats?.average_polarity || 0) * 100)} 
                  size="small" 
                  strokeColor={(analysisResult.sentiment_stats?.average_polarity || 0) > 0 ? '#52c41a' : '#ff4d4f'}
                  showInfo={false}
                  strokeWidth={6}
                />
                <Text type="secondary" className="text-sm mt-2 block font-medium">
                  {(analysisResult.sentiment_stats?.average_polarity || 0) > 0 ? '📈 Pozitif trend' : '📉 Negatif trend'}
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-500 border-0 bg-white/10 backdrop-blur-xl rounded-2xl">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                  <BarChartOutlined className="text-2xl text-white" />
                </div>
              </div>
              <Statistic
                title={<span className="text-slate-700 font-semibold text-base">Pozitiflik Oranı</span>}
                value={analysisResult.sentiment_stats?.categories?.positive ? 
                  ((analysisResult.sentiment_stats.categories.positive / analysisResult.total_comments) * 100) : 0
                }
                precision={1}
                suffix="%"
                valueStyle={{ color: '#722ed1', fontSize: '2.5rem', fontWeight: 'bold' }}
              />
              <div className="mt-4">
                <Progress 
                  percent={analysisResult.sentiment_stats?.categories?.positive ? 
                    (analysisResult.sentiment_stats.categories.positive / analysisResult.total_comments) * 100 : 0
                  } 
                  size="small" 
                  strokeColor="#722ed1"
                  showInfo={false}
                  strokeWidth={6}
                />
                <Text type="secondary" className="text-sm mt-2 block font-medium">
                  {analysisResult.sentiment_stats?.categories?.positive || 0} pozitif yorum
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-500 border-0 bg-white/10 backdrop-blur-xl rounded-2xl">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                  <FileTextOutlined className="text-2xl text-white" />
                </div>
              </div>
              <Statistic
                title={<span className="text-slate-700 font-semibold text-base">Aktif Temalar</span>}
                value={themeData.length}
                valueStyle={{ color: '#fa8c16', fontSize: '2.5rem', fontWeight: 'bold' }}
              />
              <div className="mt-4">
                <Progress 
                  percent={(themeData.length / 10) * 100} 
                  size="small" 
                  strokeColor="#fa8c16"
                  showInfo={false}
                  strokeWidth={6}
                />
                <Text type="secondary" className="text-sm mt-2 block font-medium">
                  Tespit edilen konu başlıkları
                </Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Detaylı İstatistik Panelleri */}
        <Row gutter={[32, 32]} className="mb-10">
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-4 flex items-center justify-center shadow-lg">
                    <BarChartOutlined className="text-white text-lg" />
                  </div>
                  <span className="text-xl font-semibold text-slate-800">Duygu Analizi Özeti</span>
                </div>
              }
              className="shadow-2xl border-0 hover:shadow-xl transition-all duration-500 bg-white/10 backdrop-blur-xl rounded-3xl"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200">
                  <div className="flex items-center">
                    <SmileOutlined className="text-3xl text-green-600 mr-4" />
                    <div>
                      <Text strong className="text-green-800 text-lg">Pozitif Yorumlar</Text>
                      <div className="text-sm text-green-600 mt-1">
                        {analysisResult.sentiment_stats?.categories?.positive || 0} yorum
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {analysisResult.sentiment_stats?.categories?.positive ? 
                        ((analysisResult.sentiment_stats.categories.positive / analysisResult.total_comments) * 100).toFixed(1) : 0
                      }%
                    </div>
                    <Progress 
                      percent={analysisResult.sentiment_stats?.categories?.positive ? 
                        (analysisResult.sentiment_stats.categories.positive / analysisResult.total_comments) * 100 : 0
                      }
                      size="small"
                      strokeColor="#52c41a"
                      showInfo={false}
                      className="w-24"
                      strokeWidth={6}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                  <div className="flex items-center">
                    <MehOutlined className="text-3xl text-blue-600 mr-4" />
                    <div>
                      <Text strong className="text-blue-800 text-lg">Nötr Yorumlar</Text>
                      <div className="text-sm text-blue-600 mt-1">
                        {analysisResult.sentiment_stats?.categories?.neutral || 0} yorum
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {analysisResult.sentiment_stats?.categories?.neutral ? 
                        ((analysisResult.sentiment_stats.categories.neutral / analysisResult.total_comments) * 100).toFixed(1) : 0
                      }%
                    </div>
                    <Progress 
                      percent={analysisResult.sentiment_stats?.categories?.neutral ? 
                        (analysisResult.sentiment_stats.categories.neutral / analysisResult.total_comments) * 100 : 0
                      }
                      size="small"
                      strokeColor="#1890ff"
                      showInfo={false}
                      className="w-24"
                      strokeWidth={6}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl border border-red-200">
                  <div className="flex items-center">
                    <FrownOutlined className="text-3xl text-red-600 mr-4" />
                    <div>
                      <Text strong className="text-red-800 text-lg">Negatif Yorumlar</Text>
                      <div className="text-sm text-red-600 mt-1">
                        {analysisResult.sentiment_stats?.categories?.negative || 0} yorum
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {analysisResult.sentiment_stats?.categories?.negative ? 
                        ((analysisResult.sentiment_stats.categories.negative / analysisResult.total_comments) * 100).toFixed(1) : 0
                      }%
                    </div>
                    <Progress 
                      percent={analysisResult.sentiment_stats?.categories?.negative ? 
                        (analysisResult.sentiment_stats.categories.negative / analysisResult.total_comments) * 100 : 0
                      }
                      size="small"
                      strokeColor="#ff4d4f"
                      showInfo={false}
                      className="w-24"
                      strokeWidth={6}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card 
              title={
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl mr-4 flex items-center justify-center shadow-lg">
                    <FileTextOutlined className="text-white text-lg" />
                  </div>
                  <span className="text-xl font-semibold text-slate-800">Tema Dağılımı</span>
                </div>
              }
              className="shadow-2xl border-0 hover:shadow-xl transition-all duration-500 bg-white/10 backdrop-blur-xl rounded-3xl"
            >
              <div className="space-y-8">
                <div>
                  <Text strong className="text-slate-700 mb-4 block text-lg">En Popüler Temalar</Text>
                  <Space wrap>
                    {themeData.slice(0, 6).map(theme => (
                      <Tag 
                        key={theme.name} 
                        color="blue"
                        className="mb-3 px-4 py-2 text-base font-medium rounded-xl"
                      >
                        {theme.name}: {theme.value}
                      </Tag>
                    ))}
                  </Space>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Modern Grafikler */}
        <Row gutter={[32, 32]} className="mb-10">
          <Col xs={24} lg={8}>
            <Card 
              title={
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl mr-3 flex items-center justify-center shadow-lg">
                    <SmileOutlined className="text-white text-lg" />
                  </div>
                  <span className="text-xl font-semibold text-slate-800">Duygu Dağılımı</span>
                </div>
              }
              className="shadow-2xl border-0 hover:shadow-xl transition-all duration-500 bg-white/10 backdrop-blur-xl rounded-3xl"
              extra={
                <Tag color="blue" className="font-medium px-3 py-1 rounded-xl">
                  {analysisResult.total_comments} Toplam
                </Tag>
              }
            >
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent, value }) => `${name}\n${value} yorum\n${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={3}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        style={{
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '20px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card 
              title={
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mr-3 flex items-center justify-center shadow-lg">
                    <FileTextOutlined className="text-white text-lg" />
                  </div>
                  <span className="text-xl font-semibold text-slate-800">Tema Analizi</span>
                </div>
              }
              className="shadow-2xl border-0 hover:shadow-xl transition-all duration-500 bg-white/10 backdrop-blur-xl rounded-3xl"
              extra={
                <Tag color="purple" className="font-medium px-3 py-1 rounded-xl">
                  Top {Math.min(themeData.length, 8)}
                </Tag>
              }
            >
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={themeData.slice(0, 8)} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#333' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="url(#barGradient)"
                    radius={[8, 8, 0, 0]}
                    cursor="pointer"
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8884d8" />
                      <stop offset="100%" stopColor="#82ca9d" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card 
              title={
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-xl mr-3 flex items-center justify-center shadow-lg">
                    <BarChartOutlined className="text-white text-lg" />
                  </div>
                  <span className="text-xl font-semibold text-slate-800">Video Performansı</span>
                </div>
              }
              className="shadow-2xl border-0 hover:shadow-xl transition-all duration-500 bg-white/10 backdrop-blur-xl rounded-3xl"
            >
              <div className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {((analysisResult.sentiment_stats?.categories?.positive || 0) / (analysisResult.total_comments || 1) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-blue-500 font-medium">Pozitif Tepki Oranı</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {analysisResult.sentiment_stats?.average_polarity ? 
                      (analysisResult.sentiment_stats.average_polarity > 0 ? 'İyi' : 'Kötü') : 'Orta'
                    }
                  </div>
                  <div className="text-sm text-green-500 font-medium">Genel Duygu Durumu</div>
                </div>

                <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {themeData.length}
                  </div>
                  <div className="text-sm text-purple-500 font-medium">Farklı Tema</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Kelime Bulutu */}
        <div className="mb-10">
          <EnhancedWordCloud 
            words={(analysisResult.word_cloud || []).map((w: any) => ({
              text: w.text,
              value: w.value
            }))}
            title="Video Analizi Kelime Bulutu"
            theme="green"
            height={600}
            interactive={true}
            showStats={true}
            downloadable={true}
            maxWords={50}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                <PlayCircleOutlined className="text-2xl text-white" />
              </div>
            </div>
            <Title level={1} className="mb-3 text-white text-3xl font-bold">
              Video Analizi
            </Title>
            <Text className="text-white text-opacity-90 text-lg font-medium">
              YouTube video URL'si ile detaylı yorum sentiment analizi yapın
            </Text>
            <div className="flex justify-center mt-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 border border-white border-opacity-20">
                <div className="flex items-center space-x-4 text-white text-opacity-80 text-sm">
                  <div className="flex items-center">
                    <ThunderboltOutlined className="mr-2 text-base" />
                    <span className="font-medium">Real-time İşlem</span>
                  </div>
                  <div className="w-1 h-4 bg-white bg-opacity-30 rounded"></div>
                  <div className="flex items-center">
                    <FileTextOutlined className="mr-2 text-base" />
                    <span className="font-medium">AI Analiz</span>
                  </div>
                  <div className="w-1 h-4 bg-white bg-opacity-30 rounded"></div>
                  <div className="flex items-center">
                    <BarChartOutlined className="mr-2 text-base" />
                    <span className="font-medium">Görsel Raporlar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 py-8">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          className="mb-10" 
          size="large"
          tabBarStyle={{ marginBottom: '3rem' }}
        >
          <TabPane 
            tab={
              <span className="flex items-center">
                <LinkOutlined className="mr-2" />
                Video URL Girişi
              </span>
            } 
            key="input"
          >
            <Row gutter={[32, 32]} justify="center">
              <Col xs={24} lg={16}>
                <Card className="shadow-2xl border-0 bg-white/10 backdrop-blur-xl rounded-3xl">
                  <div className="text-center mb-10">
                    <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
                      <YoutubeOutlined className="text-4xl text-white" />
                    </div>
                    <Title level={2} className="mb-4 text-slate-800">YouTube Video Analizi</Title>
                    <Text className="text-slate-600 text-xl">
                      Analiz etmek istediğiniz YouTube videosunun URL'sini girin
                    </Text>
                  </div>

                  <Form
                    form={form}
                    onFinish={handleAnalyze}
                    layout="vertical"
                    className="space-y-8"
                  >
                    <Form.Item
                      name="videoUrl"
                      label={<span className="text-xl font-medium text-slate-700">YouTube Video URL</span>}
                      rules={[
                        { required: true, message: 'Lütfen bir YouTube video URL\'si girin!' },
                        {
                          validator: (_, value) => {
                            if (!value || validateYouTubeUrl(value)) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Geçerli bir YouTube video URL\'si girin!'));
                          },
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="https://www.youtube.com/watch?v=..."
                        prefix={<YoutubeOutlined className="text-red-500" />}
                        className="rounded-2xl py-4 text-lg"
                        style={{
                          height: '60px',
                          fontSize: '18px'
                        }}
                      />
                    </Form.Item>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-2xl border-l-4 border-blue-400">
                      <Title level={4} className="text-blue-800 mb-4">
                        <FileTextOutlined className="mr-3" />
                        Analiz Hakkında
                      </Title>
                      <ul className="text-blue-700 space-y-3 text-lg">
                        <li>• Video yorumları sentiment analizi ile değerlendirilir</li>
                        <li>• Pozitif, negatif ve nötr yorumlar kategorize edilir</li>
                        <li>• Kelime bulutu ve tema analizi yapılır</li>
                        <li>• Analiz sonuçları görsel grafiklerle sunulur</li>
                        <li>• Real-time progress tracking ile anlık güncelleme</li>
                        <li>• WebSocket bağlantısı ile hızlı iletişim</li>
                      </ul>
                    </div>

                    {error && (
                      <Alert
                        message="Analiz Hatası"
                        description={error}
                        type="error"
                        showIcon
                        className="rounded-2xl"
                      />
                    )}

                    <div className="text-center">
                      <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={isAsyncAnalyzing}
                        disabled={isAsyncAnalyzing}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 hover:from-green-600 hover:to-emerald-700 rounded-2xl px-16 py-8 h-auto font-semibold text-xl shadow-2xl"
                        icon={<BarChartOutlined />}
                      >
                        {isAsyncAnalyzing ? 'Analiz Ediliyor...' : 'Analizi Başlat'}
                      </Button>
                    </div>
                  </Form>
                </Card>
              </Col>
              
              <Col xs={24} lg={8}>
                <Card className="shadow-2xl border-0 h-full bg-white/10 backdrop-blur-xl rounded-3xl">
                  <Title level={3} className="mb-6 text-slate-800">
                    <YoutubeOutlined className="mr-3 text-red-600" />
                    Desteklenen URL Formatları
                  </Title>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
                      <Text strong className="text-slate-700 text-lg">Standart URL:</Text>
                      <div className="text-base text-slate-600 mt-2 font-mono bg-white p-3 rounded-xl">
                        youtube.com/watch?v=VIDEO_ID
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
                      <Text strong className="text-slate-700 text-lg">Kısa URL:</Text>
                      <div className="text-base text-slate-600 mt-2 font-mono bg-white p-3 rounded-xl">
                        youtu.be/VIDEO_ID
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
                      <Text strong className="text-slate-700 text-lg">Embed URL:</Text>
                      <div className="text-base text-slate-600 mt-2 font-mono bg-white p-3 rounded-xl">
                        youtube.com/embed/VIDEO_ID
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl border-l-4 border-yellow-400">
                    <Text className="text-yellow-800 text-lg">
                      <strong>Not:</strong> Video analizi birkaç dakika sürebilir. 
                      Lütfen sayfayı kapatmayın.
                    </Text>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane 
            tab={
              <span className="flex items-center">
                <BarChartOutlined className="mr-2" />
                Analiz Sonuçları
              </span>
            } 
            key="results"
            disabled={!analysisResult}
          >
            {analysisResult ? (
              <div>
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <Title level={2} className="mb-4 text-slate-800">Analiz Sonuçları</Title>
                    <Text className="text-slate-600 text-xl">
                      {analysisResult.total_comments} yorum başarıyla analiz edildi
                    </Text>
                  </div>
                  <Button
                    type="default"
                    size="large"
                    onClick={resetAnalysis}
                    icon={<ReloadOutlined />}
                    className="rounded-2xl px-8 py-6 h-auto font-medium shadow-lg"
                  >
                    Yeni Analiz
                  </Button>
                </div>
                
                <AnalysisResults />
              </div>
            ) : (
              <Card className="text-center py-20 shadow-2xl border-0 bg-white/10 backdrop-blur-xl rounded-3xl">
                <div className="mb-6">
                  <BarChartOutlined className="text-8xl text-slate-300" />
                </div>
                <Title level={3} className="text-slate-600 mb-4">Henüz Analiz Yapılmadı</Title>
                <Text className="text-slate-500 mb-8 text-lg">
                  Analiz sonuçlarını görmek için önce bir video URL'si girin ve analizi başlatın.
                </Text>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => setActiveTab('input')}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 hover:from-green-600 hover:to-emerald-700 rounded-2xl px-8 py-6 h-auto font-medium"
                >
                  Video URL Girişine Git
                </Button>
              </Card>
            )}
          </TabPane>

          {/* Async Progress Tab */}
          {isAsyncAnalyzing && (
            <TabPane 
              tab={
                <span className="flex items-center">
                  <ThunderboltOutlined className="mr-2" />
                  Analiz
                </span>
              } 
              key="async-progress"
            >
              <AsyncAnalysisProgress
                videoId={currentVideoId}
                videoTitle={currentVideoTitle}
                maxComments={100}
                onComplete={handleAsyncAnalysisComplete}
                onError={handleAsyncAnalysisError}
                onCancel={handleAsyncAnalysisCancel}
              />
            </TabPane>
          )}

          <TabPane tab={
            <span className="flex items-center">
              <HistoryOutlined className="mr-2" />
              Geçmiş Analizler
            </span>
          } key="history">
            <AnalysisHistory />
          </TabPane>

          {selectedAnalysis && (
            <TabPane tab={
              <span className="flex items-center">
                <FileTextOutlined className="mr-2" />
                Analiz Detayı
              </span>
            } key="detail">
              <Card className="shadow-2xl border-0 bg-white/10 backdrop-blur-xl rounded-3xl">
                <Title level={3} className="mb-6 text-slate-800">{selectedAnalysis.videoTitle}</Title>
                <Text type="secondary" className="text-xl text-slate-600">
                  Analiz Tarihi: {new Date(selectedAnalysis.createdAt).toLocaleDateString('tr-TR')}
                </Text>
                
                {/* Seçili analiz için istatistikler */}
                <Row gutter={[24, 24]} className="mt-8">
                  <Col xs={24} sm={12} lg={6}>
                    <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                      <div className="text-4xl font-bold text-blue-600 mb-3">
                        {selectedAnalysis.sentimentStats.total}
                      </div>
                      <div className="text-base text-blue-500 font-medium">Toplam Yorum</div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <div className="text-center p-8 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200">
                      <div className={`text-4xl font-bold mb-3 ${
                        selectedAnalysis.sentimentStats.averagePolarity > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedAnalysis.sentimentStats.averagePolarity.toFixed(2)}
                      </div>
                      <div className="text-base text-slate-500 font-medium">Ortalama Polarite</div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <div className="text-center p-8 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                      <div className="text-4xl font-bold text-purple-600 mb-3">
                        {
                          selectedAnalysis.sentimentStats.categories.positive >= 
                          selectedAnalysis.sentimentStats.categories.negative &&
                          selectedAnalysis.sentimentStats.categories.positive >= 
                          selectedAnalysis.sentimentStats.categories.neutral ? 'Pozitif' :
                          selectedAnalysis.sentimentStats.categories.negative >= 
                          selectedAnalysis.sentimentStats.categories.neutral ? 'Negatif' : 'Nötr'
                        }
                      </div>
                      <div className="text-base text-purple-500 font-medium">Dominant Duygu</div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <div className="text-center p-8 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
                      <div className="text-4xl font-bold text-orange-600 mb-3">
                        {Math.round((selectedAnalysis.sentimentStats.categories.positive / selectedAnalysis.sentimentStats.total) * 100)}%
                      </div>
                      <div className="text-base text-orange-500 font-medium">Pozitif Oran</div>
                    </div>
                  </Col>
                </Row>

                {/* Seçili analiz için kelime bulutu */}
                {selectedAnalysis.wordCloud && selectedAnalysis.wordCloud.length > 0 && (
                  <div className="mt-10">
                    <EnhancedWordCloud 
                      words={selectedAnalysis.wordCloud.map((w: any) => ({
                        text: w.text,
                        value: w.value
                      }))}
                      title="Seçili Analiz Kelime Bulutu"
                      theme="green"
                      height={500}
                      interactive={true}
                      showStats={true}
                      maxWords={40}
                    />
                  </div>
                )}
              </Card>
            </TabPane>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default VideoAnalysis; 