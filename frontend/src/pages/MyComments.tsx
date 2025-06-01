import React, { useState, useEffect } from 'react';
import { Card, List, message, Spin, Typography, Row, Col, Statistic, Tag, Button, Tooltip, Input, Select } from 'antd';
import { sentimentService } from '../services/sentimentService';
import { CommentOutlined, YoutubeOutlined, ReloadOutlined, LikeOutlined, DislikeOutlined, MehOutlined, SearchOutlined, FilterOutlined, CalendarOutlined } from '@ant-design/icons';
import ErrorBoundary from '../components/ErrorBoundary';
import { useAI } from '../contexts/AIContext';
import { useCache } from '../contexts/CacheContext';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Comment {
  id: string;
  text: string;
  author: string;
  date: string;
  video_id: string;
  video_title: string;
  sentiment: {
    category: 'positive' | 'neutral' | 'negative';
    polarity?: number;
    score?: number;
    language: 'tr' | 'en';
  };
  theme: {
    [key: string]: number;
  };
}

interface SentimentStats {
  total: number;
  categories: {
    positive: number;
    neutral: number;
    negative: number;
  };
  average_polarity: number;
  language_distribution: {
    tr: number;
    en: number;
  };
}

export const MyComments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<SentimentStats | null>(null);
  const [searchText, setSearchText] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [isFromCache, setIsFromCache] = useState(false);
  
  const { setComments: setAIComments } = useAI();
  
  // Cache sistemini kullan
  const { comments: cachedComments, setComments: setCachedComments } = useCache();

  const fetchComments = async (forceRefresh: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      setIsFromCache(false);
      
      // Cache kontrolü - sadece force refresh değilse
      if (!forceRefresh && cachedComments) {
        console.log('📦 Cache\'den yorumlar yüklendi');
        setComments(cachedComments.comments);
        setFilteredComments(cachedComments.comments);
        setStats(cachedComments.sentiment_stats);
        setIsFromCache(true);
        
        // AI Context'e yorumları gönder
        const aiComments = cachedComments.comments.map((comment: Comment) => ({
          id: comment.id,
          text: comment.text,
          author: comment.author,
          date: comment.date,
          language: comment.sentiment.language,
          video_title: comment.video_title,
          sentiment: {
            polarity: comment.sentiment.polarity || comment.sentiment.score || 0,
            subjectivity: 0.5,
            confidence: Math.abs(comment.sentiment.polarity || comment.sentiment.score || 0)
          }
        }));
        setAIComments(aiComments);
        
        setLoading(false);
        return;
      }
      
      console.log('🌐 API\'den fresh yorumlar çekiliyor...');
      const analysis = await sentimentService.getCommentsAnalysis();
      if (!analysis.comments || analysis.comments.length === 0) {
        setError('Henüz hiç yorum bulunamadı.');
        message.info('Henüz hiç yorum bulunamadı.');
        return;
      }

      setComments(analysis.comments);
      setFilteredComments(analysis.comments);
      setStats(analysis.sentiment_stats);
      
      // Cache'e kaydet
      setCachedComments(analysis);
      
      // AI Context'e yorumları gönder
      const aiComments = analysis.comments.map(comment => ({
        id: comment.id,
        text: comment.text,
        author: comment.author,
        date: comment.date,
        language: comment.sentiment.language,
        video_title: comment.video_title,
        sentiment: {
          polarity: comment.sentiment.polarity || comment.sentiment.score || 0,
          subjectivity: 0.5,
          confidence: Math.abs(comment.sentiment.polarity || comment.sentiment.score || 0)
        }
      }));
      setAIComments(aiComments);
      
    } catch (error: any) {
      console.error('Yorumlar alınamadı:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Yorumlar yüklenirken bir hata oluştu.';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    let filtered = comments;

    // Metin arama
    if (searchText) {
      filtered = filtered.filter(comment => 
        comment.text.toLowerCase().includes(searchText.toLowerCase()) ||
        comment.author.toLowerCase().includes(searchText.toLowerCase()) ||
        comment.video_title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Sentiment filtresi
    if (sentimentFilter !== 'all') {
      filtered = filtered.filter(comment => comment.sentiment.category === sentimentFilter);
    }

    // Dil filtresi
    if (languageFilter !== 'all') {
      filtered = filtered.filter(comment => comment.sentiment.language === languageFilter);
    }

    setFilteredComments(filtered);
  }, [comments, searchText, sentimentFilter, languageFilter]);

  const getSentimentColor = (category: 'positive' | 'neutral' | 'negative') => {
    switch (category) {
      case 'positive':
        return 'green';
      case 'negative':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getSentimentIcon = (category: 'positive' | 'neutral' | 'negative') => {
    switch (category) {
      case 'positive':
        return <LikeOutlined />;
      case 'negative':
        return <DislikeOutlined />;
      default:
        return <MehOutlined />;
    }
  };

  const getSentimentText = (category: 'positive' | 'neutral' | 'negative') => {
    switch (category) {
      case 'positive':
        return 'Pozitif';
      case 'negative':
        return 'Negatif';
      default:
        return 'Nötr';
    }
  };

  const getThemeTags = (themes: { [key: string]: number }) => {
    if (!themes) return null;
    return Object.entries(themes)
      .filter(([_, score]) => score > 0.1)
      .slice(0, 3)
      .map(([theme, score]) => (
        <Tag key={theme} color="blue" className="mb-1">
          {theme.charAt(0).toUpperCase() + theme.slice(1)}
        </Tag>
      ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex justify-center items-center">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4">
            <Text className="text-lg text-gray-600">
              {isFromCache ? 'Önbellek verileri yükleniyor...' : 'Yorumlarınız yükleniyor...'}
            </Text>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex justify-center items-center">
        <Card className="w-full max-w-2xl shadow-xl">
          <div className="text-center">
            <div className="mb-4">
              <CommentOutlined className="text-6xl text-red-400" />
            </div>
            <Title level={3} className="text-red-500 mb-4">{error}</Title>
            <Button 
              type="primary" 
              size="large"
              icon={<ReloadOutlined />} 
              onClick={() => fetchComments(true)}
              className="bg-red-600 border-red-600 hover:bg-red-700"
            >
              Yeniden Dene
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <Title level={2} className="mb-2 text-gray-900">
                  <CommentOutlined className="mr-3 text-red-600" />
                  Yorumlarım
                  {isFromCache && (
                    <Tag color="blue" className="ml-3 text-xs">
                      📦 Önbellekten
                    </Tag>
                  )}
                </Title>
                <Text className="text-gray-600 text-lg">
                  YouTube yorumlarınızın detaylı sentiment analizi
                </Text>
              </div>
              <div className="flex gap-2">
                <Button 
                  type="default" 
                  size="large"
                  icon={<ReloadOutlined />} 
                  onClick={() => fetchComments(false)}
                  className="rounded-xl"
                >
                  Önbellekten Yükle
                </Button>
                <Button 
                  type="primary" 
                  size="large"
                  icon={<ReloadOutlined />} 
                  onClick={() => fetchComments(true)}
                  className="bg-red-600 border-red-600 hover:bg-red-700 rounded-xl"
                >
                  Yenile
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* İstatistikler */}
          {stats && (
            <div className="mb-8">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-0">
                    <div className="mb-2">
                      <CommentOutlined className="text-3xl text-blue-500" />
                    </div>
                    <Statistic
                      title={
                        <span>
                          Toplam Yorum
                          {isFromCache && <div className="text-xs text-blue-500 mt-1">📦 Önbellekten</div>}
                        </span>
                      }
                      value={stats.total}
                      valueStyle={{ color: '#1890ff', fontSize: '2rem', fontWeight: 'bold' }}
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
                      value={stats.categories.positive}
                      valueStyle={{ color: '#52c41a', fontSize: '2rem', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-0">
                    <div className="mb-2">
                      <DislikeOutlined className="text-3xl text-red-500" />
                    </div>
                    <Statistic
                      title="Negatif Yorumlar"
                      value={stats.categories.negative}
                      valueStyle={{ color: '#ff4d4f', fontSize: '2rem', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-0">
                    <div className="mb-2">
                      <MehOutlined className="text-3xl text-gray-500" />
                    </div>
                    <Statistic
                      title="Nötr Yorumlar"
                      value={stats.categories.neutral}
                      valueStyle={{ color: '#8c8c8c', fontSize: '2rem', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          {/* Filtreler */}
          <Card className="mb-8 shadow-lg border-0">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Search
                  placeholder="Yorumlarda ara..."
                  allowClear
                  size="large"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select
                placeholder="Sentiment Filtresi"
                size="large"
                value={sentimentFilter}
                onChange={setSentimentFilter}
                className="w-full md:w-48"
              >
                <Option value="all">Tüm Sentimentler</Option>
                <Option value="positive">Pozitif</Option>
                <Option value="neutral">Nötr</Option>
                <Option value="negative">Negatif</Option>
              </Select>
              <Select
                placeholder="Dil Filtresi"
                size="large"
                value={languageFilter}
                onChange={setLanguageFilter}
                className="w-full md:w-32"
              >
                <Option value="all">Tüm Diller</Option>
                <Option value="tr">Türkçe</Option>
                <Option value="en">İngilizce</Option>
              </Select>
            </div>
          </Card>

          {/* Yorum Listesi */}
          {filteredComments.length > 0 ? (
            <List
              itemLayout="vertical"
              size="large"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} yorum`,
              }}
              dataSource={filteredComments}
              renderItem={(comment) => (
                <List.Item key={comment.id}>
                  <Card 
                    className="w-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 hover:transform hover:-translate-y-1"
                    bodyStyle={{ padding: '24px' }}
                  >
                    <div className="flex flex-col space-y-4">
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {comment.author.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <Text strong className="text-lg">{comment.author}</Text>
                            <div className="flex items-center space-x-2 text-gray-500">
                              <CalendarOutlined />
                              <Text className="text-sm">
                                {new Date(comment.date).toLocaleDateString('tr-TR')}
                              </Text>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Tag 
                            color={getSentimentColor(comment.sentiment.category)}
                            icon={getSentimentIcon(comment.sentiment.category)}
                            className="px-3 py-1 text-sm font-medium"
                          >
                            {getSentimentText(comment.sentiment.category)}
                          </Tag>
                          <Tag color={comment.sentiment.language === 'tr' ? 'blue' : 'green'}>
                            {comment.sentiment.language === 'tr' ? 'Türkçe' : 'İngilizce'}
                          </Tag>
                        </div>
                      </div>

                      {/* Video Bilgisi */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <YoutubeOutlined className="text-red-500" />
                          <Text className="text-sm font-medium text-gray-700">
                            {comment.video_title}
                          </Text>
                        </div>
                      </div>

                      {/* Yorum Metni */}
                      <div className="bg-white p-4 border-l-4 border-red-400 rounded-r-lg">
                        <Text className="text-base leading-relaxed">
                          {comment.text}
                        </Text>
                      </div>

                      {/* Temalar */}
                      {comment.theme && Object.keys(comment.theme).length > 0 && (
                        <div>
                          <Text className="text-sm text-gray-600 mb-2 block">Temalar:</Text>
                          <div className="flex flex-wrap gap-1">
                            {getThemeTags(comment.theme)}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          ) : (
            <Card className="text-center py-16 shadow-lg border-0">
              <div className="mb-4">
                <CommentOutlined className="text-6xl text-gray-300" />
              </div>
              <Title level={4} className="text-gray-500 mb-2">
                {searchText || sentimentFilter !== 'all' || languageFilter !== 'all' 
                  ? 'Filtrelere uygun yorum bulunamadı' 
                  : 'Henüz hiç yorum yok'
                }
              </Title>
              <Text className="text-gray-400">
                {searchText || sentimentFilter !== 'all' || languageFilter !== 'all'
                  ? 'Farklı filtreler deneyebilir veya filtreleri temizleyebilirsiniz.'
                  : 'YouTube yorumlarınız analiz edildikten sonra burada görünecek.'
                }
              </Text>
            </Card>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};