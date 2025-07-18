import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, MessageSquare, Upload, Zap, Star, Users, TrendingUp, Shield, ChevronRight, Sparkles, ArrowRight, Play } from 'lucide-react';

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
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section with Video Slider */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          {videos.map((video, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-2000 ${
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
          
          {/* Modern Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-900/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-6xl">
              {/* Main Content - Logo Kaldırıldı */}
              <div className="text-white space-y-12">
                <div className="space-y-8">
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight">
                    <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                      YouTube
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                      Analiz Platformu
                    </span>
                  </h1>
                  
                  <div className="flex items-start space-x-4">
                    <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse mt-2 flex-shrink-0" />
                    <p className="text-xl md:text-2xl lg:text-3xl text-slate-200 font-light max-w-4xl leading-relaxed">
                      Yapay zeka destekli duygu analizi ile YouTube yorumlarınızı derinlemesine inceleyin
                    </p>
                  </div>
                </div>

                {/* Modern CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6">
                  <Link
                    to="/my-comments"
                    className="group relative bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/25 text-center text-lg flex items-center justify-center space-x-3"
                  >
                    <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span>Hemen Başla</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/youtube-analysis"
                    className="group bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white font-semibold py-5 px-10 rounded-2xl transition-all duration-300 border border-white/30 hover:border-white/50 text-center text-lg flex items-center justify-center space-x-3"
                  >
                    <BarChart3 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span>Analiz Örnekleri</span>
                  </Link>
                </div>

                {/* Enhanced Stats - Responsive Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 pb-8 lg:pb-0">
                  <div className="text-center group cursor-pointer">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                      <div className="text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">10K+</div>
                      <div className="text-xs lg:text-sm text-slate-300 font-medium mt-1 lg:mt-2">Analiz Edilen Yorum</div>
                    </div>
                  </div>
                  <div className="text-center group cursor-pointer">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                      <div className="text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">500+</div>
                      <div className="text-xs lg:text-sm text-slate-300 font-medium mt-1 lg:mt-2">Aktif Kullanıcı</div>
                    </div>
                  </div>
                  <div className="text-center group cursor-pointer">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                      <div className="text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">99%</div>
                      <div className="text-xs lg:text-sm text-slate-300 font-medium mt-1 lg:mt-2">Doğruluk Oranı</div>
                    </div>
                  </div>
                  <div className="text-center group cursor-pointer">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                      <div className="text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">24/7</div>
                      <div className="text-xs lg:text-sm text-slate-300 font-medium mt-1 lg:mt-2">Destek</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Features Section */}
      <section className="py-24 bg-gradient-to-br from-white via-slate-50 to-blue-50">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Modern Brand Section */}
          <div className="text-center mb-20">
            <div className="flex justify-center items-center mb-8">
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-white rounded-3xl shadow-xl flex items-center justify-center border border-slate-200 group-hover:shadow-2xl transition-all duration-300">
                  <img 
                    src="/Resources/Logo.png" 
                    alt="CommsItumo Brand" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-3 border-white shadow-lg">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
                <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Güçlü Analiz
                </span>
                <br />
                <span className="bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">
                  Araçları
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                YouTube içerik üreticileri için özel olarak tasarlanmış, 
                yapay zeka destekli yeni nesil analiz platformu
              </p>
            </div>
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<MessageSquare className="text-white" size={32} />}
              title="Yorumlarım"
              description="YouTube yorumlarınızı duygu etiketleriyle görüntüleyin ve detaylı analiz edin"
              link="/my-comments"
              gradient="from-red-500 to-pink-600"
              iconBg="bg-gradient-to-br from-red-500 to-pink-600"
            />
            <FeatureCard
              icon={<Upload className="text-white" size={32} />}
              title="CSV Yükle"
              description="Toplu yorum verilerinizi CSV formatında yükleyerek hızlı analiz yapın"
              link="/upload-csv"
              gradient="from-orange-500 to-amber-600"
              iconBg="bg-gradient-to-br from-orange-500 to-amber-600"
            />
            <FeatureCard
              icon={<BarChart3 className="text-white" size={32} />}
              title="Kanal Analizi"
              description="İnteraktif grafiklerle yorum trendlerini ve desenleri görselleştirin"
              link="/youtube-analysis"
              gradient="from-blue-500 to-indigo-600"
              iconBg="bg-gradient-to-br from-blue-500 to-indigo-600"
            />
            <FeatureCard
              icon={<Zap className="text-white" size={32} />}
              title="Video Analizi"
              description="Belirli videolarınızın yorumlarını detaylı şekilde analiz edin"
              link="/video-analysis"
              gradient="from-green-500 to-emerald-600"
              iconBg="bg-gradient-to-br from-green-500 to-emerald-600"
            />
          </div>
        </div>
      </section>

      {/* Enhanced Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Neden
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                CommsItumo?
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              İçerik üreticileri için özel olarak geliştirilmiş avantajlar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <BenefitCard
              icon={<div className="text-4xl">⭐</div>}
              title="Yüksek Doğruluk"
              description="AI destekli duygu analizi ile %99'a yakın doğruluk oranı"
              iconBg="bg-gradient-to-br from-yellow-400 to-amber-500"
            />
            <BenefitCard
              icon={<div className="text-4xl">👥</div>}
              title="Kolay Kullanım"
              description="Sezgisel arayüz ile herkes kolayca kullanabilir"
              iconBg="bg-gradient-to-br from-blue-400 to-cyan-500"
            />
            <BenefitCard
              icon={<div className="text-4xl">📈</div>}
              title="Gerçek Zamanlı"
              description="Anlık analiz sonuçları ve trend takibi"
              iconBg="bg-gradient-to-br from-green-400 to-emerald-500"
            />
            <BenefitCard
              icon={<div className="text-4xl">🛡️</div>}
              title="Güvenli"
              description="Verileriniz güvenli şekilde saklanır ve işlenir"
              iconBg="bg-gradient-to-br from-purple-400 to-violet-500"
            />
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-24 bg-gradient-to-r from-red-600 via-pink-600 to-purple-700">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <h2 className="text-5xl md:text-6xl font-black text-white leading-tight">
                Analiz Gücünü
                <br />
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Keşfedin
                </span>
              </h2>
              <p className="text-xl text-red-100 max-w-2xl mx-auto leading-relaxed">
                YouTube yorumlarınızı analiz etmeye bugün başlayın. 
                Ücretsiz hesap oluşturun ve farkı hemen görün.
              </p>
              <div className="pt-4">
                <Link
                  to="/my-comments"
                  className="group inline-flex items-center space-x-4 bg-white text-red-600 font-bold py-6 px-12 rounded-2xl hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/20 text-xl"
                >
                  <span className="text-2xl">✨</span>
                  <span>Ücretsiz Başla</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
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
  iconBg: string;
}

function FeatureCard({ icon, title, description, link, gradient, iconBg }: FeatureCardProps) {
  return (
    <Link
      to={link}
      className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-slate-100 overflow-hidden"
    >
      {/* Modern Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      {/* Content */}
      <div className="relative z-10 space-y-6">
        <div className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
          {icon}
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-slate-900 group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-700 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {title}
          </h3>
          <p className="text-slate-600 leading-relaxed text-base">
            {description}
          </p>
        </div>
      </div>
      
      {/* Modern Hover Arrow */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
          <ChevronRight className="w-5 h-5 text-white" />
        </div>
      </div>
    </Link>
  );
}

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBg: string;
}

function BenefitCard({ icon, title, description, iconBg }: BenefitCardProps) {
  return (
    <div className="group text-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 hover:bg-white/20">
      <div className="space-y-6">
        <div className={`w-20 h-20 ${iconBg} rounded-2xl mx-auto flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-slate-300 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}