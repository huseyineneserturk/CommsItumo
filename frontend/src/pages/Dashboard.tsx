import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, MessageSquare, Upload, Zap, Star, Users, TrendingUp, Shield, ChevronRight } from 'lucide-react';

const videos = [
  {
    src: '/Resources/Woman_Streamer.mp4',
    title: 'İçerik Üreticileri İçin Duygu Analizi',
    description: 'YouTube yorumlarınızı analiz ederek içeriğinizi geliştirin'
  },
  {
    src: '/Resources/Man_Streamer.mp4',
    title: 'Canlı Yayıncılar İçin Analiz',
    description: 'Canlı yayın yorumlarınızı gerçek zamanlı analiz edin'
  },
  {
    src: '/Resources/Video_Analytics.mp4',
    title: 'İçerik Analistleri İçin CSV Desteği',
    description: 'Profesyonel analiz araçlarıyla içeriğinizi optimize edin'
  }
];

export function Dashboard() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % videos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
      {/* Hero Section with Video Slider */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          {videos.map((video, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-30' : 'opacity-0'
              }`}
            >
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src={video.src} type="video/mp4" />
              </video>
            </div>
          ))}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              {/* Logo */}
              <div className="mb-8">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-all duration-300 border-2 border-gray-200">
                      <img 
                        src="/Resources/Logo.png" 
                        alt="CommsItumo Logo" 
                        className="w-14 h-14 object-contain"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-4xl font-bold text-white leading-tight">
                      CommsItumo
                    </h2>
                    <span className="text-lg text-red-200 font-medium tracking-wider">
                      Sentiment Analysis Platform
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="text-white">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  YouTube Yorumlarınızı
                  <span className="text-red-400 block">Analiz Edin</span>
                </h1>
                
                <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl leading-relaxed">
                  Yapay zeka destekli sentiment analizi ile YouTube yorumlarınızı derinlemesine inceleyin. 
                  İçeriğinizi geliştirin, izleyici kitlenizi daha iyi anlayın.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link
                    to="/my-comments"
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
                  >
                    Hemen Başla
                  </Link>
                  <Link
                    to="/youtube-analysis"
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 border border-white/30 text-center"
                  >
                    Analiz Örnekleri
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400">10K+</div>
                    <div className="text-sm text-gray-300">Analiz Edilen Yorum</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400">500+</div>
                    <div className="text-sm text-gray-300">Aktif Kullanıcı</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400">99%</div>
                    <div className="text-sm text-gray-300">Doğruluk Oranı</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400">24/7</div>
                    <div className="text-sm text-gray-300">Destek</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-sliding indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-2">
            {videos.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-red-400' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Slide Info */}
        <div className="absolute bottom-8 right-8 z-20 text-white max-w-xs">
          <h3 className="text-lg font-semibold mb-2">{videos[currentSlide].title}</h3>
          <p className="text-sm text-gray-300">{videos[currentSlide].description}</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          {/* Brand Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center items-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center border-2 border-gray-200">
                  <img 
                    src="/Resources/Logo.png" 
                    alt="CommsItumo Brand" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">CommsItumo</h3>
                <span className="text-sm text-gray-500 font-medium">Sentiment Analysis</span>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Güçlü Analiz Araçları
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              YouTube içerik üreticileri için özel olarak tasarlanmış, 
              yapay zeka destekli analiz platformu
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<MessageSquare className="text-red-600" size={40} />}
              title="Yorumlarım"
              description="YouTube yorumlarınızı duygu etiketleriyle görüntüleyin ve detaylı analiz edin"
              link="/my-comments"
              gradient="from-red-500 to-pink-500"
            />
            <FeatureCard
              icon={<Upload className="text-red-600" size={40} />}
              title="CSV Yükle"
              description="Toplu yorum verilerinizi CSV formatında yükleyerek hızlı analiz yapın"
              link="/upload-csv"
              gradient="from-orange-500 to-red-500"
            />
            <FeatureCard
              icon={<BarChart3 className="text-red-600" size={40} />}
              title="Kanal Analizi"
              description="İnteraktif grafiklerle yorum trendlerini ve desenleri görselleştirin"
              link="/youtube-analysis"
              gradient="from-red-500 to-rose-500"
            />
            <FeatureCard
              icon={<Zap className="text-red-600" size={40} />}
              title="Video Analizi"
              description="Belirli videolarınızın yorumlarını detaylı şekilde analiz edin"
              link="/video-analysis"
              gradient="from-pink-500 to-red-500"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Neden CommsItumo?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              İçerik üreticileri için özel olarak geliştirilmiş avantajlar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <BenefitCard
              icon={<Star className="text-yellow-500" size={32} />}
              title="Yüksek Doğruluk"
              description="AI destekli sentiment analizi ile %99 doğruluk oranı"
            />
            <BenefitCard
              icon={<Users className="text-blue-500" size={32} />}
              title="Kolay Kullanım"
              description="Sezgisel arayüz ile herkes kolayca kullanabilir"
            />
            <BenefitCard
              icon={<TrendingUp className="text-green-500" size={32} />}
              title="Gerçek Zamanlı"
              description="Anlık analiz sonuçları ve trend takibi"
            />
            <BenefitCard
              icon={<Shield className="text-purple-500" size={32} />}
              title="Güvenli"
              description="Verileriniz güvenli şekilde saklanır ve işlenir"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Hemen Başlayın
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            YouTube yorumlarınızı analiz etmeye bugün başlayın. 
            Ücretsiz hesap oluşturun ve farkı görün.
          </p>
          <Link
            to="/my-comments"
            className="inline-block bg-white text-red-600 font-semibold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Ücretsiz Başla
          </Link>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  gradient: string;
}

function FeatureCard({ icon, title, description, link, gradient }: FeatureCardProps) {
  return (
    <Link
      to={link}
      className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
      
      {/* Hover Arrow */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ChevronRight className="w-5 h-5 text-red-600" />
      </div>
    </Link>
  );
}

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}