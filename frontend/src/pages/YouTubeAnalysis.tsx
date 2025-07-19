import React, { useState, useEffect } from 'react';
import { Card, List, message, Spin, Typography, Row, Col, Statistic, Tag, Select, Button, Tabs, Collapse, Progress, Timeline, Avatar, Space, Divider, Input, Image, Modal, Switch, Steps } from 'antd';
import { sentimentService, AnalysisResult } from '../services/sentimentService';
import youtubeService, { VideoInfo } from '../services/youtubeService';
import { analysisService } from '../services/analysisService';
import { asyncAnalysisService } from '../services/asyncAnalysisService';
import { AsyncAnalysisProgress } from '../components/AsyncAnalysisProgress';
import { analysisCache, videoCache } from '../services/intelligentCache';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, Area, AreaChart, CartesianGrid } from 'recharts';
import { CalendarOutlined, FilterOutlined, ReloadOutlined, FileTextOutlined, YoutubeOutlined, BarChartOutlined, RiseOutlined, MessageOutlined, UserOutlined, ClockCircleOutlined, SmileOutlined, MehOutlined, FrownOutlined, CommentOutlined, PlayCircleOutlined, EyeOutlined, LikeOutlined, SearchOutlined, ThunderboltOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { EnhancedWordCloud } from '../components/EnhancedWordCloud';
import { getAuth } from 'firebase/auth';
import { useCache } from '../contexts/CacheContext';
import { useAI } from '../contexts/AIContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Search } = Input;
const { Step } = Steps;

const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];
const SENTIMENT_COLORS = {
  positive: '#52c41a',
  neutral: '#1890ff', 
  negative: '#ff4d4f'
};

