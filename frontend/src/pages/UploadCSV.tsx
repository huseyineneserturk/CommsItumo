import React, { useState } from 'react';
import { Upload, Button, message, Card, Typography, Row, Col, Spin, Statistic, Steps, Alert, Tag, Progress, Space, Divider } from 'antd';
import { InboxOutlined, CalendarOutlined, FilterOutlined, ReloadOutlined, UploadOutlined, FileTextOutlined, BarChartOutlined, CheckCircleOutlined, SmileOutlined, MehOutlined, FrownOutlined, RiseOutlined, MessageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Wordcloud } from '@visx/wordcloud';
import { scaleOrdinal } from '@visx/scale';
import { Text as VisxText } from '@visx/text';
import { useAI } from '../contexts/AIContext';
import { useCache } from '../contexts/CacheContext';

const { Dragger } = Upload;
const { Title, Text } = Typography;
const { Step } = Steps;

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
  const navigate = useNavigate();
  const { setComments: setAIComments } = useAI();
  
  // Cache sistemini kullan
  const { getCsvAnalysis, setCsvAnalysis } = useCache();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    // Dosya hash'i oluştur (cache key olarak kullanacağız)
    const fileKey = `${file.name}_${file.size}_${file.lastModified}`;
    
    // Önce cache'e bak
    const cachedResult = getCsvAnalysis(fileKey);
    if (cachedResult) {
      console.log('📦 Cache\'den CSV analizi yüklendi:', fileKey);
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
          polarity: comment.sentiment.polarity || comment.sentiment.score || 0,
          subjectivity: 0.5,
          confidence: Math.abs(comment.sentiment.polarity || comment.sentiment.score || 0)
        }
      }));
      setAIComments(aiComments);
      
      message.success('CSV analizi önbellekten yüklendi');
      return;
    }

    setLoading(true);
    setCurrentStep(1);
    setIsFromCache(false);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('Kullanıcı girişi gerekli');
      }
      
      const token = await user.getIdToken();
      
      setCurrentStep(2);
      console.log('🌐 API\'den fresh CSV analizi yapılıyor...');
      const response = await axios.post('http://localhost:8000/api/csv/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setAnalysisResult(response.data.data);
      setCurrentStep(3);
      
      // Cache'e kaydet
      setCsvAnalysis(fileKey, { data: response.data.data, fileInfo: { name: file.name, size: file.size } });
      
      // AI Context'e yorumları gönder
      const aiComments = response.data.data.comments.map((comment: any) => ({
        id: Math.random().toString(),
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
      
      message.success('CSV dosyası başarıyla yüklendi ve analiz edildi');
    } catch (error) {
      setCurrentStep(0);
      message.error(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
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
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    );
  };

  const renderWordCloud = () => {
    if (!analysisResult) return null;

    const words = analysisResult.word_cloud.map(item => ({
      text: item.text,
      value: item.value
    }));

    const colorScale = scaleOrdinal({
      domain: words.map(d => d.text),
      range: ['#ff8080', '#ff4d4d', '#ff1a1a', '#ff6666', '#ff3333']
    });

    const fontScale = (value: number) => Math.max(12, Math.min(60, value * 2));

    return (
      <Card title="Kelime Bulutu" className="shadow-lg border-0 hover:shadow-xl transition-shadow">
        <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg width={600} height={300}>
            <Wordcloud
              words={words}
              width={600}
              height={300}
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
                    style={{ cursor: 'pointer' }}
                  >
                    {w.text}
                  </VisxText>
                ))
              }
            </Wordcloud>
          </svg>
        </div>
      </Card>
    );
  };

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
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <Title level={2} className="mb-2 text-gray-900">
              <UploadOutlined className="mr-3 text-red-600" />
              CSV Dosya Yükleme
            </Title>
            <Text className="text-gray-600 text-lg">
              Yorum verilerinizi CSV formatında yükleyerek hızlı analiz yapın
            </Text>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Progress Steps */}
        <Card className="mb-8 shadow-lg border-0">
          <Steps current={currentStep} className="mb-6">
            <Step title="Dosya Seçimi" icon={<FileTextOutlined />} />
            <Step title="Yükleme" icon={<UploadOutlined />} />
            <Step title="Analiz" icon={<BarChartOutlined />} />
            <Step title="Sonuçlar" icon={<CheckCircleOutlined />} />
          </Steps>
        </Card>

        {!analysisResult ? (
          <Row gutter={[24, 24]}>
            {/* Upload Section */}
            <Col xs={24} lg={16}>
              <Card className="shadow-lg border-0 h-full">
                <Title level={4} className="mb-6 text-center">
                  CSV Dosyanızı Yükleyin
                </Title>
                
                <form onSubmit={handleSubmit}>
                  <Dragger 
                    {...uploadProps} 
                    className="mb-6"
                    style={{ 
                      background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
                      border: '2px dashed #d9d9d9',
                      borderRadius: '12px'
                    }}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined style={{ fontSize: '48px', color: '#ff4d4f' }} />
                    </p>
                    <p className="ant-upload-text text-lg font-semibold">
                      Dosyanızı buraya sürükleyin veya tıklayın
                    </p>
                    <p className="ant-upload-hint text-gray-500">
                      Sadece .csv formatındaki dosyalar desteklenmektedir
                    </p>
                  </Dragger>

                  {file && (
                    <Alert
                      message="Dosya Seçildi"
                      description={`${file.name} (${(file.size / 1024).toFixed(2)} KB)`}
                      type="success"
                      showIcon
                      className="mb-6"
                    />
                  )}

                  <div className="text-center">
                    <Button
                      type="primary"
                      size="large"
                      htmlType="submit"
                      loading={loading}
                      disabled={!file}
                      className="bg-red-600 border-red-600 hover:bg-red-700 px-8"
                    >
                      {loading ? 'Analiz Ediliyor...' : 'Analizi Başlat'}
                    </Button>
                  </div>
                </form>
              </Card>
            </Col>

            {/* Instructions */}
            <Col xs={24} lg={8}>
              <Card className="shadow-lg border-0 h-full">
                <Title level={4} className="mb-4">
                  CSV Formatı Hakkında
                </Title>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <Text strong className="text-blue-700">Gerekli Sütunlar:</Text>
                    <ul className="mt-2 text-sm text-blue-600">
                      <li>• text (yorum metni)</li>
                      <li>• author (yorum yazarı)</li>
                      <li>• date (tarih)</li>
                      <li>• video_title (video başlığı)</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <Text strong className="text-green-700">Analiz Özellikleri:</Text>
                    <ul className="mt-2 text-sm text-green-600">
                      <li>• Sentiment analizi</li>
                      <li>• Tema çıkarma</li>
                      <li>• Kelime bulutu</li>
                      <li>• Dil tespiti</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <Text strong className="text-yellow-700">Desteklenen Diller:</Text>
                    <ul className="mt-2 text-sm text-yellow-600">
                      <li>• Türkçe</li>
                      <li>• İngilizce</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        ) : (
          <div>
            {/* Results Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <Title level={3} className="mb-2">
                  Analiz Sonuçları
                  {isFromCache && (
                    <Tag color="blue" className="ml-3 text-xs">
                      📦 Önbellekten
                    </Tag>
                  )}
                </Title>
                <Text className="text-gray-600">
                  {analysisResult.sentiment_stats.total} yorum başarıyla analiz edildi
                  {isFromCache && ' (Önbellekten yüklendi)'}
                </Text>
              </div>
              <Button
                type="default"
                size="large"
                onClick={resetUpload}
                icon={<ReloadOutlined />}
              >
                Yeni Analiz
              </Button>
            </div>

            {/* Statistics */}
            <Row gutter={[16, 16]} className="mb-8">
              <Col xs={24} sm={12} lg={6}>
                <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
                      <FileTextOutlined className="text-2xl text-white" />
                    </div>
                  </div>
                  <Statistic
                    title={
                      <span>
                        <span className="text-blue-700 font-semibold">Toplam Yorum</span>
                        {isFromCache && <div className="text-xs text-blue-500 mt-1">📦 Önbellekten</div>}
                      </span>
                    }
                    value={analysisResult.sentiment_stats.total}
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
                      <SmileOutlined className="text-2xl text-white" />
                    </div>
                  </div>
                  <Statistic
                    title={<span className="text-green-700 font-semibold">Pozitif Yorumlar</span>}
                    value={analysisResult.sentiment_stats.categories.positive}
                    valueStyle={{ color: '#52c41a', fontSize: '2.5rem', fontWeight: 'bold' }}
                  />
                  <div className="mt-3">
                    <Progress 
                      percent={(analysisResult.sentiment_stats.categories.positive / analysisResult.sentiment_stats.total) * 100}
                      size="small" 
                      strokeColor="#52c41a"
                      showInfo={false}
                    />
                    <Text type="secondary" className="text-xs mt-1 block">
                      {((analysisResult.sentiment_stats.categories.positive / analysisResult.sentiment_stats.total) * 100).toFixed(1)}% pozitif
                    </Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="text-center shadow-lg hover:shadow-xl transition-shadow border-0 bg-gradient-to-br from-red-50 to-red-100">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
                      <FrownOutlined className="text-2xl text-white" />
                    </div>
                  </div>
                  <Statistic
                    title={<span className="text-red-700 font-semibold">Negatif Yorumlar</span>}
                    value={analysisResult.sentiment_stats.categories.negative}
                    valueStyle={{ color: '#ff4d4f', fontSize: '2.5rem', fontWeight: 'bold' }}
                  />
                  <div className="mt-3">
                    <Progress 
                      percent={(analysisResult.sentiment_stats.categories.negative / analysisResult.sentiment_stats.total) * 100}
                      size="small" 
                      strokeColor="#ff4d4f"
                      showInfo={false}
                    />
                    <Text type="secondary" className="text-xs mt-1 block">
                      {((analysisResult.sentiment_stats.categories.negative / analysisResult.sentiment_stats.total) * 100).toFixed(1)}% negatif
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
                    title={<span className="text-purple-700 font-semibold">Ortalama Polarite</span>}
                    value={analysisResult.sentiment_stats.average_polarity}
                    precision={3}
                    valueStyle={{ 
                      color: analysisResult.sentiment_stats.average_polarity > 0 ? '#52c41a' : '#ff4d4f',
                      fontSize: '2.5rem', 
                      fontWeight: 'bold' 
                    }}
                  />
                  <div className="mt-3">
                    <Progress 
                      percent={Math.abs(analysisResult.sentiment_stats.average_polarity * 100)}
                      size="small" 
                      strokeColor={analysisResult.sentiment_stats.average_polarity > 0 ? '#52c41a' : '#ff4d4f'}
                      showInfo={false}
                    />
                    <Text type="secondary" className="text-xs mt-1 block">
                      {analysisResult.sentiment_stats.average_polarity > 0 ? '📈 Pozitif trend' : '📉 Negatif trend'}
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
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg mr-3 flex items-center justify-center">
                        <FileTextOutlined className="text-white" />
                      </div>
                      <span className="text-lg font-semibold">Dil ve Tema Dağılımı</span>
                    </div>
                  }
                  className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Text strong className="text-gray-700">Dil Dağılımı</Text>
                        <Text type="secondary">{analysisResult.sentiment_stats.total} toplam</Text>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                            <Text>Türkçe</Text>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Text strong>{analysisResult.sentiment_stats.language_distribution.tr}</Text>
                            <Text type="secondary">
                              ({((analysisResult.sentiment_stats.language_distribution.tr / analysisResult.sentiment_stats.total) * 100).toFixed(1)}%)
                            </Text>
                          </div>
                        </div>
                        <Progress 
                          percent={(analysisResult.sentiment_stats.language_distribution.tr / analysisResult.sentiment_stats.total) * 100}
                          strokeColor="#1890ff"
                          showInfo={false}
                        />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                            <Text>İngilizce</Text>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Text strong>{analysisResult.sentiment_stats.language_distribution.en}</Text>
                            <Text type="secondary">
                              ({((analysisResult.sentiment_stats.language_distribution.en / analysisResult.sentiment_stats.total) * 100).toFixed(1)}%)
                            </Text>
                          </div>
                        </div>
                        <Progress 
                          percent={(analysisResult.sentiment_stats.language_distribution.en / analysisResult.sentiment_stats.total) * 100}
                          strokeColor="#722ed1"
                          showInfo={false}
                        />
                      </div>
                    </div>

                    <Divider />

                    <div>
                      <Text strong className="text-gray-700 mb-3 block">En Popüler Temalar</Text>
                      <Space wrap>
                        {analysisResult.theme_analysis.slice(0, 6).map(theme => (
                          <Tag 
                            key={theme.theme} 
                            color="blue"
                            className="mb-2 px-3 py-1 text-sm"
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
                            {analysisResult.sentiment_stats.categories.positive} yorum
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {((analysisResult.sentiment_stats.categories.positive / analysisResult.sentiment_stats.total) * 100).toFixed(1)}%
                        </div>
                        <Progress 
                          percent={(analysisResult.sentiment_stats.categories.positive / analysisResult.sentiment_stats.total) * 100}
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
                            {analysisResult.sentiment_stats.categories.neutral} yorum
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {((analysisResult.sentiment_stats.categories.neutral / analysisResult.sentiment_stats.total) * 100).toFixed(1)}%
                        </div>
                        <Progress 
                          percent={(analysisResult.sentiment_stats.categories.neutral / analysisResult.sentiment_stats.total) * 100}
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
                            {analysisResult.sentiment_stats.categories.negative} yorum
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-red-600">
                          {((analysisResult.sentiment_stats.categories.negative / analysisResult.sentiment_stats.total) * 100).toFixed(1)}%
                        </div>
                        <Progress 
                          percent={(analysisResult.sentiment_stats.categories.negative / analysisResult.sentiment_stats.total) * 100}
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
            </Row>

            {/* Charts */}
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={8}>
                {renderSentimentChart()}
              </Col>
              <Col xs={24} lg={8}>
                {renderThemeChart()}
              </Col>
              <Col xs={24} lg={8}>
                {renderWordCloud()}
              </Col>
            </Row>

            {/* Action Buttons */}
            <div className="text-center mt-8">
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/my-comments')}
                className="bg-red-600 border-red-600 hover:bg-red-700 mr-4"
              >
                Yorumları Görüntüle
              </Button>
              <Button
                type="default"
                size="large"
                onClick={() => navigate('/youtube-analysis')}
              >
                Detaylı Analiz
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}