import React, { useState } from 'react';
import { Upload, Button, message, Card, Typography, Row, Col, Spin, Statistic, Steps, Alert, Tag, Progress, Space, Divider, List, Avatar, Tooltip, Collapse } from 'antd';
import { InboxOutlined, CalendarOutlined, FilterOutlined, ReloadOutlined, UploadOutlined, FileTextOutlined, BarChartOutlined, CheckCircleOutlined, SmileOutlined, MehOutlined, FrownOutlined, RiseOutlined, MessageOutlined, ThunderboltOutlined, ClockCircleOutlined, UserOutlined, CommentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, CartesianGrid } from 'recharts';
import { EnhancedWordCloud } from '../components/EnhancedWordCloud';
import { useAI } from '../contexts/AIContext';
import { useCache } from '../contexts/CacheContext';
import { asyncAnalysisService, ProgressUpdate } from '../services/asyncAnalysisService';

const { Dragger } = Upload;
const { Title, Text } = Typography;
const { Step } = Steps;
const { Panel } = Collapse;

interface AnalysisResult {
  comments: Array<{
    text: string;
    author: string;
    date: string;
    video_title: string;
    sentiment: {
      category: string;
      score: number;
      language: string;
    };
    theme: { [key: string]: number };
  }>;
  sentiment_stats: {
    total: number;
    categories: {
      positive: number;
      negative: number;
      neutral: number;
    };
    average_polarity: number;
    language_distribution: {
      tr: number;
      en: number;
    };
    themes: { [key: string]: number };
  };
  word_cloud: Array<{
    text: string;
    value: number;
  }>;
  theme_analysis: Array<{
    theme: string;
    count: number;
  }>;
}

const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