// Video Seçimi Bileşeni
const VideoSelection: React.FC<{
  onVideoSelect: (video: VideoInfo) => void;
}> = ({ onVideoSelect }) => {
  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVideos, setFilteredVideos] = useState<VideoInfo[]>([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = videos.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVideos(filtered);
    } else {
      setFilteredVideos(videos);
    }
  }, [searchQuery, videos]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const videoList = await youtubeService.getChannelVideos(50);
      setVideos(videoList);
      setFilteredVideos(videoList);
    } catch (error) {
      message.error('Video listesi yüklenirken bir hata oluştu');
      console.error('Video listesi hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: string | number) => {
    const number = typeof num === 'string' ? parseInt(num) : num;
    if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
    if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;
    return number.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                <YoutubeOutlined className="text-2xl text-white" />
              </div>
            </div>
            <Title level={1} className="mb-3 text-white text-3xl font-bold">
              Video Seçimi
            </Title>
            <Text className="text-white text-opacity-90 text-lg font-medium">
              Analiz etmek istediğiniz YouTube videosunu seçin ve detaylı analiz başlatın
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
        {/* Video Yönetimi */}
        <div className="mb-6 flex justify-center">
          <Card className="shadow-md border-0 bg-white/10 backdrop-blur-xl rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <YoutubeOutlined className="text-white text-xs" />
                </div>
                <Text className="text-slate-700 font-medium text-sm">Video Yönetimi:</Text>
                <Tag color="red" className="font-medium px-2 py-1 rounded-lg text-xs">
                  {videos.length} video
                </Tag>
              </div>
              <Button 
                onClick={fetchVideos}
                icon={<ReloadOutlined />}
                type="primary"
                size="small"
                className="bg-gradient-to-r from-red-500 to-pink-600 border-0 hover:from-red-600 hover:to-pink-700 rounded-lg font-medium shadow-md"
              >
                Videoları Yenile
              </Button>
            </div>
          </Card>
        </div>

        {/* Arama ve İstatistikler */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} lg={16}>
            <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-xl rounded-2xl">
              <Search
                placeholder="Video ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="middle"
                prefix={<SearchOutlined className="text-slate-400" />}
                className="mb-4"
                style={{
                  borderRadius: '12px'
                }}
              />
              <div className="flex items-center justify-between">
                <Text type="secondary" className="text-base">
                  {filteredVideos.length} video gösteriliyor
                </Text>
                {searchQuery && (
                  <Button 
                    type="link" 
                    onClick={() => setSearchQuery('')}
                    size="small"
                    className="text-red-600 font-medium rounded-lg"
                  >
                    Filtreyi Temizle
                  </Button>
                )}
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-xl rounded-2xl">
              <Row gutter={16}>
                <Col span={12}>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                      <YoutubeOutlined className="text-xl text-white" />
                    </div>
                    <Statistic
                      title={<span className="text-slate-700 font-semibold text-sm">Toplam Video</span>}
                      value={videos.length}
                      valueStyle={{ color: '#d32f2f', fontSize: '2rem', fontWeight: 'bold' }}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                      <EyeOutlined className="text-xl text-white" />
                    </div>
                    <Statistic
                      title={<span className="text-slate-700 font-semibold text-sm">Toplam Görüntülenme</span>}
                      value={formatNumber(videos.reduce((acc, video) => acc + parseInt(video.view_count || '0'), 0))}
                      valueStyle={{ color: '#1565c0', fontSize: '2rem', fontWeight: 'bold' }}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Video Listesi */}
        {loading ? (
          <div className="flex justify-center items-center h-80">
            <div className="text-center">
              <Spin size="large" />
              <div className="mt-4">
                <Text className="text-lg text-slate-600">Videolar yükleniyor...</Text>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <Card
                key={video.id}
                className="shadow-lg border-0 hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden"
                onClick={() => onVideoSelect(video)}
                cover={
                  <div className="relative overflow-hidden rounded-t-3xl">
                    <Image
                      alt={video.title}
                      src={video.thumbnail}
                      className="w-full h-56 object-cover"
                      preview={false}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <PlayCircleOutlined className="text-white text-8xl opacity-0 hover:opacity-100 transition-opacity duration-300 drop-shadow-2xl" />
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-80 text-white px-3 py-2 rounded-xl text-sm font-medium backdrop-blur-sm">
                      <ClockCircleOutlined className="mr-2" />
                      {formatDate(video.published_at)}
                    </div>
                  </div>
                }
                actions={[
                  <div key="views" className="flex items-center justify-center text-blue-600 py-2">
                    <EyeOutlined className="mr-2 text-lg" />
                    <span className="text-sm font-medium">{formatNumber(video.view_count)}</span>
                  </div>,
                  <div key="likes" className="flex items-center justify-center text-green-600 py-2">
                    <LikeOutlined className="mr-2 text-lg" />
                    <span className="text-sm font-medium">{formatNumber(video.like_count)}</span>
                  </div>,
                  <div key="comments" className="flex items-center justify-center text-purple-600 py-2">
                    <CommentOutlined className="mr-2 text-lg" />
                    <span className="text-sm font-medium">{formatNumber(video.comment_count)}</span>
                  </div>
                ]}
                bodyStyle={{ padding: '24px' }}
              >
                <Card.Meta
                  title={
                    <div className="line-clamp-2 h-16 overflow-hidden">
                      <Text strong className="text-base leading-tight text-slate-800">
                        {video.title}
                      </Text>
                    </div>
                  }
                  description={
                    <div className="mt-4">
                      <Text type="secondary" className="text-sm line-clamp-3 text-slate-600">
                        {video.description || 'Açıklama bulunmuyor'}
                      </Text>
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="flex justify-between items-center">
                          <Tag color="blue" className="text-sm px-3 py-1 rounded-xl">
                            {formatNumber(video.comment_count)} yorum
                          </Tag>
                          <Button 
                            type="primary" 
                            size="small"
                            className="bg-gradient-to-r from-red-500 to-pink-600 border-0 hover:from-red-600 hover:to-pink-700 rounded-xl font-medium"
                          >
                            Analiz Et
                          </Button>
                        </div>
                      </div>
                    </div>
                  }
                />
              </Card>
            ))}
          </div>
        )}

        {filteredVideos.length === 0 && !loading && (
          <div className="text-center py-20">
            <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white/10 backdrop-blur-xl rounded-3xl">
              <div className="py-16">
                <YoutubeOutlined className="text-8xl text-slate-300 mb-6" />
                <Title level={3} className="text-slate-600 mb-4">
                  {searchQuery ? 'Arama sonucu bulunamadı' : 'Video bulunamadı'}
                </Title>
                <Text type="secondary" className="text-lg text-slate-500">
                  {searchQuery 
                    ? 'Farklı arama terimleri deneyin'
                    : 'Kanal videolarını yüklemek için yenile butonuna tıklayın'
                  }
                </Text>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{ comments: any[] }> = ({ comments }) => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const generateSummary = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/gemini/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuth().currentUser?.getIdToken()}`
        },
        body: JSON.stringify({
          comments: comments.map(comment => ({
            id: comment.id || String(Math.random()),
            text: comment.text,
            author: comment.author || 'Anonim',
            date: comment.date || new Date().toISOString(),
            language: comment.sentiment?.language || 'tr',
            video_title: comment.video_title || 'Bilinmeyen Video',
            sentiment: {
              polarity: comment.sentiment?.polarity || 0,
              category: comment.sentiment?.category || 'neutral',
              confidence: comment.sentiment?.confidence || 0,
              language: comment.sentiment?.language || 'tr'
            }
          })),
          question: "Bu yorumları özetle"
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Özet oluşturulurken bir hata oluştu');
      }

      const data = await response.json();
      setSummary(data.analysis);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Özet oluşturulurken bir hata oluştu');
      console.error('Özet hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      title={
        <div className="flex items-center">
          <FileTextOutlined className="mr-2 text-red-600" />
          <span>AI Yorum Özeti</span>
        </div>
      }
      className="shadow-lg border-0 hover:shadow-xl transition-shadow"
      extra={
        <Button
          type="primary"
          onClick={generateSummary}
          loading={loading}
          icon={<FileTextOutlined />}
          className="bg-red-600 border-red-600 hover:bg-red-700"
        >
          Özet Oluştur
        </Button>
      }
    >
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Spin size="large" />
        </div>
      ) : summary ? (
        <div className="prose max-w-none">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border-l-4 border-red-400 ai-summary-content">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }: any) => <p className="mb-3 last:mb-0 text-gray-700 leading-relaxed">{children}</p>,
                strong: ({ children }: any) => <strong className="font-bold text-gray-900">{children}</strong>,
                em: ({ children }: any) => <em className="italic text-gray-800">{children}</em>,
                ul: ({ children }: any) => <ul className="list-disc list-inside ml-4 mb-3 space-y-1">{children}</ul>,
                ol: ({ children }: any) => <ol className="list-decimal list-inside ml-4 mb-3 space-y-1">{children}</ol>,
                li: ({ children }: any) => <li className="mb-1 text-gray-700">{children}</li>,
                code: ({ children }: any) => (
                  <code className="bg-red-100 px-2 py-1 rounded text-sm font-mono text-red-800 border border-red-200">
                    {children}
                  </code>
                ),
                pre: ({ children }: any) => (
                  <pre className="bg-red-100 p-4 rounded-lg overflow-x-auto mb-3 border border-red-200">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }: any) => (
                  <blockquote className="border-l-4 border-red-400 pl-4 italic mb-3 text-gray-600 bg-red-25">
                    {children}
                  </blockquote>
                ),
                h1: ({ children }: any) => <h1 className="text-2xl font-bold text-gray-900 mb-3 mt-4 first:mt-0">{children}</h1>,
                h2: ({ children }: any) => <h2 className="text-xl font-bold text-gray-900 mb-3 mt-4 first:mt-0">{children}</h2>,
                h3: ({ children }: any) => <h3 className="text-lg font-bold text-gray-900 mb-2 mt-3 first:mt-0">{children}</h3>,
                hr: () => <hr className="border-red-200 my-4" />,
                a: ({ children, href }: any) => (
                  <a href={href} className="text-red-600 hover:text-red-700 underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                )
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12">
          <FileTextOutlined className="text-6xl mb-4 text-gray-300" />
          <Title level={4} className="text-gray-500 mb-2">AI Özet Hazır Değil</Title>
          <p className="text-gray-400">Yorumların AI özetini görmek için "Özet Oluştur" butonuna tıklayın</p>
        </div>
      )}
    </Card>
  );
};

// Yorum listesi bileşeni
const CommentsSection: React.FC<{ comments: any[] }> = ({ comments }) => {
  const [visibleComments, setVisibleComments] = useState(10);
  const [filterSentiment, setFilterSentiment] = useState('all');

  const filteredComments = comments.filter(comment => 
    filterSentiment === 'all' || comment.sentiment.category === filterSentiment
  );

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <SmileOutlined style={{ color: SENTIMENT_COLORS.positive }} />;
      case 'negative': return <FrownOutlined style={{ color: SENTIMENT_COLORS.negative }} />;
      default: return <MehOutlined style={{ color: SENTIMENT_COLORS.neutral }} />;
    }
  };

  const getSentimentColor = (sentiment: string) => SENTIMENT_COLORS[sentiment as keyof typeof SENTIMENT_COLORS] || SENTIMENT_COLORS.neutral;

  return (
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
                <Title level={5} className="mb-0">Yorumlarım</Title>
                <Text type="secondary" className="text-sm">
                  {comments.length} yorum • Tek tek analiz sonuçları
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
          {/* Filtre */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <Title level={5} className="mb-2">Yorum Filtreleme</Title>
              <Select
                value={filterSentiment}
                onChange={setFilterSentiment}
                style={{ width: 200 }}
                size="large"
              >
                <Option value="all">Tüm Yorumlar</Option>
                <Option value="positive">
                  <SmileOutlined style={{ color: SENTIMENT_COLORS.positive, marginRight: 8 }} />
                  Pozitif
                </Option>
                <Option value="neutral">
                  <MehOutlined style={{ color: SENTIMENT_COLORS.neutral, marginRight: 8 }} />
                  Nötr
                </Option>
                <Option value="negative">
                  <FrownOutlined style={{ color: SENTIMENT_COLORS.negative, marginRight: 8 }} />
                  Negatif
                </Option>
              </Select>
            </div>
            <div className="text-right">
              <Text type="secondary">Gösterilen: {Math.min(visibleComments, filteredComments.length)} / {filteredComments.length}</Text>
            </div>
          </div>

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
                        Skor: {comment.sentiment.polarity?.toFixed(3) || comment.sentiment.score?.toFixed(3) || 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-3">
                    <Text className="text-gray-700 leading-relaxed">
                      {comment.text}
                    </Text>
                  </div>

                  {/* Sentiment Analiz Detayları */}
                  <div className="bg-white border rounded-lg p-4">
                    <Title level={5} className="mb-3 text-gray-700">Analiz Detayları</Title>
                    <Row gutter={16}>
                      <Col span={8}>
                        <div className="text-center">
                          <div className={`text-2xl font-bold mb-1`} style={{ color: getSentimentColor(comment.sentiment.category) }}>
                            {((comment.sentiment.polarity || comment.sentiment.score || 0) * 100).toFixed(1)}%
                          </div>
                          <Text type="secondary" className="text-xs">Polarite Skoru</Text>
                          <Progress 
                            percent={Math.abs((comment.sentiment.polarity || comment.sentiment.score || 0) * 100)} 
                            size="small" 
                            strokeColor={getSentimentColor(comment.sentiment.category)}
                            showInfo={false}
                            className="mt-2"
                          />
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-1 text-purple-600">
                            {((comment.sentiment.confidence || 0) * 100).toFixed(1)}%
                          </div>
                          <Text type="secondary" className="text-xs">Güven Oranı</Text>
                          <Progress 
                            percent={(comment.sentiment.confidence || 0) * 100} 
                            size="small" 
                            strokeColor="#722ed1"
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
  );
};

export const YouTubeAnalysis: React.FC = () => {
  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoInfo | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [filteredAnalysis, setFilteredAnalysis] = useState<AnalysisResult | null>(null);
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [themeFilter, setThemeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [isFromCache, setIsFromCache] = useState(false);
  const [isAsyncAnalyzing, setIsAsyncAnalyzing] = useState(false);
  const [asyncProgress, setAsyncProgress] = useState(0);
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const [currentVideoTitle, setCurrentVideoTitle] = useState<string>('');

  const { setComments: setAIComments } = useAI();
  const { 
    getVideoAnalysis, 
    setVideoAnalysis
  } = useCache();

  // Component mount olduğunda video listesini yükle
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        console.log('📺 Video listesi yükleniyor...');
        const videoList = await youtubeService.getChannelVideos();
        setVideos(videoList);
      } catch (error) {
        console.error('Video listesi yüklenirken hata:', error);
        message.error('Video listesi yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  // Component unmount olduğunda aktif taskları temizle, ama WebSocket'i koru
  useEffect(() => {
    return () => {
      if (isAsyncAnalyzing) {
        console.log('🧹 Component unmount - aktif tasklar temizleniyor');
        asyncAnalysisService.clearActiveTasks();
        setIsAsyncAnalyzing(false);
      }
    };
  }, [isAsyncAnalyzing]);

  const analyzeSelectedVideo = async (video: VideoInfo) => {
    // Cache kontrolü
    const cacheKey = `video_analysis_${video.id}`;
    const cachedAnalysis = analysisCache.get(cacheKey);
    
    if (cachedAnalysis) {
      console.log('📦 Cache\'den analiz yüklendi:', video.id);
      setSelectedVideo(video);
      setAnalysis(cachedAnalysis as AnalysisResult);
      message.success(`"${video.title}" analizi cache'den yüklendi!`);
      return;
    }

    setIsAsyncAnalyzing(true);
    setSelectedVideo(video);
  };

  const handleAsyncAnalysisComplete = (result: any) => {
    console.log('🎉 Analiz tamamlandı:', result);
    
    // Cache'e kaydet
    const cacheKey = `video_analysis_${selectedVideo?.id}`;
    analysisCache.set(cacheKey, result);
    
    setAnalysis(result as AnalysisResult);
    setIsAsyncAnalyzing(false);
    message.success(`"${selectedVideo?.title}" videosu başarıyla analiz edildi!`);
  };

  const handleAsyncAnalysisError = (error: string) => {
    console.error('❌ Analiz hatası:', error);
    message.error(`Analiz hatası: ${error}`);
    setIsAsyncAnalyzing(false);
  };

  const handleAsyncAnalysisCancel = () => {
    setIsAsyncAnalyzing(false);
    setSelectedVideo(null);
    message.info('Analiz iptal edildi');
  };

  const goBackToVideoSelection = () => {
    setSelectedVideo(null);
    setAnalysis(null);
    message.info('Video seçimine dönüldü');
  };

  const clearCache = () => {
    videoCache.clear();
    analysisCache.clear();
    message.success('Önbellek temizlendi');
  };

  useEffect(() => {
    if (analysis) {
      let filtered = { ...analysis };
      const commentsArray = analysis.comments || [];
      
      // Duygu filtresi
      if (sentimentFilter !== 'all') {
        filtered.comments = commentsArray.filter(
          comment => comment.sentiment && comment.sentiment.category === sentimentFilter
        );
      } else {
        filtered.comments = commentsArray;
      }
      
      // Tema filtresi
      if (themeFilter !== 'all') {
        filtered.comments = (filtered.comments || []).filter(
          comment => comment.theme && comment.theme[themeFilter] > 0.1
        );
      }
      
      // Tarih filtresi
      if (dateRange !== 'all') {
        const now = new Date();
        const days = parseInt(dateRange.split('-')[1]);
        const cutoffDate = new Date(now.setDate(now.getDate() - days));
        
        filtered.comments = (filtered.comments || []).filter(
          comment => new Date(comment.date) >= cutoffDate
        );
      }
      
      // İstatistikleri güncelle
      const filteredCommentsArray = filtered.comments || [];
      filtered.sentiment_stats = {
        ...analysis.sentiment_stats,
        total: filteredCommentsArray.length,
        categories: {
          positive: filteredCommentsArray.filter(c => c.sentiment && c.sentiment.category === 'positive').length,
          neutral: filteredCommentsArray.filter(c => c.sentiment && c.sentiment.category === 'neutral').length,
          negative: filteredCommentsArray.filter(c => c.sentiment && c.sentiment.category === 'negative').length
        },
        language_distribution: {
          tr: filteredCommentsArray.filter(c => c.sentiment && c.sentiment.language === 'tr').length,
          en: filteredCommentsArray.filter(c => c.sentiment && c.sentiment.language === 'en').length
        },
        themes: filteredCommentsArray.reduce((acc, comment) => {
          if (comment.theme) {
            Object.entries(comment.theme).forEach(([theme, score]) => {
              if (score > 0.1) {
                acc[theme] = (acc[theme] || 0) + 1;
              }
            });
          }
          return acc;
        }, {} as Record<string, number>)
      };
      
      setFilteredAnalysis(filtered);
    }
  }, [analysis, sentimentFilter, themeFilter, dateRange]);

  // Video seçimi yapılmamışsa video seçim ekranını göster
  if (!selectedVideo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-6">
        <VideoSelection onVideoSelect={analyzeSelectedVideo} />
      </div>
    );
  }

  // Async analysis progress ekranı
  if (isAsyncAnalyzing && selectedVideo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-6">
        <AsyncAnalysisProgress
          videoId={selectedVideo.id}
          videoTitle={selectedVideo.title}
          maxComments={100}
          onComplete={handleAsyncAnalysisComplete}
          onError={handleAsyncAnalysisError}
          onCancel={handleAsyncAnalysisCancel}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex justify-center items-center">
        <Card className="w-full max-w-2xl shadow-xl">
          <div className="text-center">
            <Spin size="large" />
            <div className="mt-4">
              <Text className="text-lg text-gray-600">
                "{selectedVideo.title}" videosu analiz ediliyor...
              </Text>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!filteredAnalysis) {
    return null;
  }

  const sentimentData = [
    { name: 'Pozitif', value: filteredAnalysis.sentiment_stats.categories.positive },
    { name: 'Nötr', value: filteredAnalysis.sentiment_stats.categories.neutral },
    { name: 'Negatif', value: filteredAnalysis.sentiment_stats.categories.negative }
  ];

  const themeData = Object.entries(filteredAnalysis.sentiment_stats.themes)
    .map(([theme, count]) => ({
      name: theme.charAt(0).toUpperCase() + theme.slice(1),
      value: count
    }))
    .sort((a, b) => b.value - a.value);

  const languageData = [
    { name: 'Türkçe', value: filteredAnalysis.sentiment_stats.language_distribution.tr },
    { name: 'İngilizce', value: filteredAnalysis.sentiment_stats.language_distribution.en }
  ];

  // WordCloudChart artık EnhancedWordCloud bileşeni ile değiştirildi

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
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
              "{selectedVideo.title}" videosunun yorum sentiment analizi sonuçları
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
        {/* Navigasyon ve Önbellek Yönetimi */}
        <div className="mb-8 flex justify-center">
          <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-xl rounded-2xl">
            <div className="flex items-center justify-between space-x-6">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={goBackToVideoSelection}
                  icon={<YoutubeOutlined />}
                  className="rounded-xl font-medium"
                >
                  Video Seç
                </Button>
                <Button
                  onClick={() => analyzeSelectedVideo(selectedVideo)}
                  icon={<ReloadOutlined />}
                  className="rounded-xl font-medium"
                >
                  Yeniden Analiz Et
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <ThunderboltOutlined className="text-white text-sm" />
                  </div>
                  <Text className="text-slate-700 font-medium">Önbellek:</Text>
                  <Tag color="blue" className="font-medium px-3 py-1 rounded-xl">
                    {analysisCache.getStats().size} analiz
                  </Tag>
                </div>
                <Button 
                  onClick={clearCache}
                  icon={<ReloadOutlined />}
                  type="primary"
                  className="bg-gradient-to-r from-red-500 to-pink-600 border-0 hover:from-red-600 hover:to-pink-700 rounded-xl font-medium shadow-lg"
                >
                  Temizle
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Video Bilgi Kartı */}
        <Card className="mb-10 shadow-2xl border-0 bg-white/10 backdrop-blur-xl rounded-3xl">
          <Row gutter={32} align="middle">
            <Col xs={24} sm={8} md={6}>
              <Image
                src={selectedVideo.thumbnail}
                alt={selectedVideo.title}
                className="w-full rounded-2xl shadow-xl"
                preview={false}
              />
            </Col>
            <Col xs={24} sm={16} md={18}>
              <div className="space-y-6">
                <Title level={2} className="mb-4 text-slate-800">{selectedVideo.title}</Title>
                <Text type="secondary" className="text-lg line-clamp-3 text-slate-600">
                  {selectedVideo.description || 'Açıklama bulunmuyor'}
                </Text>
                <Row gutter={24}>
                  <Col xs={12} sm={6}>
                    <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                      <EyeOutlined className="text-blue-600 mb-2 text-2xl" />
                      <div className="text-sm text-blue-600 font-medium">Görüntülenme</div>
                      <div className="font-bold text-blue-800 text-lg">
                        {parseInt(selectedVideo.view_count || '0').toLocaleString('tr-TR')}
                      </div>
                    </div>
                  </Col>
                  
                  <Col xs={12} sm={6}>
                    <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200">
                      <LikeOutlined className="text-green-600 mb-2 text-2xl" />
                      <div className="text-sm text-green-600 font-medium">Beğeni</div>
                      <div className="font-bold text-green-800 text-lg">
                        {parseInt(selectedVideo.like_count || '0').toLocaleString('tr-TR')}
                      </div>
                    </div>
                  </Col>
                  
                  <Col xs={12} sm={6}>
                    <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                      <MessageOutlined className="text-purple-600 mb-2 text-2xl" />
                      <div className="text-sm text-purple-600 font-medium">Yorum</div>
                      <div className="font-bold text-purple-800 text-lg">
                        {parseInt(selectedVideo.comment_count || '0').toLocaleString('tr-TR')}
                      </div>
                    </div>
                  </Col>
                  
                  <Col xs={12} sm={6}>
                    <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
                      <CalendarOutlined className="text-orange-600 mb-2 text-2xl" />
                      <div className="text-sm text-orange-600 font-medium">Yayın Tarihi</div>
                      <div className="font-bold text-orange-800 text-lg">
                        {new Date(selectedVideo.published_at).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Filtreler */}
        <Card className="mb-10 shadow-2xl border-0 bg-white/10 backdrop-blur-xl rounded-3xl">
          <Row gutter={24} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Select
                className="w-full"
                value={dateRange}
                onChange={setDateRange}
                size="large"
                style={{ borderRadius: '16px' }}
              >
                <Option value="last-7">Son 7 Gün</Option>
                <Option value="last-30">Son 30 Gün</Option>
                <Option value="last-90">Son 90 Gün</Option>
                <Option value="all">Tüm Zamanlar</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                className="w-full"
                value={sentimentFilter}
                onChange={setSentimentFilter}
                size="large"
                style={{ borderRadius: '16px' }}
              >
                <Option value="all">Tüm Duygular</Option>
                <Option value="positive">Pozitif</Option>
                <Option value="neutral">Nötr</Option>
                <Option value="negative">Negatif</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                className="w-full"
                value={themeFilter}
                onChange={setThemeFilter}
                size="large"
                style={{ borderRadius: '16px' }}
              >
                <Option value="all">Tüm Temalar</Option>
                {Object.keys(filteredAnalysis.sentiment_stats.themes).map(theme => (
                  <Option key={theme} value={theme}>
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={() => analyzeSelectedVideo(selectedVideo)}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 border-0 hover:from-blue-600 hover:to-indigo-700 rounded-2xl py-6 h-auto font-medium shadow-xl"
                size="large"
              >
                Yenile
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Özet Kartı */}
        <div className="mb-10">
          <SummaryCard comments={filteredAnalysis.comments} />
        </div>

        {/* İstatistikler */}
        <Row gutter={[24, 24]} className="mb-10">
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center shadow-2xl hover:shadow-xl transition-all duration-500 border-0 bg-white/10 backdrop-blur-xl rounded-3xl">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
                  <MessageOutlined className="text-3xl text-white" />
                </div>
              </div>
              <Statistic
                title={<span className="text-slate-700 font-semibold text-lg">Toplam Yorum</span>}
                value={filteredAnalysis.sentiment_stats.total}
                valueStyle={{ color: '#1890ff', fontSize: '3rem', fontWeight: 'bold' }}
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
                  {filteredAnalysis.sentiment_stats.total} yorum
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center shadow-2xl hover:shadow-xl transition-all duration-500 border-0 bg-white/10 backdrop-blur-xl rounded-3xl">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
                  <RiseOutlined className="text-3xl text-white" />
                </div>
              </div>
              <Statistic
                title={<span className="text-slate-700 font-semibold text-lg">Ortalama Duygu</span>}
                value={filteredAnalysis.sentiment_stats.average_polarity}
                precision={3}
                valueStyle={{ 
                  color: filteredAnalysis.sentiment_stats.average_polarity > 0 ? '#52c41a' : '#ff4d4f',
                  fontSize: '3rem', 
                  fontWeight: 'bold' 
                }}
              />
              <div className="mt-4">
                <Progress 
                  percent={Math.abs(filteredAnalysis.sentiment_stats.average_polarity * 100)} 
                  size="small" 
                  strokeColor={filteredAnalysis.sentiment_stats.average_polarity > 0 ? '#52c41a' : '#ff4d4f'}
                  showInfo={false}
                  strokeWidth={6}
                />
                <Text type="secondary" className="text-sm mt-2 block font-medium">
                  {filteredAnalysis.sentiment_stats.average_polarity > 0 ? '📈 Pozitif trend' : '📉 Negatif trend'}
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center shadow-2xl hover:shadow-xl transition-all duration-500 border-0 bg-white/10 backdrop-blur-xl rounded-3xl">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
                  <BarChartOutlined className="text-3xl text-white" />
                </div>
              </div>
              <Statistic
                title={<span className="text-slate-700 font-semibold text-lg">Pozitiflik Oranı</span>}
                value={((filteredAnalysis.sentiment_stats.categories.positive / filteredAnalysis.sentiment_stats.total) * 100)}
                precision={1}
                suffix="%"
                valueStyle={{ color: '#722ed1', fontSize: '3rem', fontWeight: 'bold' }}
              />
              <div className="mt-4">
                <Progress 
                  percent={(filteredAnalysis.sentiment_stats.categories.positive / filteredAnalysis.sentiment_stats.total) * 100} 
                  size="small" 
                  strokeColor="#722ed1"
                  showInfo={false}
                  strokeWidth={6}
                />
                <Text type="secondary" className="text-sm mt-2 block font-medium">
                  {filteredAnalysis.sentiment_stats.categories.positive} pozitif yorum
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center shadow-2xl hover:shadow-xl transition-all duration-500 border-0 bg-white/10 backdrop-blur-xl rounded-3xl">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
                  <FileTextOutlined className="text-3xl text-white" />
                </div>
              </div>
              <Statistic
                title={<span className="text-slate-700 font-semibold text-lg">Aktif Temalar</span>}
                value={Object.keys(filteredAnalysis.sentiment_stats.themes).length}
                valueStyle={{ color: '#fa8c16', fontSize: '3rem', fontWeight: 'bold' }}
              />
              <div className="mt-4">
                <Progress 
                  percent={(Object.keys(filteredAnalysis.sentiment_stats.themes).length / 10) * 100} 
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

        {/* Detaylı İstatistikler */}
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
                        {filteredAnalysis.sentiment_stats.categories.positive} yorum
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {((filteredAnalysis.sentiment_stats.categories.positive / filteredAnalysis.sentiment_stats.total) * 100).toFixed(1)}%
                    </div>
                    <Progress 
                      percent={(filteredAnalysis.sentiment_stats.categories.positive / filteredAnalysis.sentiment_stats.total) * 100}
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
                        {filteredAnalysis.sentiment_stats.categories.neutral} yorum
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {((filteredAnalysis.sentiment_stats.categories.neutral / filteredAnalysis.sentiment_stats.total) * 100).toFixed(1)}%
                    </div>
                    <Progress 
                      percent={(filteredAnalysis.sentiment_stats.categories.neutral / filteredAnalysis.sentiment_stats.total) * 100}
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
                        {filteredAnalysis.sentiment_stats.categories.negative} yorum
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {((filteredAnalysis.sentiment_stats.categories.negative / filteredAnalysis.sentiment_stats.total) * 100).toFixed(1)}%
                    </div>
                    <Progress 
                      percent={(filteredAnalysis.sentiment_stats.categories.negative / filteredAnalysis.sentiment_stats.total) * 100}
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
                  <span className="text-xl font-semibold text-slate-800">Dil ve Tema Dağılımı</span>
                </div>
              }
              className="shadow-2xl border-0 hover:shadow-xl transition-all duration-500 bg-white/10 backdrop-blur-xl rounded-3xl"
            >
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Text strong className="text-slate-700 text-lg">Dil Dağılımı</Text>
                    <Text type="secondary" className="text-base">{filteredAnalysis.sentiment_stats.total} toplam</Text>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-blue-500 rounded mr-3 shadow"></div>
                        <Text className="text-base font-medium">Türkçe</Text>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Text strong className="text-lg">{filteredAnalysis.sentiment_stats.language_distribution.tr}</Text>
                        <Text type="secondary" className="text-base">
                          ({((filteredAnalysis.sentiment_stats.language_distribution.tr / filteredAnalysis.sentiment_stats.total) * 100).toFixed(1)}%)
                        </Text>
                      </div>
                    </div>
                    <Progress 
                      percent={(filteredAnalysis.sentiment_stats.language_distribution.tr / filteredAnalysis.sentiment_stats.total) * 100}
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
                        <Text strong className="text-lg">{filteredAnalysis.sentiment_stats.language_distribution.en}</Text>
                        <Text type="secondary" className="text-base">
                          ({((filteredAnalysis.sentiment_stats.language_distribution.en / filteredAnalysis.sentiment_stats.total) * 100).toFixed(1)}%)
                        </Text>
                      </div>
                    </div>
                    <Progress 
                      percent={(filteredAnalysis.sentiment_stats.language_distribution.en / filteredAnalysis.sentiment_stats.total) * 100}
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
                    {Object.entries(filteredAnalysis.sentiment_stats.themes)
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .slice(0, 6)
                      .map(([theme, count]) => (
                        <Tag 
                          key={theme} 
                          color="blue"
                          className="mb-3 px-4 py-2 text-base font-medium rounded-xl"
                        >
                          {theme.charAt(0).toUpperCase() + theme.slice(1)}: {count}
                        </Tag>
                      ))}
                  </Space>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Grafikler */}
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
                  {filteredAnalysis.sentiment_stats.total} Toplam
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
                  <span className="text-xl font-semibold text-slate-800">Tema Dağılımı</span>
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
                  <span className="text-xl font-semibold text-slate-800">Dil Dağılımı</span>
                </div>
              }
              className="shadow-2xl border-0 hover:shadow-xl transition-all duration-500 bg-white/10 backdrop-blur-xl rounded-3xl"
              extra={
                <Tag color="orange" className="font-medium px-3 py-1 rounded-xl">
                  2 Dil
                </Tag>
              }
            >
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={languageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent, value }) => `${name}\n${value} yorum\n${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={3}
                  >
                    {languageData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? '#1890ff' : '#722ed1'}
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
        </Row>

        {/* Kelime Bulutu */}
        {filteredAnalysis.word_cloud && filteredAnalysis.word_cloud.length > 0 && (
          <div className="mb-10">
            <EnhancedWordCloud 
              words={filteredAnalysis.word_cloud.map((w: any) => ({
                text: w.text,
                value: w.value
              }))}
              title="Video Yorumları Kelime Bulutu"
              theme="blue"
              height={600}
              interactive={true}
              showStats={true}
              downloadable={true}
              maxWords={50}
            />
          </div>
        )}

        {/* Yorumlar Listesi */}
        <div className="mt-10">
          <CommentsSection comments={filteredAnalysis.comments || []} />
        </div>
      </div>
    </div>
  );
};

export default YouTubeAnalysis;