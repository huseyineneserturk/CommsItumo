import React, { useState, useEffect } from 'react';
import { Card, List, message, Spin, Typography, Row, Col, Statistic, Tag, Select, Button, Tabs } from 'antd';
import { sentimentService, AnalysisResult } from '../services/sentimentService';
import { analysisService } from '../services/analysisService';
import { AnalysisResult as NewAnalysisResult, AnalysisSummary } from '../types/analysis';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { CalendarOutlined, FilterOutlined, ReloadOutlined, FileTextOutlined, YoutubeOutlined, HistoryOutlined, BarChartOutlined, RiseOutlined, MessageOutlined } from '@ant-design/icons';
import { Wordcloud } from '@visx/wordcloud';
import { scaleOrdinal } from '@visx/scale';
import { Text as VisxText } from '@visx/text';
import { getAuth } from 'firebase/auth';
import { useAI } from '../contexts/AIContext';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

interface WordCloudProps {
  words: { text: string; value: number }[];
}

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
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border-l-4 border-red-400">
            <Typography.Paragraph className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {summary}
            </Typography.Paragraph>
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

export const YouTubeAnalysis: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [dateRange, setDateRange] = useState('last-30');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [themeFilter, setThemeFilter] = useState('all');
  const [filteredAnalysis, setFilteredAnalysis] = useState<AnalysisResult | null>(null);
  
  // Firestore entegrasyonu için state'ler
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisSummary[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<NewAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('current');
  
  // Kullanıcı bilgisi
  const auth = getAuth();
  const user = auth.currentUser;
  const { setComments: setAIComments } = useAI();

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await sentimentService.getCommentsAnalysis();
      setAnalysis(data);
      
      // AI Context'e yorumları gönder
      if (data.comments) {
        const aiComments = data.comments.map(comment => ({
          id: comment.id,
          text: comment.text,
          author: comment.author,
          date: comment.date,
          language: comment.sentiment.language,
          video_title: comment.video_title,
          sentiment: {
            polarity: comment.sentiment.score,
            subjectivity: 0.5,
            confidence: Math.abs(comment.sentiment.score)
          }
        }));
        setAIComments(aiComments);
      }
      
    } catch (error) {
      console.error('Analiz verileri alınamadı:', error);
      setError('Analiz verileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      message.error('Analiz verileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
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
      const analysisDetail = await analysisService.getAnalysisByIdFromAPI(analysisId);
      if (analysisDetail) {
        setSelectedAnalysis(analysisDetail);
        setActiveTab('detail');
      }
    } catch (error) {
      console.error('Analiz detayı alınamadı:', error);
      message.error('Analiz detayı yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
    if (user) {
      fetchAnalysisHistory();
    }
  }, [user]);

  useEffect(() => {
    if (analysis) {
      let filtered = { ...analysis };
      
      // Duygu filtresi
      if (sentimentFilter !== 'all') {
        filtered.comments = analysis.comments.filter(
          comment => comment.sentiment.category === sentimentFilter
        );
      }
      
      // Tema filtresi
      if (themeFilter !== 'all') {
        filtered.comments = filtered.comments.filter(
          comment => comment.theme[themeFilter] > 0.1
        );
      }
      
      // Tarih filtresi
      if (dateRange !== 'all') {
        const now = new Date();
        const days = parseInt(dateRange.split('-')[1]);
        const cutoffDate = new Date(now.setDate(now.getDate() - days));
        
        filtered.comments = filtered.comments.filter(
          comment => new Date(comment.date) >= cutoffDate
        );
      }
      
      // İstatistikleri güncelle
      filtered.sentiment_stats = {
        ...analysis.sentiment_stats,
        total: filtered.comments.length,
        categories: {
          positive: filtered.comments.filter(c => c.sentiment.category === 'positive').length,
          neutral: filtered.comments.filter(c => c.sentiment.category === 'neutral').length,
          negative: filtered.comments.filter(c => c.sentiment.category === 'negative').length
        },
        language_distribution: {
          tr: filtered.comments.filter(c => c.sentiment.language === 'tr').length,
          en: filtered.comments.filter(c => c.sentiment.language === 'en').length
        },
        themes: filtered.comments.reduce((acc, comment) => {
          Object.entries(comment.theme).forEach(([theme, score]) => {
            if (score > 0.1) {
              acc[theme] = (acc[theme] || 0) + 1;
            }
          });
          return acc;
        }, {} as Record<string, number>)
      };
      
      setFilteredAnalysis(filtered);
    }
  }, [analysis, sentimentFilter, themeFilter, dateRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex justify-center items-center">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4">
            <Text className="text-lg text-gray-600">Kanal analizi yükleniyor...</Text>
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
              <YoutubeOutlined className="text-6xl text-red-400" />
            </div>
            <Title level={3} className="text-red-500 mb-4">{error}</Title>
            <Button 
              type="primary" 
              size="large"
              icon={<ReloadOutlined />} 
              onClick={fetchAnalysis}
              className="bg-red-600 border-red-600 hover:bg-red-700"
            >
              Yeniden Dene
            </Button>
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

  const WordCloudChart: React.FC<WordCloudProps> = ({ words }) => {
    const [selectedWord, setSelectedWord] = useState<string | null>(null);

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
          <div className="h-[600px] w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-red-50 rounded-xl">
            <svg width={800} height={600}>
              <Wordcloud
                words={data}
                width={800}
                height={600}
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

        <div className="mt-6">
          <Row gutter={16}>
            <Col span={8}>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{words.length}</div>
                <div className="text-sm text-blue-500">Toplam Kelime</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{words[0]?.text || '-'}</div>
                <div className="text-sm text-green-500">En Sık Kullanılan</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <div className="text-2xl font-bold text-red-600">{words[0]?.value || 0}</div>
                <div className="text-sm text-red-500">Kullanım Sayısı</div>
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    );
  };

  // Analiz geçmişi bileşeni
  const AnalysisHistory = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Title level={3} className="mb-2">Kanal Analiz Geçmişi</Title>
        <Text type="secondary" className="text-lg">Kanalınızın analiz edilmiş videolarının geçmişi</Text>
      </div>
      
      {analysisHistory.length === 0 ? (
        <Card className="text-center py-16 shadow-lg border-0">
          <div className="mb-4">
            <YoutubeOutlined className="text-6xl text-gray-300" />
          </div>
          <Title level={4} className="text-gray-500 mb-2">Henüz kanal analizi bulunmuyor</Title>
          <Text className="text-gray-400">
            Kanalınızın videolarının yorumları henüz analiz edilmemiş.
            <br />
            Analiz işlemi otomatik olarak gerçekleştirilir.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Title level={2} className="mb-2 text-gray-900">
                <YoutubeOutlined className="mr-3 text-red-600" />
                Kanal Analizi
              </Title>
              <Text className="text-gray-600 text-lg">
                Kanalınızın video yorumlarının detaylı sentiment analizi
              </Text>
            </div>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={fetchAnalysis}
              size="large"
              className="bg-red-600 border-red-600 hover:bg-red-700"
            >
              Analizi Yenile
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-8" size="large">
          <TabPane tab={
            <span className="flex items-center">
              <BarChartOutlined className="mr-2" />
              Genel Analiz
            </span>
          } key="current">
            {/* Filtreler */}
            <Card className="mb-8 shadow-lg border-0">
              <Row gutter={16} align="middle">
                <Col xs={24} sm={12} md={6}>
                  <Select
                    className="w-full"
                    value={dateRange}
                    onChange={setDateRange}
                    size="large"
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
                    onClick={fetchAnalysis}
                    className="w-full bg-red-600 border-red-600 hover:bg-red-700"
                    size="large"
                  >
                    Yenile
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* Özet Kartı */}
            <div className="mb-8">
              <SummaryCard comments={filteredAnalysis.comments} />
            </div>

            {/* İstatistikler */}
            <Row gutter={[16, 16]} className="mb-8">
              <Col xs={24} sm={12} lg={6}>
                <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-0">
                  <div className="mb-2">
                    <MessageOutlined className="text-3xl text-blue-500" />
                  </div>
                  <Statistic
                    title="Toplam Yorum"
                    value={filteredAnalysis.sentiment_stats.total}
                    valueStyle={{ color: '#1890ff', fontSize: '2rem', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-0">
                  <div className="mb-2">
                    <RiseOutlined className="text-3xl text-green-500" />
                  </div>
                  <Statistic
                    title="Ortalama Duygu"
                    value={filteredAnalysis.sentiment_stats.average_polarity}
                    precision={2}
                    valueStyle={{ 
                      color: filteredAnalysis.sentiment_stats.average_polarity > 0 ? '#52c41a' : '#ff4d4f',
                      fontSize: '2rem', 
                      fontWeight: 'bold' 
                    }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-0">
                  <div className="mb-2">
                    <BarChartOutlined className="text-3xl text-purple-500" />
                  </div>
                  <Statistic
                    title="Dil Dağılımı"
                    value={`${((filteredAnalysis.sentiment_stats.language_distribution.tr / filteredAnalysis.sentiment_stats.total) * 100).toFixed(1)}% Türkçe`}
                    valueStyle={{ color: '#722ed1', fontSize: '1.5rem', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-0">
                  <div className="mb-2">
                    <FileTextOutlined className="text-3xl text-orange-500" />
                  </div>
                  <Statistic
                    title="Tema Sayısı"
                    value={Object.keys(filteredAnalysis.sentiment_stats.themes).length}
                    valueStyle={{ color: '#fa8c16', fontSize: '2rem', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Grafikler */}
            <Row gutter={[24, 24]} className="mb-8">
              <Col xs={24} lg={8}>
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
              <Col xs={24} lg={8}>
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
              <Col xs={24} lg={8}>
                <Card title="Dil Dağılımı" className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={languageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {languageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>

            {/* Kelime Bulutu */}
            <WordCloudChart words={filteredAnalysis.word_cloud} />
          </TabPane>

          <TabPane tab={
            <span className="flex items-center">
              <HistoryOutlined className="mr-2" />
              Video Analizleri
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

export default YouTubeAnalysis;