export function UploadCSV() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFromCache, setIsFromCache] = useState(false);
  const [asyncProgress, setAsyncProgress] = useState(0);
  const [asyncStatus, setAsyncStatus] = useState<string>('');
  const [asyncMessage, setAsyncMessage] = useState<string>('');
  const [isAsyncActive, setIsAsyncActive] = useState(false);
  const [asyncTaskId, setAsyncTaskId] = useState<string>('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  
  const navigate = useNavigate();
  const { setComments: setAIComments } = useAI();
  
  // Cache sistemini kullan
  const { getCsvAnalysis, setCsvAnalysis } = useCache();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins > 0 ? `${mins}dk ${secs}s` : `${secs}s`;
  };

  const calculateEstimatedTime = (currentProgress: number, elapsed: number): number => {
    if (currentProgress <= 5) return 0;
    const totalEstimatedTime = (elapsed / currentProgress) * 100;
    const remaining = Math.max(0, totalEstimatedTime - elapsed);
    
    if (estimatedTime !== null) {
      return estimatedTime * 0.7 + remaining * 0.3;
    }
    return remaining;
  };

  // Elapsed time counter
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAsyncActive && startTime) {
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime.getTime()) / 1000;
        setElapsedTime(elapsed);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAsyncActive, startTime]);

  const handleAsyncCSVAnalysis = async (file: File) => {
    try {
      setIsAsyncActive(true);
      setStartTime(new Date());
      setCurrentStep(1);
      
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('Kullanıcı girişi gerekli');
      }

      // WebSocket bağlantısını başlat
      asyncAnalysisService.connectWebSocket(user.uid);

      const formData = new FormData();
      formData.append('file', file);
      const token = await user.getIdToken();

      // Async CSV upload API'si (şimdilik normal API kullanacağız, gelecekte async CSV endpoint eklenebilir)
      setAsyncProgress(20);
      setAsyncStatus('uploading');
      setAsyncMessage('CSV dosyası yükleniyor...');

      const response = await axios.post('http://localhost:8000/api/csv/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setAsyncProgress(60);
      setAsyncStatus('processing');
      setAsyncMessage('CSV verileri işleniyor...');

      // Simulate progress steps
      for (let i = 60; i <= 95; i += 5) {
        setAsyncProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setAsyncProgress(100);
      setAsyncStatus('completed');
      setAsyncMessage('CSV analizi tamamlandı!');
      setCurrentStep(3);
      setIsAsyncActive(false);

      const result = response.data.data;
      console.log('📊 CSV Analiz Sonucu:', result);
      console.log('📝 İlk yorum örneği:', result.comments?.[0]);
      setAnalysisResult(result);

      // Cache'e kaydet
      const fileKey = `${file.name}_${file.size}_${file.lastModified}`;
      setCsvAnalysis(fileKey, { data: result, fileInfo: { name: file.name, size: file.size } });

      // AI Context'e yorumları gönder
      const aiComments = result.comments.map((comment: any) => ({
        id: Math.random().toString(),
        text: comment.text,
        author: comment.author,
        date: comment.date,
        language: comment.sentiment.language,
        video_title: comment.video_title,
        sentiment: {
          polarity: comment.sentiment.score || comment.sentiment.polarity || 0,
          subjectivity: 0.5,
          confidence: Math.abs(comment.sentiment.score || comment.sentiment.polarity || 0)
        }
      }));
      setAIComments(aiComments);

      message.success('CSV dosyası başarıyla analiz edildi!');

    } catch (error) {
      setIsAsyncActive(false);
      setAsyncStatus('error');
      setAsyncMessage(error instanceof Error ? error.message : 'Bir hata oluştu');
      setCurrentStep(0);
      message.error(error instanceof Error ? error.message : 'Bir hata oluştu');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    // Dosya hash'i oluştur (cache key olarak kullanacağız)
    const fileKey = `${file.name}_${file.size}_${file.lastModified}`;
    
    // Önce cache'e bak
    const cachedResult = getCsvAnalysis(fileKey);
    if (cachedResult) {
      console.log('📦 Cache\'den CSV analizi yüklendi:', fileKey);
      console.log('📝 Cache\'den ilk yorum örneği:', cachedResult.data.comments?.[0]);
      setAnalysisResult(cachedResult.data);
      setCurrentStep(3);
      setIsFromCache(true);
      
      // AI Context'e yorumları gönder
      const aiComments = cachedResult.data.comments.map((comment: any) => ({
        id: Math.random().toString(),
        text: comment.text,
        author: comment.author,
        date: comment.date,
        language: comment.sentiment.language,
        video_title: comment.video_title,
        sentiment: {
          polarity: comment.sentiment.score || comment.sentiment.polarity || 0,
          subjectivity: 0.5,
          confidence: Math.abs(comment.sentiment.score || comment.sentiment.polarity || 0)
        }
      }));
      setAIComments(aiComments);
      
      message.success('CSV analizi önbellekten yüklendi');
      return;
    }

    // Async veya sync analiz
    await handleAsyncCSVAnalysis(file);
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.csv',
    beforeUpload: (file: File) => {
      setFile(file);
      setIsFromCache(false);
      return false;
    },
    showUploadList: false,
  };

  const resetUpload = () => {
    setFile(null);
    setAnalysisResult(null);
    setCurrentStep(0);
    setIsFromCache(false);
    setAsyncProgress(0);
    setAsyncStatus('');
    setAsyncMessage('');
    setIsAsyncActive(false);
    setElapsedTime(0);
    setEstimatedTime(null);
    // WebSocket bağlantısını tamamen kapatma, sadece task'ları temizle
    asyncAnalysisService.clearActiveTasks();
  };

  const renderSentimentChart = () => {
    if (!analysisResult) return null;

    const data = [
      { name: 'Pozitif', value: analysisResult.sentiment_stats.categories.positive },
      { name: 'Nötr', value: analysisResult.sentiment_stats.categories.neutral },
      { name: 'Negatif', value: analysisResult.sentiment_stats.categories.negative }
    ];

    return (
      <Card title="Duygu Dağılımı" className="shadow-lg border-0 hover:shadow-xl transition-shadow">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    );
  };

  // renderWordCloud artık EnhancedWordCloud bileşeni ile değiştirildi

  const renderThemeChart = () => {
    if (!analysisResult) return null;

    const data = analysisResult.theme_analysis.map(item => ({
      name: item.theme.charAt(0).toUpperCase() + item.theme.slice(1),
      value: item.count
    }));

    return (
      <Card title="Tema Analizi" className="shadow-lg border-0 hover:shadow-xl transition-shadow">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    );
  };

  // Yorumlar bileşeni
  const CommentsSection: React.FC<{ comments: any[] }> = ({ comments }) => {
    const [visibleComments, setVisibleComments] = useState(10);
    const [filterSentiment, setFilterSentiment] = useState('all');

    const filteredComments = comments.filter(comment => 
      filterSentiment === 'all' || comment.sentiment.category === filterSentiment
    );

    const getSentimentIcon = (sentiment: string) => {
      switch (sentiment) {
        case 'positive': return <SmileOutlined style={{ color: '#52c41a' }} />;
        case 'negative': return <FrownOutlined style={{ color: '#ff4d4f' }} />;
        default: return <MehOutlined style={{ color: '#1890ff' }} />;
      }
    };

    const getSentimentColor = (sentiment: string) => {
      switch (sentiment) {
        case 'positive': return '#52c41a';
        case 'negative': return '#ff4d4f';
        default: return '#1890ff';
      }
    };

    if (!comments || comments.length === 0) {
      return (
        <Card className="mt-8 shadow-lg border-0">
          <div className="text-center py-16">
            <CommentOutlined className="text-6xl text-gray-300 mb-4" />
            <Title level={4} className="text-gray-500 mb-2">Henüz yorum bulunamadı</Title>
            <Text className="text-gray-400">CSV dosyasında analiz edilmiş yorum bulunmuyor</Text>
          </div>
        </Card>
      );
    }

    return (
      <div className="mt-8">
        <Collapse 
          size="large"
          expandIconPosition="end"
          className="shadow-lg border-0"
          style={{ 
            borderRadius: '12px',
            overflow: 'hidden'
          }}
        >
          <Panel 
            header={
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center">
                  <CommentOutlined className="mr-3 text-blue-600 text-xl" />
                  <div>
                    <Title level={5} className="mb-0">CSV Yorumları</Title>
                    <Text type="secondary" className="text-sm">
                      {comments.length} yorum • Analiz sonuçları
                    </Text>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Tag color="blue">{comments.length} Toplam</Tag>
                  <Tag color="green">{comments.filter(c => c.sentiment.category === 'positive').length} Pozitif</Tag>
                  <Tag color="orange">{comments.filter(c => c.sentiment.category === 'neutral').length} Nötr</Tag>
                  <Tag color="red">{comments.filter(c => c.sentiment.category === 'negative').length} Negatif</Tag>
                </div>
              </div>
            } 
            key="comments"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
            }}
            className="text-white"
          >
            <div className="bg-white p-6 rounded-xl">
              {/* Yorumlar Listesi */}
              <List
                dataSource={filteredComments.slice(0, visibleComments)}
                renderItem={(comment, index) => (
                  <List.Item className="hover:bg-gray-50 rounded-xl p-4 transition-all duration-300">
                    <div className="w-full">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar 
                            icon={<UserOutlined />} 
                            style={{ 
                              backgroundColor: getSentimentColor(comment.sentiment.category),
                              border: `2px solid ${getSentimentColor(comment.sentiment.category)}20`
                            }}
                          />
                          <div>
                            <Text strong className="text-base">{comment.author || 'Anonim Kullanıcı'}</Text>
                            <div className="flex items-center space-x-2 mt-1">
                              <ClockCircleOutlined className="text-gray-400 text-xs" />
                              <Text type="secondary" className="text-xs">
                                {new Date(comment.date).toLocaleDateString('tr-TR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </Text>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            {getSentimentIcon(comment.sentiment.category)}
                            <Tag 
                              color={comment.sentiment.category === 'positive' ? 'green' : 
                                    comment.sentiment.category === 'negative' ? 'red' : 'blue'}
                              className="font-medium"
                            >
                              {comment.sentiment.category === 'positive' ? 'Pozitif' :
                               comment.sentiment.category === 'negative' ? 'Negatif' : 'Nötr'}
                            </Tag>
                          </div>
                          <div className="text-xs text-gray-500">
                            Skor: {(comment.sentiment.score || comment.sentiment.polarity || 0).toFixed(3)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Video Bilgisi */}
                      <div className="bg-gray-50 p-3 rounded-lg mb-3">
                        <div className="flex items-center space-x-2">
                          <FileTextOutlined className="text-red-500" />
                          <Text className="text-sm font-medium text-gray-700">
                            {comment.video_title || 'Bilinmeyen Video'}
                          </Text>
                        </div>
                      </div>

                      {/* Yorum Metni */}
                      <div className="bg-white p-4 border-l-4 border-red-400 rounded-r-lg mb-3">
                        <Text className="text-gray-700 leading-relaxed">
                          {comment.text}
                        </Text>
                      </div>

                      {/* Analiz Detayları */}
                      <div className="bg-white border rounded-lg p-4">
                        <Title level={5} className="mb-3 text-gray-700">Analiz Detayları</Title>
                        <Row gutter={16}>
                                                     <Col span={8}>
                             <div className="text-center">
                               <div className={`text-2xl font-bold mb-1`} style={{ color: getSentimentColor(comment.sentiment.category) }}>
                                 {((comment.sentiment.score || comment.sentiment.polarity || 0) * 100).toFixed(1)}%
                               </div>
                               <Text type="secondary" className="text-xs">Sentiment Skoru</Text>
                               <Progress 
                                 percent={Math.abs((comment.sentiment.score || comment.sentiment.polarity || 0) * 100)} 
                                 size="small" 
                                 strokeColor={getSentimentColor(comment.sentiment.category)}
                                 showInfo={false}
                                 className="mt-2"
                               />
                             </div>
                           </Col>
                          <Col span={8}>
                            <div className="text-center">
                              <div className="text-2xl font-bold mb-1 text-orange-600">
                                {comment.sentiment.language?.toUpperCase() || 'TR'}
                              </div>
                              <Text type="secondary" className="text-xs">Tespit Edilen Dil</Text>
                              <div className="mt-2">
                                <Tag color="orange" className="text-xs">
                                  {comment.sentiment.language === 'tr' ? 'Türkçe' : 'İngilizce'}
                                </Tag>
                              </div>
                            </div>
                          </Col>
                          <Col span={8}>
                            <div className="text-center">
                              <div className="text-2xl font-bold mb-1 text-purple-600">
                                {comment.sentiment.category === 'positive' ? '😊' : 
                                 comment.sentiment.category === 'negative' ? '😞' : '😐'}
                              </div>
                              <Text type="secondary" className="text-xs">Duygu Durumu</Text>
                              <div className="mt-2">
                                <Tag color={comment.sentiment.category === 'positive' ? 'green' : 
                                           comment.sentiment.category === 'negative' ? 'red' : 'blue'} 
                                     className="text-xs">
                                  {comment.sentiment.category === 'positive' ? 'Pozitif' :
                                   comment.sentiment.category === 'negative' ? 'Negatif' : 'Nötr'}
                                </Tag>
                              </div>
                            </div>
                          </Col>
                        </Row>

                        {/* Tema Analizi */}
                        {comment.theme && Object.keys(comment.theme).length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <Text strong className="text-sm text-gray-600 mb-2 block">Tespit Edilen Temalar:</Text>
                            <Space wrap>
                              {Object.entries(comment.theme)
                                .filter(([_, score]) => (score as number) > 0.1)
                                .sort(([, a], [, b]) => (b as number) - (a as number))
                                .map(([theme, score]) => (
                                  <Tag 
                                    key={theme} 
                                    color="blue"
                                    className="text-xs"
                                  >
                                    {theme}: {((score as number) * 100).toFixed(0)}%
                                  </Tag>
                                ))}
                            </Space>
                          </div>
                        )}
                      </div>
                    </div>
                  </List.Item>
                )}
              />

              {/* Daha Fazla Göster */}
              {visibleComments < filteredComments.length && (
                <div className="text-center mt-6">
                  <Button 
                    type="primary" 
                    size="large"
                    onClick={() => setVisibleComments(prev => prev + 10)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 rounded-xl px-8 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Daha Fazla Göster ({filteredComments.length - visibleComments} kaldı)
                  </Button>
                </div>
              )}
            </div>
          </Panel>
        </Collapse>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                <UploadOutlined className="text-2xl text-white" />
              </div>
            </div>
            <Title level={1} className="mb-3 text-white text-3xl font-bold">
              CSV Dosya Analizi
            </Title>
            <Text className="text-white text-opacity-90 text-lg font-medium">
              Yorum verilerinizi CSV formatında yükleyerek kapsamlı sentiment analizi yapın
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
        {/* Progress Steps */}
        <Card className="mb-8 shadow-2xl border-0 bg-white/10 backdrop-blur-xl rounded-3xl">
          <div className="p-8">
            <Title level={3} className="text-center mb-8 text-slate-800">
              <RiseOutlined className="mr-3 text-orange-600 text-2xl" />
              Analiz Süreci
            </Title>
            <Steps 
              current={currentStep} 
              className="mb-6"
              items={[
                {
                  title: <span className="font-semibold text-base">Dosya Seçimi</span>,
                  icon: <FileTextOutlined />,
                  description: "CSV dosyanızı yükleyin"
                },
                {
                  title: <span className="font-semibold text-base">Yükleme</span>,
                  icon: <UploadOutlined />,
                  description: "Dosya sunucuya gönderiliyor"
                },
                {
                  title: <span className="font-semibold text-base">Analiz</span>,
                  icon: <BarChartOutlined />,
                  description: "AI ile sentiment analizi"
                },
                {
                  title: <span className="font-semibold text-base">Sonuçlar</span>,
                  icon: <CheckCircleOutlined />,
                  description: "Raporlar hazırlandı"
                }
              ]}
            />
          </div>
        </Card>

        {!analysisResult ? (
          <Row gutter={[32, 32]}>
            {/* Upload Section */}
            <Col xs={24} lg={16}>
              <Card className="shadow-2xl border-0 h-full bg-white/10 backdrop-blur-xl rounded-3xl">
                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
                    <InboxOutlined className="text-4xl text-white" />
                  </div>
                  <Title level={2} className="mb-4 text-slate-800">
                    CSV Dosyanızı Yükleyin
                  </Title>
                  <Text className="text-slate-600 text-lg">
                    Analiz için CSV dosyanızı sürükleyin veya seçin
                  </Text>
                </div>
                
                {/* Async Progress Display */}
                {isAsyncActive && (
                  <Card size="small" className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300 rounded-2xl">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <Text strong className="text-blue-800 text-lg">CSV Analizi İşleniyor...</Text>
                        <Tag color="blue" className="px-3 py-1 text-sm font-medium">{asyncStatus}</Tag>
                      </div>
                      
                      <Progress 
                        percent={asyncProgress} 
                        status={asyncStatus === 'error' ? 'exception' : 'active'}
                        strokeColor={{
                          '0%': '#108ee9',
                          '50%': '#87d068', 
                          '100%': '#52c41a',
                        }}
                        strokeWidth={8}
                        className="mb-4"
                      />
                      
                      <div className="flex justify-between text-base text-slate-700">
                        <Text className="font-medium">{asyncMessage}</Text>
                        <Text className="font-medium">
                          Geçen Süre: {formatTime(elapsedTime)}
                          {estimatedTime && estimatedTime > 0 && ` | Kalan: ${formatTime(estimatedTime)}`}
                        </Text>
                      </div>
                    </div>
                  </Card>
                )}
                
                <form onSubmit={handleSubmit}>
                  <Dragger 
                    {...uploadProps} 
                    className="mb-10"
                    disabled={isAsyncActive}
                    style={{ 
                      background: isAsyncActive ? 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)' : 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
                      border: isAsyncActive ? '3px dashed #d9d9d9' : '3px dashed #fb923c',
                      borderRadius: '24px',
                      opacity: isAsyncActive ? 0.6 : 1,
                      minHeight: '240px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="mb-8">
                        <div className={`w-24 h-24 rounded-3xl mx-auto flex items-center justify-center shadow-2xl transition-all duration-300 ${
                          isAsyncActive 
                            ? 'bg-gray-400' 
                            : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
                        }`}>
                          <InboxOutlined className="text-5xl text-white" />
                        </div>
                      </div>
                      <Title level={3} className={`mb-4 ${isAsyncActive ? 'text-slate-500' : 'text-slate-800'}`}>
                        {isAsyncActive ? 'Dosya işleniyor...' : 'CSV Dosyanızı Buraya Bırakın'}
                      </Title>
                      <Text className="text-slate-600 text-center max-w-md leading-relaxed text-lg">
                        {isAsyncActive 
                          ? 'Analiz süreci devam ediyor, lütfen bekleyin...'
                          : 'Sadece .csv formatındaki dosyalar desteklenmektedir. Dosyanızı sürükleyip bırakın veya tıklayarak seçin.'
                        }
                      </Text>
                      {!isAsyncActive && (
                        <div className="mt-8">
                          <Button 
                            type="primary" 
                            size="large"
                            className="bg-gradient-to-r from-orange-500 to-amber-600 border-0 hover:from-orange-600 hover:to-amber-700 rounded-2xl px-10 py-6 h-auto font-semibold text-lg shadow-2xl"
                          >
                            Dosya Seç
                          </Button>
                        </div>
                      )}
                    </div>
                  </Dragger>

                  {file && !isAsyncActive && (
                    <Alert
                      message="Dosya Seçildi"
                      description={`${file.name} (${(file.size / 1024).toFixed(2)} KB)`}
                      type="success"
                      showIcon
                      className="mb-8 rounded-2xl"
                    />
                  )}

                  <div className="text-center">
                    <Button
                      type="primary"
                      size="large"
                      htmlType="submit"
                      loading={loading || isAsyncActive}
                      disabled={!file || isAsyncActive}
                      className="bg-gradient-to-r from-orange-500 to-amber-600 border-0 hover:from-orange-600 hover:to-amber-700 rounded-2xl px-12 py-6 h-auto font-semibold text-lg shadow-2xl"
                      icon={<ThunderboltOutlined />}
                    >
                      {loading || isAsyncActive ? 'Analiz Ediliyor...' : 'Analizi Başlat'}
                    </Button>
                    
                    {isAsyncActive && (
                      <Button
                        type="default"
                        size="large"
                        className="ml-6 rounded-2xl px-8 py-6 h-auto font-medium"
                        onClick={() => {
                          setIsAsyncActive(false);
                          asyncAnalysisService.disconnect();
                        }}
                      >
                        İptal Et
                      </Button>
                    )}
                  </div>
                </form>
              </Card>
            </Col>

            {/* Instructions */}
            <Col xs={24} lg={8}>
              <Card className="shadow-2xl border-0 h-full bg-white/10 backdrop-blur-xl rounded-3xl">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl">
                    <FileTextOutlined className="text-2xl text-white" />
                  </div>
                  <Title level={3} className="mb-4 text-slate-800">
                    CSV Format Rehberi
                  </Title>
                  <Text className="text-slate-600 text-base">
                    Dosyanızın doğru formatda olduğundan emin olun
                  </Text>
                </div>
                
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                        <FileTextOutlined className="text-white text-lg" />
                      </div>
                      <Text strong className="text-blue-800 text-lg">Gerekli Sütunlar</Text>
                    </div>
                    <div className="space-y-3">
                      {['text (yorum metni)', 'author (yorum yazarı)', 'date (tarih)', 'video_title (video başlığı)'].map((item, index) => (
                        <div key={index} className="flex items-center text-blue-700">
                          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-4"></div>
                          <Text className="text-base">{item}</Text>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-6 rounded-2xl border border-green-200">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                        <BarChartOutlined className="text-white text-lg" />
                      </div>
                      <Text strong className="text-green-800 text-lg">AI Analiz Özellikleri</Text>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        'Sentiment analizi',
                        'Tema çıkarma', 
                        'Kelime bulutu',
                        'Dil tespiti',
                        'Real-time tracking',
                        'WebSocket iletişim'
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center text-green-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          <Text className="text-sm">{feature}</Text>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-100 p-6 rounded-2xl border border-purple-200">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                        <MessageOutlined className="text-white text-lg" />
                      </div>
                      <Text strong className="text-purple-800 text-lg">Desteklenen Diller</Text>
                    </div>
                    <div className="flex space-x-6">
                      <div className="flex items-center">
                        <div className="w-8 h-6 bg-red-500 rounded mr-3 shadow"></div>
                        <Text className="text-base text-purple-700 font-medium">Türkçe</Text>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-6 bg-blue-500 rounded mr-3 shadow"></div>
                        <Text className="text-base text-purple-700 font-medium">İngilizce</Text>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        ) : (
          <div>
            {/* Results Header */}
            <div className="flex justify-between items-center mb-10">
              <div>
                <Title level={2} className="mb-4 text-slate-800">
                  Analiz Sonuçları
                  {isFromCache && (
                    <Tag color="blue" className="ml-4 text-sm px-4 py-2 rounded-xl">
                      📦 Önbellekten
                    </Tag>
                  )}
                </Title>
                <Text className="text-slate-600 text-lg">
                  {analysisResult.sentiment_stats.total} yorum başarıyla analiz edildi
                  {isFromCache && ' (Önbellekten yüklendi)'}
                </Text>
              </div>
              <Button
                type="default"
                size="large"
                onClick={resetUpload}
                icon={<ReloadOutlined />}
                className="rounded-2xl px-8 py-6 h-auto font-medium shadow-lg"
              >
                Yeni Analiz
              </Button>
            </div>

            {/* Statistics */}
            <Row gutter={[16, 16]} className="mb-8">
              <Col xs={24} sm={12} lg={6}>
                <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-500 border-0 bg-white/10 backdrop-blur-xl rounded-2xl">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                      <FileTextOutlined className="text-2xl text-white" />
                    </div>
                  </div>
                  <Statistic
                    title={
                      <span>
                        <span className="text-slate-700 font-semibold text-base">Toplam Yorum</span>
                        {isFromCache && <div className="text-xs text-blue-500 mt-1">📦 Önbellekten</div>}
                      </span>
                    }
                    value={analysisResult.sentiment_stats.total}
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
                      <SmileOutlined className="text-2xl text-white" />
                    </div>
                  </div>
                  <Statistic
                    title={<span className="text-slate-700 font-semibold text-base">Pozitif Yorumlar</span>}
                    value={analysisResult.sentiment_stats.categories.positive}
                    valueStyle={{ color: '#52c41a', fontSize: '2.5rem', fontWeight: 'bold' }}
                  />
                  <div className="mt-4">
                    <Progress 
                      percent={(analysisResult.sentiment_stats.categories.positive / analysisResult.sentiment_stats.total) * 100}
                      size="small" 
                      strokeColor="#52c41a"
                      showInfo={false}
                      strokeWidth={6}
                    />
                    <Text type="secondary" className="text-sm mt-2 block font-medium">
                      {((analysisResult.sentiment_stats.categories.positive / analysisResult.sentiment_stats.total) * 100).toFixed(1)}% pozitif
                    </Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-500 border-0 bg-white/10 backdrop-blur-xl rounded-2xl">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                      <FrownOutlined className="text-2xl text-white" />
                    </div>
                  </div>
                  <Statistic
                    title={<span className="text-slate-700 font-semibold text-base">Negatif Yorumlar</span>}
                    value={analysisResult.sentiment_stats.categories.negative}
                    valueStyle={{ color: '#ff4d4f', fontSize: '2.5rem', fontWeight: 'bold' }}
                  />
                  <div className="mt-4">
                    <Progress 
                      percent={(analysisResult.sentiment_stats.categories.negative / analysisResult.sentiment_stats.total) * 100}
                      size="small" 
                      strokeColor="#ff4d4f"
                      showInfo={false}
                      strokeWidth={6}
                    />
                    <Text type="secondary" className="text-sm mt-2 block font-medium">
                      {((analysisResult.sentiment_stats.categories.negative / analysisResult.sentiment_stats.total) * 100).toFixed(1)}% negatif
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
                    title={<span className="text-slate-700 font-semibold text-base">Ortalama Polarite</span>}
                    value={analysisResult.sentiment_stats.average_polarity}
                    precision={3}
                    valueStyle={{ 
                      color: analysisResult.sentiment_stats.average_polarity > 0 ? '#52c41a' : '#ff4d4f',
                      fontSize: '2.5rem', 
                      fontWeight: 'bold' 
                    }}
                  />
                  <div className="mt-4">
                    <Progress 
                      percent={Math.abs(analysisResult.sentiment_stats.average_polarity * 100)}
                      size="small" 
                      strokeColor={analysisResult.sentiment_stats.average_polarity > 0 ? '#52c41a' : '#ff4d4f'}
                      showInfo={false}
                      strokeWidth={6}
                    />
                    <Text type="secondary" className="text-sm mt-2 block font-medium">
                      {analysisResult.sentiment_stats.average_polarity > 0 ? '📈 Pozitif trend' : '📉 Negatif trend'}
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
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl mr-4 flex items-center justify-center shadow-lg">
                        <FileTextOutlined className="text-white text-lg" />
                      </div>
                      <span className="text-xl font-semibold text-slate-800">Dil ve Tema Dağılımı</span>
                    </div>
                  }
                  className="shadow-2xl border-0 hover:shadow-xl transition-all duration-500 bg-white/10 backdrop-blur-xl rounded-3xl"
                >
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Text strong className="text-slate-700 text-lg">Dil Dağılımı</Text>
                        <Text type="secondary" className="text-base">{analysisResult.sentiment_stats.total} toplam</Text>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-blue-500 rounded mr-3 shadow"></div>
                            <Text className="text-base font-medium">Türkçe</Text>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Text strong className="text-lg">{analysisResult.sentiment_stats.language_distribution.tr}</Text>
                            <Text type="secondary" className="text-base">
                              ({((analysisResult.sentiment_stats.language_distribution.tr / analysisResult.sentiment_stats.total) * 100).toFixed(1)}%)
                            </Text>
                          </div>
                        </div>
                        <Progress 
                          percent={(analysisResult.sentiment_stats.language_distribution.tr / analysisResult.sentiment_stats.total) * 100}
                          strokeColor="#1890ff"
                          showInfo={false}
                          strokeWidth={8}
                        />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-purple-500 rounded mr-3 shadow"></div>
                            <Text className="text-base font-medium">İngilizce</Text>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Text strong className="text-lg">{analysisResult.sentiment_stats.language_distribution.en}</Text>
                            <Text type="secondary" className="text-base">
                              ({((analysisResult.sentiment_stats.language_distribution.en / analysisResult.sentiment_stats.total) * 100).toFixed(1)}%)
                            </Text>
                          </div>
                        </div>
                        <Progress 
                          percent={(analysisResult.sentiment_stats.language_distribution.en / analysisResult.sentiment_stats.total) * 100}
                          strokeColor="#722ed1"
                          showInfo={false}
                          strokeWidth={8}
                        />
                      </div>
                    </div>

                    <Divider />

                    <div>
                      <Text strong className="text-slate-700 mb-4 block text-lg">En Popüler Temalar</Text>
                      <Space wrap>
                        {analysisResult.theme_analysis.slice(0, 6).map(theme => (
                          <Tag 
                            key={theme.theme} 
                            color="blue"
                            className="mb-3 px-4 py-2 text-base font-medium rounded-xl"
                          >
                            {theme.theme.charAt(0).toUpperCase() + theme.theme.slice(1)}: {theme.count}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  </div>
                </Card>
              </Col>

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
                            {analysisResult.sentiment_stats.categories.positive} yorum
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {((analysisResult.sentiment_stats.categories.positive / analysisResult.sentiment_stats.total) * 100).toFixed(1)}%
                        </div>
                        <Progress 
                          percent={(analysisResult.sentiment_stats.categories.positive / analysisResult.sentiment_stats.total) * 100}
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
                            {analysisResult.sentiment_stats.categories.neutral} yorum
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {((analysisResult.sentiment_stats.categories.neutral / analysisResult.sentiment_stats.total) * 100).toFixed(1)}%
                        </div>
                        <Progress 
                          percent={(analysisResult.sentiment_stats.categories.neutral / analysisResult.sentiment_stats.total) * 100}
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
                            {analysisResult.sentiment_stats.categories.negative} yorum
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-red-600 mb-2">
                          {((analysisResult.sentiment_stats.categories.negative / analysisResult.sentiment_stats.total) * 100).toFixed(1)}%
                        </div>
                        <Progress 
                          percent={(analysisResult.sentiment_stats.categories.negative / analysisResult.sentiment_stats.total) * 100}
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
            </Row>

            {/* Charts */}
            <Row gutter={[32, 32]}>
              <Col xs={24} lg={8}>
                {renderSentimentChart()}
              </Col>
              <Col xs={24} lg={8}>
                {renderThemeChart()}
              </Col>
              <Col xs={24} lg={8}>
                {analysisResult && analysisResult.word_cloud && analysisResult.word_cloud.length > 0 && (
            <EnhancedWordCloud 
              words={analysisResult.word_cloud.map((w: any) => ({
                text: w.text,
                value: w.value
              }))}
              title="CSV Analizi Kelime Bulutu"
              theme="orange"
              height={600}
              interactive={true}
              showStats={true}
              downloadable={true}
                             maxWords={50}
            />
          )}
              </Col>
            </Row>

            {/* Yorumlar Bölümü */}
            <CommentsSection comments={analysisResult.comments || []} />

            {/* Action Buttons */}
            <div className="text-center mt-12">
              <Space size="large">
                <Button
                  type="default"
                  size="large"
                  onClick={() => navigate('/youtube-analysis')}
                  className="rounded-2xl px-8 py-6 h-auto font-medium shadow-lg"
                >
                  YouTube Analizi
                </Button>
                <Button
                  type="default"
                  size="large"
                  onClick={() => navigate('/my-comments')}
                  className="rounded-2xl px-8 py-6 h-auto font-medium shadow-lg"
                >
                  Tüm Yorumlarım
                </Button>
              </Space>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}