import React, { useState, useEffect, useMemo } from 'react';
import { Card, Tag, Button, Tooltip, Switch, Select, Spin } from 'antd';
import { Wordcloud } from '@visx/wordcloud';
import { scaleOrdinal } from '@visx/scale';
import { Text as VisxText } from '@visx/text';
import { 
  FileTextOutlined, 
  ReloadOutlined, 
  ExpandOutlined, 
  CompressOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  FireOutlined,
  RiseOutlined,
  ZoomInOutlined,
  ZoomOutOutlined
} from '@ant-design/icons';

const { Option } = Select;

interface WordItem {
  text: string;
  value: number;
  category?: string;
}

interface EnhancedWordCloudProps {
  words: WordItem[];
  title?: string;
  theme?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
  maxWords?: number;
  loading?: boolean;
  className?: string;
  height?: number;
  interactive?: boolean;
  showStats?: boolean;
  downloadable?: boolean;
}

const THEME_COLORS = {
  blue: {
    primary: '#1890ff',
    secondary: '#69c0ff', 
    gradient: 'from-blue-500 to-cyan-600',
    bgGradient: 'from-blue-50 via-cyan-50 to-blue-100',
    colors: ['#1890ff', '#52c41a', '#722ed1', '#fa541c', '#13c2c2', '#eb2f96']
  },
  purple: {
    primary: '#722ed1',
    secondary: '#b37feb',
    gradient: 'from-purple-500 to-pink-600', 
    bgGradient: 'from-purple-50 via-pink-50 to-purple-100',
    colors: ['#722ed1', '#eb2f96', '#1890ff', '#52c41a', '#fa541c', '#13c2c2']
  },
  green: {
    primary: '#52c41a',
    secondary: '#95de64',
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-50 via-emerald-50 to-green-100', 
    colors: ['#52c41a', '#1890ff', '#722ed1', '#fa541c', '#13c2c2', '#eb2f96']
  },
  red: {
    primary: '#f5222d',
    secondary: '#ff7875',
    gradient: 'from-red-500 to-pink-600',
    bgGradient: 'from-red-50 via-pink-50 to-red-100',
    colors: ['#f5222d', '#722ed1', '#1890ff', '#52c41a', '#fa541c', '#13c2c2']
  },
  orange: {
    primary: '#fa541c', 
    secondary: '#ff9c6e',
    gradient: 'from-orange-500 to-red-600',
    bgGradient: 'from-orange-50 via-red-50 to-orange-100',
    colors: ['#fa541c', '#f5222d', '#722ed1', '#1890ff', '#52c41a', '#13c2c2']
  }
};

const EXTENDED_COLORS = [
  '#1890ff', '#722ed1', '#52c41a', '#fa541c', '#f5222d', '#13c2c2',
  '#eb2f96', '#faad14', '#2f54eb', '#73d13d', '#ff4d4f', '#36cfc9',
  '#ff7a45', '#9254de', '#40a9ff', '#95de64', '#ffa940', '#ff85c0',
  '#597ef7', '#b7eb8f', '#ffec3d', '#87e8de', '#ffadd2', '#d3f261'
];

