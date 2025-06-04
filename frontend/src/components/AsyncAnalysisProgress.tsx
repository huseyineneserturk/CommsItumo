import React, { useState, useEffect } from 'react';
import { Progress, Card, Typography, Alert, Button, Steps, Statistic, Space, Tag, Divider, Row, Col } from 'antd';
import { asyncAnalysisService, ProgressUpdate } from '../services/asyncAnalysisService';
import { 
  PlayCircleOutlined, 
  LoadingOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  CommentOutlined,
  BarChartOutlined,
  SaveOutlined,
  YoutubeOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  MessageOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Step } = Steps;

interface AsyncAnalysisProgressProps {
  videoId: string;
  videoTitle: string;
  maxComments: number;
  onComplete: (result: any) => void;
  onError: (error: string) => void;
  onCancel?: () => void;
}

interface StepInfo {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const AsyncAnalysisProgress: React.FC<AsyncAnalysisProgressProps> = ({
  videoId,
  videoTitle,
  maxComments,
  onComplete,
  onError,
  onCancel
}) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(0);
  const [taskId, setTaskId] = useState<string>('');
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [commentsFound, setCommentsFound] = useState<number>(0);
  const [processedComments, setProcessedComments] = useState<number>(0);
  const [finalStats, setFinalStats] = useState<any>(null);

  const steps: StepInfo[] = [
    { 
      title: 'Başlatılıyor', 
      description: 'Analiz süreci başlatılıyor...', 
      icon: <PlayCircleOutlined /> 
    },
    { 
      title: 'Video Bilgileri', 
      description: 'Video metadata alınıyor...', 
      icon: <YoutubeOutlined /> 
    },
    { 
      title: 'Yorumlar', 
      description: 'Video yorumları çekiliyor...', 
      icon: <CommentOutlined /> 
    },
    { 
      title: 'Sentiment Analizi', 
      description: 'Yorumlar analiz ediliyor...', 
      icon: <BarChartOutlined /> 
    },
    { 
      title: 'İstatistikler', 
      description: 'Sonuçlar hesaplanıyor...', 
      icon: <LoadingOutlined /> 
    },
    { 
      title: 'Kaydetme', 
      description: 'Veriler kaydediliyor...', 
      icon: <SaveOutlined /> 
    },
    { 
      title: 'Tamamlandı', 
      description: 'Analiz başarıyla tamamlandı!', 
      icon: <CheckCircleOutlined /> 
    }
  ];

  const getStepFromStatus = (status: string): number => {
    const statusMap: { [key: string]: number } = {
      'started': 0,
      'fetching_video_info': 1,
      'fetching_comments': 2,
      'analyzing': 3,
      'calculating_stats': 4,
      'saving': 5,
      'completed': 6
    };
    return statusMap[status] || 0;
  };

  const getStatusColor = (status: string): string => {
    const colorMap: { [key: string]: string } = {
      'started': 'blue',
      'fetching_video_info': 'cyan',
      'fetching_comments': 'orange',
      'analyzing': 'purple',
      'calculating_stats': 'geekblue',
      'saving': 'volcano',
      'completed': 'green',
      'error': 'red'
    };
    return colorMap[status] || 'default';
  };

  const calculateEstimatedTime = (currentProgress: number, elapsed: number): number => {
    if (currentProgress <= 5) return 0;
    const totalEstimatedTime = (elapsed / currentProgress) * 100;
    const remaining = Math.max(0, totalEstimatedTime - elapsed);
    
    // Smooth the estimate using exponential moving average
    if (estimatedTime !== null) {
      return estimatedTime * 0.7 + remaining * 0.3;
    }
    return remaining;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins > 0 ? `${mins}dk ${secs}s` : `${secs}s`;
  };

  const startAnalysis = async () => {
    try {
      setIsActive(true);
      setStartTime(new Date());
      
      const id = await asyncAnalysisService.startAsyncAnalysis(
        videoId,
        maxComments,
        (progressUpdate: ProgressUpdate) => {
          console.log('📊 Progress update:', progressUpdate);
          
          setProgress(progressUpdate.progress);
          setStatus(progressUpdate.status);
          setMessage(progressUpdate.message);
          setCurrentStep(getStepFromStatus(progressUpdate.status));
          
          // Ek veriler
          if (progressUpdate.video_info) {
            setVideoInfo(progressUpdate.video_info);
          }
          if (progressUpdate.comments_found) {
            setCommentsFound(progressUpdate.comments_found);
          }
          if (progressUpdate.processed_comments) {
            setProcessedComments(progressUpdate.processed_comments);
          }
          if (progressUpdate.final_stats) {
            setFinalStats(progressUpdate.final_stats);
          }
          
          // Estimated time calculation
          if (startTime && progressUpdate.progress > 5) {
            const elapsed = (Date.now() - startTime.getTime()) / 1000;
            const estimated = calculateEstimatedTime(progressUpdate.progress, elapsed);
            setEstimatedTime(estimated);
          }
          
          if (progressUpdate.status === 'completed' && progressUpdate.result) {
            setIsActive(false);
            onComplete(progressUpdate.result);
          } else if (progressUpdate.status === 'error') {
            setIsActive(false);
            onError(progressUpdate.message);
          }
        }
      );
      
      setTaskId(id);
    } catch (error) {
      setIsActive(false);
      onError(error instanceof Error ? error.message : 'Analiz başlatılamadı');
    }
  };

