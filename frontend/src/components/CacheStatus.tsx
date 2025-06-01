import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, Space, Tag, Popover, Statistic, Row, Col, message, Modal } from 'antd';
import { DeleteOutlined, InfoCircleOutlined, ReloadOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useCache } from '../contexts/CacheContext';

const { Text, Title } = Typography;

interface CacheStatusProps {
  visible?: boolean;
  onClose?: () => void;
}

const CacheStatus: React.FC<CacheStatusProps> = ({ visible = false, onClose }) => {
  const { clearCache, clearExpiredItems, youtubeAnalysis, comments, videoAnalyses, csvAnalyses } = useCache();
  const [cacheInfo, setCacheInfo] = useState({
    totalItems: 0,
    totalSize: 0,
    expiredItems: 0,
    youtubeAnalysisAge: null as number | null,
    commentsAge: null as number | null,
  });

  const calculateCacheInfo = () => {
    const CACHE_KEY_PREFIX = 'comms_itumo_cache_';
    let totalItems = 0;
    let totalSize = 0;
    let expiredItems = 0;
    let youtubeAnalysisAge = null;
    let commentsAge = null;

    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(CACHE_KEY_PREFIX)
      );

      keys.forEach(key => {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            totalItems++;
            totalSize += item.length;
            
            const parsed = JSON.parse(item);
            const isExpired = Date.now() > parsed.timestamp + parsed.ttl;
            
            if (isExpired) {
              expiredItems++;
            }

            // YouTube analizi yaşı
            if (key === CACHE_KEY_PREFIX + 'youtube_analysis' && !isExpired) {
              youtubeAnalysisAge = Math.floor((Date.now() - parsed.timestamp) / (1000 * 60)); // dakika
            }

            // Yorumlar yaşı
            if (key === CACHE_KEY_PREFIX + 'comments' && !isExpired) {
              commentsAge = Math.floor((Date.now() - parsed.timestamp) / (1000 * 60)); // dakika
            }
          }
        } catch (error) {
          // Geçersiz cache öğesi
          expiredItems++;
        }
      });
    } catch (error) {
      console.error('Cache bilgisi hesaplanırken hata:', error);
    }

    setCacheInfo({
      totalItems,
      totalSize: Math.round(totalSize / 1024), // KB
      expiredItems,
      youtubeAnalysisAge,
      commentsAge,
    });
  };

  useEffect(() => {
    if (visible) {
      calculateCacheInfo();
      const interval = setInterval(calculateCacheInfo, 30000); // 30 saniyede bir güncelle
      return () => clearInterval(interval);
    }
  }, [visible]);

  const handleClearCache = () => {
    Modal.confirm({
      title: 'Önbelleği Temizle',
      content: 'Tüm önbellek verileri silinecek. Bu işlem geri alınamaz. Devam etmek istediğinizden emin misiniz?',
      okText: 'Evet, Temizle',
      cancelText: 'İptal',
      okType: 'danger',
      onOk: () => {
        clearCache();
        calculateCacheInfo();
        message.success('Önbellek başarıyla temizlendi');
      },
    });
  };

  const handleClearExpired = () => {
    clearExpiredItems();
    calculateCacheInfo();
    message.success('Süresi dolmuş önbellek öğeleri temizlendi');
  };

  const formatAge = (minutes: number | null) => {
    if (minutes === null) return 'Yok';
    if (minutes < 1) return 'Az önce';
    if (minutes < 60) return `${minutes} dk`;
    return `${Math.floor(minutes / 60)} sa ${minutes % 60} dk`;
  };

  const getCacheStatusColor = () => {
    if (cacheInfo.expiredItems > 0) return 'orange';
    if (cacheInfo.totalItems === 0) return 'default';
    return 'green';
  };

  const content = (
    <Card className="w-96 border-0 shadow-lg">
      <div className="mb-4">
        <Title level={5} className="mb-3">
          <InfoCircleOutlined className="mr-2 text-blue-500" />
          Önbellek Durumu
        </Title>
      </div>

      <Row gutter={[16, 16]} className="mb-4">
        <Col span={12}>
          <Statistic
            title="Toplam Öğe"
            value={cacheInfo.totalItems}
            valueStyle={{ fontSize: '1.5rem', color: '#1890ff' }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Boyut"
            value={cacheInfo.totalSize}
            suffix="KB"
            valueStyle={{ fontSize: '1.5rem', color: '#52c41a' }}
          />
        </Col>
      </Row>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <div>
            <Text strong>YouTube Analizi</Text>
            <div className="text-xs text-gray-500">
              Son güncelleme: {formatAge(cacheInfo.youtubeAnalysisAge)}
            </div>
          </div>
          <Tag color={youtubeAnalysis ? 'green' : 'default'}>
            {youtubeAnalysis ? 'Mevcut' : 'Yok'}
          </Tag>
        </div>

        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <div>
            <Text strong>Yorumlar</Text>
            <div className="text-xs text-gray-500">
              Son güncelleme: {formatAge(cacheInfo.commentsAge)}
            </div>
          </div>
          <Tag color={comments ? 'green' : 'default'}>
            {comments ? 'Mevcut' : 'Yok'}
          </Tag>
        </div>

        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
          <div>
            <Text strong>Video Analizleri</Text>
            <div className="text-xs text-gray-500">
              {Object.keys(videoAnalyses).length} video
            </div>
          </div>
          <Tag color={Object.keys(videoAnalyses).length > 0 ? 'green' : 'default'}>
            {Object.keys(videoAnalyses).length} Öğe
          </Tag>
        </div>

        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
          <div>
            <Text strong>CSV Analizleri</Text>
            <div className="text-xs text-gray-500">
              {Object.keys(csvAnalyses).length} dosya
            </div>
          </div>
          <Tag color={Object.keys(csvAnalyses).length > 0 ? 'green' : 'default'}>
            {Object.keys(csvAnalyses).length} Öğe
          </Tag>
        </div>
      </div>

      {cacheInfo.expiredItems > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Text className="text-yellow-800">
            <ClockCircleOutlined className="mr-2" />
            {cacheInfo.expiredItems} öğenin süresi dolmuş
          </Text>
        </div>
      )}

      <Space className="w-full" direction="vertical">
        {cacheInfo.expiredItems > 0 && (
          <Button
            type="default"
            icon={<ClockCircleOutlined />}
            onClick={handleClearExpired}
            className="w-full"
          >
            Süresi Dolmuş Öğeleri Temizle
          </Button>
        )}
        
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={calculateCacheInfo}
          className="w-full"
        >
          Durumu Yenile
        </Button>
        
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={handleClearCache}
          className="w-full"
        >
          Tüm Önbelleği Temizle
        </Button>
      </Space>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <Text className="text-xs text-gray-600">
          <strong>TTL Süreleri:</strong><br />
          • YouTube Analizi: 10 dk<br />
          • Video Analizleri: 15 dk<br />
          • Yorumlar: 5 dk<br />
          • CSV Analizleri: 30 dk
        </Text>
      </div>
    </Card>
  );

  useEffect(() => {
    calculateCacheInfo();
  }, []);

  if (visible) {
    return content;
  }

  return (
    <Popover
      content={content}
      title={null}
      trigger="click"
      placement="bottomRight"
      overlayClassName="cache-status-popover"
    >
      <Button
        type="text"
        icon={<InfoCircleOutlined />}
        className="flex items-center"
        onClick={() => calculateCacheInfo()}
      >
        <span className="ml-1">Önbellek</span>
        <Tag
          color={getCacheStatusColor()}
          className="ml-2 text-xs"
        >
          {cacheInfo.totalItems}
        </Tag>
      </Button>
    </Popover>
  );
};

// Both named and default export
export { CacheStatus };
export default CacheStatus; 