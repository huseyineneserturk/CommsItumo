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
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 flex justify-center items-center">
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
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 flex justify-center items-center">
        <div className="container mx-auto px-6 lg:px-8">
          <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white/10 backdrop-blur-xl">
            <div className="text-center py-16">
              <div className="mb-4">
                <CommentOutlined className="text-6xl text-red-400" />
              </div>
              <Title level={3} className="text-red-500 mb-4">{error}</Title>
              <Button 
                type="primary" 
                size="large"
                icon={<ReloadOutlined />} 
                onClick={() => fetchComments(true)}
                className="bg-gradient-to-r from-red-500 to-pink-600 border-0 hover:from-red-600 hover:to-pink-700 rounded-2xl px-8 py-6 h-auto font-medium shadow-2xl hover:shadow-red-500/25"
              >
                Yeniden Dene
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 shadow-lg">
          <div className="container mx-auto px-6 py-12">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                  <CommentOutlined className="text-3xl text-white" />
                </div>
              </div>
              <Title level={1} className="mb-4 text-white text-4xl font-bold">
                Yorumlarım
                {isFromCache && (
                  <div className="inline-block ml-4">
                    <span className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium border border-white border-opacity-20">
                      📦 Önbellekten
                    </span>
                  </div>
                )}
              </Title>
              <Text className="text-white text-opacity-90 text-xl font-medium">
                YouTube yorumlarınızın detaylı sentiment analizi ve kapsamlı istatistikler
              </Text>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => fetchComments(false)}
                  className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-opacity-30 transition-all duration-300 flex items-center space-x-2 font-medium border border-white border-opacity-20"
                >
                  <ReloadOutlined className="text-lg" />
                  <span>Önbellekten Yükle</span>
                </button>
                <button
                  onClick={() => fetchComments(true)}
                  className="bg-white text-red-600 px-6 py-3 rounded-xl hover:bg-opacity-90 transition-all duration-300 flex items-center space-x-2 font-medium shadow-lg"
                >
                  <ReloadOutlined className="text-lg" />
                  <span>Yenile</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 lg:px-8 py-8">
          {/* İstatistikler */}
          {stats && (
            <div className="mb-8">
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="text-center shadow-2xl hover:shadow-xl transition-all duration-500 border-0 bg-white/10 backdrop-blur-xl rounded-3xl">
                    <div className="mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl">
                        <CommentOutlined className="text-2xl text-white" />
                      </div>
                    </div>
                    <Statistic
                      title={
                        <span className="text-slate-700 font-semibold">
                          Toplam Yorum
                          {isFromCache && <div className="text-xs text-blue-500 mt-1">📦 Önbellekten</div>}
                        </span>
                      }
                      value={stats.total}
                      valueStyle={{ color: '#1890ff', fontSize: '2.5rem', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="text-center shadow-2xl hover:shadow-xl transition-all duration-500 border-0 bg-white/10 backdrop-blur-xl rounded-3xl">
                    <div className="mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl">
                        <LikeOutlined className="text-2xl text-white" />
                      </div>
                    </div>
                    <Statistic
                      title={<span className="text-slate-700 font-semibold">Pozitif Yorumlar</span>}
                      value={stats.categories.positive}
                      valueStyle={{ color: '#52c41a', fontSize: '2.5rem', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="text-center shadow-2xl hover:shadow-xl transition-all duration-500 border-0 bg-white/10 backdrop-blur-xl rounded-3xl">
                    <div className="mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl">
                        <DislikeOutlined className="text-2xl text-white" />
                      </div>
                    </div>
                    <Statistic
                      title={<span className="text-slate-700 font-semibold">Negatif Yorumlar</span>}
                      value={stats.categories.negative}
                      valueStyle={{ color: '#ff4d4f', fontSize: '2.5rem', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card className="text-center shadow-2xl hover:shadow-xl transition-all duration-500 border-0 bg-white/10 backdrop-blur-xl rounded-3xl">
                    <div className="mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl">
                        <MehOutlined className="text-2xl text-white" />
                      </div>
                    </div>
                    <Statistic
                      title={<span className="text-slate-700 font-semibold">Nötr Yorumlar</span>}
                      value={stats.categories.neutral}
                      valueStyle={{ color: '#8c8c8c', fontSize: '2.5rem', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          {/* Filtreler */}
          <Card className="mb-8 shadow-2xl border-0 bg-white/10 backdrop-blur-xl rounded-3xl">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <Search
                  placeholder="Yorumlarda ara..."
                  allowClear
                  size="large"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full"
                  style={{
                    borderRadius: '16px'
                  }}
                />
              </div>
              <Select
                placeholder="Sentiment Filtresi"
                size="large"
                value={sentimentFilter}
                onChange={setSentimentFilter}
                className="w-full md:w-48"
                style={{
                  borderRadius: '16px'
                }}
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
                style={{
                  borderRadius: '16px'
                }}
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
                className: "modern-pagination"
              }}
              dataSource={filteredComments}
              renderItem={(comment) => (
                <List.Item key={comment.id}>
                  <Card 
                    className="w-full shadow-2xl hover:shadow-xl transition-all duration-500 border-0 bg-white/10 backdrop-blur-xl rounded-3xl hover:transform hover:-translate-y-2"
                    bodyStyle={{ padding: '32px' }}
                  >
                    <div className="flex flex-col space-y-6">
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                            <span className="text-white font-bold text-lg">
                              {comment.author.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <Text strong className="text-xl text-slate-800">{comment.author}</Text>
                            <div className="flex items-center space-x-2 text-slate-500 mt-1">
                              <CalendarOutlined />
                              <Text className="text-sm">
                                {new Date(comment.date).toLocaleDateString('tr-TR')}
                              </Text>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Tag 
                            color={getSentimentColor(comment.sentiment.category)}
                            icon={getSentimentIcon(comment.sentiment.category)}
                            className="px-4 py-2 text-base font-medium rounded-xl"
                          >
                            {getSentimentText(comment.sentiment.category)}
                          </Tag>
                          <Tag 
                            color={comment.sentiment.language === 'tr' ? 'blue' : 'green'}
                            className="px-3 py-1 rounded-xl"
                          >
                            {comment.sentiment.language === 'tr' ? 'Türkçe' : 'İngilizce'}
                          </Tag>
                        </div>
                      </div>

                      {/* Video Bilgisi */}
                      <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-2xl border border-slate-200">
                        <div className="flex items-center space-x-3">
                          <YoutubeOutlined className="text-red-500 text-xl" />
                          <Text className="text-base font-medium text-slate-700">
                            {comment.video_title}
                          </Text>
                        </div>
                      </div>

                      {/* Yorum Metni */}
                      <div className="bg-white p-6 border-l-4 border-red-400 rounded-2xl shadow-lg">
                        <Text className="text-base leading-relaxed text-slate-700">
                          {comment.text}
                        </Text>
                      </div>

                      {/* Temalar */}
                      {comment.theme && Object.keys(comment.theme).length > 0 && (
                        <div>
                          <Text className="text-sm text-slate-600 mb-3 block font-medium">Tespit Edilen Temalar:</Text>
                          <div className="flex flex-wrap gap-2">
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
            <Card className="text-center py-20 shadow-2xl border-0 bg-white/10 backdrop-blur-xl rounded-3xl">
              <div className="mb-6">
                <CommentOutlined className="text-8xl text-slate-300" />
              </div>
              <Title level={3} className="text-slate-600 mb-4">
                {searchText || sentimentFilter !== 'all' || languageFilter !== 'all' 
                  ? 'Filtrelere uygun yorum bulunamadı' 
                  : 'Henüz hiç yorum yok'
                }
              </Title>
              <Text className="text-slate-500 text-lg">
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