export const EnhancedWordCloud: React.FC<EnhancedWordCloudProps> = ({
  words = [],
  title = 'Kelime Bulutu',
  theme = 'purple',
  maxWords = 60,
  loading = false,
  className = '',
  height = 500,
  interactive = true,
  showStats = true,
  downloadable = false
}) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'top'>('all');
  const [wordLimit, setWordLimit] = useState(maxWords);
  const [fontSize, setFontSize] = useState(1);

  const themeConfig = THEME_COLORS[theme];
  const displayHeight = isExpanded ? height * 1.5 : height;

  // Filtered and processed words
  const processedWords = useMemo(() => {
    if (!words || words.length === 0) return [];

    let filtered = [...words];

    // Type filter
    if (filterType === 'top') {
      filtered = filtered.slice(0, Math.min(15, wordLimit));
    }

    // Kelime boyutlarını dengelemek için değerleri normalize et
    const sortedFiltered = filtered.slice(0, wordLimit);
    const maxVal = Math.max(...sortedFiltered.map(w => w.value));
    
    return sortedFiltered.map(word => ({
      text: word.text,
      value: Math.max(1, Math.min(maxVal, word.value)) // Min 1, max değer limiti
    }));
  }, [words, filterType, wordLimit]);

  // Color scale with extended palette
  const colorScale = scaleOrdinal({
    domain: processedWords.map(d => d.text),
    range: EXTENDED_COLORS
  });

  // Enhanced font scaling - daha dengeli boyutlar
  const fontScale = (value: number) => {
    const maxValue = Math.max(...processedWords.map(w => w.value));
    const minValue = Math.min(...processedWords.map(w => w.value)); 
    
    const normalizedValue = (value - minValue) / (maxValue - minValue || 1);
    // Daha küçük font range ile kelimeler arası mesafeyi artır
    const baseSize = 18 + (normalizedValue * 28); // 18px to 46px range (daha dar)
    
    return Math.max(16, Math.min(48, baseSize * fontSize));
  };

  // Enhanced rotation - daha az rotasyon daha temiz görünüm
  const getRotation = () => {
    const rotations = [0, 0, 0, 0, 15, -15, 30, -30]; // Çoğunlukla düz
    return rotations[Math.floor(Math.random() * rotations.length)];
  };

  // Statistics
  const stats = useMemo(() => {
    if (!words.length) return null;
    
    const total = words.length;
    const maxValue = Math.max(...words.map(w => w.value));
    const avgValue = words.reduce((sum, w) => sum + w.value, 0) / total;
    
    // Sentiment counts kaldırıldı

    return {
      total,
      maxValue,
      avgValue: Math.round(avgValue * 10) / 10,
      topWord: words[0]
    };
  }, [words]);

  // Download functionality
  const handleDownload = () => {
    const dataStr = JSON.stringify(processedWords, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'word-cloud-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Card className={`shadow-xl border-0 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <Spin size="large" />
          <span className="ml-3 text-lg">Kelime bulutu oluşturuluyor...</span>
        </div>
      </Card>
    );
  }

  if (!processedWords.length) {
    return (
      <Card 
        title={
          <div className="flex items-center">
            <div className={`w-8 h-8 bg-gradient-to-r ${themeConfig.gradient} rounded-lg mr-3 flex items-center justify-center`}>
              <FileTextOutlined className="text-white" />
            </div>
            <span className="text-lg font-semibold">{title}</span>
          </div>
        }
        className={`shadow-xl border-0 hover:shadow-2xl transition-all duration-300 ${className}`}
      >
        <div className="text-center py-16">
          <FileTextOutlined className="text-6xl text-gray-300 mb-4" />
          <div className="text-xl font-semibold text-gray-500 mb-2">
            Kelime bulutu için yeterli veri yok
          </div>
          <div className="text-gray-400">
            Analiz edilecek yeterli kelime bulunamadı veya filtreler çok kısıtlayıcı
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      title={
        <div className="flex items-center">
          <div className={`w-8 h-8 bg-gradient-to-r ${themeConfig.gradient} rounded-lg mr-3 flex items-center justify-center`}>
            <FileTextOutlined className="text-white" />
          </div>
          <span className="text-lg font-semibold">{title}</span>
        </div>
      }
      className={`shadow-xl border-0 hover:shadow-2xl transition-all duration-300 ${className}`}
      extra={
        <div className="flex items-center space-x-2">
          {showStats && (
            <Tag color={theme} className="font-medium">
              <FireOutlined className="mr-1" />
              {processedWords.length} kelime
            </Tag>
          )}
          
          {interactive && (
            <>
                             <Select
                 value={filterType}
                 onChange={setFilterType}
                 size="small"
                 style={{ width: 80 }}
               >
                 <Option value="all">Tümü</Option>
                 <Option value="top">En İyi</Option>
               </Select>

              <Tooltip title="Yazı Boyutu">
                <div className="flex items-center space-x-1">
                  <Button 
                    size="small" 
                    icon={<ZoomOutOutlined />}
                    onClick={() => setFontSize(Math.max(0.6, fontSize - 0.2))}
                    disabled={fontSize <= 0.6}
                  />
                  <Button 
                    size="small" 
                    icon={<ZoomInOutlined />}
                    onClick={() => setFontSize(Math.min(2, fontSize + 0.2))}
                    disabled={fontSize >= 2}
                  />
                </div>
              </Tooltip>

              <Button 
                size="small"
                icon={isExpanded ? <CompressOutlined /> : <ExpandOutlined />}
                onClick={() => setIsExpanded(!isExpanded)}
                type="text"
              />
            </>
          )}
          
          {downloadable && (
            <Button 
              size="small"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              type="text"
            />
          )}
          
          {selectedWord && (
            <Button 
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => setSelectedWord(null)}
              type="text"
            >
              Temizle
            </Button>
          )}
        </div>
      }
    >
      <div className="relative">
        {/* Enhanced Word Cloud */}
        <div 
          className={`w-full flex items-center justify-center bg-gradient-to-br ${themeConfig.bgGradient} rounded-2xl border border-${theme}-200 shadow-inner relative overflow-hidden`}
          style={{ height: displayHeight }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full bg-repeat opacity-20" 
                 style={{
                   backgroundImage: `radial-gradient(circle at 25% 25%, ${themeConfig.primary} 2px, transparent 2px)`,
                   backgroundSize: '24px 24px'
                 }}
            />
          </div>

          <svg 
            width="100%" 
            height="100%" 
            viewBox={`0 0 ${isExpanded ? 1200 : 900} ${displayHeight}`}
            className="max-w-full relative z-10"
          >
                          <Wordcloud
                words={processedWords.slice(0, Math.min(40, processedWords.length))}
                width={isExpanded ? 1200 : 900}
                height={displayHeight}
                fontSize={(datum) => fontScale(datum.value)}
                font="Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
                padding={12}
                spiral="archimedean"
                rotate={() => getRotation()}
                random={() => 0.6}
              >
              {(cloudWords) =>
                cloudWords.map((w, i) => {
                  const isSelected = selectedWord === w.text;
                  const wordData = processedWords.find(word => word.text === w.text);
                  
                  return (
                    <VisxText
                      key={`${w.text}-${i}`}
                      fill={colorScale(w.text || '')}
                      textAnchor="middle"
                      transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                      fontSize={w.size}
                      fontFamily={w.font}
                      fontWeight="700"
                      onClick={() => interactive && setSelectedWord(w.text || '')}
                                             style={{ 
                         cursor: interactive ? 'pointer' : 'default',
                         filter: isSelected 
                           ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.3)) brightness(1.2)' 
                           : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                         transition: 'all 0.3s ease',
                         opacity: selectedWord && !isSelected ? 0.6 : 1,
                         pointerEvents: 'all'
                       }}
                      className={interactive ? "hover:opacity-90 transition-all duration-200" : ""}
                    >
                      {w.text}
                    </VisxText>
                  );
                })
              }
            </Wordcloud>
          </svg>
          
          {/* Enhanced Selected Word Info */}
          {selectedWord && (
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-lg p-4 rounded-xl shadow-xl border max-w-64 z-20">
              <div className="font-bold text-lg text-gray-800 mb-1">
                {selectedWord}
              </div>
              {(() => {
                const wordInfo = words.find(w => w.text === selectedWord);
                return wordInfo ? (
                                       <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-gray-600">Kullanım:</span>
                         <span className="font-semibold text-gray-800">{wordInfo.value}</span>
                       </div>
                       {wordInfo.category && (
                         <div className="flex items-center justify-between">
                           <span className="text-sm text-gray-600">Kategori:</span>
                           <span className="text-sm font-medium text-gray-700">{wordInfo.category}</span>
                         </div>
                       )}
                     </div>
                ) : null;
              })()}
            </div>
          )}
        </div>
        
        {/* Enhanced Statistics */}
        {showStats && stats && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`text-center p-4 bg-gradient-to-br from-${theme}-50 to-${theme}-100 rounded-xl border border-${theme}-200`}>
              <div className={`text-2xl font-bold text-${theme}-600 mb-1`}>
                {stats.total}
              </div>
              <div className={`text-sm text-${theme}-500 font-medium`}>Toplam Kelime</div>
            </div>
            
            <div className={`text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200`}>
              <div className="text-2xl font-bold text-green-600 mb-1 truncate" 
                   title={stats.topWord?.text}>
                {stats.topWord?.text?.slice(0, 8) || '-'}
              </div>
              <div className="text-sm text-green-500 font-medium">En Popüler</div>
            </div>
            
            <div className={`text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200`}>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {stats.maxValue}
              </div>
              <div className="text-sm text-blue-500 font-medium">Max Kullanım</div>
            </div>
            
            <div className={`text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200`}>
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {stats.avgValue}
              </div>
              <div className="text-sm text-purple-500 font-medium">Ortalama</div>
            </div>
          </div>
        )}

                 {/* Duygu dağılımı kaldırıldı */}
      </div>
    </Card>
  );
}; 