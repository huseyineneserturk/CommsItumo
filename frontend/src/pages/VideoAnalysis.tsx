import React, { useState, useEffect } from 'react';
import { Card, message, Spin, Typography, Row, Col, Statistic, Button, Input, Form, Alert, Tag, Tabs, List, Progress, Space, Switch } from 'antd';
import { analysisService } from '../services/analysisService';
import { AnalysisResult, AnalysisSummary } from '../types/analysis';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { YoutubeOutlined, PlayCircleOutlined, BarChartOutlined, FileTextOutlined, LinkOutlined, ReloadOutlined, EyeOutlined, LikeOutlined, MessageOutlined, CalendarOutlined, HistoryOutlined, SmileOutlined, MehOutlined, FrownOutlined, RiseOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Wordcloud } from '@visx/wordcloud';
import { scaleOrdinal } from '@visx/scale';
import { Text as VisxText } from '@visx/text';
import { getAuth } from 'firebase/auth';
import { useAI } from '../contexts/AIContext';
import { useCache } from '../contexts/CacheContext';
import { AsyncAnalysisProgress } from '../components/AsyncAnalysisProgress';
import { asyncAnalysisService } from '../services/asyncAnalysisService';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

interface WordCloudProps {
  words: { text: string; value: number }[];
}

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

  const WordCloudChart: React.FC<WordCloudProps> = ({ words }) => {
    const [selectedWord, setSelectedWord] = useState<string | null>(null);

    if (!words || words.length === 0) {
      return (
        <Card 
          title={
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg mr-3 flex items-center justify-center">
                <FileTextOutlined className="text-white" />
              </div>
              <span className="text-lg font-semibold">Kelime Bulutu</span>
            </div>
          }
          className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300"
        >
          <div className="text-center py-16">
            <FileTextOutlined className="text-6xl text-gray-300 mb-4" />
            <Title level={4} className="text-gray-500 mb-2">Kelime bulutu için yeterli veri yok</Title>
            <Text className="text-gray-400">Analiz edilecek yeterli kelime bulunamadı</Text>
          </div>
        </Card>
      );
    }

    const data = words.slice(0, 50).map(word => ({
      text: word.text,
      value: word.value
    }));

    const colorScale = scaleOrdinal({
      domain: data.map(d => d.text),
      range: [
        '#ff4757', '#3742fa', '#2ed573', '#ffa502', '#ff6348',
        '#1e90ff', '#ff1493', '#32cd32', '#ff8c00', '#9370db',
        '#20b2aa', '#ff69b4', '#00ced1', '#ffd700', '#dc143c'
      ]
    });

    const fontScale = (value: number) => Math.max(10, Math.min(32, value * 1.5));

    return (
      <Card 
        title={
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg mr-3 flex items-center justify-center">
              <FileTextOutlined className="text-white" />
            </div>
            <span className="text-lg font-semibold">Kelime Bulutu</span>
          </div>
        }
        className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300"
        extra={
          <div className="flex items-center space-x-2">
            <Tag color="purple" className="font-medium">
              {words.length} Kelime
            </Tag>
            {selectedWord && (
              <Button 
                type="link" 
                onClick={() => setSelectedWord(null)}
                icon={<ReloadOutlined />}
                size="small"
              >
                Temizle
              </Button>
            )}
          </div>
        }
      >
        <div className="relative">
          {/* Kompakt Word Cloud */}
          <div className="h-80 w-full flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-xl border border-purple-100 shadow-inner">
            <svg width="100%" height="100%" viewBox="0 0 600 320" className="max-w-full">
              <Wordcloud
                words={data}
                width={600}
                height={320}
                fontSize={(datum) => fontScale(datum.value)}
                font="Inter, system-ui, sans-serif"
                padding={1}
                spiral="archimedean"
                rotate={0}
                random={() => 0.5}
              >
                {(cloudWords) =>
                  cloudWords.map((w, i) => (
                    <VisxText
                      key={w.text}
                      fill={colorScale(w.text || '')}
                      textAnchor="middle"
                      transform={`translate(${w.x}, ${w.y})`}
                      fontSize={w.size}
                      fontFamily={w.font}
                      fontWeight="600"
                      onClick={() => setSelectedWord(w.text || '')}
                      style={{ 
                        cursor: 'pointer',
                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                        transition: 'all 0.2s ease'
                      }}
                      className="hover:opacity-80"
                    >
                      {w.text}
                    </VisxText>
                  ))
                }
              </Wordcloud>
            </svg>
            
            {/* Selected Word Tooltip */}
            {selectedWord && (
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border max-w-48">
                <Text strong className="text-sm text-gray-800 block">{selectedWord}</Text>
                <Text type="secondary" className="text-xs">
                  {words.find(w => w.text === selectedWord)?.value || 0} kullanım
                </Text>
              </div>
            )}
          </div>
          
          {/* Kompakt İstatistikler */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="text-lg font-bold text-blue-600">{words.length}</div>
              <div className="text-xs text-blue-500">Toplam</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="text-lg font-bold text-green-600 truncate" title={words[0]?.text || '-'}>
                {words[0]?.text?.slice(0, 8) || '-'}
              </div>
              <div className="text-xs text-green-500">En Sık</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
              <div className="text-lg font-bold text-red-600">{words[0]?.value || 0}</div>
              <div className="text-xs text-red-500">Sayısı</div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // Geçmiş analizler bileşeni
  const AnalysisHistory = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Title level={3} className="mb-2">Video Analiz Geçmişi</Title>
        <Text type="secondary" className="text-lg">Analiz edilmiş videolarınızın geçmişi</Text>
      </div>
      
      {analysisHistory.length === 0 ? (
        <Card className="text-center py-16 shadow-lg border-0">
          <div className="mb-4">
            <YoutubeOutlined className="text-6xl text-gray-300" />
          </div>
          <Title level={4} className="text-gray-500 mb-2">Henüz video analizi bulunmuyor</Title>
          <Text className="text-gray-400">
            Henüz hiç video analizi yapmadınız.
            <br />
            Analiz yapmak için "Video URL Girişi" tab'ından başlayın.
          </Text>
        </Card>
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={analysisHistory}
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                onClick={() => handleAnalysisSelect(item.id)}
                className="cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 border-0 hover:transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Title level={5} className="mb-3">
                      {item.videoTitle || 'Bilinmeyen Video'}
                    </Title>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-500">
                        <CalendarOutlined className="mr-2" />
                        <Text type="secondary">
                          {new Date(item.createdAt).toLocaleDateString('tr-TR')}
                        </Text>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <MessageOutlined className="mr-2" />
                        <Text type="secondary">
                          Toplam Yorum: {item.totalComments}
                        </Text>
                      </div>
                      <Tag color={
                        item.dominantSentiment === 'positive' ? 'green' :
                        item.dominantSentiment === 'negative' ? 'red' : 'blue'
                      } className="mt-2">
                        {item.dominantSentiment === 'positive' ? 'Pozitif' :
                         item.dominantSentiment === 'negative' ? 'Negatif' : 'Nötr'}
                      </Tag>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className={`text-2xl font-bold ${
                        item.averagePolarity > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.averagePolarity.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">Ortalama Polarite</div>
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
      <div className="space-y-8">
        {/* Video Bilgileri */}
        {videoInfo && (
          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <Title level={4} className="mb-3 text-gray-900">
                {videoInfo.title || 'Video Başlığı'}
              </Title>
              {isFromCache && (
                <Tag color="blue" className="text-xs">
                  📦 Önbellekten
                </Tag>
              )}
            </div>
            
            <div className="flex flex-col lg:flex-row items-start space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Video Thumbnail */}
              <div className="flex-shrink-0">
                <div className="w-48 h-36 bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                  {videoInfo.thumbnail ? (
                    <img 
                      src={videoInfo.thumbnail} 
                      alt={videoInfo.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <YoutubeOutlined className="text-4xl text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Video Detayları */}
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <EyeOutlined className="text-blue-600 mr-2" />
                    <div>
                      <div className="text-sm text-blue-600">Görüntülenme</div>
                      <div className="font-semibold text-blue-800">
                        {videoInfo.view_count?.toLocaleString('tr-TR') || '0'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <LikeOutlined className="text-green-600 mr-2" />
                    <div>
                      <div className="text-sm text-green-600">Beğeni</div>
                      <div className="font-semibold text-green-800">
                        {videoInfo.like_count?.toLocaleString('tr-TR') || '0'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                    <MessageOutlined className="text-purple-600 mr-2" />
                    <div>
                      <div className="text-sm text-purple-600">Yorum</div>
                      <div className="font-semibold text-purple-800">
                        {videoInfo.comment_count?.toLocaleString('tr-TR') || '0'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                    <CalendarOutlined className="text-orange-600 mr-2" />
                    <div>
                      <div className="text-sm text-orange-600">Yayın Tarihi</div>
                      <div className="font-semibold text-orange-800">
                        {videoInfo.published_at ? 
                          new Date(videoInfo.published_at).toLocaleDateString('tr-TR') : 
                          'Bilinmiyor'
                        }
                      </div>
                    </div>
                  </div>
                </div>
                
                {videoInfo.description && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Text className="text-sm text-gray-600">
                      <strong>Açıklama:</strong>
                    </Text>
                    <Paragraph 
                      ellipsis={{ rows: 3, expandable: true, symbol: 'Daha fazla' }}
                      className="mt-2 text-gray-700"
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
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
                  <MessageOutlined className="text-2xl text-white" />
                </div>
              </div>
              <Statistic
                title={
                  <span>
                    <span className="text-blue-700 font-semibold">Toplam Yorum</span>
                    {isFromCache && <div className="text-xs text-blue-500 mt-1">📦 Önbellekten</div>}
                  </span>
                }
                value={analysisResult.total_comments || 0}
                valueStyle={{ color: '#1890ff', fontSize: '2.5rem', fontWeight: 'bold' }}
              />
              <div className="mt-3">
                <Progress 
                  percent={100} 
                  size="small" 
                  strokeColor="#1890ff"
                  showInfo={false}
                />
                <Text type="secondary" className="text-xs mt-1 block">
                  {isFromCache ? '📦 Önbellekten' : '🌐 Canlı veri'}
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-0 bg-gradient-to-br from-green-50 to-green-100">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
                  <RiseOutlined className="text-2xl text-white" />
                </div>
              </div>
              <Statistic
                title={<span className="text-green-700 font-semibold">Ortalama Duygu</span>}
                value={analysisResult.sentiment_stats?.average_polarity || 0}
                precision={3}
                valueStyle={{ 
                  color: (analysisResult.sentiment_stats?.average_polarity || 0) > 0 ? '#52c41a' : '#ff4d4f',
                  fontSize: '2.5rem', 
                  fontWeight: 'bold' 
                }}
              />
              <div className="mt-3">
                <Progress 
                  percent={Math.abs((analysisResult.sentiment_stats?.average_polarity || 0) * 100)} 
                  size="small" 
                  strokeColor={(analysisResult.sentiment_stats?.average_polarity || 0) > 0 ? '#52c41a' : '#ff4d4f'}
                  showInfo={false}
                />
                <Text type="secondary" className="text-xs mt-1 block">
                  {(analysisResult.sentiment_stats?.average_polarity || 0) > 0 ? '📈 Pozitif trend' : '📉 Negatif trend'}
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-0 bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
                  <BarChartOutlined className="text-2xl text-white" />
                </div>
              </div>
              <Statistic
                title={<span className="text-purple-700 font-semibold">Pozitiflik Oranı</span>}
                value={analysisResult.sentiment_stats?.categories?.positive ? 
                  ((analysisResult.sentiment_stats.categories.positive / analysisResult.total_comments) * 100) : 0
                }
                precision={1}
                suffix="%"
                valueStyle={{ color: '#722ed1', fontSize: '2.5rem', fontWeight: 'bold' }}
              />
              <div className="mt-3">
                <Progress 
                  percent={analysisResult.sentiment_stats?.categories?.positive ? 
                    (analysisResult.sentiment_stats.categories.positive / analysisResult.total_comments) * 100 : 0
                  } 
                  size="small" 
                  strokeColor="#722ed1"
                  showInfo={false}
                />
                <Text type="secondary" className="text-xs mt-1 block">
                  {analysisResult.sentiment_stats?.categories?.positive || 0} pozitif yorum
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-0 bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
                  <FileTextOutlined className="text-2xl text-white" />
                </div>
              </div>
              <Statistic
                title={<span className="text-orange-700 font-semibold">Aktif Temalar</span>}
                value={themeData.length}
                valueStyle={{ color: '#fa8c16', fontSize: '2.5rem', fontWeight: 'bold' }}
              />
              <div className="mt-3">
                <Progress 
                  percent={(themeData.length / 10) * 100} 
                  size="small" 
                  strokeColor="#fa8c16"
                  showInfo={false}
                />
                <Text type="secondary" className="text-xs mt-1 block">
                  Tespit edilen konu başlıkları
                </Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Detaylı İstatistik Panelleri */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-3 flex items-center justify-center">
                    <BarChartOutlined className="text-white" />
                  </div>
                  <span className="text-lg font-semibold">Duygu Analizi Özeti</span>
                </div>
              }
              className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center">
                    <SmileOutlined className="text-2xl text-green-600 mr-3" />
                    <div>
                      <Text strong className="text-green-800">Pozitif Yorumlar</Text>
                      <div className="text-xs text-green-600">
                        {analysisResult.sentiment_stats?.categories?.positive || 0} yorum
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
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
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center">
                    <MehOutlined className="text-2xl text-blue-600 mr-3" />
                    <div>
                      <Text strong className="text-blue-800">Nötr Yorumlar</Text>
                      <div className="text-xs text-blue-600">
                        {analysisResult.sentiment_stats?.categories?.neutral || 0} yorum
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
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
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                  <div className="flex items-center">
                    <FrownOutlined className="text-2xl text-red-600 mr-3" />
                    <div>
                      <Text strong className="text-red-800">Negatif Yorumlar</Text>
                      <div className="text-xs text-red-600">
                        {analysisResult.sentiment_stats?.categories?.negative || 0} yorum
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">
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
                      className="w-20"
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
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg mr-3 flex items-center justify-center">
                    <FileTextOutlined className="text-white" />
                  </div>
                  <span className="text-lg font-semibold">Tema Dağılımı</span>
                </div>
              }
              className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300"
            >
              <div className="space-y-6">
                <div>
                  <Text strong className="text-gray-700 mb-3 block">En Popüler Temalar</Text>
                  <Space wrap>
                    {themeData.slice(0, 6).map(theme => (
                      <Tag 
                        key={theme.name} 
                        color="blue"
                        className="mb-2 px-3 py-1 text-sm"
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
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} lg={8}>
            <Card 
              title={
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg mr-3 flex items-center justify-center">
                    <SmileOutlined className="text-white" />
                  </div>
                  <span className="text-lg font-semibold">Duygu Dağılımı</span>
                </div>
              }
              className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300"
              extra={
                <Tag color="blue" className="font-medium">
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
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg mr-3 flex items-center justify-center">
                    <FileTextOutlined className="text-white" />
                  </div>
                  <span className="text-lg font-semibold">Tema Analizi</span>
                </div>
              }
              className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300"
              extra={
                <Tag color="purple" className="font-medium">
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
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-lg mr-3 flex items-center justify-center">
                    <BarChartOutlined className="text-white" />
                  </div>
                  <span className="text-lg font-semibold">Video Performansı</span>
                </div>
              }
              className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">
                    {((analysisResult.sentiment_stats?.categories?.positive || 0) / (analysisResult.total_comments || 1) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-blue-500">Pozitif Tepki Oranı</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">
                    {analysisResult.sentiment_stats?.average_polarity ? 
                      (analysisResult.sentiment_stats.average_polarity > 0 ? 'İyi' : 'Kötü') : 'Orta'
                    }
                  </div>
                  <div className="text-sm text-green-500">Genel Duygu Durumu</div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">
                    {themeData.length}
                  </div>
                  <div className="text-sm text-purple-500">Farklı Tema</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Kelime Bulutu */}
        <WordCloudChart words={analysisResult.word_cloud || []} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <Title level={2} className="mb-2 text-gray-900">
              <PlayCircleOutlined className="mr-3 text-red-600" />
              Video Analizi
            </Title>
            <Text className="text-gray-600 text-lg">
              YouTube video URL'si ile detaylı yorum analizi yapın
            </Text>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          className="mb-8" 
          size="large"
          tabBarStyle={{ marginBottom: '2rem' }}
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
            <Row gutter={[24, 24]} justify="center">
              <Col xs={24} lg={16}>
                <Card className="shadow-xl border-0">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <YoutubeOutlined className="text-3xl text-white" />
                    </div>
                    <Title level={3} className="mb-2">YouTube Video Analizi</Title>
                    <Text className="text-gray-600 text-lg">
                      Analiz etmek istediğiniz YouTube videosunun URL'sini girin
                    </Text>
                  </div>

                  <Form
                    form={form}
                    onFinish={handleAnalyze}
                    layout="vertical"
                    className="space-y-6"
                  >
                    <Form.Item
                      name="videoUrl"
                      label={<span className="text-lg font-medium">YouTube Video URL</span>}
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
                        className="rounded-xl"
                      />
                    </Form.Item>

                    <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-400">
                      <Title level={5} className="text-blue-800 mb-3">
                        <FileTextOutlined className="mr-2" />
                        Analiz Hakkında
                      </Title>
                      <ul className="text-blue-700 space-y-2">
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
                        className="rounded-xl"
                      />
                    )}

                    <div className="text-center">
                      <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={isAsyncAnalyzing}
                        disabled={isAsyncAnalyzing}
                        className="bg-red-600 border-red-600 hover:bg-red-700 px-12 py-3 h-auto rounded-xl font-semibold"
                        icon={<BarChartOutlined />}
                      >
                        {isAsyncAnalyzing ? 'Analiz Ediliyor...' : 'Analizi Başlat'}
                      </Button>
                    </div>
                  </Form>
                </Card>
              </Col>
              
              <Col xs={24} lg={8}>
                <Card className="shadow-lg border-0 h-full">
                  <Title level={4} className="mb-4">
                    <YoutubeOutlined className="mr-2 text-red-600" />
                    Desteklenen URL Formatları
                  </Title>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Text strong className="text-gray-700">Standart URL:</Text>
                      <div className="text-sm text-gray-600 mt-1 font-mono">
                        youtube.com/watch?v=VIDEO_ID
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Text strong className="text-gray-700">Kısa URL:</Text>
                      <div className="text-sm text-gray-600 mt-1 font-mono">
                        youtu.be/VIDEO_ID
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Text strong className="text-gray-700">Embed URL:</Text>
                      <div className="text-sm text-gray-600 mt-1 font-mono">
                        youtube.com/embed/VIDEO_ID
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <Text className="text-yellow-800">
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
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <Title level={3} className="mb-2">Analiz Sonuçları</Title>
                    <Text className="text-gray-600 text-lg">
                      {analysisResult.total_comments} yorum başarıyla analiz edildi
                    </Text>
                  </div>
                  <Button
                    type="default"
                    size="large"
                    onClick={resetAnalysis}
                    icon={<ReloadOutlined />}
                    className="rounded-xl"
                  >
                    Yeni Analiz
                  </Button>
                </div>
                
                <AnalysisResults />
              </div>
            ) : (
              <Card className="text-center py-16 shadow-lg border-0">
                <div className="mb-4">
                  <BarChartOutlined className="text-6xl text-gray-300" />
                </div>
                <Title level={4} className="text-gray-500 mb-2">Henüz Analiz Yapılmadı</Title>
                <Text className="text-gray-400 mb-6">
                  Analiz sonuçlarını görmek için önce bir video URL'si girin ve analizi başlatın.
                </Text>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => setActiveTab('input')}
                  className="bg-red-600 border-red-600 hover:bg-red-700"
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
              <Card className="shadow-lg border-0">
                <Title level={4} className="mb-4">{selectedAnalysis.videoTitle}</Title>
                <Text type="secondary" className="text-lg">
                  Analiz Tarihi: {new Date(selectedAnalysis.createdAt).toLocaleDateString('tr-TR')}
                </Text>
                
                {/* Seçili analiz için istatistikler */}
                <Row gutter={[16, 16]} className="mt-6">
                  <Col xs={24} sm={12} lg={6}>
                    <div className="text-center p-6 bg-blue-50 rounded-xl">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {selectedAnalysis.sentimentStats.total}
                      </div>
                      <div className="text-sm text-blue-500">Toplam Yorum</div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <div className="text-center p-6 bg-green-50 rounded-xl">
                      <div className={`text-3xl font-bold mb-2 ${
                        selectedAnalysis.sentimentStats.averagePolarity > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedAnalysis.sentimentStats.averagePolarity.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">Ortalama Polarite</div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <div className="text-center p-6 bg-purple-50 rounded-xl">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {
                          selectedAnalysis.sentimentStats.categories.positive >= 
                          selectedAnalysis.sentimentStats.categories.negative &&
                          selectedAnalysis.sentimentStats.categories.positive >= 
                          selectedAnalysis.sentimentStats.categories.neutral ? 'Pozitif' :
                          selectedAnalysis.sentimentStats.categories.negative >= 
                          selectedAnalysis.sentimentStats.categories.neutral ? 'Negatif' : 'Nötr'
                        }
                      </div>
                      <div className="text-sm text-purple-500">Dominant Duygu</div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <div className="text-center p-6 bg-orange-50 rounded-xl">
                      <div className="text-3xl font-bold text-orange-600 mb-2">
                        {Math.round((selectedAnalysis.sentimentStats.categories.positive / selectedAnalysis.sentimentStats.total) * 100)}%
                      </div>
                      <div className="text-sm text-orange-500">Pozitif Oran</div>
                    </div>
                  </Col>
                </Row>

                {/* Seçili analiz için kelime bulutu */}
                {selectedAnalysis.wordCloud && selectedAnalysis.wordCloud.length > 0 && (
                  <div className="mt-8">
                    <WordCloudChart words={selectedAnalysis.wordCloud} />
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