  // Elapsed time counter with 1 second interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && startTime) {
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime.getTime()) / 1000;
        setElapsedTime(elapsed);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, startTime]);

  useEffect(() => {
    startAnalysis();
    
    return () => {
      if (taskId) {
        asyncAnalysisService.unregisterProgressCallback(taskId);
      }
    };
  }, [videoId]);

  const handleCancel = () => {
    setIsActive(false);
    if (taskId) {
      asyncAnalysisService.unregisterProgressCallback(taskId);
    }
    onCancel?.();
  };

  const handleRetry = () => {
    setProgress(0);
    setStatus('');
    setMessage('');
    setCurrentStep(0);
    setElapsedTime(0);
    setEstimatedTime(null);
    setVideoInfo(null);
    setCommentsFound(0);
    setProcessedComments(0);
    setFinalStats(null);
    startAnalysis();
  };

  const getProgressStatus = () => {
    if (status === 'error') return 'exception';
    if (status === 'completed') return 'success';
    return 'active';
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px' }}>
      <Card 
        title={
          <div>
            <Title level={4} style={{ margin: 0 }}>
              📊 Video Analizi İşleniyor
            </Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              {videoTitle}
            </Text>
          </div>
        }
        style={{ marginBottom: 24 }}
        extra={
          <Space>
            <Tag color={getStatusColor(status)}>
              {status === 'completed' ? 'Tamamlandı' : 
               status === 'error' ? 'Hata' : 
               'İşleniyor'}
            </Tag>
            {isActive && (
              <Button size="small" onClick={handleCancel}>
                İptal Et
              </Button>
            )}
          </Space>
        }
      >
        {/* Progress Bar */}
        <div style={{ marginBottom: 24 }}>
          <Progress 
            percent={progress} 
            status={getProgressStatus()}
            strokeColor={{
              '0%': '#108ee9',
              '50%': '#87d068', 
              '100%': '#52c41a',
            }}
            format={(percent) => `${percent}%`}
          />
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: '13px', color: '#666' }}>
              {message}
            </Text>
            <Text style={{ fontSize: '12px', color: '#999' }}>
              {progress}% tamamlandı
            </Text>
          </div>
        </div>

        {/* Video Information */}
        {videoInfo && (
          <Card size="small" style={{ marginBottom: 16, backgroundColor: '#f8f9fa' }}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic 
                  title="Video Görüntülenme" 
                  value={videoInfo.view_count?.toLocaleString('tr-TR') || '0'}
                  prefix={<EyeOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="Toplam Yorum" 
                  value={videoInfo.comment_count?.toLocaleString('tr-TR') || '0'}
                  prefix={<MessageOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="Analiz Edilecek" 
                  value={Math.min(maxComments, videoInfo.comment_count || 0).toLocaleString('tr-TR')}
                  prefix={<BarChartOutlined />}
                />
              </Col>
            </Row>
          </Card>
        )}

        {/* Analysis Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Statistic 
              title="Geçen Süre" 
              value={formatTime(elapsedTime)}
              prefix={<ClockCircleOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Tahmini Kalan" 
              value={estimatedTime && estimatedTime > 0 ? formatTime(estimatedTime) : '--'}
              prefix={<LoadingOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Yorumlar Bulundu" 
              value={commentsFound || '--'}
              prefix={<CommentOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="İşlenen" 
              value={processedComments ? `${processedComments}/${commentsFound}` : '--'}
              prefix={<BarChartOutlined />}
            />
          </Col>
        </Row>

        {/* Final Statistics (when completed) */}
        {finalStats && status === 'completed' && (
          <Card size="small" style={{ marginBottom: 16, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <Title level={5} style={{ color: '#52c41a', marginBottom: 12 }}>
              📈 Analiz Sonuçları
            </Title>
            <Row gutter={16}>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                    {finalStats.positive}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Pozitif</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    {finalStats.neutral}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Nötr</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                    {finalStats.negative}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Negatif</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: finalStats.average_polarity > 0 ? '#52c41a' : '#ff4d4f' 
                  }}>
                    {finalStats.average_polarity?.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Ortalama</div>
                </div>
              </Col>
            </Row>
          </Card>
        )}

        <Divider />

        {/* Steps */}
        <Steps 
          current={currentStep} 
          direction="vertical" 
          size="small"
          status={status === 'error' ? 'error' : 'process'}
        >
          {steps.map((step, index) => (
            <Step 
              key={index}
              title={step.title} 
              description={step.description}
              icon={step.icon}
              status={
                index < currentStep ? 'finish' : 
                index === currentStep ? (status === 'error' ? 'error' : 'process') : 
                'wait'
              }
            />
          ))}
        </Steps>

        {/* Error Handling */}
        {status === 'error' && (
          <Alert
            message="Analiz Hatası"
            description={message}
            type="error"
            style={{ marginTop: 16 }}
            action={
              <Space>
                <Button size="small" onClick={handleRetry}>
                  Tekrar Dene
                </Button>
                <Button size="small" type="primary" onClick={handleCancel}>
                  Geri Dön
                </Button>
              </Space>
            }
            icon={<ExclamationCircleOutlined />}
          />
        )}

        {/* Success Message */}
        {status === 'completed' && (
          <Alert
            message="Analiz Tamamlandı!"
            description={`Video analizi başarıyla tamamlandı. Toplam süre: ${formatTime(elapsedTime)}`}
            type="success"
            style={{ marginTop: 16 }}
            icon={<CheckCircleOutlined />}
          />
        )}

        {/* Debug Info (Development) */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ marginTop: 16, padding: 12, background: '#f5f5f5', fontSize: '12px' }}>
            <strong>Debug:</strong> Task ID: {taskId} | WebSocket: {asyncAnalysisService.isConnected() ? '✅' : '❌'} | 
            Progress: {progress}% | Status: {status} | Elapsed: {formatTime(elapsedTime)}
          </div>
        )}
      </Card>
    </div>
  );
}; 