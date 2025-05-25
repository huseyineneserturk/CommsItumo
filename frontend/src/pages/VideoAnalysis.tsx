import React, { useState, useEffect } from 'react';
import { Card, message, Spin, Typography, Row, Col, Statistic, Button, Input, Form, Alert, Tag, Tabs } from 'antd';
import { analysisService } from '../services/analysisService';
import { AnalysisResult } from '../types/analysis';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { YoutubeOutlined, PlayCircleOutlined, BarChartOutlined, FileTextOutlined, LinkOutlined, ReloadOutlined, EyeOutlined, LikeOutlined, MessageOutlined, CalendarOutlined } from '@ant-design/icons';
import { Wordcloud } from '@visx/wordcloud';
import { scaleOrdinal } from '@visx/scale';
import { Text as VisxText } from '@visx/text';
import { getAuth } from 'firebase/auth';
import { useAI } from '../contexts/AIContext';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

interface WordCloudProps {
  words: { text: string; value: number }[];
}

const VideoAnalysis: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [videoInfo, setVideoInfo] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('input');

  const auth = getAuth();
  const user = auth.currentUser;
  const { setComments: setAIComments } = useAI();

  const extractVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const validateYouTubeUrl = (url: string): boolean => {
    return extractVideoId(url) !== null;
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
      setAnalyzing(true);
      setError(null);
      
      // Video analizi yap
      const result = await analysisService.analyzeVideo(videoId, 100);
      
      setAnalysisResult(result);
      setVideoInfo(result.video_info);
      setActiveTab('results');
      
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
            polarity: comment.sentiment?.score || 0,
            subjectivity: 0.5,
            confidence: Math.abs(comment.sentiment?.score || 0)
          }
        }));
        setAIComments(aiComments);
      }
      
      message.success(`Video analizi tamamlandı! ${result.total_comments} yorum analiz edildi.`);
      
    } catch (error) {
      console.error('Video analizi hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Video analizi sırasında bir hata oluştu.';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setVideoInfo(null);
    setError(null);
    setActiveTab('input');
    form.resetFields();
  };

  const WordCloudChart: React.FC<WordCloudProps> = ({ words }) => {
    const [selectedWord, setSelectedWord] = useState<string | null>(null);

    if (!words || words.length === 0) {
      return (
        <Card title="Kelime Bulutu" className="shadow-lg border-0 hover:shadow-xl transition-shadow">
          <div className="text-center py-12">
            <FileTextOutlined className="text-6xl text-gray-300 mb-4" />
            <Title level={4} className="text-gray-500 mb-2">Kelime Bulutu Hazır Değil</Title>
            <Text className="text-gray-400">Kelime bulutu için yeterli veri yok</Text>
          </div>
        </Card>
      );
    }

    const data = words.map(word => ({
      text: word.text,
      value: word.value
    }));

    const colorScale = scaleOrdinal({
      domain: data.map(d => d.text),
      range: ['#ff8080', '#ff4d4d', '#ff1a1a', '#ff6666', '#ff3333']
    });

    const fontScale = (value: number) => Math.max(12, Math.min(60, value * 2));

    return (
      <Card 
        title="Kelime Bulutu" 
        className="shadow-lg border-0 hover:shadow-xl transition-shadow"
        extra={
          selectedWord && (
            <Button 
              type="link" 
              onClick={() => setSelectedWord(null)}
              icon={<ReloadOutlined />}
            >
              Seçimi Temizle
            </Button>
          )
        }
      >
        <div className="relative">
          <div className="h-[400px] w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-red-50 rounded-xl">
            <svg width={600} height={400}>
              <Wordcloud
                words={data}
                width={600}
                height={400}
                fontSize={(datum) => fontScale(datum.value)}
                font="Arial"
                padding={2}
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
                      transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                      fontSize={w.size}
                      fontFamily={w.font}
                      onClick={() => setSelectedWord(w.text || '')}
                      style={{ cursor: 'pointer' }}
                    >
                      {w.text}
                    </VisxText>
                  ))
                }
              </Wordcloud>
            </svg>
          </div>
          
          {selectedWord && (
            <div className="absolute top-4 right-4 bg-white p-4 rounded-xl shadow-xl max-w-xs border border-gray-200">
              <Text strong className="text-lg">{selectedWord}</Text>
              <div className="mt-2">
                <Text type="secondary">
                  Kullanım Sayısı: {words.find(w => w.text === selectedWord)?.value || 0}
                </Text>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  };

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
                <Title level={4} className="mb-3 text-gray-900">
                  {videoInfo.title || 'Video Başlığı'}
                </Title>
                
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

        {/* Analiz İstatistikleri */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-0">
              <div className="mb-2">
                <MessageOutlined className="text-3xl text-blue-500" />
              </div>
              <Statistic
                title="Toplam Yorum"
                value={analysisResult.total_comments || 0}
                valueStyle={{ color: '#1890ff', fontSize: '2rem', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-0">
              <div className="mb-2">
                <BarChartOutlined className="text-3xl text-green-500" />
              </div>
              <Statistic
                title="Ortalama Duygu"
                value={analysisResult.sentiment_stats?.average_polarity || 0}
                precision={2}
                valueStyle={{ 
                  color: (analysisResult.sentiment_stats?.average_polarity || 0) > 0 ? '#52c41a' : '#ff4d4f',
                  fontSize: '2rem', 
                  fontWeight: 'bold' 
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-0">
              <div className="mb-2">
                <LikeOutlined className="text-3xl text-green-500" />
              </div>
              <Statistic
                title="Pozitif Yorumlar"
                value={analysisResult.sentiment_stats?.categories?.positive || 0}
                valueStyle={{ color: '#52c41a', fontSize: '2rem', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-0">
              <div className="mb-2">
                <FileTextOutlined className="text-3xl text-purple-500" />
              </div>
              <Statistic
                title="Tema Sayısı"
                value={themeData.length}
                valueStyle={{ color: '#722ed1', fontSize: '2rem', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Grafikler */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card title="Duygu Dağılımı" className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Tema Dağılımı" className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={themeData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
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
                        loading={analyzing}
                        disabled={analyzing}
                        className="bg-red-600 border-red-600 hover:bg-red-700 px-12 py-3 h-auto rounded-xl font-semibold"
                        icon={<BarChartOutlined />}
                      >
                        {analyzing ? 'Analiz Ediliyor...' : 'Analizi Başlat'}
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
        </Tabs>
      </div>
    </div>
  );
};

export default VideoAnalysis; 